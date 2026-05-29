import {
  SectionFrame,
  Eyebrow,
  Heading,
  Grid,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const metrics = [
  { value: "1,200+", label: "導入社数" },
  { value: "98%", label: "継続率" },
  { value: "4.8/5", label: "満足度" },
  { value: "5年", label: "提供実績" },
];

export function ProofTrustMetrics({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="dark">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="light">
          選ばれる理由
        </Eyebrow>
        <h2
          className={`font-bold tracking-tight ${
            card ? "text-base" : "text-3xl sm:text-4xl"
          }`}
        >
          数字が証明する信頼
        </h2>
      </div>
      <Grid cols={4} variant={variant}>
        {metrics.map((m, i) => (
          <div key={i} className="text-center">
            <p
              className={`font-bold text-sansan-300 ${
                card ? "text-lg" : "text-4xl sm:text-5xl"
              }`}
            >
              {m.value}
            </p>
            <p
              className={`mt-0.5 text-slate-400 ${
                card ? "text-[9px]" : "text-sm sm:text-base"
              }`}
            >
              {m.label}
            </p>
          </div>
        ))}
      </Grid>
    </SectionFrame>
  );
}
