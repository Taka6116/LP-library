import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

// Bento Grid 機能一覧 — 2025-26年のSaaSで主流の非対称グリッド。
// 調査では bento 採用ページは滞在時間 +31%、最適カード数は 4〜8。
// ここは 5 タイル（大1 + 中1 + 小3）の構成。_shared トークンでテーマ追従。

const ICON = {
  bolt: "M13 2 4.1 12.6c-.3.4 0 .9.4.9H10l-1 8.5 8.9-10.6c.3-.4 0-.9-.4-.9H14l-1-8.5Z",
  chart: "M4 20V10m6 10V4m6 16v-7",
  shield: "M12 3l7 3v5c0 4.5-3 8.4-7 10-4-1.6-7-5.5-7-10V6l7-3Z",
  users: "M16 19v-1a4 4 0 0 0-8 0v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 8v-1a4 4 0 0 0-2.5-3.7",
} as const;

function TileIcon({ d, card, light }: { d: string; card: boolean; light?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={light ? "#fff" : "currentColor"}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${card ? "h-3.5 w-3.5" : "h-6 w-6"} ${light ? "" : "text-accent"}`}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export function SolutionBentoGrid({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  const tilePad = card ? "p-2" : "p-6";
  const titleCls = card ? "text-[9px] font-bold" : "text-base font-bold";
  const descCls = card
    ? "mt-0.5 text-[7px] leading-snug text-slate-500"
    : "mt-1.5 text-sm leading-relaxed text-slate-500";

  return (
    <SectionFrame variant={variant} tone="light">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-12 space-y-3"}`}>
        <Eyebrow variant={variant}>FEATURES</Eyebrow>
        <Heading variant={variant}>必要なものは、ぜんぶこの中に。</Heading>
        {!card && (
          <SubCopy variant={variant}>
            散らばっていたツールと作業を、ひとつのワークスペースへ。
          </SubCopy>
        )}
      </div>

      <div
        className={`grid grid-cols-3 ${card ? "gap-1.5" : "gap-4"}`}
        style={{ gridAutoRows: "1fr" }}
      >
        {/* 大タイル（2col）— 主役機能 + ミニグラフ */}
        <div
          className={`col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl bg-accent-soft ${tilePad}`}
        >
          <div>
            <TileIcon d={ICON.chart} card={card} />
            <p className={`${titleCls} ${card ? "mt-1" : "mt-3"} text-slate-900`}>
              成果がひと目でわかるダッシュボード
            </p>
            <p className={descCls}>
              流入・CV・売上をリアルタイムに集計。レポート作成はもう不要です。
            </p>
          </div>
          {/* ミニ棒グラフ（装飾） */}
          <div
            className={`flex items-end ${card ? "mt-1.5 h-7 gap-1" : "mt-6 h-24 gap-2.5"}`}
            aria-hidden
          >
            {[35, 55, 45, 70, 60, 85, 100].map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-t ${i === 6 ? "bg-accent" : "bg-accent/30"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* ダークタイル — スピード訴求 */}
        <div className={`flex flex-col justify-between rounded-2xl bg-accent-ink text-white ${tilePad}`}>
          <TileIcon d={ICON.bolt} card={card} light />
          <div>
            <p className={`${card ? "text-[13px]" : "text-3xl"} font-extrabold leading-none`}>
              5<span className={card ? "text-[8px]" : "text-base"}>分</span>
            </p>
            <p className={`${card ? "text-[7px]" : "text-xs"} mt-1 text-white/70`}>
              で初期設定が完了
            </p>
          </div>
        </div>

        {/* 小タイル — セキュリティ */}
        <div className={`rounded-2xl border border-slate-200 bg-white ${tilePad}`}>
          <TileIcon d={ICON.shield} card={card} />
          <p className={`${titleCls} ${card ? "mt-1" : "mt-3"} text-slate-900`}>安心のセキュリティ</p>
          {!card && <p className={descCls}>SSL・権限管理・監査ログを標準装備。</p>}
        </div>

        {/* 小タイル — チーム共有 */}
        <div className={`rounded-2xl border border-slate-200 bg-white ${tilePad}`}>
          <TileIcon d={ICON.users} card={card} />
          <p className={`${titleCls} ${card ? "mt-1" : "mt-3"} text-slate-900`}>チームで共有</p>
          {!card && <p className={descCls}>人数無制限。コメントでその場で議論。</p>}
        </div>

        {/* 横長タイル — 連携 */}
        <div
          className={`col-span-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-white ${tilePad}`}
        >
          <div>
            <p className={`${titleCls} text-slate-900`}>使い慣れたツールとつながる</p>
            {!card && <p className={descCls}>Slack / Google / CRM など30以上と連携。</p>}
          </div>
          <div className={`flex shrink-0 ${card ? "-space-x-1" : "-space-x-2"}`} aria-hidden>
            {["#6366f1", "#0ea5e9", "#10b981", "#f59e0b"].map((c) => (
              <span
                key={c}
                className={`rounded-full ring-2 ring-white ${card ? "h-3.5 w-3.5" : "h-8 w-8"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
