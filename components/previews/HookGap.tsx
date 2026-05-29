import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function HookGap({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>理想と現実のギャップ</Eyebrow>
        <Heading variant={variant}>どこで差がついているのか</Heading>
      </div>
      <div
        className={`grid items-stretch gap-${card ? "2" : "5"} ${
          card ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        <div
          className={`rounded-2xl border border-slate-200 bg-slate-50 ${
            card ? "p-3" : "p-7"
          }`}
        >
          <p
            className={`font-semibold text-slate-500 ${
              card ? "text-[10px]" : "text-sm"
            }`}
          >
            現実
          </p>
          <p
            className={`mt-1 font-bold text-slate-800 ${
              card ? "text-xs" : "text-xl sm:text-2xl"
            }`}
          >
            場当たり的な施策の繰り返し
          </p>
          <p
            className={`mt-1 text-slate-500 ${
              card ? "text-[10px]" : "text-sm"
            }`}
          >
            やることは増えるのに、成果は安定しない。
          </p>
        </div>
        <div
          className={`rounded-2xl border border-sansan-200 bg-sansan-50 ${
            card ? "p-3" : "p-7"
          }`}
        >
          <p
            className={`font-semibold text-sansan-600 ${
              card ? "text-[10px]" : "text-sm"
            }`}
          >
            理想
          </p>
          <p
            className={`mt-1 font-bold text-sansan-900 ${
              card ? "text-xs" : "text-xl sm:text-2xl"
            }`}
          >
            再現性のある成長の仕組み
          </p>
          <p
            className={`mt-1 text-sansan-700/80 ${
              card ? "text-[10px]" : "text-sm"
            }`}
          >
            一度作れば、成果が積み上がり続ける。
          </p>
        </div>
      </div>
    </SectionFrame>
  );
}
