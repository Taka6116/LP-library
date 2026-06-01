import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// ASHIATO — 活躍の足跡を可視化する。
// 青グラデーション全幅ヒーロー + 左:isometricイラスト + 右:テキスト+CTA + 底:受賞バー
// https://ashiatohr.com/
//
// Design tokens:
//   color.surface.strong  = #ffd600  → 黄色CTA
//   color.text.tertiary   = #1e40ca  → blue accent
//   color.border.muted    = #ffffff  → white elements
//   font.family.primary   = Noto Sans JP
//   radius.lg             = 100px    → pill buttons
//   radius.md             = 39px     → badge radius

const BLUE_L  = "#1535b5";   // left-side dark navy blue
const BLUE_R  = "#2d6df0";   // right-side bright blue
const YELLOW  = "#ffd600";   // color.surface.strong → primary CTA
const WHITE   = "#ffffff";
const EN_GRN  = "#009a44";   // "en" brand green

export function HeroAshiato({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  return (
    <section
      className={`relative w-full overflow-hidden font-sans ${card ? "" : ""}`}
      style={{
        background: `linear-gradient(110deg, ${BLUE_L} 0%, #1d4fd8 45%, ${BLUE_R} 100%)`,
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      {/* ── Decorative wave swoosh ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: card ? "28%" : "30%",
          top: 0,
          bottom: 0,
          width: card ? "55%" : "60%",
          background: "rgba(255,255,255,0.04)",
          borderRadius: "0 0 60% 40% / 0 0 100% 80%",
          transform: "rotate(-8deg) translateX(-10%)",
        }}
      />

      {/* ═══════════ NAV BAR (full only) ═══════════ */}
      {!card && (
        <nav
          className="relative z-10 flex items-center justify-between px-10 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white"
              style={{ background: EN_GRN }}
            >
              en
            </span>
            <span className="text-lg font-black tracking-wide text-white">ASHIATO</span>
          </div>

          {/* Nav links */}
          <div className="hidden items-center gap-6 text-sm font-medium text-white/90 lg:flex">
            {["メリット", "料金", "導入事例", "バックグラウンドチェック", "お役立ち情報"].map((t) => (
              <span key={t} className="cursor-pointer hover:text-white">{t}</span>
            ))}
            <span className="ml-2 cursor-pointer text-white/70 hover:text-white">ログイン</span>
          </div>

          {/* Nav CTAs */}
          <div className="flex items-center gap-3">
            <span
              className="cursor-pointer rounded-full border border-white px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              お問い合わせ
            </span>
            <span
              className="cursor-pointer rounded-full px-5 py-1.5 text-sm font-bold text-slate-900"
              style={{ background: WHITE }}
            >
              資料ダウンロード
            </span>
          </div>
        </nav>
      )}

      {/* ═══════════ MAIN HERO BODY ═══════════ */}
      <div
        className={`relative z-10 flex items-center ${
          card
            ? "min-h-[160px] gap-2 px-3 py-3"
            : "min-h-[520px] gap-0 px-8 sm:px-12 lg:px-16 py-6"
        }`}
      >
        {/* LEFT — hero illustration */}
        <div
          className={`flex-shrink-0 ${
            card ? "w-[48%]" : "w-[52%]"
          } flex items-end justify-center`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/ashiato/hero.webp")}
            alt="ASHIATOサービスイメージ"
            className={card ? "h-[140px] w-auto object-contain" : "h-[460px] w-auto max-w-full object-contain drop-shadow-xl"}
          />
        </div>

        {/* RIGHT — text + CTA */}
        <div
          className={`flex flex-col ${
            card ? "flex-1 gap-1.5 pl-2" : "flex-1 gap-5 pl-8 sm:pl-12"
          }`}
        >
          {/* Eyebrow */}
          <div className={`flex items-center gap-1.5 ${card ? "" : ""}`}>
            <span
              className={`flex items-center justify-center rounded-full font-black text-white ${
                card ? "h-4 w-4 text-[6px]" : "h-7 w-7 text-xs"
              }`}
              style={{ background: EN_GRN }}
            >
              en
            </span>
            <span
              className={`font-medium text-white/90 ${card ? "text-[7px]" : "text-sm"}`}
            >
              のリファレンスチェックサービス
            </span>
          </div>

          {/* H1 */}
          <h1
            className={`font-black leading-tight text-white ${
              card ? "text-[15px]" : "text-[2.6rem] sm:text-[3.25rem] leading-[1.2]"
            }`}
          >
            活躍の足跡を
            {card ? " " : <br />}
            可視化する。
          </h1>

          {/* Body copy (full only) */}
          {!card && (
            <p className="max-w-md text-sm leading-relaxed text-white/85">
              ASHIATO（アシアト）は、候補者の現職や前職の上司・同僚からのレビューで過去の活躍ぶりを可視化、貴社にフィットする人材の採用をサポートするエングループの新しいリファレンスチェックサービスです。
            </p>
          )}

          {/* CTAs */}
          <div
            className={`flex flex-col ${
              card ? "gap-1 mt-0.5" : "gap-3 mt-1 max-w-xs"
            }`}
          >
            {/* Primary: yellow pill */}
            <span
              className={`flex cursor-pointer items-center justify-center font-bold text-slate-900 transition hover:brightness-95 ${
                card
                  ? "rounded-full px-3 py-1 text-[7px] gap-1"
                  : "rounded-full px-8 py-3.5 text-base gap-3 shadow-lg"
              }`}
              style={{ background: YELLOW }}
            >
              {!card && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset("/ashiato/download.webp")}
                  alt=""
                  className="h-8 w-8 object-contain"
                  aria-hidden
                />
              )}
              資料ダウンロード
              <span className={card ? "" : "text-lg"}>↓</span>
            </span>

            {/* Secondary: white outline pill */}
            <span
              className={`flex cursor-pointer items-center justify-center font-semibold text-white transition hover:bg-white/10 ${
                card
                  ? "rounded-full border border-white px-3 py-1 text-[7px]"
                  : "rounded-full border-2 border-white px-8 py-3 text-base"
              }`}
            >
              お問い合わせ
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════ BOTTOM AWARD BAR (full only) ═══════════ */}
      {!card && (
        <div
          className="relative z-10 flex items-center gap-4 px-16 py-3"
          style={{ background: "rgba(0,0,0,0.18)" }}
        >
          {/* Award badge */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/ashiato/award.webp")}
            alt="BOXIL SaaS AWARD 2025 専門1位"
            className="h-14 w-auto object-contain"
          />
          <span className="text-sm font-bold" style={{ color: YELLOW }}>
            ※
          </span>
          {/* Social proof strip */}
          <div
            className="flex flex-1 items-center justify-center rounded-full py-2 px-6 text-sm font-bold text-slate-900"
            style={{ background: YELLOW }}
          >
            リリース3周年で導入企業 5000社突破！
          </div>
        </div>
      )}

      {/* Card bottom bar */}
      {card && (
        <div
          className="relative z-10 flex items-center gap-1.5 px-3 py-1.5"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset("/ashiato/award.webp")}
            alt="BOXIL SaaS AWARD"
            className="h-5 w-auto object-contain"
          />
          <span
            className="flex-1 rounded-full py-0.5 px-2 text-center text-[6.5px] font-bold text-slate-900"
            style={{ background: YELLOW }}
          >
            リリース3周年で導入企業 5000社突破！
          </span>
        </div>
      )}
    </section>
  );
}
