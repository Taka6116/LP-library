import {
  SectionFrame,
  Eyebrow,
  Heading,
  Card,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const beforeItems = [
  "Excelとメールで進捗を管理し、最新状態が誰にも分からない",
  "担当者が変わるたびに品質がばらつく",
  "問い合わせ対応に追われ、改善に手が回らない",
  "数字の集計だけで毎週半日が消えている",
];

export function ProblemBeforeState({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          BEFORE
        </Eyebrow>
        <Heading variant={variant}>いまの現場で起きていること</Heading>
      </div>
      <Card variant={variant} tone="danger" className="mx-auto max-w-3xl">
        <ul className={`space-y-${card ? "1" : "3"}`}>
          {beforeItems.map((t, i) => (
            <li
              key={i}
              className={`flex items-start gap-${card ? "1.5" : "3"}`}
            >
              <span
                className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full bg-rose-200 font-bold text-rose-700 ${
                  card ? "h-3.5 w-3.5 text-[8px]" : "h-6 w-6 text-xs"
                }`}
              >
                ×
              </span>
              <span
                className={`text-slate-700 ${
                  card ? "text-[10px] leading-snug" : "text-sm sm:text-base"
                }`}
              >
                {t}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </SectionFrame>
  );
}
