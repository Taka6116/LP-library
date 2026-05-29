import {
  SectionFrame,
  Eyebrow,
  Heading,
  Card,
  Grid,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const points = [
  {
    title: "時間が生まれる",
    body: "定型業務を仕組みに任せ、戦略的な仕事に時間を使えるようになります。",
  },
  {
    title: "品質が安定する",
    body: "担当者によるばらつきがなくなり、常に一定の成果を出せます。",
  },
  {
    title: "成果が積み上がる",
    body: "改善のたびにナレッジが蓄積し、続けるほど強くなる組織に。",
  },
];

export function BenefitThreePoints({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          導入メリット
        </Eyebrow>
        <Heading variant={variant}>得られる3つの価値</Heading>
      </div>
      <Grid cols={3} variant={variant}>
        {points.map((p, i) => (
          <Card key={i} variant={variant} tone="light">
            <div
              className={`mb-${card ? "1" : "3"} h-1 w-${
                card ? "6" : "12"
              } rounded-full bg-sansan-500`}
            />
            <h3 className={`font-semibold ${card ? "text-[11px]" : "text-lg"}`}>
              {p.title}
            </h3>
            <p
              className={`mt-1 text-slate-600 ${
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
