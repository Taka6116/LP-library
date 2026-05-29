import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  PrimaryButton,
  GhostButton,
  VisualBlock,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function HeroProblemFirst({ variant, theme }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div
        className={`grid items-center gap-${card ? "4" : "12"} ${
          card ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        <div className={card ? "space-y-2" : "space-y-6"}>
          <Eyebrow variant={variant} tone="muted">
            こんな課題、ありませんか？
          </Eyebrow>
          <Heading variant={variant}>
            毎月の業務が属人化し、
            <br className="hidden sm:block" />
            成果が積み上がらない。
          </Heading>
          <SubCopy variant={variant}>
            担当者頼みの運用、繰り返す手戻り、見えないコスト。その課題、仕組みで解決できます。
          </SubCopy>
          <div className={`flex flex-wrap items-center gap-${card ? "2" : "3"}`}>
            <PrimaryButton variant={variant}>無料で相談する</PrimaryButton>
            <GhostButton variant={variant}>資料を見る</GhostButton>
          </div>
        </div>
        <VisualBlock
          variant={variant}
          className={card ? "h-24" : "h-72 sm:h-80"}
        >
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full space-y-2">
              <div className="h-2 w-2/3 rounded-full bg-rose-200" />
              <div className="h-2 w-1/2 rounded-full bg-slate-200" />
              <div className="h-2 w-3/4 rounded-full bg-slate-200" />
              <div className="mt-3 h-2 w-1/3 rounded-full bg-sansan-300" />
            </div>
          </div>
        </VisualBlock>
      </div>
    </SectionFrame>
  );
}
