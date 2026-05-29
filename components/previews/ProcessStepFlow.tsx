import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const steps = [
  { title: "お問い合わせ", body: "フォームから30秒で完了" },
  { title: "ヒアリング", body: "課題と目標をすり合わせ" },
  { title: "設計・導入", body: "運用に合わせて初期設定" },
  { title: "運用開始", body: "伴走しながら改善" },
];

export function ProcessStepFlow({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>導入の流れ</Eyebrow>
        <Heading variant={variant}>4ステップで運用開始</Heading>
      </div>
      <div
        className={`grid gap-${card ? "2" : "5"} ${
          card ? "grid-cols-4" : "grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {steps.map((s, i) => (
          <div key={i} className="relative">
            <div
              className={`mb-${card ? "1" : "3"} inline-flex items-center justify-center rounded-full bg-sansan-600 font-bold text-white ${
                card ? "h-5 w-5 text-[10px]" : "h-10 w-10 text-base"
              }`}
            >
              {i + 1}
            </div>
            <h3
              className={`font-semibold ${card ? "text-[10px]" : "text-base"}`}
            >
              {s.title}
            </h3>
            <p
              className={`mt-0.5 text-slate-500 ${
                card ? "text-[9px] leading-snug" : "text-sm"
              }`}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
