"use client";
import { isCard, type SharedPreviewProps } from "./_shared";

// ─── Design tokens (sukurire.jp/parents/) ───────────────────────────────────
// color.border.strong  = #01a9fb  → accent (question text / underline / counts)
// color.text.inverse   = #195cb9  → dark-navy (large numbers)
// color.text.primary   = #3c3c3c  → body text
// font.family.primary  = Noto Sans JP
const T = {
  bg:      "#d4e8f8",
  accent:  "#01a9fb",   // border.strong
  navy:    "#195cb9",   // text.inverse  → big numbers + large slice
  text:    "#3c3c3c",   // text.primary
  sub:     "#888",
  // Pie palette: light-blue tones matching original
  p1:      "#195cb9",   // 58% — deep navy
  p2:      "#44b7f8",   // 26% — sky blue
  p3:      "#8dd8f8",   // 11% — light blue
  p4:      "#d9eef8",   //  5% — very pale
} as const;

const RANKING = [
  { rank: "1位", text: "外出先などどこでも見られる", count: "1,725 人" },
  { rank: "2位", text: "子供を介さず見逃しがない",   count: "1,175 人" },
  { rank: "3位", text: "紙と比べて管理が簡単",       count: "1,125 人" },
];

// ─── SVG pie-chart helpers ───────────────────────────────────────────────────
/** Convert polar (deg from 12-o'clock, CW) to Cartesian SVG coordinates */
function p2xy(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: +(cx + r * Math.cos(a)).toFixed(2), y: +(cy + r * Math.sin(a)).toFixed(2) };
}
/** Single pie-slice path (center → arc) */
function slicePath(cx: number, cy: number, r: number, s: number, e: number) {
  const p1 = p2xy(cx, cy, r, s);
  const p2 = p2xy(cx, cy, r, e);
  const lg = (e - s > 180) ? 1 : 0;
  return `M${cx},${cy} L${p1.x},${p1.y} A${r},${r},0,${lg},1,${p2.x},${p2.y}Z`;
}

// Pie slices: 0° = 12 o'clock, clockwise
// 58% = 208.8°, 26% = 93.6°, 11% = 39.6°, 5% = 18°
const SLICES = [
  { s: 0,     e: 208.8, fill: T.p1, labelText: ["できる限り参加したい"], pct: "58%", side: "right" as const },
  { s: 208.8, e: 302.4, fill: T.p2, labelText: ["どちらかといえば","参加したい"], pct: "26%", side: "left"  as const },
  { s: 302.4, e: 341.4, fill: T.p3, labelText: ["活動内容がまだ","よくわからない"], pct: "11%", side: "left" as const },
  { s: 341.4, e: 360,   fill: T.p4, labelText: [],                               pct: "",    side: "right" as const },
];

// SVG viewport: wide enough to fit callout labels on both sides
const CX = 240, CY = 150, R = 110;
const VW = 530, VH = 300;
const LABEL_R = 152;   // knee point radius
const HORIZ   = 14;    // horizontal segment length

function PieSVG() {
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {/* ── Slices ── */}
      {SLICES.map((sl, i) => (
        <path
          key={i}
          d={slicePath(CX, CY, R, sl.s, sl.e)}
          fill={sl.fill}
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ))}

      {/* ── Leader lines + labels ── */}
      {SLICES.filter(sl => sl.labelText.length > 0).map((sl, i) => {
        const mid   = (sl.s + sl.e) / 2;
        const inner = p2xy(CX, CY, R + 8, mid);
        const knee  = p2xy(CX, CY, LABEL_R, mid);
        const isR   = sl.side === "right";
        const horizX = isR ? knee.x + HORIZ : knee.x - HORIZ;
        const textX  = isR ? horizX + 5 : horizX - 5;
        const anchor = isR ? "start" : "end";

        // Stack label rows: label lines (12px) + pct line (16px bold)
        const rows  = [...sl.labelText, sl.pct];
        const lh    = 14;
        const totalH = rows.length * lh;
        const startY = knee.y - totalH / 2 + lh * 0.75;

        return (
          <g key={`lbl-${i}`}>
            {/* Radial segment */}
            <line x1={inner.x} y1={inner.y} x2={knee.x} y2={knee.y}
                  stroke={sl.fill} strokeWidth="1.5" />
            {/* Horizontal tick */}
            <line x1={knee.x} y1={knee.y} x2={horizX} y2={knee.y}
                  stroke={sl.fill} strokeWidth="1.5" />

            {rows.map((txt, ri) => {
              const isPct = ri === rows.length - 1;
              return (
                <text
                  key={ri}
                  x={textX}
                  y={+(startY + ri * lh).toFixed(1)}
                  textAnchor={anchor}
                  fontSize={isPct ? 15 : 11}
                  fontWeight={isPct ? "700" : "400"}
                  fill={isPct ? T.navy : T.text}
                  fontFamily="'Noto Sans JP', sans-serif"
                >
                  {txt}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Card-variant (thumbnail) — compact conic-gradient approach ──────────────
const CONIC = [
  `${T.p1} 0deg 208.8deg`,
  `${T.p2} 208.8deg 302.4deg`,
  `${T.p3} 302.4deg 341.4deg`,
  `${T.p4} 341.4deg 360deg`,
].join(", ");

// ─── Main component ──────────────────────────────────────────────────────────
export function InfographicSurveySkurilre({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full ${card ? "px-3 py-5" : "px-6 py-16 sm:px-10 sm:py-24"}`}
      style={{ background: T.bg, fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      <div className={`mx-auto w-full ${card ? "" : "max-w-5xl"}`}>

        {/* ════ Title ════ */}
        <div className={`text-center ${card ? "mb-3" : "mb-12"}`}>
          <h2
            className={`font-bold ${card ? "text-[11px] leading-snug" : "text-[1.625rem] sm:text-3xl"}`}
            style={{ color: T.text }}
          >
            保護者に聞きました！アンケート結果
          </h2>
          {/* accent underline */}
          <div
            className={`mx-auto rounded-full ${card ? "mt-0.5 h-[2px] w-8" : "mt-2 h-[3px] w-16"}`}
            style={{ background: T.accent }}
          />
        </div>

        {/* ════ Two-column grid ════ */}
        <div className={`grid ${card ? "grid-cols-2 gap-2" : "grid-cols-1 gap-6 md:grid-cols-2"}`}>

          {/* ── Left column ── */}
          <div className={`flex flex-col ${card ? "gap-1.5" : "gap-5"}`}>

            {/* Card ①: 95% stat */}
            <div
              className={`rounded-2xl bg-white ${card ? "p-2.5" : "px-8 py-7"}`}
              style={{ boxShadow: "0 2px 12px rgba(25,92,185,.07)" }}
            >
              <p
                className={`font-medium ${card ? "text-[8px]" : "text-sm"}`}
                style={{ color: T.accent }}
              >
                アプリでお便りを見ましたか？
              </p>
              <div className={`flex items-baseline ${card ? "mt-1 gap-0.5" : "mt-4 gap-2"}`}>
                <span
                  className={`font-bold ${card ? "text-[9px]" : "text-xl"}`}
                  style={{ color: T.text }}
                >
                  「見た」
                </span>
                <span
                  className={`font-black leading-none ${card ? "text-[26px]" : "text-[4.5rem]"}`}
                  style={{ color: T.navy }}
                >
                  95
                </span>
                <span
                  className={`font-semibold ${card ? "text-[9px]" : "text-xl"}`}
                  style={{ color: T.sub }}
                >
                  %
                </span>
              </div>
            </div>

            {/* Card ②: Ranking */}
            <div
              className={`flex-1 rounded-2xl bg-white ${card ? "p-2.5" : "px-8 py-7"}`}
              style={{ boxShadow: "0 2px 12px rgba(25,92,185,.07)" }}
            >
              <p
                className={`font-medium ${card ? "text-[7.5px] mb-1.5" : "text-sm mb-5"}`}
                style={{ color: T.accent }}
              >
                アプリの便利な点はなんですか？
                {!card && "（複数回答可）"}
              </p>

              <div className={card ? "space-y-1" : "space-y-0"}>
                {RANKING.map((r, i) => (
                  <div key={r.rank}>
                    <div className={`flex items-center ${card ? "gap-1.5" : "gap-4 py-3"}`}>
                      {/* Numbered badge */}
                      <span
                        className={`flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white leading-none ${
                          card ? "h-4 w-4 text-[6.5px]" : "h-10 w-10 text-sm"
                        }`}
                        style={{ background: T.navy }}
                      >
                        {r.rank}
                      </span>
                      <span
                        className={`flex-1 leading-tight ${card ? "text-[7px]" : "text-sm"}`}
                        style={{ color: T.text }}
                      >
                        {r.text}
                      </span>
                      <span
                        className={`font-semibold whitespace-nowrap ${card ? "text-[7px]" : "text-sm"}`}
                        style={{ color: T.accent }}
                      >
                        {r.count}
                      </span>
                    </div>
                    {/* Dashed divider */}
                    {i < RANKING.length - 1 && (
                      <div
                        className={`border-t border-dashed border-slate-200 ${
                          card ? "ml-5" : "ml-14"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: pie chart ── */}
          <div
            className={`rounded-2xl bg-white flex flex-col ${card ? "p-2.5" : "px-8 py-7"}`}
            style={{ boxShadow: "0 2px 12px rgba(25,92,185,.07)" }}
          >
            <p
              className={`font-medium ${card ? "text-[8px] mb-2" : "text-sm mb-4"}`}
              style={{ color: T.accent }}
            >
              これからもポイント活動に参加したいですか？
            </p>

            {/* ── Full variant: SVG pie ── */}
            {!card && (
              <div className="flex-1 flex items-center justify-center py-2">
                <PieSVG />
              </div>
            )}

            {/* ── Card variant: conic-gradient + mini legend ── */}
            {card && (
              <>
                <div className="relative mx-auto h-[68px] w-[68px]">
                  <div
                    className="h-full w-full rounded-full"
                    style={{ background: `conic-gradient(${CONIC})` }}
                  />
                </div>
                <div className="mt-1.5 space-y-0.5 px-0.5">
                  {[
                    { c: T.p1, l: "できる限り", p: "58%" },
                    { c: T.p2, l: "どちらかといえば", p: "26%" },
                    { c: T.p3, l: "よくわからない", p: "11%" },
                  ].map((item) => (
                    <div key={item.l} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: item.c }} />
                      <span className="text-[6px] leading-tight" style={{ color: T.text }}>{item.l}</span>
                      <span className="ml-auto text-[6.5px] font-bold" style={{ color: T.navy }}>{item.p}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── 84% conclusion ── */}
            <div className={`text-center ${card ? "mt-2" : "mt-4"}`}>
              <p
                className={card ? "text-[7px]" : "text-base"}
                style={{ color: T.sub }}
              >
                参加したいと答えた方が
              </p>
              <div className={`flex items-baseline justify-center ${card ? "gap-0.5" : "gap-1"}`}>
                <span
                  className={`font-black leading-none ${card ? "text-[24px]" : "text-[4.5rem]"}`}
                  style={{ color: T.navy }}
                >
                  84
                </span>
                <span
                  className={`font-semibold ${card ? "text-[9px]" : "text-2xl"}`}
                  style={{ color: T.sub }}
                >
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ════ Footer note ════ */}
        {!card && (
          <p
            className="mt-7 text-center text-xs leading-relaxed"
            style={{ color: T.sub }}
          >
            ※ご協力いただいた保護者：小学校4校、中学校1校、小中一貫校4校の皆様　※有効回答数：2,500人（2020年10月時点）
          </p>
        )}
      </div>
    </section>
  );
}
