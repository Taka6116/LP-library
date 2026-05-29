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

export function HeroVisualDashboard({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div
        className={`grid items-center gap-${card ? "4" : "12"} ${
          card ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        <div className={card ? "space-y-2" : "space-y-6"}>
          <Eyebrow variant={variant}>DATA PLATFORM</Eyebrow>
          <Heading variant={variant}>
            すべての数字を、
            <br className="hidden sm:block" />
            ひとつの画面に。
          </Heading>
          <SubCopy variant={variant}>
            散らばったデータを集約し、意思決定に必要な指標をリアルタイムで可視化します。
          </SubCopy>
          <div className={`flex flex-wrap items-center gap-${card ? "2" : "3"}`}>
            <PrimaryButton variant={variant}>デモを予約</PrimaryButton>
            <GhostButton variant={variant}>機能を見る</GhostButton>
          </div>
        </div>
        <VisualBlock variant={variant} className={card ? "h-28" : "h-80"}>
          <div className={`absolute inset-0 ${card ? "p-2" : "p-5"}`}>
            <div className="flex h-full flex-col gap-2 rounded-xl bg-white/80 p-3 shadow-soft ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="h-2 w-16 rounded-full bg-slate-300" />
                <div className="h-2 w-8 rounded-full bg-sansan-300" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-2">
                    <div className="h-1.5 w-8 rounded-full bg-slate-200" />
                    <div className="mt-1 h-3 w-10 rounded bg-sansan-200" />
                  </div>
                ))}
              </div>
              <div className="flex flex-1 items-end gap-1.5 rounded-lg bg-slate-50 p-2">
                {[40, 65, 50, 80, 60, 90, 72].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-t bg-gradient-to-t from-sansan-400 to-sansan-300"
                  />
                ))}
              </div>
            </div>
          </div>
        </VisualBlock>
      </div>
    </SectionFrame>
  );
}
