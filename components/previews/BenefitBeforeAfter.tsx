import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const rows = [
  { before: "手作業で3時間", after: "自動化で5分" },
  { before: "担当者しか分からない", after: "チーム全員が把握" },
  { before: "効果が測れない", after: "数字でリアルタイム把握" },
];

export function BenefitBeforeAfter({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          BEFORE / AFTER
        </Eyebrow>
        <Heading variant={variant}>導入で、ここまで変わる</Heading>
      </div>
      <div className={`mx-auto max-w-3xl space-y-${card ? "1.5" : "3"}`}>
        {rows.map((r, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_auto_1fr] items-center gap-${
              card ? "1.5" : "3"
            }`}
          >
            <div
              className={`rounded-xl border border-slate-200 bg-white text-slate-500 ${
                card ? "p-2 text-[9px]" : "p-4 text-sm"
              }`}
            >
              {r.before}
            </div>
            <span
              className={`font-bold text-sansan-500 ${
                card ? "text-xs" : "text-xl"
              }`}
            >
              →
            </span>
            <div
              className={`rounded-xl border border-sansan-200 bg-sansan-50 font-semibold text-sansan-900 ${
                card ? "p-2 text-[9px]" : "p-4 text-sm"
              }`}
            >
              {r.after}
            </div>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
