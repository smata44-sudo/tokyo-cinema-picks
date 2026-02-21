#!/usr/bin/env python3
"""
Tokyo Mini-Theater Film Scraper
毎日 GitHub Actions で実行し、各映画館の上映情報を取得して films.json を生成する
"""

import json
import re
import sys
import time
import logging
from datetime import date, datetime, timedelta
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from html.parser import HTMLParser

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "ja,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

TODAY = date.today()
WEEK_END = TODAY + timedelta(days=6)


# ── ユーティリティ ──────────────────────────────────────────────────────────────

def fetch_html(url: str, timeout: int = 15) -> str:
    """指定URLのHTMLを取得して返す"""
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=timeout) as r:
            raw = r.read()
            # charset判定
            ct = r.headers.get_content_charset() or "utf-8"
            try:
                return raw.decode(ct, errors="replace")
            except Exception:
                return raw.decode("utf-8", errors="replace")
    except (URLError, HTTPError) as e:
        log.warning(f"fetch failed {url}: {e}")
        return ""


def clean(text: str) -> str:
    """空白・改行を整理する"""
    return re.sub(r"\s+", " ", text).strip()


def extract_times(text: str) -> list[str]:
    """HH:MM 形式の時刻を抽出する"""
    return re.findall(r"\d{1,2}:\d{2}", text)


# ── 各館スクレイパー ────────────────────────────────────────────────────────────

class SimpleHTMLTextExtractor(HTMLParser):
    """タグを除去してテキストだけ返す簡易パーサ"""
    def __init__(self):
        super().__init__()
        self.texts = []
        self._skip = False

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self._skip = True

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self._skip = False

    def handle_data(self, data):
        if not self._skip:
            self.texts.append(data)

    def get_text(self) -> str:
        return " ".join(self.texts)


def parse_text(html: str) -> str:
    p = SimpleHTMLTextExtractor()
    p.feed(html)
    return clean(p.get_text())


def scrape_shin_bungeiza() -> list[dict]:
    """新文芸坐 — shin-bungeiza.com/schedule"""
    url = "https://www.shin-bungeiza.com/schedule"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    # 上映作品ブロックを正規表現で抽出 (タイトルと時刻)
    # 新文芸坐のHTMLは schedule ページに <h3> でタイトルが並ぶ
    titles = re.findall(r'<h3[^>]*>(.*?)</h3>', html, re.S)
    time_blocks = re.findall(r'<p[^>]*class="[^"]*time[^"]*"[^>]*>(.*?)</p>', html, re.S | re.I)

    for i, t in enumerate(titles[:8]):
        title = clean(re.sub(r"<[^>]+>", "", t))
        if not title or len(title) < 2:
            continue
        times_raw = time_blocks[i] if i < len(time_blocks) else ""
        times = extract_times(re.sub(r"<[^>]+>", "", times_raw))
        films.append({
            "title": title,
            "director": "",
            "times": times,
            "period": f"{TODAY.strftime('%m/%d')}〜{WEEK_END.strftime('%m/%d')}",
            "theater": "新文芸坐",
            "area": "池袋",
            "url": "https://www.shin-bungeiza.com/",
        })
    return films


def scrape_waseda_shochiku() -> list[dict]:
    """早稲田松竹 — wasedashochiku.co.jp"""
    url = "https://wasedashochiku.co.jp/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    # 作品タイトルは <h2> または <h3> に入っている
    title_re = re.findall(r'<(?:h2|h3)[^>]*>(.*?)</(?:h2|h3)>', html, re.S)
    for t in title_re:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or any(kw in title.lower() for kw in ["schedule", "information", "access", "menu"]):
            continue
        # 時刻をタイトル近傍テキストから
        times = extract_times(html[:html.find(t) + 200] if t in html else "")
        films.append({
            "title": title,
            "director": "",
            "times": times,
            "period": f"{TODAY.strftime('%m/%d')}〜{WEEK_END.strftime('%m/%d')}",
            "theater": "早稲田松竹",
            "area": "高田馬場",
            "url": "https://wasedashochiku.co.jp/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_eurospace() -> list[dict]:
    """ユーロスペース — eurospace.co.jp"""
    url = "http://www.eurospace.co.jp/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    # ユーロスペースはトップページに現在上映作品が並ぶ
    blocks = re.findall(r'<div[^>]*class="[^"]*movie[^"]*"[^>]*>(.*?)</div>', html, re.S | re.I)
    for block in blocks[:6]:
        title_m = re.search(r'<(?:h\d|p)[^>]*>(.*?)</(?:h\d|p)>', block, re.S)
        if not title_m:
            continue
        title = clean(re.sub(r"<[^>]+>", "", title_m.group(1)))
        if len(title) < 2:
            continue
        times = extract_times(re.sub(r"<[^>]+>", "", block))
        films.append({
            "title": title,
            "director": "",
            "times": times,
            "period": "上映中",
            "theater": "ユーロスペース",
            "area": "渋谷",
            "url": "http://www.eurospace.co.jp/",
        })
    return films


def scrape_pole2() -> list[dict]:
    """ポレポレ東中野 — pole2.co.jp"""
    url = "https://pole2.co.jp/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    titles = re.findall(r'<h\d[^>]*>(.*?)</h\d>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or "ポレポレ" in title or "menu" in title.lower():
            continue
        films.append({
            "title": title,
            "director": "",
            "times": [],
            "period": "上映中",
            "theater": "ポレポレ東中野",
            "area": "東中野",
            "url": "https://pole2.co.jp/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_laputa() -> list[dict]:
    """ラピュタ阿佐ヶ谷 — laputa-jp.com"""
    url = "https://www.laputa-jp.com/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    blocks = re.findall(r'<(?:h2|h3|h4)[^>]*>(.*?)</(?:h2|h3|h4)>', html, re.S)
    for t in blocks:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or any(kw in title for kw in ["ラピュタ", "阿佐", "NEWS", "INFO"]):
            continue
        films.append({
            "title": title,
            "director": "",
            "times": [],
            "period": "上映中",
            "theater": "ラピュタ阿佐ヶ谷",
            "area": "阿佐ヶ谷",
            "url": "https://www.laputa-jp.com/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_ttcg(theater_slug: str, theater_name: str, area: str) -> list[dict]:
    """TTCG系列（新文芸坐・キネカ大森・テアトル新宿）共通スクレイパー"""
    url = f"https://ttcg.jp/{theater_slug}/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    # TTCG サイトは <h2 class="movie-title"> のような構造
    titles = re.findall(r'class="[^"]*(?:movie|title|film)[^"]*"[^>]*>(.*?)</', html, re.S | re.I)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2:
            continue
        films.append({
            "title": title,
            "director": "",
            "times": [],
            "period": "上映中",
            "theater": theater_name,
            "area": area,
            "url": f"https://ttcg.jp/{theater_slug}/",
        })
        if len(films) >= 5:
            break
    return films


def scrape_nfaj() -> list[dict]:
    """国立映画アーカイブ — nfaj.go.jp"""
    url = "https://www.nfaj.go.jp/exhibition/program/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    titles = re.findall(r'<h\d[^>]*>(.*?)</h\d>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 4 or any(kw in title for kw in ["国立", "映画アーカイブ", "プログラム", "展示"]):
            continue
        films.append({
            "title": title,
            "director": "",
            "times": [],
            "period": f"{TODAY.strftime('%m/%d')}〜",
            "theater": "国立映画アーカイブ",
            "area": "京橋",
            "url": "https://www.nfaj.go.jp/",
        })
        if len(films) >= 3:
            break
    return films


def scrape_stranger() -> list[dict]:
    """Stranger（菊川）— stranger.jp"""
    url = "https://stranger.jp/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    titles = re.findall(r'<(?:h2|h3)[^>]*>(.*?)</(?:h2|h3)>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or "Stranger" in title or "stranger" in title.lower():
            continue
        films.append({
            "title": title,
            "director": "",
            "times": [],
            "period": "上映中",
            "theater": "Stranger",
            "area": "菊川",
            "url": "https://stranger.jp/",
        })
        if len(films) >= 3:
            break
    return films


def scrape_uplink() -> list[dict]:
    """アップリンク吉祥寺 — joji.uplink.co.jp"""
    url = "https://joji.uplink.co.jp/"
    html = fetch_html(url)
    if not html:
        return []

    films = []
    titles = re.findall(r'<(?:h2|h3)[^>]*>(.*?)</(?:h2|h3)>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or "UPLINK" in title.upper():
            continue
        films.append({
            "title": title,
            "director": "",
            "times": [],
            "period": "上映中",
            "theater": "アップリンク吉祥寺",
            "area": "吉祥寺",
            "url": "https://joji.uplink.co.jp/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_cinemart_shinjuku() -> list[dict]:
    """シネマート新宿"""
    url = "https://www.cinemart.co.jp/theater/shinjuku/"
    html = fetch_html(url)
    if not html:
        return []
    films = []
    titles = re.findall(r'<(?:h2|h3|h4)[^>]*>(.*?)</(?:h2|h3|h4)>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or any(kw in title for kw in ["シネマート", "INFO", "NEWS", "アクセス"]):
            continue
        films.append({
            "title": title, "director": "", "times": [],
            "period": "上映中", "theater": "シネマート新宿",
            "area": "新宿", "url": "https://www.cinemart.co.jp/theater/shinjuku/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_musashino() -> list[dict]:
    """新宿武蔵野館"""
    url = "https://shinjuku.musashino-k.jp/"
    html = fetch_html(url)
    if not html:
        return []
    films = []
    titles = re.findall(r'<(?:h2|h3)[^>]*>(.*?)</(?:h2|h3)>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or "武蔵野" in title or "musashino" in title.lower():
            continue
        films.append({
            "title": title, "director": "", "times": [],
            "period": "上映中", "theater": "新宿武蔵野館",
            "area": "新宿", "url": "https://shinjuku.musashino-k.jp/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_le_cinema() -> list[dict]:
    """ル・シネマ渋谷宮下"""
    url = "https://www.bunkamura.co.jp/cinema_miyashita/"
    html = fetch_html(url)
    if not html:
        return []
    films = []
    titles = re.findall(r'<(?:h2|h3)[^>]*>(.*?)</(?:h2|h3)>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or any(kw in title for kw in ["ル・シネマ", "Bunkamura", "アクセス"]):
            continue
        films.append({
            "title": title, "director": "", "times": [],
            "period": "上映中", "theater": "ル・シネマ渋谷宮下",
            "area": "渋谷", "url": "https://www.bunkamura.co.jp/cinema_miyashita/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_jinbocho() -> list[dict]:
    """神保町シアター"""
    url = "https://www.shogakukan.co.jp/jinbocho-theater/"
    html = fetch_html(url)
    if not html:
        return []
    films = []
    titles = re.findall(r'<(?:h2|h3|h4)[^>]*>(.*?)</(?:h2|h3|h4)>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or any(kw in title for kw in ["神保町", "シアター", "アクセス", "INFO"]):
            continue
        films.append({
            "title": title, "director": "", "times": [],
            "period": "上映中", "theater": "神保町シアター",
            "area": "神保町", "url": "https://www.shogakukan.co.jp/jinbocho-theater/",
        })
        if len(films) >= 4:
            break
    return films


def scrape_cinemarosa() -> list[dict]:
    """シネマ・ロサ"""
    url = "https://www.cinemarosa.net/"
    html = fetch_html(url)
    if not html:
        return []
    films = []
    titles = re.findall(r'<(?:h2|h3)[^>]*>(.*?)</(?:h2|h3)>', html, re.S)
    for t in titles:
        title = clean(re.sub(r"<[^>]+>", "", t))
        if len(title) < 2 or "ロサ" in title:
            continue
        films.append({
            "title": title, "director": "", "times": [],
            "period": "上映中", "theater": "シネマ・ロサ",
            "area": "池袋", "url": "https://www.cinemarosa.net/",
        })
        if len(films) >= 4:
            break
    return films


# ── メイン ────────────────────────────────────────────────────────────────────

SCRAPERS = [
    scrape_shin_bungeiza,
    scrape_waseda_shochiku,
    scrape_eurospace,
    scrape_pole2,
    scrape_laputa,
    lambda: scrape_ttcg("cineka_omori", "キネカ大森", "大森"),
    lambda: scrape_ttcg("theatre_shinjuku", "テアトル新宿", "新宿"),
    scrape_nfaj,
    scrape_stranger,
    scrape_uplink,
    scrape_cinemart_shinjuku,
    scrape_musashino,
    scrape_le_cinema,
    scrape_jinbocho,
    scrape_cinemarosa,
]

THEATER_URLS = {
    "新文芸坐": "https://www.shin-bungeiza.com/",
    "早稲田松竹": "https://wasedashochiku.co.jp/",
    "ユーロスペース": "http://www.eurospace.co.jp/",
    "シネマヴェーラ渋谷": "http://www.cinemavera.com/",
    "下高井戸シネマ": "https://www.shimotakaidocinema.com/",
    "ポレポレ東中野": "https://pole2.co.jp/",
    "ラピュタ阿佐ヶ谷": "https://www.laputa-jp.com/",
    "キネカ大森": "https://ttcg.jp/cineka_omori/",
    "K's Cinema": "https://www.ks-cinema.com/",
    "アップリンク吉祥寺": "https://joji.uplink.co.jp/",
    "目黒シネマ": "https://www.okura-movie.co.jp/meguro_cinema/",
    "シネマート新宿": "https://www.cinemart.co.jp/theater/shinjuku/",
    "テアトル新宿": "https://ttcg.jp/theatre_shinjuku/",
    "新宿武蔵野館": "https://shinjuku.musashino-k.jp/",
    "ル・シネマ渋谷宮下": "https://www.bunkamura.co.jp/cinema_miyashita/",
    "神保町シアター": "https://www.shogakukan.co.jp/jinbocho-theater/",
    "国立映画アーカイブ": "https://www.nfaj.go.jp/",
    "シネマ・ロサ": "https://www.cinemarosa.net/",
    "Stranger": "https://stranger.jp/",
}


def main():
    all_films = []
    for scraper in SCRAPERS:
        try:
            films = scraper()
            log.info(f"  {films[0]['theater'] if films else '?'}: {len(films)} 作品")
            all_films.extend(films)
        except Exception as e:
            log.warning(f"scraper error: {e}")
        time.sleep(1.5)  # サーバー負荷軽減

    result = {
        "updated": datetime.now().isoformat(),
        "updated_date": TODAY.isoformat(),
        "week_start": TODAY.strftime("%Y/%m/%d"),
        "week_end": WEEK_END.strftime("%Y/%m/%d"),
        "theater_urls": THEATER_URLS,
        "films": all_films,
    }

    out_path = "api/films.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    log.info(f"✅ {len(all_films)} 作品 → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
