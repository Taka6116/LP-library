import {
  SectionFrame,
  Eyebrow,
  Heading,
  SubCopy,
  isCard,
  type SharedPreviewProps,
} from "./_shared";

// 他社比較テーブル — Casper 等で実証された定番の説得パターン。
// 「緑の✓ vs 赤の✗」は原始的だが効果が高い。当社列をアクセント色で強調。

const ROWS = [
  { label: "初期費用",       ours: "ok",  others: "ng", note: "0円" },
  { label: "導入スピード",   ours: "ok",  others: "tri", note: "最短即日" },
  { label: "専任サポート",   ours: "ok",  others: "ng", note: "無料・無制限" },
  { label: "カスタマイズ",   ours: "ok",  others: "tri", note: "管理画面から自由に" },
  { label: "解約縛り",       ours: "ok",  others: "ng", note: "いつでも解約可" },
] as const;

type Mark = "ok" | "ng" | "tri";

function MarkIcon({ mark, card }: { mark: Mark; card: boolean }) {
  const size = card ? "h-3 w-3" : "h-5 w-5";
  if (mark === "ok") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={size} aria-label="対応">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  if (mark === "ng") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeLinecap="round" className={size} aria-label="非対応">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinejoin="round" className={size} aria-label="一部対応">
      <path d="M12 4 21 19H3L12 4Z" />
    </svg>
  );
}

export function BenefitComparisonTable({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  const cellPad = card ? "px-1.5 py-1" : "px-5 py-4";
  const labelCls = card ? "text-[8px]" : "text-sm";

  return (
    <SectionFrame variant={variant} tone="muted">
      <div className={`text-center ${card ? "mb-3 space-y-1" : "mb-10 space-y-3"}`}>
        <Eyebrow variant={variant} tone="muted">COMPARISON</Eyebrow>
        <Heading variant={variant}>選ばれる理由は、比べればわかる。</Heading>
        {!card && (
          <SubCopy variant={variant}>
            一般的なサービスとの違いを、項目ごとに比較しました。
          </SubCopy>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className={`${cellPad} ${labelCls} w-[40%] font-semibold text-slate-400`}>
                比較項目
              </th>
              <th className={`${cellPad} ${labelCls} text-center font-semibold text-slate-400`}>
                一般的なサービス
              </th>
              {/* 当社列 — アクセント強調 */}
              <th className={`${cellPad} ${labelCls} bg-accent text-center font-bold text-white`}>
                当社サービス
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={r.label}
                className={i < ROWS.length - 1 ? "border-b border-slate-100" : ""}
              >
                <td className={`${cellPad} ${labelCls} font-semibold text-slate-700`}>
                  {r.label}
                </td>
                <td className={`${cellPad} text-center`}>
                  <span className="inline-flex justify-center">
                    <MarkIcon mark={r.others} card={card} />
                  </span>
                </td>
                <td className={`${cellPad} bg-accent-soft text-center`}>
                  <span className="inline-flex flex-col items-center gap-0.5">
                    <MarkIcon mark={r.ours} card={card} />
                    <span
                      className={`font-semibold text-accent ${
                        card ? "text-[7px]" : "text-xs"
                      }`}
                    >
                      {r.note}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!card && (
        <p className="mt-4 text-center text-xs text-slate-400">
          ※ 一般的なサービス＝同価格帯の競合サービス平均（自社調べ）
        </p>
      )}
    </SectionFrame>
  );
}
