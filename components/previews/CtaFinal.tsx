import {
  SectionFrame,
  PrimaryButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function CtaFinal({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="accent">
      <div
        className={`mx-auto max-w-3xl text-center ${
          card ? "space-y-2" : "space-y-6"
        }`}
      >
        <h2
          className={`font-bold tracking-tight ${
            card ? "text-base" : "text-3xl sm:text-5xl"
          }`}
        >
          まずは、現状の課題から
          <br className="hidden sm:block" />
          お聞かせください。
        </h2>
        <p
          className={`mx-auto text-sansan-100 ${
            card ? "text-[10px]" : "max-w-xl text-base sm:text-lg"
          }`}
        >
          無理な営業は一切ありません。御社に合うかどうか、フラットにご相談いただけます。
        </p>
        <div
          className={`flex flex-wrap items-center justify-center gap-${
            card ? "2" : "3"
          }`}
        >
          <PrimaryButton variant={variant} tone="light">
            無料で相談する
          </PrimaryButton>
          <span
            className={`inline-flex items-center justify-center rounded-xl border border-white/40 font-semibold text-white ${
              card ? "px-3 py-1.5 text-[11px]" : "px-6 py-3 text-sm sm:text-base"
            }`}
          >
            資料をダウンロード
          </span>
        </div>
        <p
          className={`text-sansan-200 ${card ? "text-[9px]" : "text-xs sm:text-sm"}`}
        >
          ＼ 導入企業1,200社以上・継続率98% ／
        </p>
      </div>
    </SectionFrame>
  );
}
