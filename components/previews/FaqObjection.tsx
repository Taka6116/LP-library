import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const objections = [
  {
    worry: "うちの業界でも使える？",
    answer: "業種を問わず1,200社以上の導入実績があります。業界特有の運用にも個別対応します。",
  },
  {
    worry: "ITに詳しくなくても大丈夫？",
    answer: "専任担当が初期設定から運用定着まで伴走するので、専門知識は不要です。",
  },
  {
    worry: "効果が出なかったら？",
    answer: "導入後も定期的に成果をレビューし、改善提案を続けます。まずは無料相談で適性を確認できます。",
  },
];

export function FaqObjection({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">
          導入前の不安に答えます
        </Eyebrow>
        <Heading variant={variant}>その心配、解消できます</Heading>
      </div>
      <div className={`mx-auto max-w-3xl space-y-${card ? "1.5" : "3"}`}>
        {objections.map((o, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-slate-200 bg-white ${
              card ? "p-2.5" : "p-5"
            }`}
          >
            <p
              className={`font-semibold text-slate-800 ${
                card ? "text-[10px]" : "text-base"
              }`}
            >
              Q. {o.worry}
            </p>
            <p
              className={`mt-1 flex items-start gap-1 text-slate-600 ${
                card ? "text-[9px] leading-snug" : "text-sm leading-relaxed"
              }`}
            >
              <span className="font-bold text-sansan-600">A.</span>
              {o.answer}
            </p>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
