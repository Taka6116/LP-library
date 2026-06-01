import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// スクリレ — 保護者に聞きました！アンケート結果
// 水色背景 + 左2枚カード（95%統計 + ランキング）+ 右1枚カード（円グラフ + 84%）

const BG = "#d6eaf8";
const BLUE = "#1976d2";
const LIGHT_BLUE = "#42a5f5";

const RANKING = [
  { rank: "1位", text: "外出先などどこでも見られる", count: "1,725 人" },
  { rank: "2位", text: "子供を介さず見逃しがない", count: "1,175 人" },
  { rank: "3位", text: "紙と比べて管理が簡単", count: "1,125 人" },
];

// conic-gradient: 12時方向スタート、時計回り
// 58% = 208.8deg | 26% = 93.6deg | 11% = 39.6deg | 5% = 18deg
const CONIC = [
  `${BLUE} 0deg 208.8deg`,
  `${LIGHT_BLUE} 208.8deg 302.4deg`,
  `#90caf9 302.4deg 341.4deg`,
  `#e2e8f0 341.4deg 360deg`,
].join(", ");

const PIE_LABELS = [
  {
    pct: "58%",
    label: "できる限り参加したい",
    color: "white",
    // 12時から104.4° (大きい右スライス中央) → translate to right
    style: { right: "-108px", top: "38%", textAlign: "left" as const, width: "100px" },
  },
  {
    pct: "26%",
    label: "どちらかといえば参加したい",
    color: BLUE,
    // 255.6° → 左中央
    style: { left: "-112px", top: "50%", textAlign: "right" as const, width: "104px" },
  },
  {
    pct: "11%",
    label: "活動内容がまだよくわからない",
    color: "#475569",
    // 321.9° → 上左
    style: { left: "-70px", top: "-36px", textAlign: "right" as const, width: "64px" },
  },
];

export function InfographicSurveySkurilre({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full font-sans ${card ? "px-3 py-5" : "px-6 py-16 sm:px-10 sm:py-24"}`}
      style={{ background: BG }}
    >
      <div className={`mx-auto w-full ${card ? "" : "max-w-5xl"}`}>

        {/* ---- タイトル ---- */}
        <div className={`text-center ${card ? "mb-3" : "mb-10"}`}>
          <h2
            className={`font-bold text-slate-800 ${card ? "text-[11px] leading-snug" : "text-2xl sm:text-3xl"}`}
          >
            保護者に聞きました！アンケート結果
          </h2>
          <div
            className={`mx-auto mt-1 rounded-full ${card ? "h-[2px] w-8" : "h-1 w-20"}`}
            style={{ background: BLUE }}
          />
        </div>

        {/* ---- 2カラムグリッド ---- */}
        <div
          className={`grid ${card ? "grid-cols-2 gap-2" : "grid-cols-1 gap-6 md:grid-cols-2"}`}
        >
          {/* ========== 左カラム ========== */}
          <div className={`flex flex-col ${card ? "gap-1.5" : "gap-5"}`}>

            {/* カード①: 95% */}
            <div
              className={`rounded-2xl bg-white shadow-sm ${card ? "p-2.5" : "p-7"}`}
            >
              <p
                className={`font-semibold leading-tight ${card ? "text-[8px]" : "text-sm"}`}
                style={{ color: LIGHT_BLUE }}
              >
                アプリでお便りを見ましたか？
              </p>
              <div
                className={`flex items-baseline ${card ? "mt-1 gap-0.5" : "mt-3 gap-2"}`}
              >
                <span
                  className={`font-bold text-slate-700 ${card ? "text-[9px]" : "text-xl"}`}
                >
                  「見た」
                </span>
                <span
                  className={`font-black leading-none ${card ? "text-[26px]" : "text-7xl"}`}
                  style={{ color: BLUE }}
                >
                  95
                </span>
                <span
                  className={`font-bold text-slate-500 ${card ? "text-[9px]" : "text-xl"}`}
                >
                  %
                </span>
              </div>
            </div>

            {/* カード②: ランキング */}
            <div
              className={`rounded-2xl bg-white shadow-sm ${card ? "p-2.5" : "p-7"}`}
            >
              <p
                className={`font-semibold leading-tight ${card ? "text-[7.5px] mb-1.5" : "text-sm mb-5"}`}
                style={{ color: LIGHT_BLUE }}
              >
                アプリの便利な点はなんですか？{!card && "（複数回答可）"}
              </p>
              <div className={`${card ? "space-y-1" : "space-y-4"}`}>
                {RANKING.map((r, i) => (
                  <div key={r.rank}>
                    <div className={`flex items-center ${card ? "gap-1.5" : "gap-3"}`}>
                      {/* 番号バッジ */}
                      <span
                        className={`flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white ${
                          card ? "h-4 w-4 text-[6.5px]" : "h-10 w-10 text-sm"
                        }`}
                        style={{ background: BLUE }}
                      >
                        {r.rank}
                      </span>
                      <span
                        className={`flex-1 text-slate-700 leading-tight ${card ? "text-[7px]" : "text-sm"}`}
                      >
                        {r.text}
                      </span>
                      <span
                        className={`font-semibold whitespace-nowrap ${card ? "text-[7px]" : "text-sm"}`}
                        style={{ color: BLUE }}
                      >
                        {r.count}
                      </span>
                    </div>
                    {i < RANKING.length - 1 && (
                      <div
                        className={`border-t border-dashed border-slate-200 ${
                          card ? "mt-1 ml-5" : "mt-3 ml-14"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== 右カラム ========== */}
          <div
            className={`rounded-2xl bg-white shadow-sm ${card ? "p-2.5 flex flex-col" : "p-7 flex flex-col items-center"}`}
          >
            <p
              className={`font-semibold leading-tight ${card ? "text-[8px] mb-2" : "text-sm mb-7"}`}
              style={{ color: LIGHT_BLUE }}
            >
              これからもポイント活動に参加したいですか？
            </p>

            {/* 円グラフ */}
            <div
              className={`relative mx-auto flex-shrink-0 ${
                card ? "h-[72px] w-[72px]" : "h-48 w-48 sm:h-56 sm:w-56"
              }`}
            >
              {/* Pie circle */}
              <div
                className="h-full w-full rounded-full"
                style={{ background: `conic-gradient(${CONIC})` }}
              />

              {/* Floating labels (full only) */}
              {!card &&
                PIE_LABELS.map((l) => (
                  <div
                    key={l.pct}
                    className="pointer-events-none absolute leading-snug"
                    style={{ ...l.style, fontSize: "11px" }}
                  >
                    <span style={{ color: l.color === "white" ? "#475569" : l.color }}>
                      {l.label}
                      <br />
                    </span>
                    {l.pct === "58%" ? (
                      <span
                        className="font-black"
                        style={{ fontSize: "20px", color: BLUE }}
                      >
                        {l.pct}
                      </span>
                    ) : (
                      <span
                        className="font-bold"
                        style={{ fontSize: "14px", color: "#475569" }}
                      >
                        {l.pct}
                      </span>
                    )}
                  </div>
                ))}
            </div>

            {/* カード凡例 (card only) */}
            {card && (
              <div className="mt-1.5 space-y-0.5">
                {[
                  { color: BLUE, label: "できる限り", pct: "58%" },
                  { color: LIGHT_BLUE, label: "どちらかといえば", pct: "26%" },
                  { color: "#90caf9", label: "よくわからない", pct: "11%" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ background: l.color }}
                    />
                    <span className="text-[6.5px] text-slate-600 leading-tight">{l.label}</span>
                    <span className="ml-auto text-[6.5px] font-bold" style={{ color: BLUE }}>{l.pct}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 84% 結論 */}
            <div className={`${card ? "mt-1.5 text-center" : "mt-8 text-center"}`}>
              <p
                className={`text-slate-600 ${card ? "text-[7.5px]" : "text-base"}`}
              >
                参加したいと答えた方が
              </p>
              <div className={`flex items-baseline justify-center ${card ? "gap-0.5" : "gap-1"}`}>
                <span
                  className={`font-black leading-none ${card ? "text-[22px]" : "text-6xl"}`}
                  style={{ color: BLUE }}
                >
                  84
                </span>
                <span
                  className={`font-bold text-slate-500 ${card ? "text-[10px]" : "text-xl"}`}
                >
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ---- 注釈 ---- */}
        {!card && (
          <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
            ※ご協力いただいた保護者：小学校4校、中学校1校、小中一貫校4校の皆様　※有効回答数：2,500人（2020年10月時点）
          </p>
        )}
      </div>
    </section>
  );
}
