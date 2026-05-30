"use client";

import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// HERP Trust（ハープトラスト）— リファレンスチェック LP ファーストビュー
// 白基調・フラット。ブランドブルー #0060e6、本文 #333、ヒラギノ角ゴ（font-sans に内包）。
// 左: 訴求コピー+CTA / 中央: ノートPC素材(saaslp3.webp) / 右: 資料ダウンロード入力フォーム。
const BLUE = "#0060e6";
const BLUE_DARK = "#0052c4";
const INK = "#1a1a1a";
const BODY = "#333333";
const MUTE = "#656565";

const NAV = ["料金プラン", "選ばれる理由", "よくある質問"];
const LOGOS = [
  "DENTSU DIGITAL",
  "MACROMILL",
  "PERSOL",
  "Fujikura",
  "17LIVE",
  "Money Forward",
  "AnyMind",
  "Akatsuki",
];

function Logo({ card }: { card: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`relative grid place-items-center rounded-[5px] bg-[#1a1a1a] ${
          card ? "h-4 w-4" : "h-7 w-7"
        }`}
      >
        <span
          className={`block rotate-45 rounded-[1px] bg-[#0060e6] ${
            card ? "h-1.5 w-1.5" : "h-2.5 w-2.5"
          }`}
        />
      </span>
      <span className="leading-none">
        <span
          className={`block font-bold tracking-tight ${card ? "text-[11px]" : "text-lg"}`}
          style={{ color: INK }}
        >
          HERP Trust
        </span>
        {!card && (
          <span className="block text-[10px] tracking-wide" style={{ color: MUTE }}>
            ハープトラスト
          </span>
        )}
      </span>
    </div>
  );
}

/* アワード/実績バッジ（提供素材: ITreview LEADER + 月桂樹 + 2,000社以上） */
function Awards({ card }: { card: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset("/award-2000.webp")}
      alt="ITreview LEADER 2025 Winter／シリーズ累計導入実績 2,000社以上"
      className={`w-auto ${card ? "h-6" : "h-16"}`}
    />
  );
}

/* 入力フィールド（label 紐付け・focus-visible 等の状態を定義） */
function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[13px] font-bold" style={{ color: BODY }}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-[#333] transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus-visible:border-[#0060e6] focus-visible:ring-2 focus-visible:ring-[#0060e6]/30 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  );
}

/* 資料ダウンロード フォーム */
function LeadForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="資料ダウンロード フォーム"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]"
    >
      <div className="mb-4 flex items-center gap-3">
        {/* 資料カバーのサムネイル（CSS） */}
        <div className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded border border-slate-200 bg-[#f9f9f9]">
          <div className="space-y-0.5 px-1.5">
            <span className="block h-0.5 w-8 rounded-full" style={{ background: BLUE }} />
            <span className="block h-0.5 w-10 rounded-full bg-slate-300" />
            <span className="block h-0.5 w-7 rounded-full bg-slate-300" />
            <span className="mt-0.5 block h-2 w-10 rounded-sm bg-[#0060e6]/15" />
          </div>
        </div>
        <div className="leading-tight">
          <p className="text-[11px]" style={{ color: MUTE }}>
            料金・機能・事例がわかる
          </p>
          <p className="text-base font-bold" style={{ color: INK }}>
            今すぐ資料ダウンロード
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Field id="herp-sei" label="姓" placeholder="例) 採用" autoComplete="family-name" />
          <Field id="herp-mei" label="名" placeholder="例) 太郎" autoComplete="given-name" />
        </div>
        <Field
          id="herp-company"
          label="会社名"
          placeholder="例) 株式会社HERP"
          autoComplete="organization"
        />
        <Field
          id="herp-email"
          label="法人メールアドレス"
          type="email"
          inputMode="email"
          placeholder="例) taro.saiyo@herp.co.jp"
          autoComplete="email"
        />
        <Field
          id="herp-tel"
          label="日中繋がりやすい電話番号"
          type="tel"
          inputMode="tel"
          placeholder="例) 08012345678"
          autoComplete="tel"
        />

        <button
          type="submit"
          className="w-full rounded-md py-3 text-sm font-bold text-white transition-colors hover:bg-[#0052c4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0060e6]/50 focus-visible:ring-offset-2 active:bg-[#0049ad]"
          style={{ background: BLUE }}
        >
          今すぐ資料ダウンロード
        </button>

        <p className="text-[11px] leading-relaxed" style={{ color: MUTE }}>
          <span className="font-semibold" style={{ color: BLUE }}>
            プライバシーポリシー
          </span>
          と
          <span className="font-semibold" style={{ color: BLUE }}>
            個人情報の取り扱い
          </span>
          に同意の上、申し込みしたものとみなします。
        </p>
      </div>
    </form>
  );
}

export function HeroHerpTrust({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  /* ---- コンパクト（サムネイル）表示 ---- */
  if (card) {
    return (
      <section className="w-full bg-white font-sans" style={{ color: BODY }}>
        <div className="px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <Logo card />
            <span
              className="rounded px-1.5 py-0.5 text-[7px] font-bold text-white"
              style={{ background: BLUE }}
            >
              資料・デモをダウンロード
            </span>
          </div>
          <div className="grid grid-cols-[1.1fr_1fr] gap-2">
            <div className="space-y-1">
              <p className="text-[7px] font-bold" style={{ color: INK }}>
                オンライン完結型リファレンスチェック
              </p>
              <p className="text-sm font-bold leading-tight" style={{ color: INK }}>
                リファレンスチェック
                <br />
                月額1.5万円〜
              </p>
              <span
                className="inline-block rounded px-2 py-0.5 text-[8px] font-bold text-white"
                style={{ background: BLUE }}
              >
                今すぐ資料ダウンロード
              </span>
              <div className="pt-0.5">
                <Awards card />
              </div>
            </div>
            {/* mini form */}
            <div className="rounded border border-slate-200 bg-white p-1.5">
              <p className="mb-1 text-[6px] font-bold" style={{ color: INK }}>
                今すぐ資料ダウンロード
              </p>
              <div className="space-y-1">
                <span className="block h-2 rounded-sm bg-slate-100" />
                <span className="block h-2 rounded-sm bg-slate-100" />
                <span className="block h-2 rounded-sm bg-slate-100" />
                <span
                  className="block h-2.5 rounded-sm"
                  style={{ background: BLUE }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---- フル表示 ---- */
  return (
    <section className="w-full bg-white font-sans" style={{ color: BODY }}>
      <div className="mx-auto w-full max-w-6xl px-6 pb-12 sm:px-10">
        {/* NAV */}
        <nav className="flex items-center justify-between border-b border-slate-100 py-4">
          <Logo card={false} />
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-6 text-sm font-bold lg:flex" style={{ color: INK }}>
              {NAV.map((n) => (
                <span key={n} className="cursor-default transition-colors hover:text-[#0060e6]">
                  {n}
                </span>
              ))}
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" />
                </svg>
                ログイン
              </span>
            </div>
            <span
              className="rounded-md px-4 py-2.5 text-sm font-bold text-white"
              style={{ background: BLUE }}
            >
              資料・デモをダウンロード
            </span>
          </div>
        </nav>

        {/* BODY — 大きなノートPCの右端にフォームが重なる構成 */}
        <div className="relative pt-10 lg:min-h-[580px]">
          {/* コピー（左・通常フロー） */}
          <div className="space-y-5 lg:max-w-[440px]">
            <p className="text-sm font-bold leading-relaxed" style={{ color: INK }}>
              オンライン完結型リファレンスチェックツール
              <br />
              「HERP Trust（ハープトラスト）」
            </p>
            <h1
              className="text-[2.1rem] font-bold leading-[1.3] tracking-tight sm:text-[2.4rem]"
              style={{ color: INK }}
            >
              リファレンスチェック
              <br />
              月額1.5万円〜
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: MUTE }}>
              HERP Trust（ハープトラスト）は、候補者の入社後の活躍を予測する新しい評価軸を、オンラインでスピーディーに取得できるリファレンスチェックです。
            </p>

            <div className="space-y-3 pt-1">
              <span
                className="flex w-full flex-col items-center justify-center rounded-md py-3.5 text-white shadow-sm"
                style={{ background: BLUE }}
              >
                <span className="text-xs font-normal opacity-90">
                  ＼ 料金・機能・事例がわかる ／
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-lg font-bold">
                  今すぐ資料ダウンロード
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
              <span
                className="flex w-full items-center justify-center gap-2 rounded-md border-2 bg-white py-3.5 text-base font-bold"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                オンラインデモ体験
                <span aria-hidden>→|</span>
              </span>
            </div>

            <div className="pt-3">
              <Awards card={false} />
            </div>
          </div>

          {/* ノートPC素材（大きく・フォームの背面に回り込む） */}
          <div className="mt-10 lg:absolute lg:right-2 lg:top-6 lg:mt-0 lg:w-[620px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/saaslp3.webp")}
              alt="HERP Trust のリファレンスチェック結果ダッシュボード"
              className="w-full object-contain drop-shadow-xl"
            />
          </div>

          {/* 入力フォーム（PC右端に重ねる） */}
          <div className="mt-8 lg:absolute lg:right-0 lg:top-0 lg:z-10 lg:mt-0 lg:w-[360px]">
            <LeadForm />
          </div>
        </div>

        {/* 導入企業ロゴ */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {LOGOS.map((l) => (
              <span
                key={l}
                className="text-sm font-bold tracking-wide text-slate-400"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
