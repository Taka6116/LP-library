import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// ASHIATO — 活躍の足跡を可視化する。
// https://ashiatohr.com/
//
// Layout:
//   [NAV]  white bg — logo | links | CTA×2
//   [HERO] blue gradient — left: hero.webp full-height | right: copy + CTA×2
//   [BAR]  award badge (large) | yellow strip full-width

const YELLOW = "#ffd600";
const EN_GRN = "#009a44";

export function HeroAshiato({ variant }: SharedPreviewProps) {
  const card = isCard(variant);

  /* ─────────── CARD VARIANT (thumbnail) ─────────── */
  if (card) {
    return (
      <section
        className="relative w-full overflow-hidden font-sans"
        style={{ background: `linear-gradient(112deg, #2247c9 0%, #2a57db 48%, #3a73f2 100%)`, fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {/* Swoosh */}
        <div aria-hidden className="pointer-events-none absolute" style={{ left: "26%", top: 0, bottom: 0, width: "55%", background: "rgba(255,255,255,0.04)", borderRadius: "0 0 60% 40% / 0 0 100% 80%", transform: "rotate(-8deg) translateX(-10%)" }} />

        {/* Nav (card) */}
        <div className="relative z-10 flex items-center justify-between px-3 py-1.5 border-b border-white/15">
          <div className="flex items-center gap-1">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded text-[5px] font-black text-white" style={{ background: EN_GRN }}>en</span>
            <span className="text-[8px] font-black text-white tracking-wide">ASHIATO</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="rounded-full border border-white px-1.5 py-0.5 text-[6px] font-semibold text-white">お問い合わせ</span>
            <span className="rounded-full px-1.5 py-0.5 text-[6px] font-bold text-slate-900" style={{ background: "#fff" }}>資料DL</span>
          </div>
        </div>

        {/* Main */}
        <div className="relative z-10 flex items-center gap-1 px-2 py-2" style={{ minHeight: 130 }}>
          <div className="flex w-[48%] items-end justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/ashiato/hero.webp")} alt="" className="h-[115px] w-auto object-contain" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5 pl-1">
            <div className="flex items-center gap-1">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded text-[5px] font-black text-white" style={{ background: EN_GRN }}>en</span>
              <span className="text-[6.5px] text-white/85">のリファレンスチェックサービス</span>
            </div>
            <p className="text-[14px] font-black leading-tight text-white">活躍の足跡を<br />可視化する。</p>
            <span className="w-full rounded-full py-1 text-center text-[7px] font-bold text-slate-900" style={{ background: YELLOW }}>資料ダウンロード ↓</span>
            <span className="w-full rounded-full border border-white py-1 text-center text-[7px] font-semibold text-white">お問い合わせ</span>
          </div>
        </div>

        {/* Bottom award row — on blue bg */}
        <div className="relative z-10 flex items-center gap-1 px-3 pb-2 pt-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/ashiato/award.webp")} alt="BOXIL SaaS AWARD" className="relative z-10 h-9 w-auto flex-shrink-0 object-contain" style={{ marginRight: -4 }} />
          <span className="text-[6px] text-white/60">※</span>
          <span
            className="flex flex-1 items-center justify-center py-1 text-[6.5px] font-bold text-slate-900"
            style={{
              background: YELLOW,
              clipPath: "polygon(0 0, 100% 0, calc(100% - 7px) 50%, 100% 100%, 0 100%, 7px 50%)",
              paddingLeft: 12,
              paddingRight: 12,
            }}
          >
            リリース3周年で導入企業 5000社突破！
          </span>
        </div>
      </section>
    );
  }

  /* ─────────── FULL VARIANT ─────────── */
  return (
    <section
      className="w-full overflow-hidden font-sans"
      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      {/* ══ NAV BAR — white background ══ */}
      <nav className="flex items-center justify-between bg-white px-10 py-3.5 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-black text-white"
            style={{ background: EN_GRN }}
          >
            en
          </span>
          <span className="text-xl font-black tracking-wide" style={{ color: "#13348f" }}>
            ASHIATO
          </span>
        </div>

        {/* Links — pipe separators between first group */}
        <div className="flex items-center gap-5 text-sm font-bold text-slate-700">
          {["メリット", "料金", "導入事例", "バックグラウンドチェック"].map((t) => (
            <span key={t} className="cursor-pointer hover:text-blue-700">{t}</span>
          ))}
          <span className="text-slate-300">|</span>
          <span className="flex cursor-pointer items-center gap-1 hover:text-blue-700">お役立ち情報 <span className="text-[10px]">∨</span></span>
          <span className="flex cursor-pointer items-center gap-1 hover:text-blue-700"><span aria-hidden>👤</span>ログイン</span>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2.5">
          <span className="cursor-pointer rounded-full border border-blue-700 px-5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
            お問い合わせ
          </span>
          <span className="cursor-pointer rounded-full bg-blue-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
            資料ダウンロード
          </span>
        </div>
      </nav>

      {/* ══ HERO BODY — bright blue gradient ══ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(112deg, #2247c9 0%, #2a57db 48%, #3a73f2 100%)`,
          minHeight: 540,
        }}
      >
        {/* Decorative lighter-blue swoosh wave behind illustration */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: "8%",
            top: "20%",
            width: "62%",
            height: "70%",
            background: "rgba(120,165,255,0.22)",
            borderRadius: "44% 56% 60% 40% / 48% 42% 58% 52%",
            filter: "blur(2px)",
            transform: "rotate(-6deg)",
          }}
        />
        {/* subtle dot texture on right */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.5px)",
            backgroundSize: "14px 14px",
            maskImage: "linear-gradient(105deg, transparent 55%, black 100%)",
            WebkitMaskImage: "linear-gradient(105deg, transparent 55%, black 100%)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1200px] items-stretch pb-20">

          {/* LEFT — illustration, bottom-aligned */}
          <div className="flex w-[54%] flex-shrink-0 items-end justify-center pb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/ashiato/hero.webp")}
              alt="ASHIATOサービスイメージ"
              className="w-full max-w-[660px] object-contain"
              style={{ marginBottom: 0 }}
            />
          </div>

          {/* RIGHT — copy + CTA */}
          <div className="flex flex-1 flex-col justify-center gap-5 py-12 pl-6 pr-10">

            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-xs font-black text-white"
                style={{ background: EN_GRN }}
              >
                en
              </span>
              <span className="text-sm font-medium text-white">
                のリファレンスチェックサービス
              </span>
            </div>

            {/* H1 */}
            <h1
              className="font-black leading-[1.15] text-white"
              style={{ fontSize: "clamp(2.4rem, 4vw, 3.4rem)" }}
            >
              活躍の足跡を
              <br />
              可視化する。
            </h1>

            {/* Body */}
            <p className="max-w-[360px] text-sm leading-relaxed text-white/85">
              ASHIATO（アシアト）は、候補者の現職や前職の上司・同僚からのレビューで過去の活躍ぶりを可視化、貴社にフィットする人材の採用をサポートするエングループの新しいリファレンスチェックサービスです。
            </p>

            {/* CTA ① — yellow pill with doc thumbnail */}
            <div className="flex max-w-[380px] flex-col gap-3">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center overflow-hidden rounded-full transition hover:brightness-95"
                style={{ background: YELLOW, height: 60 }}
              >
                {/* Doc thumbnail */}
                <span
                  className="flex h-full flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
                  style={{ width: 72, background: "rgba(0,0,0,0.08)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset("/ashiato/download.webp")}
                    alt=""
                    aria-hidden
                    className="h-11 w-auto object-contain"
                  />
                </span>
                <span className="flex-1 text-center text-base font-bold text-slate-900">
                  資料ダウンロード　↓
                </span>
              </button>

              {/* CTA ② — white outline pill */}
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-center rounded-full border-2 border-white transition hover:bg-white/10"
                style={{ height: 56 }}
              >
                <span className="text-base font-semibold text-white">
                  お問い合わせ
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ══ BOTTOM AWARD ROW — sits directly on blue background ══ */}
        <div className="absolute bottom-5 left-0 right-0 z-20">
          <div className="mx-auto flex max-w-[1200px] items-center pl-[31%] pr-2">
            {/* Award badge — large, overlaps ribbon left edge */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/ashiato/award.webp")}
              alt="BOXIL SaaS AWARD 2025 部門1位 BOXILセクション"
              className="relative z-10 h-[88px] w-auto flex-shrink-0 object-contain drop-shadow-md"
              style={{ marginRight: -10 }}
            />
            <span className="mx-2 text-sm font-bold text-white/70">※</span>

            {/* Yellow RIBBON banner — fishtail notched ends */}
            <div
              className="flex flex-1 items-center justify-center py-3 text-base font-bold text-slate-900"
              style={{
                background: YELLOW,
                clipPath:
                  "polygon(0 0, 100% 0, calc(100% - 16px) 50%, 100% 100%, 0 100%, 16px 50%)",
                paddingLeft: 28,
                paddingRight: 28,
              }}
            >
              リリース3周年で導入企業 5000社突破！
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
