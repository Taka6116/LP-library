import {
  SectionFrame,
  Eyebrow,
  Heading,
  PrimaryButton,
  GhostButton,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const plans = [
  {
    name: "Starter",
    price: "¥9,800",
    features: ["基本機能", "メールサポート", "1ユーザー"],
    featured: false,
  },
  {
    name: "Pro",
    price: "¥29,800",
    features: ["全機能", "優先サポート", "10ユーザー", "API連携"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "お問い合わせ",
    features: ["カスタム対応", "専任担当", "無制限ユーザー"],
    featured: false,
  },
];

export function PricingThreePlans({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          PRICING
        </Eyebrow>
        <Heading variant={variant}>シンプルな3つのプラン</Heading>
      </div>
      <div
        className={`grid items-stretch gap-${card ? "2" : "5"} ${
          card ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        {plans.map((p, i) => (
          <div
            key={i}
            className={`flex flex-col rounded-2xl border ${
              p.featured
                ? "border-sansan-300 bg-white ring-2 ring-sansan-200"
                : "border-slate-200 bg-white"
            } ${card ? "p-3" : "p-6"}`}
          >
            {p.featured && (
              <span
                className={`mb-1 inline-flex w-fit rounded-full bg-sansan-600 font-semibold text-white ${
                  card ? "px-1.5 py-0.5 text-[8px]" : "px-3 py-1 text-xs"
                }`}
              >
                人気
              </span>
            )}
            <p
              className={`font-semibold text-slate-700 ${
                card ? "text-[10px]" : "text-base"
              }`}
            >
              {p.name}
            </p>
            <p
              className={`font-bold text-slate-900 ${
                card ? "text-sm" : "text-2xl sm:text-3xl"
              }`}
            >
              {p.price}
              {p.price.startsWith("¥") && (
                <span
                  className={`font-normal text-slate-400 ${
                    card ? "text-[8px]" : "text-sm"
                  }`}
                >
                  /月
                </span>
              )}
            </p>
            <ul
              className={`mt-${card ? "1" : "4"} flex-1 space-y-${
                card ? "0.5" : "2"
              }`}
            >
              {p.features.map((f, j) => (
                <li
                  key={j}
                  className={`flex items-center gap-1 text-slate-600 ${
                    card ? "text-[8px]" : "text-sm"
                  }`}
                >
                  <span className="text-sansan-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className={`mt-${card ? "2" : "5"}`}>
              {p.featured ? (
                <PrimaryButton variant={variant}>選ぶ</PrimaryButton>
              ) : (
                <GhostButton variant={variant}>選ぶ</GhostButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
