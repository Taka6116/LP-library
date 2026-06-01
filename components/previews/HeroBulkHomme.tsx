"use client";
import { useState, useEffect, useCallback, type MouseEvent } from "react";
import { isCard, type SharedPreviewProps } from "./_shared";
import { asset } from "@/lib/asset";

// BULK HOMME — トップ ファーストビュー カルーセル
// https://bulk.co.jp/
// KV画像にコピー・ボタンが焼き込み済みなので、画像をそのまま回す
// カルーセル + 白ヘッダー（ロゴ/ナビ/カート）+ 矢印 + ドット で再現。

// 画像パスはフォルダ名・ファイル名に日本語/空白を含むため各セグメントをエンコード
function kv(file: string): string {
  return asset(`/${["バルクオム", file].map(encodeURIComponent).join("/")}`);
}

const SLIDES = [
  { file: "EC_RN_PC_THE HAROIL_KV_re.jpg",        alt: "THE HAIR OIL — ベタつかないのに、自然なツヤとまとまり。" },
  { file: "EC_RN_PC_THE FACEWASH_KV_re.jpg",      alt: "THE FACE WASH — 濃密泡に溺れる体験が心地よすぎて癖になる。" },
  { file: "EC_RN_PC_THE REPAIR LOTION_KV2_re.jpg", alt: "THE REPAIR LOTION" },
  { file: "EC_RN_PC_THE SHAVING FOAM_KV2_re.jpg", alt: "THE SHAVING FOAM — いつもの髭剃りが、スキンケアに変わる。" },
];

const NAV = ["ABOUT US", "定期コース一覧", "製品一覧", "お問い合わせ"];

function Logo({ card }: { card: boolean }) {
  return (
    <div className="flex items-baseline gap-1 leading-none" style={{ color: "#1a1a1a" }}>
      <span className={`font-extrabold tracking-wider ${card ? "text-[9px]" : "text-2xl"}`}>BULK</span>
      <span className={`font-light tracking-[0.2em] ${card ? "text-[9px]" : "text-2xl"}`}>HOMME</span>
    </div>
  );
}

export function HeroBulkHomme({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  const [active, setActive] = useState(0);
  const n = SLIDES.length;

  const go = useCallback(
    (i: number, e?: MouseEvent) => {
      // Prevent the parent SectionPatternCard from treating arrow/dot clicks
      // as a "select this section" action.
      e?.stopPropagation();
      setActive(((i % n) + n) % n);
    },
    [n],
  );

  // Auto-advance (full variant only)
  useEffect(() => {
    if (card) return;
    const id = setInterval(() => setActive((p) => (p + 1) % n), 5000);
    return () => clearInterval(id);
  }, [card, n]);

  return (
    <section className="w-full bg-white" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* ════════ HEADER ════════ */}
      {/* Top row: LOGIN | logo | CART / MENU */}
      <div className={`flex items-center justify-between ${card ? "px-3 py-1.5" : "px-8 py-3"}`}>
        {/* LOGIN */}
        <div className="flex flex-col items-center" style={{ color: "#1a1a1a" }}>
          <span className={card ? "text-[9px]" : "text-lg"} aria-hidden>👤</span>
          <span className={`font-medium tracking-wide ${card ? "text-[5px]" : "text-[10px]"}`}>LOGIN</span>
        </div>

        {/* Logo (center) */}
        <Logo card={card} />

        {/* CART / MENU */}
        <div className={`flex items-start ${card ? "gap-1.5" : "gap-5"}`} style={{ color: "#1a1a1a" }}>
          <div className="flex flex-col items-center">
            <span className={card ? "text-[9px]" : "text-lg"} aria-hidden>🛒</span>
            <span className={`font-medium tracking-wide ${card ? "text-[5px]" : "text-[10px]"}`}>CART</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`leading-none ${card ? "text-[8px]" : "text-base"}`} aria-hidden>≡</span>
            <span className={`font-medium tracking-wide ${card ? "text-[5px]" : "text-[10px]"}`}>MENU</span>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <div
        className={`flex items-center justify-center border-t border-b border-slate-200 ${card ? "gap-0 py-1" : "gap-0 py-3"}`}
      >
        {NAV.map((item, i) => (
          <div key={item} className="flex items-center">
            <span
              className={`cursor-pointer font-bold tracking-wide text-slate-800 transition hover:text-slate-500 ${
                card ? "px-2 text-[5.5px]" : "px-10 text-sm"
              }`}
            >
              {item}
            </span>
            {i < NAV.length - 1 && (
              <span className={`text-slate-300 ${card ? "text-[6px]" : "text-base"}`}>|</span>
            )}
          </div>
        ))}
      </div>

      {/* ════════ CAROUSEL ════════ */}
      <div className="relative w-full overflow-hidden">
        {/* Slides — first image defines height, rest stacked absolute */}
        <div className="relative w-full">
          {SLIDES.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.file}
              src={kv(s.file)}
              alt={s.alt}
              className={
                i === 0
                  ? `block w-full transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`
                  : `absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      i === active ? "opacity-100" : "opacity-0"
                    }`
              }
              style={i === 0 ? undefined : { pointerEvents: "none" }}
              draggable={false}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        {!card && (
          <>
            <button
              type="button"
              aria-label="前のスライド"
              onClick={(e) => go(active - 1, e)}
              className="group absolute left-0 top-1/2 z-10 -translate-y-1/2 px-4 py-6"
            >
              <svg width="22" height="40" viewBox="0 0 22 40" fill="none" aria-hidden
                   className="opacity-60 transition group-hover:opacity-100">
                <path d="M18 4 L5 20 L18 36" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="次のスライド"
              onClick={(e) => go(active + 1, e)}
              className="group absolute right-0 top-1/2 z-10 -translate-y-1/2 px-4 py-6"
            >
              <svg width="22" height="40" viewBox="0 0 22 40" fill="none" aria-hidden
                   className="opacity-60 transition group-hover:opacity-100">
                <path d="M4 4 L17 20 L4 36" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Card variant: simple static chevrons (decorative) */}
        {card && (
          <>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-700/70">‹</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-700/70">›</span>
          </>
        )}

        {/* Dots */}
        <div
          className={`absolute left-1/2 z-10 flex -translate-x-1/2 items-center ${
            card ? "bottom-1 gap-1" : "bottom-5 gap-2.5"
          }`}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`スライド ${i + 1}`}
              onClick={(e) => go(i, e)}
              className={`rounded-full transition ${card ? "h-1 w-1" : "h-2.5 w-2.5"} ${
                i === active ? "" : "opacity-100"
              }`}
              style={{ background: i === active ? "#3a3a3a" : "#c8c8c8" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
