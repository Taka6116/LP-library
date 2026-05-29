import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const items = [
  {
    myth: "ツールを入れれば解決する",
    truth: "重要なのは運用設計。ツールはそれを支える手段にすぎません。",
  },
  {
    myth: "人を増やせば回る",
    truth: "属人化したまま増員しても、教育コストと混乱が増えるだけです。",
  },
];

export function HookCommonMisunderstanding({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          よくある誤解
        </Eyebrow>
        <Heading variant={variant}>その思い込み、逆効果かもしれません</Heading>
      </div>
      <div className={`mx-auto max-w-3xl space-y-${card ? "2" : "4"}`}>
        {items.map((it, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${
              card ? "p-3" : "p-6"
            }`}
          >
            <p
              className={`font-semibold text-slate-400 line-through ${
                card ? "text-[10px]" : "text-base"
              }`}
            >
              「{it.myth}」
            </p>
            <div className={`mt-1 flex items-start gap-${card ? "1.5" : "2"}`}>
              <span
                className={`mt-0.5 font-bold text-sansan-600 ${
                  card ? "text-[10px]" : "text-base"
                }`}
              >
                →
              </span>
              <p
                className={`font-medium text-slate-800 ${
                  card ? "text-[10px] leading-snug" : "text-base sm:text-lg"
                }`}
              >
                {it.truth}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
