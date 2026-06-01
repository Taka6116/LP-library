import { isCard, type SharedPreviewProps } from "./_shared";

// SEARCH WRITE — 選べる3つのプラン
// 3カラム料金カード（カラーヘッダー + 仕様行 + 機能リスト）
// https://searchwrite.jp/pricing

const GREEN  = "#2aa84f";
const ORANGE = "#e5820d";
const PURPLE = "#7b5ec4";
const TEXT   = "#333";
const MUTED  = "#888";
const LINK   = "#2aa84f"; // green for feature links

const PLANS = [
  {
    color:    GREEN,
    brand:    "SEARCH WRITE",
    subtitle: "+カスタマーサクセス",
    term:     "12ヶ月",
    users:    "無制限",
    sites:    "1",
    features: [
      { text: "施策検討・コンテンツ作成・成果計測・改善など全機能", highlight: false },
      { text: "定型レポートダウンロード", highlight: true  },
      { text: "内部課題発見・改善機能",  highlight: false },
    ],
    featureNote: null,
    services: [
      { text: "導入支援（複数回）",         bold: false },
      { text: "キーワード戦略設計支援",     bold: false },
      { text: "キーワード選定支援",         bold: false },
      { text: "コンテンツ設計支援",         bold: false },
    ],
  },
  {
    color:    ORANGE,
    brand:    "SEARCH WRITE",
    subtitle: "+カスタマーサクセス\n+CVR改善機能",
    term:     "12ヶ月",
    users:    "無制限",
    sites:    "1",
    features: [
      { text: "施策検討・コンテンツ作成・成果計測・改善など全機能", highlight: false },
      { text: "定型レポートダウンロード", highlight: true  },
      { text: "内部課題発見・改善機能",  highlight: false },
      { text: "CVR改善機能",            highlight: true, colorOverride: ORANGE },
    ],
    featureNote: null,
    services: [
      { text: "導入支援（複数回）",     bold: false },
      { text: "キーワード戦略設計支援", bold: false },
      { text: "キーワード選定支援",     bold: false },
      { text: "コンテンツ設計支援",     bold: false },
    ],
  },
  {
    color:    PURPLE,
    brand:    "SEARCH WRITE",
    subtitle: "+カスタマーサクセス\n+コンサルティング",
    term:     "6ヶ月",
    users:    "無制限",
    sites:    "1",
    features: [
      { text: "施策検討・コンテンツ作成・成果計測・改善など全機能", highlight: false },
      { text: "定型レポートダウンロード", highlight: true  },
      { text: "内部課題発見・改善機能",  highlight: false },
    ],
    featureNote: "※ CVR改善機能の利用についてはお問い合わせください。",
    services: [
      { text: "導入支援＋月1回のWeb定例会",                            bold: false },
      { text: "専任コンサルタントによるキーワード戦略設計・選定・コンテンツ設計", bold: true  },
    ],
  },
] as const;

export function PricingSearchWrite({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`w-full bg-white font-sans ${card ? "px-3 py-5" : "px-6 py-16 sm:px-10 sm:py-20"}`}
      style={{ color: TEXT }}
    >
      <div className={`mx-auto w-full ${card ? "" : "max-w-5xl"}`}>

        {/* ── Section title ── */}
        <div className={card ? "mb-3" : "mb-10"}>
          <div className={`flex items-center gap-2 ${card ? "mb-1" : "mb-3"}`}>
            {/* ◀ green chevron */}
            <span
              className={`font-black leading-none ${card ? "text-[10px]" : "text-2xl"}`}
              style={{ color: GREEN }}
            >
              ◀
            </span>
            <h2
              className={`font-bold ${card ? "text-[11px]" : "text-2xl sm:text-3xl"}`}
              style={{ color: TEXT }}
            >
              選べる3つのプラン
            </h2>
          </div>
          {/* Separator line */}
          <div className="relative">
            <div className={`w-full ${card ? "h-px" : "h-px"} bg-slate-200`} />
            <div
              className={`absolute right-0 top-0 ${card ? "h-px w-4" : "h-[2px] w-10"}`}
              style={{ background: GREEN, top: card ? 0 : "-0.5px" }}
            />
          </div>
        </div>

        {/* ── 3-column plan cards ── */}
        <div className={`grid grid-cols-3 ${card ? "gap-1.5" : "gap-5"}`}>
          {PLANS.map((plan, pi) => (
            <div
              key={pi}
              className={`flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white ${
                card ? "" : "shadow-sm"
              }`}
            >
              {/* Colored header */}
              <div
                className={`flex flex-col items-center text-center text-white ${
                  card ? "px-2 py-2" : "px-5 py-5"
                }`}
                style={{ background: plan.color }}
              >
                {/* Brand logo */}
                <div className={`flex items-center gap-1 font-black tracking-wide ${card ? "text-[7px]" : "text-base"}`}>
                  <span className={card ? "text-[8px]" : "text-lg"}>◀</span>
                  {plan.brand}
                </div>
                {/* Plan subtitle — handle newlines */}
                {plan.subtitle.split("\n").map((line, li) => (
                  <p
                    key={li}
                    className={`leading-tight ${card ? "text-[6px] mt-0.5" : "text-sm mt-1"}`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Card body */}
              <div className={`flex flex-col flex-1 ${card ? "px-2 py-2 gap-1.5" : "px-5 py-6 gap-4"}`}>

                {/* Spec rows */}
                {[
                  { label: "契約期間",         value: plan.term,  large: false },
                  { label: "利用可能ユーザー数", value: plan.users, large: false },
                  { label: "登録可能サイト数",   value: plan.sites, large: true  },
                ].map((row) => (
                  <div key={row.label}>
                    <p
                      className={`text-slate-500 ${card ? "text-[6px]" : "text-xs"}`}
                    >
                      {row.label}
                    </p>
                    {row.large ? (
                      <div className={`flex items-baseline ${card ? "gap-0.5" : "gap-0.5"}`}>
                        <span
                          className={`font-black leading-none ${card ? "text-[14px]" : "text-4xl"}`}
                          style={{ color: plan.color }}
                        >
                          {row.value}
                        </span>
                        <span className={`font-semibold text-slate-700 ${card ? "text-[6px]" : "text-sm"}`}>
                          サイト※
                        </span>
                      </div>
                    ) : (
                      <p className={`font-bold text-slate-800 ${card ? "text-[7px]" : "text-sm"}`}>
                        {row.value}
                      </p>
                    )}
                  </div>
                ))}

                {/* Features */}
                <div>
                  <p className={`font-semibold text-slate-700 ${card ? "text-[6.5px] mb-0.5" : "text-xs mb-2"}`}>
                    機能
                  </p>
                  <ul className={card ? "space-y-0.5" : "space-y-1.5"}>
                    {plan.features.map((f, fi) => (
                      <li
                        key={fi}
                        className={`flex items-start gap-1 leading-tight ${card ? "text-[5.5px]" : "text-xs"}`}
                        style={{
                          color: f.highlight
                            ? ("colorOverride" in f ? f.colorOverride : LINK)
                            : TEXT,
                          fontWeight: "colorOverride" in f ? 600 : "inherit",
                        }}
                      >
                        <span className="mt-0.5 flex-shrink-0">•</span>
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.featureNote && !card && (
                    <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400">
                      {plan.featureNote}
                    </p>
                  )}
                </div>

                {/* Services */}
                <div>
                  <p className={`font-semibold text-slate-700 ${card ? "text-[6.5px] mb-0.5" : "text-xs mb-2"}`}>
                    ご提供サービス
                  </p>
                  <ul className={card ? "space-y-0.5" : "space-y-1.5"}>
                    {plan.services.map((s, si) => (
                      <li
                        key={si}
                        className={`flex items-start gap-1 leading-tight ${card ? "text-[5.5px]" : "text-xs"}`}
                        style={{
                          color: s.bold ? plan.color : TEXT,
                          fontWeight: s.bold ? 700 : "inherit",
                        }}
                      >
                        <span className="mt-0.5 flex-shrink-0">•</span>
                        <span>{s.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        {!card && (
          <p className="mt-5 text-xs text-slate-400">
            ※ オプションとして追加は可能
          </p>
        )}
      </div>
    </section>
  );
}
