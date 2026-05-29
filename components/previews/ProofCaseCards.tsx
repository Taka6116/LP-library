import {
  SectionFrame,
  Eyebrow,
  Heading,
  Card,
  Grid,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const cases = [
  {
    company: "製造業 A社",
    result: "月40時間の削減",
    body: "報告業務を自動化し、現場が改善に集中できるように。",
  },
  {
    company: "EC事業 B社",
    result: "CV率 +22%",
    body: "LP改善とデータ分析で、広告効率を大幅に改善。",
  },
  {
    company: "人材サービス C社",
    result: "対応速度 3倍",
    body: "問い合わせ対応を仕組み化し、機会損失をゼロに。",
  },
];

export function ProofCaseCards({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          CASE STUDY
        </Eyebrow>
        <Heading variant={variant}>導入企業の成果事例</Heading>
      </div>
      <Grid cols={3} variant={variant}>
        {cases.map((c, i) => (
          <Card key={i} variant={variant} tone="light">
            <div
              className={`mb-${card ? "1" : "3"} h-${
                card ? "8" : "20"
              } rounded-xl bg-gradient-to-br from-slate-100 to-sansan-50`}
            />
            <p
              className={`text-slate-500 ${card ? "text-[9px]" : "text-xs"}`}
            >
              {c.company}
            </p>
            <p
              className={`font-bold text-sansan-600 ${
                card ? "text-xs" : "text-xl"
              }`}
            >
              {c.result}
            </p>
            <p
              className={`mt-0.5 text-slate-600 ${
                card ? "text-[9px] leading-snug" : "text-sm"
              }`}
            >
              {c.body}
            </p>
          </Card>
        ))}
      </Grid>
    </SectionFrame>
  );
}
