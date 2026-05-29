import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  PrimaryButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const includes = [
  "現状分析と課題整理",
  "御社専用の運用設計",
  "導入・定着サポート",
  "成果に応じた改善提案",
];

export function PricingCustom({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div
        className={`mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sansan-50/40 text-center ${
          card ? "p-4" : "p-10"
        }`}
      >
        <Eyebrow variant={variant}>料金について</Eyebrow>
        <Heading variant={variant} className={card ? "mt-1" : "mt-2"}>
          お客様に最適なプランをご提案します
        </Heading>
        <SubCopy variant={variant} className="mx-auto mt-2">
          事業の規模や課題に合わせて、無駄のない個別お見積もりをご用意します。まずはお気軽にご相談ください。
        </SubCopy>
        <div
          className={`mx-auto mt-${card ? "2" : "5"} grid max-w-md gap-${
            card ? "1" : "2"
          } ${card ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
        >
          {includes.map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-left text-slate-700 shadow-soft ${
                card ? "text-[9px]" : "text-sm"
              }`}
            >
              <span className="text-sansan-500">✓</span>
              {f}
            </div>
          ))}
        </div>
        <div className={`mt-${card ? "2" : "6"}`}>
          <PrimaryButton variant={variant}>無料で見積もりを依頼</PrimaryButton>
        </div>
      </div>
    </SectionFrame>
  );
}
