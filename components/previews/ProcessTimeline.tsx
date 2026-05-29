import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

const milestones = [
  { week: "Day 1", title: "初回相談", body: "現状と目標をヒアリング" },
  { week: "Week 1", title: "プラン設計", body: "最適な導入プランを提案" },
  { week: "Week 2-3", title: "構築・設定", body: "環境構築とデータ移行" },
  { week: "Week 4", title: "運用開始", body: "本番稼働とサポート開始" },
];

export function ProcessTimeline({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant}>TIMELINE</Eyebrow>
        <Heading variant={variant}>相談から運用まで最短4週間</Heading>
      </div>
      <div className="relative mx-auto max-w-3xl">
        <div
          className={`absolute left-2 top-0 h-full w-px bg-slate-200 ${
            card ? "left-1.5" : "left-2.5 sm:left-3"
          }`}
        />
        <div className={`space-y-${card ? "2" : "5"}`}>
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`relative flex items-start gap-${card ? "2" : "4"}`}
            >
              <span
                className={`relative z-10 mt-1 shrink-0 rounded-full bg-sansan-600 ring-4 ring-white ${
                  card ? "h-3 w-3" : "h-5 w-5 sm:h-6 sm:w-6"
                }`}
              />
              <div>
                <p
                  className={`font-semibold text-sansan-600 ${
                    card ? "text-[9px]" : "text-xs sm:text-sm"
                  }`}
                >
                  {m.week}
                </p>
                <p
                  className={`font-semibold text-slate-800 ${
                    card ? "text-[10px]" : "text-base sm:text-lg"
                  }`}
                >
                  {m.title}
                </p>
                <p
                  className={`text-slate-500 ${
                    card ? "text-[9px]" : "text-sm"
                  }`}
                >
                  {m.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
