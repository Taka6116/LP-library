import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// Uniforce — TASK SITUATION（課題提起）
// https://uniforce.co.jp/ipo/
// 人物イラスト + 角丸ティールコンテナ内に 2×2 の課題カード（ティールヘッダー + ●3項目）
//
// Design tokens:
//   color.text.inverse (accent) = #00b3a7
//   color.text.primary          = #0c0d24
//   color.text.tertiary         = #5a5b6a
//   font.family.primary         = Noto Sans JP
//   radius.2xl = 34px / radius.md = 16px / radius.xl = 30px

const TEAL = "#00b3a7";
const INK = "#0c0d24";
const GRAY = "#5a5b6a";
const PANEL = "#e4f6f3"; // light teal container
const CARD_BG = "#ffffff";

function svg(file: string): string {
  return asset(`/${["ユニフォース", file].map(encodeURIComponent).join("/")}`);
}

const CARDS = [
  {
    title: "IPO",
    headerStyle: "light" as const,
    items: [
      "何から準備を始めればいいかわからない",
      "上場スケジュールの遅延が心配",
      "社内リソースのみではIPOの準備がすすまない",
    ],
  },
  {
    title: "M&A",
    headerStyle: "light" as const,
    items: [
      "IPOも視野に入れつつM&Aの準備も進めたい",
      "企業価値を上げるための内部統制を知りたい",
      "買い手が求める評価基準がわからない",
    ],
  },
  {
    title: "内部統制構築",
    headerStyle: "dark" as const,
    items: [
      "自社に合わせたペースで内部管理体制を構築したい",
      "いつまでにどの程度の統制が必要かわからない",
      "作業量が多く、本来の業務を圧迫している",
    ],
  },
  {
    title: "経営管理",
    headerStyle: "dark" as const,
    items: [
      "今後の事業計画や資本政策に不安がある",
      "CEOが事業や経営以外に時間を取られている",
      "どこに相談すれば疑問を解決できるかわからない",
    ],
  },
];

const HEADER_GRAD = {
  light: "linear-gradient(90deg, #5fd4c8 0%, #2bbcae 100%)",
  dark: "linear-gradient(90deg, #1cae9f 0%, #0f9b8e 100%)",
};

function TaskCard({ card, data }: { card: boolean; data: (typeof CARDS)[number] }) {
  return (
    <div
      className={`flex flex-col overflow-hidden ${card ? "rounded-md" : "rounded-2xl"}`}
      style={{ background: CARD_BG, boxShadow: "rgba(37,42,64,0.11) 0px 3px 16px 0px" }}
    >
      {/* Header pill */}
      <div
        className={`text-center font-bold text-white ${card ? "py-1 text-[7px]" : "py-2.5 text-base"}`}
        style={{ background: HEADER_GRAD[data.headerStyle] }}
      >
        {data.title}
      </div>

      {/* Bullet list */}
      <ul className={`flex flex-col ${card ? "gap-1 px-1.5 py-1.5" : "gap-3 px-6 py-5"}`}>
        {data.items.map((it, i) => (
          <li key={i} className={`flex items-start ${card ? "gap-1" : "gap-2.5"}`}>
            <span
              className={`flex-shrink-0 rounded-full ${card ? "mt-[3px] h-1 w-1" : "mt-[7px] h-1.5 w-1.5"}`}
              style={{ background: TEAL }}
            />
            <span
              className={`leading-snug ${card ? "text-[6px]" : "text-sm"}`}
              style={{ color: INK }}
            >
              {it}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProblemUniforceTask({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`relative w-full overflow-hidden bg-white ${card ? "px-3 py-4" : "px-6 py-16 sm:px-10 sm:py-20"}`}
      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      {/* Soft teal radial glow behind heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: card ? "60%" : "55%",
          background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,179,167,0.10) 0%, transparent 70%)",
        }}
      />

      <div className={`relative mx-auto w-full ${card ? "" : "max-w-5xl"}`}>

        {/* ── Eyebrow ── */}
        <div className={`text-center ${card ? "mb-1.5" : "mb-5"}`}>
          <p
            className={`font-bold tracking-[0.22em] ${card ? "text-[6px]" : "text-xs"}`}
            style={{ color: TEAL }}
          >
            TASK SITUATION
          </p>
          <div
            className={`mx-auto rounded-full ${card ? "mt-0.5 h-px w-5" : "mt-1.5 h-[2px] w-10"}`}
            style={{ background: TEAL }}
          />
        </div>

        {/* ── Sub heading (teal) ── */}
        <p
          className={`text-center font-bold ${card ? "text-[7px] mb-0.5" : "text-base mb-2"}`}
          style={{ color: TEAL }}
        >
          猫の手も借りたいほど多忙な経営者の皆さま
        </p>

        {/* ── Main heading ── */}
        <h2
          className={`text-center font-bold ${card ? "text-[10px] leading-tight" : "text-2xl sm:text-3xl leading-snug"}`}
          style={{ color: INK }}
        >
          <span style={{ color: TEAL }}>IPO・M&amp;Aの準備</span>
          でこのような
          <span style={{ color: TEAL }}>課題</span>
          を抱えていませんか？
        </h2>

        {/* ── People illustration ── */}
        <div className={`relative z-10 flex justify-center ${card ? "mt-1.5" : "mt-8"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={svg("task-situation-pc.svg")}
            alt="多忙な経営者のイメージ"
            className={card ? "h-9 w-auto object-contain" : "h-32 w-auto object-contain sm:h-40"}
            draggable={false}
          />
        </div>

        {/* ── Teal panel with 2×2 cards ── */}
        <div
          className={`relative ${card ? "-mt-2 rounded-xl p-2" : "-mt-6 rounded-[34px] p-6 sm:p-10"}`}
          style={{ background: PANEL }}
        >
          <div className={`grid grid-cols-2 ${card ? "gap-1.5" : "gap-5 sm:gap-7"}`}>
            {CARDS.map((c) => (
              <TaskCard key={c.title} card={card} data={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
