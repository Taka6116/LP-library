import {
  SectionFrame,
  Eyebrow,
  Heading,
  Grid,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const kpis = [
  { value: "-42%", label: "業務時間", note: "月間の作業工数" },
  { value: "+1.6×", label: "成約率", note: "リード対応の改善" },
  { value: "-28%", label: "運用コスト", note: "ツール・人件費" },
  { value: "+18pt", label: "CV率", note: "LP改善後" },
];

export function BenefitKpiGrid({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>RESULTS</Eyebrow>
        <Heading variant={variant}>導入企業が出している成果</Heading>
      </div>
      <Grid cols={4} variant={variant}>
        {kpis.map((k, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-sansan-50/50 text-center ${
              card ? "p-2" : "p-6"
            }`}
          >
            <p
              className={`font-bold text-sansan-600 ${
                card ? "text-base" : "text-3xl sm:text-4xl"
              }`}
            >
              {k.value}
            </p>
            <p
              className={`mt-0.5 font-semibold text-slate-800 ${
                card ? "text-[9px]" : "text-sm sm:text-base"
              }`}
            >
              {k.label}
            </p>
            <p
              className={`text-slate-500 ${
                card ? "text-[8px]" : "text-xs"
              }`}
            >
              {k.note}
            </p>
          </div>
        ))}
      </Grid>
    </SectionFrame>
  );
}
