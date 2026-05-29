import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  PrimaryButton,
  VisualBlock,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function SolutionOverview({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>SOLUTION</Eyebrow>
        <Heading variant={variant}>課題を、ひとつの仕組みで解決します</Heading>
        <SubCopy variant={variant} className="mx-auto max-w-2xl">
          散らばった業務・データ・コミュニケーションを集約し、誰でも回せる運用へ。
        </SubCopy>
      </div>
      <VisualBlock variant={variant} className={card ? "h-24" : "h-72"}>
        <div className="absolute inset-0 grid grid-cols-3 place-items-center gap-2 p-4">
          {["集約", "自動化", "可視化"].map((label, i) => (
            <div
              key={i}
              className={`flex w-full flex-col items-center gap-1 rounded-xl bg-white/80 shadow-soft ring-1 ring-slate-200 ${
                card ? "p-2" : "p-4"
              }`}
            >
              <div
                className={`rounded-lg bg-sansan-100 ${
                  card ? "h-4 w-4" : "h-10 w-10"
                }`}
              />
              <span
                className={`font-semibold text-slate-700 ${
                  card ? "text-[9px]" : "text-sm"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </VisualBlock>
    </SectionFrame>
  );
}
