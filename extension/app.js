// ==============================================
// GitHub Pages API endpoint
// ==============================================
const FILMS_API_URL =
  "https://smata44-sudo.github.io/tokyo-cinema-picks/api/films.json";

// Fallback: 静的データ（API取得失敗時に使用）
// ==============================================
// Film database — curated from real Tokyo mini-theater schedules
// Week of Feb 2 – Feb 8, 2026
// ==============================================
const theaterUrls = {
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
};

const allFilms = [
  // --- SET A (default) ---
  {
    set: "A",
    title: "シェルブールの雨傘",
    originalTitle: "Les Parapluies de Cherbourg",
    year: 1964,
    country: "フランス",
    region: "europe",
    director: "ジャック・ドゥミ",
    genre: "ミュージカル / ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "ドゥミ×ルグラン特集",
    theater: "新文芸坐",
    area: "池袋",
    runtime: 91,
    times: ["11:00", "15:30"],
    period: "2/1〜2/6",
    comment: "カトリーヌ・ドヌーヴ主演。全編歌のミュージカル。ミシェル・ルグランの音楽が胸に迫る。特集上映でトークイベントもあり。"
  },
  {
    set: "A",
    title: "アイム・スティル・ヒア",
    originalTitle: "I'm Still Here",
    year: 2024,
    country: "ブラジル / フランス",
    region: "other",
    director: "ウォルター・サレス",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "早稲田松竹",
    area: "高田馬場",
    runtime: 137,
    times: ["11:15", "16:00"],
    period: "2/1, 2/3, 2/5",
    comment: "ブラジル軍事政権下の実話に基づく家族の物語。ヴェネツィア映画祭金獅子賞受賞作。ウォルター・サレス久々の傑作。"
  },
  {
    set: "A",
    title: "汚れた血",
    originalTitle: "Mauvais Sang",
    year: 1986,
    country: "フランス",
    region: "europe",
    director: "レオス・カラックス",
    genre: "ドラマ / ロマンス",
    isDoc: false,
    isSpecial: true,
    specialLabel: "カラックス特集",
    theater: "ユーロスペース",
    area: "渋谷",
    runtime: 116,
    times: ["12:30", "18:00"],
    period: "上映中",
    comment: "ドニ・ラヴァンがデヴィッド・ボウイの曲に合わせて疾走する名シーンは映画史に残る。カラックス回顧上映の一本。"
  },
  {
    set: "A",
    title: "イングリッド・バーグマン特集",
    originalTitle: "Ingrid Bergman Retrospective",
    year: 0,
    country: "アメリカ / スウェーデン",
    region: "usa",
    director: "各作品による",
    genre: "特集上映",
    isDoc: false,
    isSpecial: true,
    specialLabel: "バーグマン特集",
    theater: "シネマヴェーラ渋谷",
    area: "渋谷",
    runtime: 0,
    times: ["13:00", "16:00", "19:00"],
    period: "2月上旬〜中旬",
    comment: "世界で愛された女優バーグマンの回顧特集。ヒッチコック作品やロッセリーニ作品を含む貴重な上映機会。"
  },
  {
    set: "A",
    title: "ミシェル・ルグラン 世界を変えた映画音楽家",
    originalTitle: "Michel Legrand: World-Changing Film Composer",
    year: 2024,
    country: "フランス",
    region: "europe",
    director: "",
    genre: "ドキュメンタリー / 音楽",
    isDoc: true,
    isSpecial: true,
    specialLabel: "ドゥミ×ルグラン特集",
    theater: "新文芸坐",
    area: "池袋",
    runtime: 109,
    times: ["13:30"],
    period: "2/1〜2/6",
    comment: "映画音楽の巨匠ルグランの生涯を追うドキュメンタリー。ドゥミ×ルグラン特集の一環として上映。"
  },
  {
    set: "A",
    title: "コンクラーヴェ",
    originalTitle: "Conclave",
    year: 2024,
    country: "アメリカ / イギリス",
    region: "usa",
    director: "エドワード・バーガー",
    genre: "サスペンス / ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "早稲田松竹",
    area: "高田馬場",
    runtime: 120,
    times: ["13:30", "18:30"],
    period: "1/31, 2/2, 2/4, 2/6",
    comment: "教皇選挙の舞台裏を描くサスペンス。レイフ・ファインズの抑制された演技が光る。緊迫感ある密室劇。"
  },
  {
    set: "A",
    title: "アリス",
    originalTitle: "Alice",
    year: 1988,
    country: "チェコスロバキア",
    region: "europe",
    director: "ヤン・シュヴァンクマイエル",
    genre: "アニメーション / ファンタジー",
    isDoc: false,
    isSpecial: true,
    specialLabel: "特別上映",
    theater: "下高井戸シネマ",
    area: "下高井戸",
    runtime: 86,
    times: ["20:45"],
    period: "2/2",
    comment: "チェコの鬼才シュヴァンクマイエルによる実写×ストップモーション。不気味で美しい『不思議の国のアリス』。一夜限りの特別上映。"
  },
  {
    set: "A",
    title: "どうすればよかったか？",
    originalTitle: "Dousureba Yokatta ka?",
    year: 2024,
    country: "日本",
    region: "japan",
    director: "藤野知明",
    genre: "ドキュメンタリー",
    isDoc: true,
    isSpecial: false,
    specialLabel: "",
    theater: "ポレポレ東中野",
    area: "東中野",
    runtime: 0,
    times: ["11:40", "13:50"],
    period: "上映中",
    comment: "監督自身の家族を撮った衝撃のドキュメンタリー。上映後に監督によるQ&Aあり（2/2, 2/6）。"
  },
  {
    set: "A",
    title: "ポンヌフの恋人",
    originalTitle: "Les Amants du Pont-Neuf",
    year: 1991,
    country: "フランス",
    region: "europe",
    director: "レオス・カラックス",
    genre: "ドラマ / ロマンス",
    isDoc: false,
    isSpecial: true,
    specialLabel: "カラックス特集",
    theater: "ユーロスペース",
    area: "渋谷",
    runtime: 125,
    times: ["15:00"],
    period: "上映中",
    comment: "パリのポンヌフ橋を舞台にしたホームレスの恋。花火のシーンは映画史に残る名場面。カラックス特集上映。"
  },
  {
    set: "A",
    title: "ロシュフォールの恋人たち",
    originalTitle: "Les Demoiselles de Rochefort",
    year: 1967,
    country: "フランス / アメリカ",
    region: "europe",
    director: "ジャック・ドゥミ",
    genre: "ミュージカル",
    isDoc: false,
    isSpecial: true,
    specialLabel: "ドゥミ×ルグラン特集",
    theater: "新文芸坐",
    area: "池袋",
    runtime: 127,
    times: ["14:00", "18:30"],
    period: "2/1〜2/6",
    comment: "ドヌーヴ姉妹とジーン・ケリー共演。色鮮やかな港町を舞台に繰り広げられる軽やかなミュージカル。"
  },
  {
    set: "A",
    title: "ストレイト・ストーリー 4Kリマスター",
    originalTitle: "The Straight Story",
    year: 1999,
    country: "アメリカ",
    region: "usa",
    director: "デヴィッド・リンチ",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "4Kリマスター",
    theater: "シネマート新宿",
    area: "新宿",
    runtime: 113,
    times: ["9:45"],
    period: "〜2/5",
    comment: "デヴィッド・リンチ最も優しい映画。老人が芝刈り機で兄に会いに行くロードムービー。4Kリマスターで再び。"
  },
  {
    set: "A",
    title: "エターナル・サンシャイン",
    originalTitle: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
    country: "アメリカ",
    region: "usa",
    director: "ミシェル・ゴンドリー",
    genre: "ドラマ / ロマンス / SF",
    isDoc: false,
    isSpecial: true,
    specialLabel: "GAGA 40周年特集",
    theater: "ル・シネマ渋谷宮下",
    area: "渋谷",
    runtime: 108,
    times: ["上映時間は公式サイト参照"],
    period: "1/30〜2/19",
    comment: "チャーリー・カウフマン脚本の切ないSFロマンス。GAGA 40周年記念特集で35mmプリント上映の可能性も。"
  },
  {
    set: "A",
    title: "生誕100年 俳優・佐田啓二 特集",
    originalTitle: "Keiji Sada Centennial Retrospective",
    year: 0,
    country: "日本",
    region: "japan",
    director: "各作品による",
    genre: "特集上映",
    isDoc: false,
    isSpecial: true,
    specialLabel: "生誕100年特集",
    theater: "神保町シアター",
    area: "神保町",
    runtime: 0,
    times: ["上映時間は公式サイト参照"],
    period: "1/17〜2/13",
    comment: "小津安二郎作品の常連、佐田啓二の生誕100年回顧特集。昭和の名作群を名画座の雰囲気で堪能できる。"
  },
  {
    set: "A",
    title: "アンソロジー・フィルムアーカイブス アメリカ実験映画の地平へ",
    originalTitle: "Anthology Film Archives: American Experimental Cinema",
    year: 0,
    country: "アメリカ",
    region: "usa",
    director: "各作品による",
    genre: "実験映画 / アヴァンギャルド",
    isDoc: false,
    isSpecial: true,
    specialLabel: "企画上映",
    theater: "国立映画アーカイブ",
    area: "京橋",
    runtime: 0,
    times: ["13:00", "15:00", "19:00"],
    period: "1/15〜2/8",
    comment: "NYの実験映画の殿堂アンソロジー・フィルムアーカイブスのコレクションから厳選。映画の可能性を拡張する貴重なプログラム。"
  },

  // --- SET B (after first refresh) ---
  {
    set: "B",
    title: "リー・ミラー 彼女の瞳が映す世界",
    originalTitle: "Lee",
    year: 2024,
    country: "イギリス / アメリカ",
    region: "usa",
    director: "エレン・カラス",
    genre: "ドラマ / 伝記",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "早稲田松竹",
    area: "高田馬場",
    runtime: 116,
    times: ["14:00", "18:45"],
    period: "2/1, 2/3, 2/5",
    comment: "報道写真家リー・ミラーの波乱の半生。ケイト・ウィンスレットが迫真の演技で体現する。"
  },
  {
    set: "B",
    title: "トレインスポッティング",
    originalTitle: "Trainspotting",
    year: 1996,
    country: "イギリス",
    region: "europe",
    director: "ダニー・ボイル",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "30周年リバイバル",
    theater: "キネカ大森",
    area: "大森",
    runtime: 94,
    times: ["15:20", "19:30"],
    period: "1/30〜2週間",
    comment: "90年代ブリティッシュ・カルチャーの金字塔。30周年リバイバル上映。スクリーンで観る価値がある。"
  },
  {
    set: "B",
    title: "ロバと王女",
    originalTitle: "Peau d'âne",
    year: 1970,
    country: "フランス",
    region: "europe",
    director: "ジャック・ドゥミ",
    genre: "ファンタジー / ミュージカル",
    isDoc: false,
    isSpecial: true,
    specialLabel: "ドゥミ×ルグラン特集",
    theater: "新文芸坐",
    area: "池袋",
    runtime: 90,
    times: ["11:30", "16:00"],
    period: "2/1〜2/6",
    comment: "ドヌーヴ主演のファンタジー童話。ドゥミ×ルグランの特集上映ならではの一本。色彩設計が美しい。"
  },
  {
    set: "B",
    title: "おーい、応為",
    originalTitle: "Oh-i, Oui",
    year: 2025,
    country: "日本",
    region: "japan",
    director: "大森立嗣",
    genre: "ドラマ / 時代劇",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "下高井戸シネマ",
    area: "下高井戸",
    runtime: 122,
    times: ["10:30", "14:45"],
    period: "上映中",
    comment: "長澤まさみ主演。葛飾北斎の娘・応為の生涯を描く。日本美術と映像美が融合した力作。"
  },
  {
    set: "B",
    title: "猫を放つ",
    originalTitle: "Neko wo Hanatsu",
    year: 2025,
    country: "日本",
    region: "japan",
    director: "志賀大介",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "ポレポレ東中野",
    area: "東中野",
    runtime: 0,
    times: ["15:30"],
    period: "上映中",
    comment: "志賀大介監督のデビュー長編。新鋭監督の瑞々しい感性が光るインディペンデント作品。"
  },
  {
    set: "B",
    title: "エミリア・ペレス",
    originalTitle: "Emilia Pérez",
    year: 2024,
    country: "フランス",
    region: "europe",
    director: "ジャック・オディアール",
    genre: "ミュージカル / ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "早稲田松竹",
    area: "高田馬場",
    runtime: 133,
    times: ["11:00", "17:30"],
    period: "1/31, 2/2, 2/4, 2/6",
    comment: "カンヌ審査員賞受賞。メキシコの麻薬王がトランスジェンダーとして新たな人生を歩む異色ミュージカル。"
  },
  {
    set: "B",
    title: "恋は夜生まれる",
    originalTitle: "Koi wa Yoru Umareru",
    year: 2025,
    country: "日本",
    region: "japan",
    director: "",
    genre: "ドラマ / ロマンス",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "ユーロスペース",
    area: "渋谷",
    runtime: 0,
    times: ["12:00", "17:00", "19:30"],
    period: "1/31〜",
    comment: "ユーロスペースで封切り公開中の新作。夜の東京を舞台にしたロマンス。"
  },
  {
    set: "B",
    title: "昭和銀幕ヒロイン 中島そのみ特集",
    originalTitle: "Showa Heroines: Nakajima Sonomi",
    year: 0,
    country: "日本",
    region: "japan",
    director: "各作品による",
    genre: "特集上映",
    isDoc: false,
    isSpecial: true,
    specialLabel: "昭和ヒロイン特集",
    theater: "ラピュタ阿佐ヶ谷",
    area: "阿佐ヶ谷",
    runtime: 0,
    times: ["10:30"],
    period: "2/1〜2/7",
    comment: "知られざる昭和の名女優・中島そのみの出演作を集めた貴重な特集上映。ラピュタとシネマヴェーラの共同企画。"
  },
  {
    set: "B",
    title: "ヴィットリア 抱きしめて",
    originalTitle: "Vittoria",
    year: 2024,
    country: "イタリア",
    region: "europe",
    director: "アレッサンドロ・カッサゴリ",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "ポレポレ東中野",
    area: "東中野",
    runtime: 0,
    times: ["9:50"],
    period: "上映中",
    comment: "ナンニ・モレッティ製作。養子縁組を通じた家族の絆を描くイタリア映画。"
  },
  {
    set: "B",
    title: "任侠映画特集 血湧き肉躍る",
    originalTitle: "Ninkyou Cinema Part 2",
    year: 0,
    country: "日本",
    region: "japan",
    director: "各作品による",
    genre: "アクション / 任侠",
    isDoc: false,
    isSpecial: true,
    specialLabel: "任侠映画特集",
    theater: "ラピュタ阿佐ヶ谷",
    area: "阿佐ヶ谷",
    runtime: 0,
    times: ["13:00", "16:00"],
    period: "2/1〜4/4",
    comment: "日本映画の黄金期を彩った任侠映画の数々。名画座ラピュタならではの特集上映。"
  },
  {
    set: "B",
    title: "ヘドウィグ・アンド・アングリーインチ",
    originalTitle: "Hedwig and the Angry Inch",
    year: 2001,
    country: "アメリカ",
    region: "usa",
    director: "ジョン・キャメロン・ミッチェル",
    genre: "ミュージカル / ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "GAGA 40周年特集",
    theater: "ル・シネマ渋谷宮下",
    area: "渋谷",
    runtime: 92,
    times: ["上映時間は公式サイト参照"],
    period: "1/30〜2/19",
    comment: "性別を超えたロックスターの物語。カルト的人気を誇るミュージカル映画。GAGA 40周年記念特集で上映。"
  },
  {
    set: "B",
    title: "落下の王国 4Kデジタルリマスター",
    originalTitle: "The Fall",
    year: 2006,
    country: "アメリカ / インド",
    region: "usa",
    director: "ターセム・シン",
    genre: "ファンタジー / アドベンチャー",
    isDoc: false,
    isSpecial: true,
    specialLabel: "4Kリマスター",
    theater: "新宿武蔵野館",
    area: "新宿",
    runtime: 117,
    times: ["上映時間は公式サイト参照"],
    period: "上映中",
    comment: "世界遺産をロケ地に使った圧倒的映像美。怪我をしたスタントマンと少女の物語。4Kリマスターで甦る色彩の洪水。"
  },
  {
    set: "B",
    title: "終点のあの子",
    originalTitle: "The Girl at the Terminus",
    year: 2025,
    country: "日本",
    region: "japan",
    director: "",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "テアトル新宿",
    area: "新宿",
    runtime: 125,
    times: ["9:30", "13:50", "18:20"],
    period: "1/23〜",
    comment: "邦画専門館テアトル新宿で公開中。日本映画の新しい才能に出会える場所。"
  },
  {
    set: "B",
    title: "旅と日々",
    originalTitle: "Journey and Days",
    year: 2025,
    country: "日本",
    region: "japan",
    director: "三宅唱",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "Stranger",
    area: "菊川",
    runtime: 89,
    times: ["10:00"],
    period: "上映中",
    comment: "三宅唱監督作。49席のカフェ併設マイクロシアターStrangerで、親密な空間での映画体験を。"
  },

  // --- SET C (after second refresh) ---
  {
    set: "C",
    title: "ファーゴ 4K",
    originalTitle: "Fargo",
    year: 1996,
    country: "アメリカ",
    region: "usa",
    director: "ジョエル・コーエン",
    genre: "クライム / ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "30周年4Kリバイバル",
    theater: "キネカ大森",
    area: "大森",
    runtime: 98,
    times: ["13:00", "17:30"],
    period: "2/13〜2週間",
    comment: "コーエン兄弟の最高傑作。フランシス・マクドーマンドの名演。30周年4K版でスクリーンに甦る。"
  },
  {
    set: "C",
    title: "フランケンシュタイン",
    originalTitle: "Frankenstein",
    year: 2025,
    country: "アメリカ",
    region: "usa",
    director: "ギレルモ・デル・トロ",
    genre: "ホラー / ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "下高井戸シネマ",
    area: "下高井戸",
    runtime: 149,
    times: ["13:00", "18:00"],
    period: "2月上映",
    comment: "デル・トロ念願の企画。オスカー・アイザック、ミア・ゴス出演。古典怪奇文学の新たな映画化。"
  },
  {
    set: "C",
    title: "フィフィ大空をゆく 4K",
    originalTitle: "Le Voyage en Ballon",
    year: 1965,
    country: "フランス",
    region: "europe",
    director: "アルベール・ラモリス",
    genre: "ファミリー / アドベンチャー",
    isDoc: false,
    isSpecial: true,
    specialLabel: "4K特別上映",
    theater: "下高井戸シネマ",
    area: "下高井戸",
    runtime: 78,
    times: ["9:30"],
    period: "2/9",
    comment: "『赤い風船』のラモリス監督作。気球でフランスの空を旅する映像詩。4Kリストア版の貴重な上映。"
  },
  {
    set: "C",
    title: "躍動！感動！香港映画セレクション vol.12",
    originalTitle: "Hong Kong Cinema Selection vol.12",
    year: 0,
    country: "香港",
    region: "other",
    director: "各作品による",
    genre: "特集上映",
    isDoc: false,
    isSpecial: true,
    specialLabel: "香港映画特集",
    theater: "新文芸坐",
    area: "池袋",
    runtime: 0,
    times: ["19:00"],
    period: "2/1〜2/8",
    comment: "香港映画の名作を集めた人気シリーズ第12弾。アクションからドラマまで香港映画の魅力を堪能。"
  },
  {
    set: "C",
    title: "月刊ホン・サンス Vol.4",
    originalTitle: "Monthly Hong Sang-soo Vol.4",
    year: 0,
    country: "韓国",
    region: "other",
    director: "ホン・サンス",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "月刊ホン・サンス",
    theater: "ユーロスペース",
    area: "渋谷",
    runtime: 0,
    times: ["14:00", "18:30"],
    period: "2/14〜",
    comment: "韓国インディペンデント映画の巨匠ホン・サンス作品を毎月上映する人気企画の第4弾。"
  },
  {
    set: "C",
    title: "私は死にたくない！",
    originalTitle: "I Want to Live!",
    year: 1958,
    country: "アメリカ",
    region: "usa",
    director: "ロバート・ワイズ",
    genre: "ドラマ / クライム",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "ユーロスペース",
    area: "渋谷",
    runtime: 120,
    times: ["12:00", "17:00"],
    period: "2/7〜2/13",
    comment: "スーザン・ヘイワードがアカデミー主演女優賞を獲得した実話ベースのクライムドラマ。"
  },
  {
    set: "C",
    title: "祖谷物語 おくのひと",
    originalTitle: "Iya Monogatari",
    year: 2013,
    country: "日本",
    region: "japan",
    director: "蔦哲一朗",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "特別上映+トーク",
    theater: "K's Cinema",
    area: "新宿",
    runtime: 169,
    times: ["13:20"],
    period: "上映中",
    comment: "徳島の秘境・祖谷を舞台にした壮大な叙事詩。トーク＆サイン会付きの特別上映。"
  },
  {
    set: "C",
    title: "黒の牛",
    originalTitle: "Kuro no Ushi",
    year: 2025,
    country: "日本 / インド",
    region: "japan",
    director: "",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "K's Cinema",
    area: "新宿",
    runtime: 0,
    times: ["15:45", "18:00"],
    period: "上映中",
    comment: "日本とインドの合作。K's Cinemaならではのインディペンデント作品。監督トーク付き上映あり。"
  },
  {
    set: "C",
    title: "Voices from Gaza Episode 2",
    originalTitle: "Voices from Gaza Episode 2",
    year: 2025,
    country: "パレスチナ",
    region: "other",
    director: "",
    genre: "ドキュメンタリー",
    isDoc: true,
    isSpecial: false,
    specialLabel: "",
    theater: "アップリンク吉祥寺",
    area: "吉祥寺",
    runtime: 0,
    times: ["10:45", "16:20"],
    period: "上映中",
    comment: "ガザの人々の声を届けるドキュメンタリー第2弾。今観るべき重要な作品。"
  },
  {
    set: "C",
    title: "東映B級魂 野田幸男NIGHTS",
    originalTitle: "Toei B-Movie Spirit: Noda Yukio NIGHTS",
    year: 0,
    country: "日本",
    region: "japan",
    director: "野田幸男",
    genre: "アクション / レイトショー",
    isDoc: false,
    isSpecial: true,
    specialLabel: "レイトショー特集",
    theater: "ラピュタ阿佐ヶ谷",
    area: "阿佐ヶ谷",
    runtime: 0,
    times: ["20:30"],
    period: "2/1〜4/4",
    comment: "不滅の東映B級魂。知る人ぞ知る野田幸男監督のレイトショー特集。名画座の醍醐味。"
  },
  {
    set: "C",
    title: "オール・アバウト・マイ・マザー",
    originalTitle: "All About My Mother",
    year: 1999,
    country: "スペイン",
    region: "europe",
    director: "ペドロ・アルモドバル",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "GAGA 40周年特集",
    theater: "ル・シネマ渋谷宮下",
    area: "渋谷",
    runtime: 101,
    times: ["上映時間は公式サイト参照"],
    period: "1/30〜2/19",
    comment: "アルモドバルの最高傑作との呼び声も高い。女性たちの連帯と再生の物語。GAGA 40周年記念特集で上映。"
  },
  {
    set: "C",
    title: "レクイエム・フォー・ドリーム 4Kリマスター",
    originalTitle: "Requiem for a Dream",
    year: 2000,
    country: "アメリカ",
    region: "usa",
    director: "ダーレン・アロノフスキー",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "4Kリマスター",
    theater: "新宿武蔵野館",
    area: "新宿",
    runtime: 102,
    times: ["上映時間は公式サイト参照"],
    period: "2/6〜",
    comment: "アロノフスキーの衝撃作が4Kリマスターで。中毒に蝕まれる人々を描く圧巻の映像体験。"
  },
  {
    set: "C",
    title: "ヤンヤン 夏の想い出 4Kレストア",
    originalTitle: "Yi Yi",
    year: 2000,
    country: "台湾",
    region: "other",
    director: "エドワード・ヤン",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: true,
    specialLabel: "4Kレストア",
    theater: "ル・シネマ渋谷宮下",
    area: "渋谷",
    runtime: 173,
    times: ["上映時間は公式サイト参照"],
    period: "上映中",
    comment: "エドワード・ヤンの遺作にして最高傑作。台北の家族の日常を3時間で描く至福の映画体験。4Kレストア版。"
  },
  {
    set: "C",
    title: "怪異と映画 特集",
    originalTitle: "Supernatural Phenomena and Film",
    year: 0,
    country: "日本",
    region: "japan",
    director: "各作品による",
    genre: "ホラー / 特集上映",
    isDoc: false,
    isSpecial: true,
    specialLabel: "怪異と映画",
    theater: "神保町シアター",
    area: "神保町",
    runtime: 0,
    times: ["上映時間は公式サイト参照"],
    period: "2/14〜2/27",
    comment: "『リング』や『蛇娘と白髪魔』など、日本の怪異映画を集めた特集上映。楳図かずおリスペクト割引も。"
  },
  {
    set: "C",
    title: "逝ける映画人を偲んで 2023-2024",
    originalTitle: "In Memory of Departed Filmmakers",
    year: 0,
    country: "日本",
    region: "japan",
    director: "各作品による",
    genre: "特集上映",
    isDoc: false,
    isSpecial: true,
    specialLabel: "企画上映",
    theater: "国立映画アーカイブ",
    area: "京橋",
    runtime: 0,
    times: ["15:00"],
    period: "2/10〜3/22",
    comment: "2023-2024年に逝去した映画人を偲ぶ上映。『魔界転生』『ゴジラVSビオランテ』など84本60プログラム。"
  },
  {
    set: "C",
    title: "万事快調 オール・グリーンズ",
    originalTitle: "All Greens",
    year: 2025,
    country: "日本",
    region: "japan",
    director: "",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "シネマ・ロサ",
    area: "池袋",
    runtime: 0,
    times: ["13:05", "19:00"],
    period: "上映中",
    comment: "池袋のインディペンデント映画の聖地シネマ・ロサで上映中。アンダーグラウンドな邦画に出会える場所。"
  },
  {
    set: "C",
    title: "ヘアスプレー",
    originalTitle: "Hairspray",
    year: 1988,
    country: "アメリカ",
    region: "usa",
    director: "ジョン・ウォーターズ",
    genre: "コメディ / ミュージカル",
    isDoc: false,
    isSpecial: true,
    specialLabel: "期間限定上映",
    theater: "シネマート新宿",
    area: "新宿",
    runtime: 92,
    times: ["上映時間は公式サイト参照"],
    period: "〜2/5",
    comment: "ジョン・ウォーターズ監督のオリジナル版。後にブロードウェイ化された元祖。2週間限定上映。"
  },
  {
    set: "C",
    title: "わが心のジミー・ディーン",
    originalTitle: "Come Back to the 5 & Dime, Jimmy Dean, Jimmy Dean",
    year: 1982,
    country: "アメリカ",
    region: "usa",
    director: "ロバート・アルトマン",
    genre: "ドラマ",
    isDoc: false,
    isSpecial: false,
    specialLabel: "",
    theater: "Stranger",
    area: "菊川",
    runtime: 109,
    times: ["上映時間は公式サイト参照"],
    period: "上映中",
    comment: "アルトマンの隠れた傑作。菊川の49席マイクロシアターStrangerで観る贅沢な映画体験。"
  }
];

// ==============================================
// Keyword knowledge base — maps search terms to related attributes
// ==============================================
const keywordDB = {
  // --- Directors ---
  "ゴダール":      { region: "europe", era: [1960,1970], genres: ["ドラマ","アヴァンギャルド","ロマンス"], country: "フランス", related: ["カラックス","ヌーヴェルヴァーグ","ドゥミ"] },
  "トリュフォー":  { region: "europe", era: [1960,1975], genres: ["ドラマ","ロマンス"], country: "フランス", related: ["ヌーヴェルヴァーグ","ドゥミ","カラックス"] },
  "ドゥミ":        { region: "europe", era: [1964,1970], genres: ["ミュージカル","ファンタジー"], country: "フランス", related: ["ルグラン","ドヌーヴ","ヌーヴェルヴァーグ"] },
  "カラックス":    { region: "europe", era: [1986,1999], genres: ["ドラマ","ロマンス"], country: "フランス", related: ["ゴダール","ヌーヴェルヴァーグ"] },
  "アルモドバル":  { region: "europe", era: [1988,2024], genres: ["ドラマ"], country: "スペイン", related: ["ヨーロッパ","女性"] },
  "リンチ":        { region: "usa", era: [1977,2006], genres: ["ドラマ","ホラー","ファンタジー"], country: "アメリカ", related: ["シュヴァンクマイエル","実験","アロノフスキー"] },
  "コーエン":      { region: "usa", era: [1984,2018], genres: ["クライム","ドラマ","コメディ"], country: "アメリカ", related: ["ファーゴ","アメリカ映画"] },
  "ヒッチコック":  { region: "usa", era: [1935,1976], genres: ["サスペンス","ドラマ"], country: "アメリカ", related: ["バーグマン","クラシック"] },
  "小津":          { region: "japan", era: [1930,1962], genres: ["ドラマ","特集上映"], country: "日本", related: ["佐田啓二","昭和","日本映画"] },
  "黒澤":          { region: "japan", era: [1943,1993], genres: ["ドラマ","アクション","時代劇"], country: "日本", related: ["日本映画","昭和","任侠"] },
  "デル・トロ":    { region: "usa", era: [1993,2025], genres: ["ホラー","ファンタジー","ドラマ"], country: "アメリカ", related: ["フランケンシュタイン","怪異"] },
  "ホン・サンス":  { region: "other", era: [1996,2025], genres: ["ドラマ"], country: "韓国", related: ["インディペンデント","アジア"] },
  "エドワード・ヤン": { region: "other", era: [1983,2000], genres: ["ドラマ"], country: "台湾", related: ["アジア","ヤンヤン","家族"] },
  "アルトマン":    { region: "usa", era: [1970,2006], genres: ["ドラマ","コメディ"], country: "アメリカ", related: ["群像劇","アメリカ映画"] },
  "シュヴァンクマイエル": { region: "europe", era: [1964,2010], genres: ["アニメーション","ファンタジー","ホラー"], country: "チェコ", related: ["実験","リンチ","アヴァンギャルド"] },

  // --- Actors/People ---
  "ドヌーヴ":      { region: "europe", era: [1964,2000], genres: ["ミュージカル","ドラマ","ファンタジー"], country: "フランス", related: ["ドゥミ","シェルブール","ロシュフォール","ロバと王女"] },
  "バーグマン":    { region: "usa", era: [1939,1978], genres: ["ドラマ","サスペンス","特集上映"], country: "アメリカ", related: ["ヒッチコック","ロッセリーニ","クラシック"] },
  "ルグラン":      { region: "europe", era: [1960,2019], genres: ["ミュージカル","ドキュメンタリー","音楽"], country: "フランス", related: ["ドゥミ","シェルブール","映画音楽"] },
  "佐田啓二":      { region: "japan", era: [1949,1964], genres: ["ドラマ","特集上映"], country: "日本", related: ["小津","昭和","神保町"] },

  // --- Genres/Themes ---
  "ミュージカル":  { region: null, era: null, genres: ["ミュージカル"], country: null, related: ["ドゥミ","ヘドウィグ","ヘアスプレー"] },
  "ホラー":        { region: null, era: null, genres: ["ホラー"], country: null, related: ["怪異","フランケンシュタイン","シュヴァンクマイエル"] },
  "ドキュメンタリー": { region: null, era: null, genres: ["ドキュメンタリー"], country: null, related: [] },
  "サスペンス":    { region: null, era: null, genres: ["サスペンス","クライム"], country: null, related: ["ヒッチコック","コーエン"] },
  "アニメーション": { region: null, era: null, genres: ["アニメーション"], country: null, related: ["シュヴァンクマイエル","実験"] },
  "実験映画":      { region: null, era: null, genres: ["実験映画","アヴァンギャルド"], country: null, related: ["アンソロジー","リンチ"] },
  "任侠":          { region: "japan", era: [1960,1975], genres: ["アクション","任侠"], country: "日本", related: ["東映","昭和","日本映画"] },
  "ロマンス":      { region: null, era: null, genres: ["ロマンス","ドラマ"], country: null, related: ["恋","ポンヌフ"] },
  "家族":          { region: null, era: null, genres: ["ドラマ"], country: null, related: ["ヤンヤン","アイム・スティル"] },

  // --- Movements/Eras ---
  "ヌーヴェルヴァーグ": { region: "europe", era: [1958,1975], genres: ["ドラマ","ロマンス"], country: "フランス", related: ["ゴダール","トリュフォー","ドゥミ","カラックス"] },
  "昭和":          { region: "japan", era: [1926,1989], genres: ["ドラマ","特集上映","時代劇","任侠"], country: "日本", related: ["佐田啓二","名画座","日本映画"] },
  "90年代":        { region: null, era: [1990,1999], genres: [], country: null, related: ["トレインスポッティング","ファーゴ"] },
  "4K":            { region: null, era: null, genres: [], country: null, related: ["リマスター","レストア"] },

  // --- Countries/Regions ---
  "フランス映画":  { region: "europe", era: null, genres: [], country: "フランス", related: ["ドゥミ","カラックス","ゴダール"] },
  "アメリカ映画":  { region: "usa", era: null, genres: [], country: "アメリカ", related: ["ハリウッド"] },
  "日本映画":      { region: "japan", era: null, genres: [], country: "日本", related: ["邦画","昭和"] },
  "韓国映画":      { region: "other", era: null, genres: [], country: "韓国", related: ["ホン・サンス","アジア"] },
  "台湾映画":      { region: "other", era: null, genres: [], country: "台湾", related: ["エドワード・ヤン","アジア"] },
  "香港映画":      { region: "other", era: null, genres: ["アクション","特集上映"], country: "香港", related: ["アジア"] },
};

// ==============================================
// App state & logic
// ==============================================
let currentSet = "A";
const setOrder = ["A", "B", "C"];
let currentFilter = "all";
let searchMode = false;
let searchResults = [];
let searchQuery = "";

// 動的データ（APIから取得後に上書き）
let dynamicFilms = null;
let dynamicTheaterUrls = null;
let apiWeekLabel = null;
let lastUpdated = null;

function getActiveFilms() { return dynamicFilms || allFilms; }
function getActiveTheaterUrls() { return dynamicTheaterUrls || theaterUrls; }

function getWeekLabel() {
  if (apiWeekLabel) return apiWeekLabel;
  const start = new Date(2026, 1, 2);
  const end = new Date(2026, 1, 8);
  const fmt = d => `${d.getMonth()+1}/${d.getDate()}`;
  return `${start.getFullYear()}年 ${fmt(start)}（月）〜 ${fmt(end)}（日）`;
}

function filterFilms(films, filter) {
  if (filter === "all") return films;
  if (filter === "doc") return films.filter(f => f.isDoc);
  return films.filter(f => f.region === filter);
}

// --- Relevance scoring engine ---
function scoreFilm(film, keyword) {
  let score = 0;
  const kw = keyword.toLowerCase();
  const allText = [
    film.title, film.originalTitle, film.director, film.genre,
    film.country, film.comment, film.specialLabel, film.theater, film.area
  ].join(" ").toLowerCase();

  // 1) Direct text match (highest priority)
  if (allText.includes(kw)) {
    score += 50;
    // Bonus for title/director match
    if ((film.title + film.originalTitle).toLowerCase().includes(kw)) score += 30;
    if (film.director.toLowerCase().includes(kw)) score += 25;
  }

  // 2) Knowledge base lookup
  const entry = findKBEntry(keyword);
  if (entry) {
    // Region match
    if (entry.region && film.region === entry.region) score += 15;

    // Country match
    if (entry.country && film.country.includes(entry.country)) score += 12;

    // Era proximity
    if (entry.era && film.year > 0) {
      const [eraStart, eraEnd] = entry.era;
      if (film.year >= eraStart && film.year <= eraEnd) {
        score += 18;
      } else {
        const dist = Math.min(Math.abs(film.year - eraStart), Math.abs(film.year - eraEnd));
        if (dist <= 10) score += 10;
        else if (dist <= 20) score += 5;
      }
    }

    // Genre overlap
    if (entry.genres.length > 0) {
      const filmGenres = film.genre.toLowerCase();
      entry.genres.forEach(g => {
        if (filmGenres.includes(g.toLowerCase())) score += 12;
      });
    }

    // Related terms match in film text
    if (entry.related) {
      entry.related.forEach(r => {
        if (allText.includes(r.toLowerCase())) score += 8;
      });
    }
  }

  return score;
}

function findKBEntry(keyword) {
  const kw = keyword.toLowerCase();
  // Exact match
  for (const [key, val] of Object.entries(keywordDB)) {
    if (kw.includes(key.toLowerCase()) || key.toLowerCase().includes(kw)) {
      return val;
    }
  }
  return null;
}

function performSearch(keyword) {
  if (!keyword.trim()) {
    clearSearch();
    return;
  }

  searchMode = true;
  searchQuery = keyword.trim();

  // Score ALL films across all sets
  const scored = getActiveFilms().map(f => ({
    film: f,
    score: scoreFilm(f, searchQuery)
  }));

  // Filter films with score > 0, sort by score descending
  searchResults = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // If no results with score > 0, try softer match
  if (searchResults.length === 0) {
    // Fall back: show all films sorted by loose relevance
    const entry = findKBEntry(searchQuery);
    if (entry) {
      // Re-score with region/era only
      const loose = getActiveFilms().map(f => {
        let s = 0;
        if (entry.region && f.region === entry.region) s += 10;
        if (entry.era && f.year > 0) {
          const [es, ee] = entry.era;
          if (f.year >= es - 15 && f.year <= ee + 15) s += 8;
        }
        if (entry.genres.length > 0) {
          entry.genres.forEach(g => {
            if (f.genre.toLowerCase().includes(g.toLowerCase())) s += 6;
          });
        }
        return { film: f, score: s };
      }).filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      searchResults = loose;
    }
  }

  renderSearch();
}

function clearSearch() {
  searchMode = false;
  searchResults = [];
  searchQuery = "";
  document.getElementById('searchInput').value = "";
  document.getElementById('searchStatus').innerHTML = "";
  render();
}

function getRelevanceLabel(score) {
  if (score >= 60) return "関連度：高";
  if (score >= 30) return "関連度：中";
  return "関連度：低";
}

function buildCard(film, rank, score) {
  const tags = [];
  tags.push(`<span class="tag country">${film.country}${film.year ? ' / ' + film.year : ''}</span>`);
  tags.push(`<span class="tag genre">${film.genre}</span>`);
  if (film.isSpecial) {
    tags.push(`<span class="tag special">${film.specialLabel}</span>`);
  }
  if (film.isDoc) {
    tags.push(`<span class="tag special">ドキュメンタリー</span>`);
  }

  const timesStr = film.times.length ? film.times.join(' / ') : '時間は公式サイト参照';
  const badge = (typeof score === 'number' && searchMode)
    ? `<span class="relevance-badge">${getRelevanceLabel(score)}</span>`
    : '';

  return `
    <div class="card">
      <div class="rank">${rank}</div>
      <div class="info">
        <div class="title-row">
          <span class="film-title">${film.title}</span>
          ${film.originalTitle ? `<span class="original-title">${film.originalTitle}</span>` : ''}
        </div>
        <div class="meta">${tags.join('')}</div>
        <div class="theater-line">
          <a class="theater-name" href="${getActiveTheaterUrls()[film.theater] || '#'}" target="_blank" rel="noopener">${film.theater}</a>（${film.area}）
          ｜${film.period}
        </div>
        <div class="time-line">上映時間: ${timesStr}${film.runtime ? ` ／ ${film.runtime}分` : ''}</div>
        <div class="comment">${film.comment}</div>
      </div>
      ${badge}
    </div>
  `;
}

function renderSearch() {
  const container = document.getElementById('ranking');
  const status = document.getElementById('searchStatus');

  if (searchResults.length === 0) {
    status.innerHTML = `「<span class="keyword-highlight">${searchQuery}</span>」に関連する上映は見つかりませんでした`;
    container.innerHTML = '';
    return;
  }

  status.innerHTML = `「<span class="keyword-highlight">${searchQuery}</span>」に関連する映画 — ${searchResults.length}件`;
  container.innerHTML = searchResults.map((s, i) => buildCard(s.film, i + 1, s.score)).join('');
}

function render() {
  if (searchMode) { renderSearch(); return; }

  const container = document.getElementById('ranking');
  const setFilms = getActiveFilms().filter(f => f.set === currentSet);
  const filtered = filterFilms(setFilms, currentFilter);
  const top10 = filtered.slice(0, 10);

  document.getElementById('searchStatus').innerHTML = "";
  container.innerHTML = top10.map((f, i) => buildCard(f, i + 1)).join('');
}

function refresh() {
  if (searchMode) {
    // In search mode, re-shuffle by adding randomness
    searchResults.forEach(s => { s.score += (Math.random() - 0.5) * 10; });
    searchResults.sort((a, b) => b.score - a.score);
    renderSearch();
    return;
  }

  const container = document.getElementById('ranking');
  container.classList.add('refreshing');
  setTimeout(() => {
    const idx = setOrder.indexOf(currentSet);
    currentSet = setOrder[(idx + 1) % setOrder.length];
    container.classList.remove('refreshing');
    render();
  }, 300);
}

// ==============================================
// All-listings mode — show every film grouped by theater
// ==============================================
let currentMode = "ranking"; // "ranking" | "listing"
let theaterFilterValue = "all";

function getAllTheaters() {
  const theaterMap = {};
  getActiveFilms().forEach(f => {
    if (!theaterMap[f.theater]) {
      theaterMap[f.theater] = { area: f.area, films: [] };
    }
    // Avoid duplicates (same title in same theater)
    if (!theaterMap[f.theater].films.some(x => x.title === f.title)) {
      theaterMap[f.theater].films.push(f);
    }
  });
  return theaterMap;
}

function buildTheaterFilterButtons() {
  const container = document.getElementById('theaterFilter');
  const theaters = getAllTheaters();
  const names = Object.keys(theaters);

  let html = `<button class="${theaterFilterValue === 'all' ? 'active' : ''}" data-tf="all">すべて (${names.length}館)</button>`;
  names.forEach(name => {
    const active = theaterFilterValue === name ? 'active' : '';
    const short = name.length > 8 ? name.substring(0, 8) + '…' : name;
    html += `<button class="${active}" data-tf="${name}" title="${name}">${short}</button>`;
  });
  container.innerHTML = html;

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      theaterFilterValue = btn.dataset.tf;
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderListing();
    });
  });
}

function buildFilmRow(film) {
  const director = film.director || '—';
  const timesStr = film.times.length ? film.times.join(' / ') : '公式サイト参照';
  const runtime = film.runtime ? ` (${film.runtime}分)` : '';

  let tags = '';
  const tagItems = [];
  tagItems.push(`<span class="tag country">${film.country}${film.year ? ' / ' + film.year : ''}</span>`);
  tagItems.push(`<span class="tag genre">${film.genre}</span>`);
  if (film.isSpecial) tagItems.push(`<span class="tag special">${film.specialLabel}</span>`);
  if (film.isDoc) tagItems.push(`<span class="tag special">DOC</span>`);
  tags = `<div class="fr-tags">${tagItems.join('')}</div>`;

  return `
    <div class="film-row">
      <span class="fr-title" title="${film.title}">${film.title}</span>
      <span class="fr-director">${director}</span>
      <span class="fr-times">${timesStr}${runtime}</span>
      ${tags}
    </div>
  `;
}

function renderListing() {
  const container = document.getElementById('allListings');
  const countEl = document.getElementById('listingCount');
  const theaters = getAllTheaters();

  let totalFilms = 0;
  let totalTheaters = 0;
  let html = '';

  const entries = Object.entries(theaters);
  entries.forEach(([name, data]) => {
    if (theaterFilterValue !== 'all' && theaterFilterValue !== name) return;

    totalTheaters++;
    const icon = '🎬';
    const url = getActiveTheaterUrls()[name] || '#';

    html += `<div class="theater-section">`;
    html += `<div class="theater-header">`;
    html += `  <div class="theater-icon">${icon}</div>`;
    html += `  <a href="${url}" target="_blank" rel="noopener">${name}</a>`;
    html += `  <span class="area-badge">${data.area}</span>`;
    html += `</div>`;

    data.films.forEach(f => {
      html += buildFilmRow(f);
      totalFilms++;
    });

    html += `</div>`;
  });

  countEl.innerHTML = `<strong>${totalTheaters}</strong> 館 ／ <strong>${totalFilms}</strong> 作品`;
  container.innerHTML = html;
}

function switchMode(mode) {
  currentMode = mode;
  const rankingEl = document.getElementById('rankingMode');
  const listingEl = document.getElementById('listingMode');
  const btnRanking = document.getElementById('modeRanking');
  const btnListing = document.getElementById('modeListing');
  const title = document.getElementById('mainTitle');

  if (mode === 'ranking') {
    rankingEl.style.display = '';
    listingEl.style.display = 'none';
    btnRanking.classList.add('active');
    btnListing.classList.remove('active');
    title.textContent = '東京ミニシアター 今週のおすすめ TOP 10';
    render();
  } else {
    rankingEl.style.display = 'none';
    listingEl.style.display = '';
    btnRanking.classList.remove('active');
    btnListing.classList.add('active');
    title.textContent = '東京ミニシアター 全上映一覧';
    buildTheaterFilterButtons();
    renderListing();
  }
}

// ==============================================
// Init & event listeners
// ==============================================
document.getElementById('weekLabel').textContent = getWeekLabel();

// Mode toggle
document.getElementById('modeRanking').addEventListener('click', () => switchMode('ranking'));
document.getElementById('modeListing').addEventListener('click', () => switchMode('listing'));

// Filter buttons
document.querySelectorAll('.controls button:not(.refresh)').forEach(btn => {
  btn.addEventListener('click', () => {
    if (searchMode) clearSearch();
    document.querySelectorAll('.controls button:not(.refresh)').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

document.getElementById('refreshBtn').addEventListener('click', refresh);

// Search
document.getElementById('searchBtn').addEventListener('click', () => {
  performSearch(document.getElementById('searchInput').value);
});
document.getElementById('clearBtn').addEventListener('click', clearSearch);
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') performSearch(e.target.value);
});


// ==============================================
// 起動: GitHub Pages の films.json を取得
// ==============================================
async function init() {
  document.getElementById('weekLabel').textContent = getWeekLabel();
  document.getElementById('ranking').innerHTML =
    '<div style="text-align:center;padding:40px;color:#888;font-size:0.8rem;">最新の上映情報を取得しています…</div>';

  try {
    const res = await fetch(FILMS_API_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.films && data.films.length > 0) {
      dynamicFilms = data.films;
      dynamicTheaterUrls = data.theater_urls || theaterUrls;
      if (data.week_start && data.week_end) {
        apiWeekLabel = `${data.week_start} 〜 ${data.week_end}`;
      }
      lastUpdated = data.updated_date || null;
      document.getElementById('weekLabel').textContent = getWeekLabel();

      const footer = document.querySelector('footer');
      if (footer && lastUpdated) {
        footer.innerHTML =
          `各映画館の公式サイトで最新情報をご確認ください。<br>` +
          `データ更新日: ${lastUpdated}（毎日自動更新）`;
      }
    }
  } catch (e) {
    console.warn("API fetch failed, using fallback:", e.message);
    document.getElementById('weekLabel').textContent = getWeekLabel();
  }

  render();
}

init();
