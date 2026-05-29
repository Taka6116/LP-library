import { isCard, type SharedPreviewProps } from "./_shared";

// AssetSync — SaaS系LP ファーストビュー（実デザイン踏襲）
// 白基調・上部ネイビーバー・Latoフォント。ネイビー見出し(#1c3058)、
// アクセント青(#245fb2)、ナビ + CTA + タブレット/スマホのダッシュボードモックアップ。
const NAVY = "#1c3058";
const BLUE = "#245fb2";
const NAV = ["ホーム", "特徴", "機能", "料金", "よくある質問"];

// ロゴアイコン（円形グラデーション）
function Logo({ card }: { card: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`block rounded-full ${card ? "h-4 w-4" : "h-7 w-7"}`}
        style={{
          background: `conic-gradient(from 140deg, ${BLUE}, #7fb0f0, ${NAVY}, ${BLUE})`,
        }}
      />
      <span
        className={`font-bold tracking-tight ${card ? "text-xs" : "text-xl"}`}
        style={{ color: NAVY }}
      >
        AssetSync
      </span>
    </div>
  );
}

// タブレット内ダッシュボード
function TabletDashboard({ card }: { card: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      {/* topbar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`block rounded-full ${card ? "h-2 w-2" : "h-3.5 w-3.5"}`}
            style={{ background: BLUE }}
          />
          <span
            className={`font-bold ${card ? "text-[6px]" : "text-[11px]"}`}
            style={{ color: NAVY }}
          >
            ダッシュボード
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
        </div>
      </div>

      <div className={`grid grid-cols-2 ${card ? "gap-1 p-1.5" : "gap-2 p-3"}`}>
        {/* 資産一覧 donut */}
        <div className={`rounded-lg bg-slate-50 ${card ? "p-1" : "p-2.5"}`}>
          <p
            className={`font-semibold text-slate-500 ${card ? "text-[5px]" : "text-[9px]"}`}
          >
            資産一覧
          </p>
          <div className={`flex items-center justify-center ${card ? "mt-0.5" : "mt-2"}`}>
            <div
              className={`relative grid place-items-center rounded-full ${
                card ? "h-8 w-8" : "h-20 w-20"
              }`}
              style={{
                background: `conic-gradient(${BLUE} 0 38%, #7fb0f0 38% 64%, #c9ddf5 64% 100%)`,
              }}
            >
              <div
                className={`grid place-items-center rounded-full bg-white ${
                  card ? "h-5 w-5" : "h-12 w-12"
                }`}
              >
                <span
                  className={`font-black ${card ? "text-[5px]" : "text-[11px]"}`}
                  style={{ color: NAVY }}
                >
                  12.8億
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 推移グラフ line */}
        <div className={`rounded-lg bg-slate-50 ${card ? "p-1" : "p-2.5"}`}>
          <p
            className={`font-semibold text-slate-500 ${card ? "text-[5px]" : "text-[9px]"}`}
          >
            推移グラフ
          </p>
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className={`w-full ${card ? "mt-0.5 h-8" : "mt-2 h-20"}`}
          >
            <polyline
              points="0,40 16,32 32,36 48,22 64,26 80,12 100,8"
              fill="none"
              stroke={BLUE}
              strokeWidth="2.5"
            />
            <polyline
              points="0,40 16,32 32,36 48,22 64,26 80,12 100,8 100,50 0,50"
              fill={`${BLUE}22`}
              stroke="none"
            />
          </svg>
        </div>

        {/* 直近のログ一覧 table */}
        {!card && (
          <div className="col-span-2 rounded-lg bg-slate-50 p-2.5">
            <p className="text-[9px] font-semibold text-slate-500">直近のログ一覧</p>
            <div className="mt-1.5 space-y-1">
              {[
                ["積立", "+96,993円", "確立引き出し"],
                ["収益", "+464,172円", "売上計上"],
                ["オフィス", "+703,268円", "源泉徴収費用"],
              ].map((r) => (
                <div
                  key={r[0]}
                  className="grid grid-cols-3 items-center text-[8px] text-slate-500"
                >
                  <span>{r[0]}</span>
                  <span className="font-semibold" style={{ color: BLUE }}>
                    {r[1]}
                  </span>
                  <span className="text-right">{r[2]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 手前に重なるスマホ
function PhoneCard({ card }: { card: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.1rem] border-[3px] border-slate-800 bg-white shadow-2xl ${
        card ? "w-12" : "w-36"
      }`}
    >
      <div className="flex items-center gap-1 border-b border-slate-100 px-1.5 py-1">
        <span
          className={`block rounded-full ${card ? "h-1.5 w-1.5" : "h-3 w-3"}`}
          style={{ background: BLUE }}
        />
        <span
          className={`font-bold ${card ? "text-[4px]" : "text-[8px]"}`}
          style={{ color: NAVY }}
        >
          AssetSync
        </span>
      </div>
      <div className={card ? "space-y-0.5 p-1" : "space-y-1.5 p-2"}>
        <p
          className={`font-semibold text-slate-500 ${card ? "text-[3.5px]" : "text-[7px]"}`}
        >
          加入中の保険／積立情報
        </p>
        <div
          className={`rounded-md text-white ${card ? "p-1" : "p-2"}`}
          style={{ background: BLUE }}
        >
          <p className={`font-bold ${card ? "text-[4px]" : "text-[8px]"}`}>
            メディケア医療保険
          </p>
          <p className={`font-black ${card ? "text-[6px]" : "text-[13px]"}`}>
            ¥12,000
          </p>
        </div>
        <div
          className={`rounded-md bg-slate-50 ${card ? "p-1" : "p-2"}`}
        >
          <p
            className={`font-semibold ${card ? "text-[3.5px]" : "text-[7px]"}`}
            style={{ color: NAVY }}
          >
            積立額の見直しをご検討ください
          </p>
          {!card && (
            <span
              className="mt-1 inline-block rounded-full px-2 py-0.5 text-[7px] font-bold text-white"
              style={{ background: NAVY }}
            >
              シミュレーションしてみる
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function HeroAssetSync({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <section className="w-full bg-white font-lato">
      {/* 上部ネイビーバー */}
      <div className={card ? "h-1" : "h-2"} style={{ background: NAVY }} />

      <div className={`mx-auto w-full max-w-6xl ${card ? "px-4 pb-4" : "px-6 pb-14 sm:px-10"}`}>
        {/* ナビ */}
        <nav className={`flex items-center justify-between ${card ? "py-2" : "py-5"}`}>
          <Logo card={card} />

          {!card && (
            <div className="hidden items-center gap-7 text-sm font-bold text-slate-700 lg:flex">
              {NAV.map((item) => (
                <span key={item} className="transition hover:text-slate-900">
                  {item}
                </span>
              ))}
            </div>
          )}

          <div className={`flex items-center ${card ? "gap-1" : "gap-3"}`}>
            <span
              className={`inline-flex items-center justify-center rounded-md border font-bold ${
                card ? "px-1.5 py-0.5 text-[7px]" : "px-4 py-2 text-sm"
              }`}
              style={{ borderColor: NAVY, color: NAVY }}
            >
              資料ダウンロード
            </span>
            <span
              className={`inline-flex items-center justify-center rounded-md font-bold text-white ${
                card ? "px-1.5 py-0.5 text-[7px]" : "px-4 py-2 text-sm"
              }`}
              style={{ background: NAVY }}
            >
              お問い合わせ
            </span>
          </div>
        </nav>

        {/* 本体 */}
        <div
          className={`grid items-center ${
            card ? "grid-cols-[1fr_1fr] gap-2" : "grid-cols-1 gap-8 lg:grid-cols-[1fr_1.05fr]"
          }`}
        >
          <div className={card ? "space-y-1.5" : "space-y-6"}>
            <h1
              className={`font-black leading-[1.25] tracking-tight ${
                card ? "text-sm" : "text-4xl sm:text-5xl"
              }`}
              style={{ color: NAVY }}
            >
              資産のすべてを把握し、
              <br />
              利益を最大化する。
            </h1>

            <p
              className={`text-slate-500 ${
                card ? "text-[8px] leading-snug" : "max-w-md text-base leading-relaxed sm:text-lg"
              }`}
            >
              収益、オフィス、保険など、企業のすべての資産をひとつに。AssetSyncは、戦略的な投資判断と従業員支援を同時に実現する、次世代の資産管理プラットフォームです。
            </p>

            <div className={`flex items-center ${card ? "gap-1.5 pt-0.5" : "gap-3 pt-2"}`}>
              <span
                className={`inline-flex items-center justify-center rounded-md border font-bold ${
                  card ? "px-2 py-1 text-[8px]" : "px-7 py-3 text-sm sm:text-base"
                }`}
                style={{ borderColor: NAVY, color: NAVY }}
              >
                資料ダウンロード
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md font-bold text-white ${
                  card ? "px-2 py-1 text-[8px]" : "px-7 py-3 text-sm sm:text-base"
                }`}
                style={{ background: BLUE }}
              >
                お問い合わせ
              </span>
            </div>
          </div>

          {/* 右: タブレット + スマホ */}
          <div className={`relative ${card ? "pl-4 pt-1" : "pl-12 pt-2"}`}>
            <TabletDashboard card={card} />
            <div className={`absolute bottom-0 ${card ? "-left-1" : "-left-2"}`}>
              <PhoneCard card={card} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
