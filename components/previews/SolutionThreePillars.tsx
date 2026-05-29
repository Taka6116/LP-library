import {
  SectionFrame,
  Eyebrow,
  Heading,
  Card,
  Grid,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const pillars = [
  {
    title: "標準化",
    body: "業務フローをテンプレート化し、誰が担当しても同じ品質を実現します。",
  },
  {
    title: "自動化",
    body: "繰り返しの作業を自動処理に置き換え、本質的な業務に集中できます。",
  },
  {
    title: "最適化",
    body: "蓄積されたデータをもとに、継続的に改善できるサイクルを作ります。",
  },
];

export function SolutionThreePillars({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          3つの柱
        </Eyebrow>
        <Heading variant={variant}>解決を支える3つのアプローチ</Heading>
      </div>
      <Grid cols={3} variant={variant}>
        {pillars.map((p, i) => (
          <Card key={i} variant={variant} tone="light">
            <div
              className={`mb-${card ? "1" : "3"} flex items-center gap-2`}
            >
              <span
                className={`inline-flex items-center justify-center rounded-lg bg-sansan-600 font-bold text-white ${
                  card ? "h-5 w-5 text-[10px]" : "h-9 w-9 text-sm"
                }`}
              >
                {i + 1}
              </span>
              <h3
                className={`font-semibold ${card ? "text-[11px]" : "text-lg"}`}
              >
                {p.title}
              </h3>
            </div>
            <p
              className={`text-slate-600 ${
                card ? "text-[10px] leading-snug" : "text-sm leading-relaxed"
              }`}
            >
              {p.body}
            </p>
          </Card>
        ))}
      </Grid>
    </SectionFrame>
  );
}
