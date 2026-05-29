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

export function CtaSoft({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div
        className={`mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white text-center ${
          card ? "p-4" : "p-10"
        }`}
      >
        <Eyebrow variant={variant}>まずは気軽に</Eyebrow>
        <Heading variant={variant} className={card ? "mt-1" : "mt-2"}>
          無料診断で、自社の伸びしろを確認
        </Heading>
        <SubCopy variant={variant} className="mx-auto mt-2">
          3分の入力で、改善ポイントをレポートでお届けします。登録不要・その場で結果が分かります。
        </SubCopy>
        <div
          className={`mt-${card ? "2" : "6"} flex flex-wrap items-center justify-center gap-${
            card ? "2" : "3"
          }`}
        >
          <PrimaryButton variant={variant}>無料診断を始める</PrimaryButton>
          <GhostButton variant={variant}>資料をもらう</GhostButton>
        </div>
        <p
          className={`mt-${card ? "1" : "3"} text-slate-400 ${
            card ? "text-[9px]" : "text-xs"
          }`}
        >
          営業電話はありません
        </p>
      </div>
    </SectionFrame>
  );
}
