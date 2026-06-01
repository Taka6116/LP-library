import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// シューマツワーカー — 副業人材活用までの流れ
// 吹き出し見出し + 最短5日アピール + 4ステップ横並び（円形画像 + > 矢印）

const BLUE = "#1976d2";
const LIGHT_BLUE = "#42a5f5";
const BG = "#eef2f7";

const STEPS = [
  {
    no: "STEP01",
    title: "募集要項作成",
    img: "/worker/flow-img2-1-4aa0c99a.png",
    desc: "貴社課題をヒアリングし、最適な人材をピックアップするため募集要項を弊社で代行作成。",
  },
  {
    no: "STEP02",
    title: "候補人材ご提案",
    img: "/worker/flow-img2-2-102f1e06.png",
    desc: "弊社にてアサイン可能な人材をピックアップし、スキルシートを共有。",
  },
  {
    no: "STEP03",
    title: "候補人材に案件説明",
    img: "/worker/flow-img2-3-72854992.png",
    desc: "ご提案した候補人材と、弊社担当を交えて業務内容すり合わせ。",
  },
  {
    no: "STEP04",
    title: "契約→キックオフ",
    img: "/worker/flow-img2-4-4119e4f9.png",
    desc: "弊社と御社で契約を締結し、副業人材を業務稼働開始。",
  },
];

export function ProcessWorkerFlow({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`relative w-full overflow-hidden font-sans ${
        card ? "px-4 py-5" : "px-6 py-16 sm:px-10 sm:py-24"
      }`}
      style={{ background: BG }}
    >
      {/* 大きな透かし "FLOW" 文字 */}
      {!card && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[15%] select-none font-black uppercase leading-none tracking-tight text-slate-300/40"
          style={{ fontSize: "clamp(80px, 18vw, 220px)" }}
        >
          FLOW
        </span>
      )}

      <div className="relative mx-auto w-full max-w-5xl">
        {/* ---- セクションヘッダー ---- */}
        <div className={`text-center ${card ? "mb-3" : "mb-10"}`}>
          {/* FLOW eyebrow */}
          <p
            className={`font-bold tracking-widest ${card ? "text-[9px] mb-0.5" : "text-sm mb-1"}`}
            style={{ color: LIGHT_BLUE }}
          >
            FLOW
          </p>
          {/* メイン見出し */}
          <h2
            className={`font-bold leading-snug text-slate-800 ${
              card ? "text-[13px]" : "text-2xl sm:text-3xl"
            }`}
          >
            副業人材活用までの流れ
          </h2>
        </div>

        {/* ---- 吹き出し ---- */}
        <div className={`relative mx-auto ${card ? "max-w-[180px] mb-3" : "max-w-xs mb-6"}`}>
          <div
            className={`rounded-full border-2 bg-white text-center font-bold text-slate-700 shadow-sm ${
              card ? "px-3 py-1 text-[9px] border-slate-300" : "px-6 py-2 text-sm border-slate-300"
            }`}
          >
            シューマツワーカーなら!!
          </div>
          {/* 吹き出し三角（下向き） */}
          <span
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "100%",
              width: 0,
              height: 0,
              borderLeft: `${card ? 6 : 10}px solid transparent`,
              borderRight: `${card ? 6 : 10}px solid transparent`,
              borderTop: `${card ? 7 : 12}px solid #cbd5e1`,
            }}
          />
        </div>

        {/* ---- 最短5日キャッチ ---- */}
        <div className={`text-center ${card ? "mb-4" : "mb-12"}`}>
          <p
            className={`font-bold text-slate-800 ${
              card ? "text-[11px] leading-tight" : "text-xl sm:text-2xl leading-snug"
            }`}
          >
            <span style={{ color: BLUE }} className={card ? "text-[13px]" : "text-3xl sm:text-4xl"}>
              最短
            </span>
            <span style={{ color: BLUE }} className={card ? "text-[15px] mx-0.5" : "text-5xl sm:text-6xl mx-1 font-black"}>
              ５
            </span>
            <span className={`${card ? "text-[10px]" : "text-xl sm:text-2xl"} text-slate-500 font-normal`}>日で</span>
            {" "}
            <span className={card ? "text-[13px]" : "text-3xl sm:text-4xl"}>稼働開始</span>
            {" "}
            <span className={`font-normal ${card ? "text-[9px]" : "text-base"} text-slate-600`}>
              が可能
            </span>
          </p>
          {!card && (
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              ヒアリングから募集、契約後オンボーディングまで一気通貫してサポートしますので、<br />
              初めて副業人材を導入する企業でも安心です
            </p>
          )}
        </div>

        {/* ---- ステップ 4枚 + 矢印 ---- */}
        <div
          className={`flex items-start justify-center ${
            card ? "gap-1" : "gap-2 sm:gap-4"
          }`}
        >
          {STEPS.map((s, i) => (
            <div key={s.no} className="flex items-center">
              {/* ステップカード */}
              <div
                className={`flex flex-col items-center ${
                  card ? "w-[56px]" : "w-36 sm:w-44"
                }`}
              >
                {/* 円形画像 */}
                <div
                  className={`overflow-hidden rounded-full border-4 border-white bg-white shadow-md ${
                    card ? "h-12 w-12" : "h-28 w-28 sm:h-36 sm:w-36"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(s.img)}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* STEP番号 */}
                <p
                  className={`font-bold tracking-wider ${
                    card ? "mt-1 text-[7px]" : "mt-3 text-xs"
                  }`}
                  style={{ color: BLUE }}
                >
                  {s.no}
                </p>

                {/* タイトル */}
                <p
                  className={`text-center font-bold text-slate-800 leading-tight ${
                    card ? "mt-0.5 text-[7.5px]" : "mt-1 text-sm sm:text-base"
                  }`}
                >
                  {s.title}
                </p>

                {/* 説明文 */}
                {!card && (
                  <p className="mt-2 text-center text-xs leading-relaxed text-slate-500">
                    {s.desc}
                  </p>
                )}
              </div>

              {/* 矢印 ">" */}
              {i < STEPS.length - 1 && (
                <span
                  className={`font-bold text-slate-400 ${
                    card ? "mx-0.5 text-[10px]" : "mx-1 text-2xl sm:text-3xl"
                  }`}
                >
                  {">"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
