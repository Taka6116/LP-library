import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  PrimaryButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

export function CtaSplit({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  const fieldH = card ? "h-5" : "h-11";
  return (
    <SectionFrame variant={variant} tone="dark">
      <div
        className={`grid items-center gap-${card ? "3" : "12"} ${
          card ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        <div className={card ? "space-y-1.5" : "space-y-4"}>
          <Eyebrow variant={variant} tone="light">
            お問い合わせ
          </Eyebrow>
          <h2
            className={`font-bold tracking-tight ${
              card ? "text-base" : "text-3xl sm:text-4xl"
            }`}
          >
            今日から、はじめましょう。
          </h2>
          <p
            className={`text-slate-300 ${
              card ? "text-[10px]" : "text-base sm:text-lg"
            }`}
          >
            右のフォームから1分でお問い合わせいただけます。担当者より翌営業日までにご連絡します。
          </p>
        </div>
        <div
          className={`rounded-2xl bg-white ${card ? "p-3" : "p-6"} space-y-${
            card ? "1.5" : "3"
          }`}
        >
          {["お名前", "メールアドレス", "会社名"].map((label, i) => (
            <div key={i}>
              <p
                className={`mb-0.5 font-medium text-slate-500 ${
                  card ? "text-[8px]" : "text-xs"
                }`}
              >
                {label}
              </p>
              <div
                className={`w-full rounded-lg border border-slate-200 bg-slate-50 ${fieldH}`}
              />
            </div>
          ))}
          <div className={`pt-${card ? "1" : "2"}`}>
            <PrimaryButton variant={variant}>送信する</PrimaryButton>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
