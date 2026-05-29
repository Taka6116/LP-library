import {
  SectionFrame,
  Eyebrow,
  Heading,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

// 「3つの質問で、あなたに合った活用法を」
// 課題を選ばせて該当コンテンツへ導く診断・絞り込みセクション
const QUESTIONS = [
  { q: "名刺管理を効率化したい", tag: "Q1" },
  { q: "営業活動に活用したい", tag: "Q2" },
  { q: "社内に定着させたい", tag: "Q3" },
];

export function HookSelectorThreeQuestions({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <SectionFrame variant={variant} tone="light">
      <div
        className={`grid items-center gap-${card ? "3" : "10"} ${
          card ? "grid-cols-[auto_1fr]" : "grid-cols-1 lg:grid-cols-[auto_1.4fr]"
        }`}
      >
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sansan/img-guide-select-illust.svg"
            alt="活用法を選ぶ"
            className={card ? "h-20 w-auto" : "h-48 w-auto sm:h-60"}
          />
        </div>

        <div className={card ? "space-y-2" : "space-y-6"}>
          <Eyebrow variant={variant}>SELECT</Eyebrow>
          <Heading variant={variant}>
            あなたの目的に合わせて、活用法を選ぶ
          </Heading>

          <div className={`grid gap-${card ? "1.5" : "3"}`}>
            {QUESTIONS.map((item) => (
              <div
                key={item.tag}
                className={`group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-muted transition hover:border-accent hover:bg-accent-soft ${
                  card ? "px-2 py-1.5" : "px-5 py-4"
                }`}
              >
                <div className={`flex items-center gap-${card ? "1.5" : "3"}`}>
                  <span
                    className={`flex items-center justify-center rounded-full bg-accent font-bold text-white ${
                      card ? "h-4 w-4 text-[8px]" : "h-8 w-8 text-xs"
                    }`}
                  >
                    {item.tag}
                  </span>
                  <span
                    className={`font-semibold text-ink ${
                      card ? "text-[10px]" : "text-sm sm:text-base"
                    }`}
                  >
                    {item.q}
                  </span>
                </div>
                <span
                  className={`text-accent transition group-hover:translate-x-1 ${
                    card ? "text-[10px]" : "text-lg"
                  }`}
                  aria-hidden
                >
                  ›
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
