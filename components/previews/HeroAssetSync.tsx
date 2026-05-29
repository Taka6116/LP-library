import { isCard, type SharedPreviewProps } from "./_shared";

// AssetSync — SaaS系LP ファーストビュー
// 黒基調(surface.base #000000)・Latoフォントを踏襲した SaaS ヒーロー。
// ナビ + 見出し + サブコピー + CTA + ダッシュボード風ビジュアルで構成。
// 配色トークン: text.inverse #ffffff / tertiary(accent) #245fb2 / surface.raised #1d325b。
const ACCENT = "#245fb2";
const RAISED = "#1d325b";

const NAV = ["Product", "Solutions", "Pricing", "Resources"];

export function HeroAssetSync({ variant }: SharedPreviewProps) {
  const card = isCard(variant);
  return (
    <section
      className={`relative w-full overflow-hidden bg-black font-lato text-white ${
        card ? "px-5 py-6" : "px-6 py-10 sm:px-10 sm:py-16"
      }`}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: ACCENT }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Nav */}
        <nav
          className={`flex items-center justify-between ${card ? "mb-4" : "mb-12"}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`grid place-items-center rounded-md font-black text-white ${
                card ? "h-5 w-5 text-[10px]" : "h-8 w-8 text-base"
              }`}
              style={{ background: ACCENT }}
            >
              A
            </span>
            <span className={`font-bold ${card ? "text-xs" : "text-lg"}`}>
              AssetSync
            </span>
          </div>

          {!card && (
            <div className="hidden items-center gap-7 text-sm text-white/70 md:flex">
              {NAV.map((item) => (
                <span key={item} className="transition hover:text-white">
                  {item}
                </span>
              ))}
            </div>
          )}

          <div className={`flex items-center ${card ? "gap-1.5" : "gap-3"}`}>
            {!card && (
              <span className="text-sm font-medium text-white/80">Sign in</span>
            )}
            <span
              className={`inline-flex items-center justify-center rounded-full font-bold text-white ${
                card ? "px-2.5 py-1 text-[9px]" : "px-5 py-2 text-sm"
              }`}
              style={{ background: ACCENT }}
            >
              Get started
            </span>
          </div>
        </nav>

        {/* Hero body */}
        <div
          className={`grid items-center ${
            card ? "grid-cols-[1.1fr_1fr] gap-3" : "grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr]"
          }`}
        >
          <div className={card ? "space-y-2" : "space-y-6"}>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${
                card ? "px-2 py-0.5 text-[8px]" : "px-3 py-1 text-xs"
              }`}
              style={{ borderColor: `${ACCENT}66`, color: "#9ec1ef" }}
            >
              <span
                className={card ? "h-1 w-1 rounded-full" : "h-1.5 w-1.5 rounded-full"}
                style={{ background: ACCENT }}
              />
              New · Real-time asset tracking
            </span>

            <h1
              className={`font-black leading-[1.1] tracking-tight ${
                card ? "text-base" : "text-4xl sm:text-5xl"
              }`}
            >
              Sync every asset.
              <br />
              <span style={{ color: "#7fb0f0" }}>See everything</span> clearly.
            </h1>

            <p
              className={`text-white/60 ${
                card ? "text-[9px] leading-snug" : "max-w-md text-base leading-relaxed sm:text-lg"
              }`}
            >
              AssetSync unifies your hardware, software and cloud resources into a
              single live dashboard — so nothing slips through the cracks.
            </p>

            <div className={`flex items-center ${card ? "gap-1.5 pt-0.5" : "gap-3 pt-2"}`}>
              <span
                className={`inline-flex items-center justify-center rounded-full font-bold text-white shadow-lg ${
                  card ? "px-3 py-1 text-[9px]" : "px-7 py-3 text-sm sm:text-base"
                }`}
                style={{ background: ACCENT }}
              >
                Start free trial
              </span>
              <span
                className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 font-bold text-white transition hover:bg-white/10 ${
                  card ? "px-3 py-1 text-[9px]" : "px-7 py-3 text-sm sm:text-base"
                }`}
              >
                Watch demo
              </span>
            </div>

            {!card && (
              <div className="flex items-center gap-5 pt-4 text-xs text-white/40">
                <span>SOC 2 compliant</span>
                <span>·</span>
                <span>10,000+ teams</span>
                <span>·</span>
                <span>99.9% uptime</span>
              </div>
            )}
          </div>

          {/* Dashboard mockup */}
          <div
            className={`rounded-2xl border border-white/10 shadow-2xl ${
              card ? "p-2" : "p-4 sm:p-5"
            }`}
            style={{ background: RAISED }}
          >
            <div className={`flex items-center gap-1.5 ${card ? "mb-1.5" : "mb-3"}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span
                className={`ml-2 font-semibold text-white/50 ${
                  card ? "text-[7px]" : "text-[11px]"
                }`}
              >
                assets / overview
              </span>
            </div>

            {/* KPI row */}
            <div className={`grid grid-cols-3 ${card ? "gap-1" : "gap-2.5"}`}>
              {[
                { k: "Tracked", v: "8,420" },
                { k: "In sync", v: "98%" },
                { k: "Alerts", v: "3" },
              ].map((m) => (
                <div
                  key={m.k}
                  className={`rounded-lg bg-white/5 ${card ? "p-1.5" : "p-3"}`}
                >
                  <p
                    className={`text-white/40 ${card ? "text-[6px]" : "text-[10px]"}`}
                  >
                    {m.k}
                  </p>
                  <p
                    className={`font-black text-white ${
                      card ? "text-[10px]" : "text-xl"
                    }`}
                  >
                    {m.v}
                  </p>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div
              className={`flex items-end justify-between rounded-lg bg-white/5 ${
                card ? "mt-1 h-10 gap-0.5 p-1.5" : "mt-2.5 h-28 gap-1.5 p-3"
              }`}
            >
              {[40, 65, 52, 80, 60, 92, 74, 88].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i % 2 === 0 ? ACCENT : "rgba(255,255,255,0.25)",
                  }}
                />
              ))}
            </div>

            {/* List rows */}
            {!card && (
              <div className="mt-2.5 space-y-1.5">
                {["MacBook Pro 16″", "AWS · prod-cluster", "Figma · Org seat"].map(
                  (row) => (
                    <div
                      key={row}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                    >
                      <span className="text-xs text-white/80">{row}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: `${ACCENT}33`, color: "#9ec1ef" }}
                      >
                        synced
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
