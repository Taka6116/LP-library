import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  Card,
  Grid,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const problems = [
  {
    title: "業務が属人化している",
    body: "特定の担当者しか分からない作業が多く、引き継ぎや休暇のたびに止まってしまう。",
  },
  {
    title: "手作業に時間を奪われる",
    body: "本来注力すべき業務より、コピペや転記などの定型作業に時間を取られている。",
  },
  {
    title: "成果が可視化できない",
    body: "施策の効果が数字で分からず、次に何を改善すべきか判断できない。",
  },
];

export function ProblemThreeCards({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-12 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          よくある課題
        </Eyebrow>
        <Heading variant={variant}>その課題、放置していませんか？</Heading>
      </div>
      <Grid cols={3} variant={variant}>
        {problems.map((p, i) => (
          <Card key={i} variant={variant} tone="light">
            <div
              className={`mb-${card ? "1" : "3"} inline-flex items-center justify-center rounded-lg bg-rose-100 font-bold text-rose-600 ${
                card ? "h-5 w-5 text-[10px]" : "h-9 w-9 text-sm"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3
              className={`font-semibold ${card ? "text-[11px]" : "text-lg"}`}
            >
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
