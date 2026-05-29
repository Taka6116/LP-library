import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const faqs = [
  { q: "導入にどれくらいの期間がかかりますか？", open: true },
  { q: "既存のツールと連携できますか？", open: false },
  { q: "サポート体制について教えてください", open: false },
  { q: "契約期間の縛りはありますか？", open: false },
];

export function FaqAccordion({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>FAQ</Eyebrow>
        <Heading variant={variant}>よくあるご質問</Heading>
      </div>
      <div className={`mx-auto max-w-3xl space-y-${card ? "1.5" : "3"}`}>
        {faqs.map((f, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-slate-200 bg-white ${
              card ? "p-2.5" : "p-5"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={`font-semibold text-slate-800 ${
                  card ? "text-[10px]" : "text-base"
                }`}
              >
                {f.q}
              </p>
              <span
                className={`text-slate-400 ${card ? "text-xs" : "text-xl"}`}
              >
                {f.open ? "−" : "+"}
              </span>
            </div>
            {f.open && (
              <p
                className={`mt-1 text-slate-600 ${
                  card ? "text-[9px] leading-snug" : "text-sm leading-relaxed"
                }`}
              >
                最短4週間で運用を開始できます。お客様の状況に合わせて、無理のないスケジュールをご提案します。
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
