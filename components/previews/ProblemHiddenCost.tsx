import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  Grid,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const costs = [
  { label: "年間で失う工数", value: "480h", note: "定型作業の積み重ね" },
  { label: "機会損失", value: "¥3.2M", note: "対応漏れ・遅延による" },
  { label: "離職リスク", value: "1.8×", note: "属人化による負荷集中" },
];

export function ProblemHiddenCost({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="dark">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="light">
          見えていないコスト
        </Eyebrow>
        <h2
          className={`font-bold tracking-tight ${
            card ? "text-base" : "text-3xl sm:text-4xl"
          }`}
        >
          その「なんとなく回っている」が、
          <br className="hidden sm:block" />
          毎月コストを生んでいます。
        </h2>
      </div>
      <Grid cols={3} variant={variant}>
        {costs.map((c, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-white/10 bg-white/5 text-center ${
              card ? "p-3" : "p-6"
            }`}
          >
            <p
              className={`text-slate-400 ${
                card ? "text-[9px]" : "text-xs sm:text-sm"
              }`}
            >
              {c.label}
            </p>
            <p
              className={`font-bold text-rose-300 ${
                card ? "text-lg" : "text-4xl sm:text-5xl"
              }`}
            >
              {c.value}
            </p>
            <p
              className={`text-slate-400 ${
                card ? "text-[9px]" : "text-xs sm:text-sm"
              }`}
            >
              {c.note}
            </p>
          </div>
        ))}
      </Grid>
    </SectionFrame>
  );
}
