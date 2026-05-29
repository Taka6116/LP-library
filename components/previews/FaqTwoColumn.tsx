import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const faqs = [
  { q: "無料トライアルはありますか？", a: "14日間の無料トライアルをご用意しています。" },
  { q: "解約はいつでもできますか？", a: "はい、いつでも解約可能です。違約金はありません。" },
  { q: "データの移行は対応してくれる？", a: "専任担当が既存データの移行をサポートします。" },
  { q: "セキュリティは大丈夫？", a: "ISO27001取得済み。通信は全て暗号化されています。" },
  { q: "複数拠点でも使える？", a: "拠点数に制限はなく、一元管理が可能です。" },
  { q: "請求書払いに対応？", a: "月額・年額どちらも請求書払いに対応しています。" },
];

export function FaqTwoColumn({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>FAQ</Eyebrow>
        <Heading variant={variant}>よくあるご質問</Heading>
      </div>
      <div
        className={`grid gap-${card ? "2" : "x-8 gap-y-6"} ${
          card ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {faqs.map((f, i) => (
          <div key={i}>
            <p
              className={`font-semibold text-slate-800 ${
                card ? "text-[10px]" : "text-base"
              }`}
            >
              {f.q}
            </p>
            <p
              className={`mt-0.5 text-slate-600 ${
                card ? "text-[9px] leading-snug" : "text-sm leading-relaxed"
              }`}
            >
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
