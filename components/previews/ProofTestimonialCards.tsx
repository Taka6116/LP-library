import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  Card,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

// お客様の声 3カード — 2025年定番の社会的証明パターン。
// 「具体的な成果 > 漠然とした称賛」の原則に従い、引用は数字入り。
// アバターはイニシャル円（画像不要・汎用）。星は SVG（絵文字不使用）。

const VOICES = [
  {
    quote:
      "導入3ヶ月でリード獲得数が1.8倍に。何より運用の手間が想像以上に軽く、チームにすぐ定着しました。",
    name: "田中 真由",
    role: "マーケティング部 部長",
    attr: "IT・従業員120名",
    initial: "田",
    bg: "#6366f1",
  },
  {
    quote:
      "毎月20時間かかっていたレポート作成がほぼ自動に。空いた時間を施策の改善に回せています。",
    name: "佐藤 健",
    role: "経営企画室",
    attr: "製造・従業員300名",
    initial: "佐",
    bg: "#0ea5e9",
  },
  {
    quote:
      "サポートの返信が早く、導入時の不安がありませんでした。初月から問い合わせが約1.4倍に増えています。",
    name: "鈴木 彩",
    role: "代表取締役",
    attr: "士業・従業員8名",
    initial: "鈴",
    bg: "#f59e0b",
  },
];

function Stars({ card }: { card: boolean }) {
  return (
    <div className="flex gap-0.5" aria-label="評価 5点満点中5点">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          fill="#f59e0b"
          className={card ? "h-2.5 w-2.5" : "h-4 w-4"}
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function ProofTestimonialCards({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-12 space-y-3"}`}>
        <Eyebrow variant={variant}>VOICE</Eyebrow>
        <Heading variant={variant}>導入企業の声</Heading>
        {!card && (
          <SubCopy variant={variant}>
            業種も規模も異なる現場で、成果につながっています。
          </SubCopy>
        )}
      </div>

      <div
        className={`grid ${
          card ? "grid-cols-3 gap-2" : "grid-cols-1 gap-5 md:grid-cols-3"
        }`}
      >
        {VOICES.map((v) => (
          <Card key={v.name} variant={variant} tone="light" className="flex flex-col">
            <Stars card={card} />
            {/* 引用 */}
            <p
              className={`flex-1 text-slate-700 ${
                card
                  ? "mt-1.5 text-[8px] leading-snug line-clamp-4"
                  : "mt-4 text-sm leading-relaxed"
              }`}
            >
              「{v.quote}」
            </p>
            {/* 人物 */}
            <div
              className={`flex items-center border-t border-slate-100 ${
                card ? "mt-2 gap-1.5 pt-1.5" : "mt-5 gap-3 pt-4"
              }`}
            >
              <span
                className={`grid shrink-0 place-items-center rounded-full font-bold text-white ${
                  card ? "h-5 w-5 text-[8px]" : "h-10 w-10 text-sm"
                }`}
                style={{ background: v.bg }}
                aria-hidden
              >
                {v.initial}
              </span>
              <div className="min-w-0">
                <p
                  className={`truncate font-semibold text-slate-800 ${
                    card ? "text-[8px]" : "text-sm"
                  }`}
                >
                  {v.name}
                </p>
                <p
                  className={`truncate text-slate-400 ${
                    card ? "text-[7px]" : "text-xs"
                  }`}
                >
                  {v.role} / {v.attr}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
