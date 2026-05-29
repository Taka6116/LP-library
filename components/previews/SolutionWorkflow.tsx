import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const steps = [
  { label: "入力", body: "既存データやフォームから情報を取り込む" },
  { label: "処理", body: "ルールとAIが自動で整形・判定・振り分け" },
  { label: "出力", body: "レポートや次のアクションとして即座に活用" },
];

export function SolutionWorkflow({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>HOW IT WORKS</Eyebrow>
        <Heading variant={variant}>入力から出力まで、自動でつながる</Heading>
      </div>
      <div
        className={`flex items-stretch ${
          card ? "gap-1" : "flex-col gap-3 sm:flex-row sm:gap-4"
        }`}
      >
        {steps.map((s, i) => (
          <div key={i} className="flex flex-1 items-center gap-1 sm:gap-2">
            <div
              className={`flex-1 rounded-2xl border border-slate-200 bg-slate-50 text-center ${
                card ? "p-2" : "p-5"
              }`}
            >
              <p
                className={`font-bold text-sansan-600 ${
                  card ? "text-[10px]" : "text-base sm:text-lg"
                }`}
              >
                {s.label}
              </p>
              <p
                className={`mt-1 text-slate-600 ${
                  card ? "text-[9px] leading-snug" : "text-xs sm:text-sm"
                }`}
              >
                {s.body}
              </p>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`font-bold text-slate-300 ${
                  card ? "text-xs" : "text-2xl"
                }`}
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
