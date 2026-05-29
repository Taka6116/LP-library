import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// AssetSync — SaaS系LP ファーストビュー（実デザイン踏襲）
// 白基調・上部ネイビーバー・Latoフォント。ネイビー見出し(#1c3058)、
// アクセント青(#245fb2)。右側は提供素材 saas-hero.webp（タブレット+スマホ）。
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
              ? "grid-cols-[1fr_1fr] gap-3"
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

          {/* 右: 提供素材のデバイスモックアップ */}
          <div className={card ? "" : "pl-2"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/saas-hero.webp")}
              alt="AssetSync ダッシュボードのデバイスモックアップ"
              className={`ml-auto w-full object-contain ${card ? "max-w-[150px]" : "max-w-xl"}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
