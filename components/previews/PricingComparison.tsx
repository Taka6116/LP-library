import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const features = [
  { name: "ユーザー数", starter: "1", pro: "10", ent: "無制限" },
  { name: "API連携", starter: "—", pro: "✓", ent: "✓" },
  { name: "優先サポート", starter: "—", pro: "✓", ent: "✓" },
  { name: "専任担当", starter: "—", pro: "—", ent: "✓" },
];

export function PricingComparison({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  const cell = card ? "px-1.5 py-1 text-[8px]" : "px-4 py-3 text-sm";
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          プラン比較
        </Eyebrow>
        <Heading variant={variant}>機能を見比べて選べます</Heading>
      </div>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50">
              <th className={`font-semibold text-slate-500 ${cell}`}>機能</th>
              <th className={`font-semibold text-slate-700 ${cell}`}>Starter</th>
              <th className={`font-semibold text-sansan-600 ${cell}`}>Pro</th>
              <th className={`font-semibold text-slate-700 ${cell}`}>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className={`font-medium text-slate-700 ${cell}`}>{f.name}</td>
                <td className={`text-slate-600 ${cell}`}>{f.starter}</td>
                <td className={`font-semibold text-sansan-600 ${cell}`}>{f.pro}</td>
                <td className={`text-slate-600 ${cell}`}>{f.ent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionFrame>
  );
}
