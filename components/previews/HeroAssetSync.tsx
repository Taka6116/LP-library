import { isCard, type SharedPreviewProps } from "./_shared";

// AssetSync — SaaS系LP ファーストビュー（実デザイン踏襲）
// 白基調・上部ネイビーバー・Latoフォント。ネイビー見出し(#1c3058)、
// アクセント青(#245fb2)。右側は タブレット+スマホ のデバイスモックアップ。
const NAVY = "#1c3058";
const BLUE = "#245fb2";
const SKY = "#7fb0f0";
const NAV = ["ホーム", "特徴", "機能", "料金", "よくある質問"];

function Logo({ card }: { card: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`block rounded-full ${card ? "h-4 w-4" : "h-7 w-7"}`}
        style={{
          background: `conic-gradient(from 140deg, ${BLUE}, ${SKY}, ${NAVY}, ${BLUE})`,
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

/* タブレット画面内のダッシュボード（実寸） */
function DashboardScreen() {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="block h-3 w-3 rounded-full" style={{ background: BLUE }} />
          <span className="text-[10px] font-bold" style={{ color: NAVY }}>
            ダッシュボード
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: BLUE }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {/* 資産一覧 */}
        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="text-[9px] font-bold text-slate-600">資産一覧</p>
          <p className="mt-0.5 text-[6px] leading-tight text-slate-400">
            収益・保険・積立など、各資産をカテゴリ別に表示。
          </p>
          <div className="mt-1.5 flex items-center justify-center">
            <div
              className="relative grid h-[68px] w-[68px] place-items-center rounded-full"
              style={{
                background: `conic-gradient(${BLUE} 0 38%, ${SKY} 38% 66%, #c9ddf5 66% 100%)`,
              }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-center">
                <div>
                  <p className="text-[5px] text-slate-400">合計資産額</p>
                  <p className="text-[10px] font-black" style={{ color: NAVY }}>
                    約12.8億
                  </p>
                </div>
              </div>
              <span
                className="absolute -right-1 top-1 rounded px-1 text-[6px] font-bold text-white"
                style={{ background: BLUE }}
              >
                38%
              </span>
            </div>
          </div>
        </div>

        {/* 推移グラフ */}
        <div className="rounded-lg bg-slate-50 p-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-slate-600">推移グラフ</p>
            <div className="flex gap-0.5">
              {["日", "週", "月", "年"].map((t, i) => (
                <span
                  key={t}
                  className="rounded px-1 text-[5px] font-semibold"
                  style={
                    i === 2
                      ? { background: BLUE, color: "#fff" }
                      : { background: "#e2e8f0", color: "#94a3b8" }
                  }
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 120 64" preserveAspectRatio="none" className="mt-2 h-[62px] w-full">
            <defs>
              <linearGradient id="as-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity="0.25" />
                <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points="0,50 20,40 40,46 60,28 80,33 100,16 120,8"
              fill="none"
              stroke={BLUE}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <polygon
              points="0,50 20,40 40,46 60,28 80,33 100,16 120,8 120,64 0,64"
              fill="url(#as-fill)"
            />
          </svg>
        </div>

        {/* 直近のログ一覧 */}
        <div className="col-span-2 rounded-lg bg-slate-50 p-2.5">
          <p className="text-[9px] font-bold text-slate-600">直近のログ一覧</p>
          <div className="mt-1.5 grid grid-cols-[1fr_1fr_1fr_auto] gap-x-2 text-[6px] text-slate-400">
            <span>日付</span>
            <span>カテゴリ</span>
            <span className="text-right">変動額</span>
            <span className="text-right">ステータス</span>
          </div>
          <div className="mt-1 space-y-1">
            {[
              ["2025-04-01", "積立", "+96,993円", "確立引き出し"],
              ["2025-03-31", "収益", "+464,172円", "売上計上"],
              ["2025-03-30", "オフィス", "+703,268円", "源泉徴収費用"],
            ].map((r) => (
              <div
                key={r[0]}
                className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-x-2 border-t border-slate-100 pt-1 text-[6.5px] text-slate-500"
              >
                <span>{r[0]}</span>
                <span>{r[1]}</span>
                <span className="text-right font-semibold" style={{ color: BLUE }}>
                  {r[2]}
                </span>
                <span className="text-right text-slate-400">{r[3]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* スマホ画面内 */
function PhoneScreen() {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-1">
          <span className="block h-2 w-2 rounded-full" style={{ background: BLUE }} />
          <span className="text-[6px] font-bold" style={{ color: NAVY }}>
            AssetSync
          </span>
        </div>
        <span className="h-2 w-2 rounded-full bg-slate-200" />
      </div>
      <div className="space-y-1.5 p-2">
        <p className="text-[6px] font-bold text-slate-500">加入中の保険／積立情報</p>
        <div className="rounded-md p-2 text-white" style={{ background: BLUE }}>
          <p className="text-[7px] font-bold">メディケア医療保険</p>
          <div className="mt-1 flex items-end justify-between">
            <span className="rounded bg-white/20 px-1 text-[5px]">月額</span>
            <span className="text-[12px] font-black leading-none">¥12,000</span>
          </div>
        </div>
        <p className="text-[6px] font-bold text-slate-500">推奨プラン・アドバイスカード</p>
        <div className="rounded-md bg-slate-50 p-2">
          <p className="text-[6.5px] font-bold leading-snug" style={{ color: NAVY }}>
            積立額の見直しを
            <br />
            ご検討ください
          </p>
          <p className="mt-0.5 text-[5px] leading-tight text-slate-400">
            収益・年齢の状況を踏まえ、最適な積立額をご提案します。
          </p>
          <span
            className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[6px] font-bold text-white"
            style={{ background: NAVY }}
          >
            シミュレーションしてみる
          </span>
        </div>
      </div>
    </div>
  );
}

/* タブレット+スマホ デバイスモックアップ（CSS製） */
function DeviceMockup({ card }: { card: boolean }) {
  // card のときは縮尺を落として収める
  const scale = card ? "scale-[0.42] origin-top-left" : "";
  return (
    <div className={card ? "relative h-32 overflow-hidden" : "flex justify-end"}>
      {/* tablet-sized anchor box so the phone stays glued to the tablet's edge */}
      <div className={`relative w-[420px] ${scale}`}>
        {/* Tablet */}
        <div
          className="w-full rounded-[1.6rem] bg-slate-900 p-2.5 shadow-[0_30px_60px_-15px_rgba(28,48,88,0.45)]"
          style={{ transform: "perspective(1400px) rotateY(-9deg) rotateX(3deg)" }}
        >
          <div className="aspect-[4/3] overflow-hidden rounded-[1rem] bg-white">
            <DashboardScreen />
          </div>
        </div>

        {/* Phone (front-left, overlapping the tablet) */}
        <div
          className="absolute -bottom-8 left-2 w-[128px] rounded-[1.4rem] bg-slate-900 p-1.5 shadow-[0_24px_48px_-12px_rgba(28,48,88,0.5)]"
          style={{ transform: "perspective(1200px) rotateY(9deg)" }}
        >
          {/* notch */}
          <div className="absolute left-1/2 top-1.5 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-900" />
          <div className="aspect-[9/19] overflow-hidden rounded-[1.05rem] bg-white">
            <PhoneScreen />
          </div>
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

      <div className={`mx-auto w-full max-w-6xl ${card ? "px-4 pb-4" : "px-6 pb-20 sm:px-10"}`}>
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
            card
              ? "grid-cols-[1fr_1fr] gap-2"
              : "grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr]"
          }`}
        >
          <div className={card ? "space-y-1.5" : "space-y-7"}>
            <h1
              className={`font-black leading-[1.3] tracking-tight ${
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
                card
                  ? "text-[8px] leading-snug"
                  : "max-w-md text-base leading-loose sm:text-lg"
              }`}
            >
              収益、オフィス、保険など、企業のすべての資産をひとつに。AssetSyncは、戦略的な投資判断と従業員支援を同時に実現する、次世代の資産管理プラットフォームです。
            </p>

            <div className={`flex items-center ${card ? "gap-1.5 pt-0.5" : "gap-4 pt-1"}`}>
              <span
                className={`inline-flex items-center justify-center rounded-md border font-bold ${
                  card ? "px-2 py-1 text-[8px]" : "px-8 py-3.5 text-sm sm:text-base"
                }`}
                style={{ borderColor: NAVY, color: NAVY }}
              >
                資料ダウンロード
              </span>
              <span
                className={`inline-flex items-center justify-center rounded-md font-bold text-white ${
                  card ? "px-2 py-1 text-[8px]" : "px-8 py-3.5 text-sm sm:text-base"
                }`}
                style={{ background: BLUE }}
              >
                お問い合わせ
              </span>
            </div>
          </div>

          {/* 右: デバイスモックアップ */}
          <div className={card ? "" : "pl-2"}>
            <DeviceMockup card={card} />
          </div>
        </div>
      </div>
    </section>
  );
}
