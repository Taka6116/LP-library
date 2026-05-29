import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  PrimaryButton,
  GhostButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function HeroOutcomeFirst({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="dark">
      <div className={`text-center ${card ? "space-y-2" : "space-y-6"}`}>
        <Eyebrow variant={variant} tone="light">
          導入後に手に入る成果
        </Eyebrow>
        <h2
          className={`mx-auto font-bold leading-tight tracking-tight ${
            card ? "text-base" : "max-w-3xl text-3xl sm:text-5xl"
          }`}
        >
          売上を伸ばす仕組みを、
          <br className="hidden sm:block" />
          <span className="text-sansan-300">最短ルート</span>で。
        </h2>
        <p
          className={`mx-auto text-slate-300 ${
            card ? "text-[11px]" : "max-w-2xl text-base sm:text-lg"
          }`}
        >
          導入企業の平均で、業務時間40%削減・成約率1.6倍。あなたのチームにも同じ変化を。
        </p>
        <div
          className={`flex flex-wrap items-center justify-center gap-${
            card ? "2" : "3"
          }`}
        >
          <PrimaryButton variant={variant} tone="light">
            無料で試す
          </PrimaryButton>
          <span
            className={`inline-flex items-center justify-center rounded-xl border border-white/30 font-semibold text-white transition hover:border-white/60 ${
              card ? "px-3 py-1.5 text-[11px]" : "px-6 py-3 text-sm sm:text-base"
            }`}
          >
            導入事例を見る
          </span>
        </div>
        <div
          className={`flex flex-wrap items-center justify-center gap-${
            card ? "3" : "8"
          } pt-${card ? "1" : "4"} text-slate-400`}
        >
          {["業務時間 -40%", "成約率 ×1.6", "継続率 98%"].map((m) => (
            <span
              key={m}
              className={card ? "text-[10px]" : "text-sm sm:text-base"}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
