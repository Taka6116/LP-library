import {
  SectionFrame,
  Heading,
  SubCopy,
  PrimaryButton,
  GhostButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

// 「お困りですか？」ヘルプ・サポート誘導CTA
export function CtaSansanHelp({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div
        className={`mx-auto flex flex-col items-center rounded-3xl bg-white text-center shadow-card ${
          card ? "gap-1.5 p-3" : "max-w-3xl gap-5 px-8 py-12"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sansan/guide-icon.svg"
          alt=""
          className={card ? "h-8 w-8" : "h-16 w-16"}
        />
        <Heading variant={variant}>お探しの情報は見つかりましたか？</Heading>
        <SubCopy variant={variant} className="!text-center">
          解決しない場合は、サポート窓口やヘルプセンターをご利用ください。
        </SubCopy>
        {!card && (
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <PrimaryButton variant={variant}>サポートに問い合わせる</PrimaryButton>
            <GhostButton variant={variant}>ヘルプセンター</GhostButton>
          </div>
        )}
      </div>
    </SectionFrame>
  );
}
