// Recognizable brand-logo tiles (inline SVG, brand colors) for module cards.
// Each renders its logo on a brand-colored rounded tile, app-launcher style.

import type { CSSProperties, ReactNode } from "react";

function Tile({
  className = "h-11 w-11",
  bgClass = "",
  style,
  children,
}: {
  className?: string;
  bgClass?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid place-items-center overflow-hidden rounded-xl ring-1 ring-black/5 shadow-sm dark:ring-white/10 ${bgClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ── Gmail (white tile, multicolor M) ──
export const GmailTile = ({ className }: { className?: string }) => (
  <Tile className={className} bgClass="bg-white">
    <svg viewBox="0 0 256 193" className="h-[58%] w-[58%]" aria-hidden>
      <path fill="#4285F4" d="M58.18 192.05V93.14L27.5 65.08 0 49.5v125.09c0 9.66 7.83 17.46 17.46 17.46z" />
      <path fill="#34A853" d="M197.82 192.05h40.72c9.66 0 17.46-7.83 17.46-17.46V49.5l-31.16 17.84-27.02 25.8z" />
      <path fill="#EA4335" d="M58.18 93.14l-4.17-38.65 4.17-36.99L128 69.87l69.82-52.37 4.67 34.99-4.67 40.65L128 145.5z" />
      <path fill="#FBBC04" d="M197.82 17.5v75.64L256 49.5V26.23c0-21.58-24.64-33.89-41.89-20.94z" />
      <path fill="#C5221F" d="M0 49.5l26.76 20.07 31.42 23.57V17.5L41.89 5.29C24.61-7.66 0 4.65 0 26.23z" />
    </svg>
  </Tile>
);

// ── Yahoo! Mail (purple tile, white envelope + dot) ──
export const YahooTile = ({ className }: { className?: string }) => (
  <Tile className={className} bgClass="bg-[#5F01D1]">
    <svg viewBox="0 0 24 24" className="h-[56%] w-[56%]" fill="none" aria-hidden>
      <rect x="3" y="6.5" width="18" height="12" rx="2" stroke="#fff" strokeWidth="1.6" />
      <path d="M4 8l8 5 8-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Tile>
);

// ── PowerPoint (orange tile, white P) ──
export const PowerPointTile = ({ className }: { className?: string }) => (
  <Tile className={className} bgClass="bg-gradient-to-br from-[#D24726] to-[#B7472A]">
    <svg viewBox="0 0 24 24" className="h-[62%] w-[62%]" aria-hidden>
      <path
        fill="#fff"
        d="M7.2 4.5h5.3c2.9 0 4.9 1.9 4.9 4.7s-2 4.8-4.9 4.8H9.7v5.5H7.2zM9.7 6.7v5.1h2.5c1.5 0 2.4-1 2.4-2.55s-.9-2.55-2.4-2.55z"
      />
    </svg>
  </Tile>
);

// ── X (black tile, white X) ──
export const XTile = ({ className }: { className?: string }) => (
  <Tile className={className} bgClass="bg-black">
    <svg viewBox="0 0 24 24" className="h-[52%] w-[52%]" aria-hidden>
      <path
        fill="#fff"
        d="M18.9 2.5h3.3l-7.21 8.24L23.5 21.5h-6.63l-5.2-6.79-5.94 6.79H2.43l7.71-8.81L2 2.5h6.8l4.7 6.21zm-1.16 17h1.83L8.34 4.4H6.38z"
      />
    </svg>
  </Tile>
);

// ── LinkedIn (blue tile, white in) ──
export const LinkedInTile = ({ className }: { className?: string }) => (
  <Tile className={className} bgClass="bg-[#0A66C2]">
    <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" aria-hidden>
      <path
        fill="#fff"
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.2 9h3.6v11.5H3.2zM9 9h3.45v1.57h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.4 4.33 5.53v6.25h-3.6v-5.54c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92v5.64H9z"
      />
    </svg>
  </Tile>
);

// ── Instagram (gradient tile, white camera) ──
export const InstagramTile = ({ className }: { className?: string }) => (
  <Tile
    className={className}
    style={{
      background:
        "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    }}
  >
    <svg viewBox="0 0 24 24" className="h-[56%] w-[56%]" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.6" stroke="#fff" strokeWidth="1.7" />
      <circle cx="17" cy="7" r="1.1" fill="#fff" />
    </svg>
  </Tile>
);

// ── LP mockup (mini landing page in a browser frame) ──
export const LpMockTile = ({ className }: { className?: string }) => (
  <Tile className={className} bgClass="bg-white">
    <svg viewBox="0 0 24 24" className="h-[74%] w-[74%]" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
      <rect x="3" y="4" width="18" height="4" rx="2" fill="#6366F1" />
      <circle cx="5.5" cy="6" r="0.6" fill="#fff" />
      <circle cx="7.3" cy="6" r="0.6" fill="#fff" />
      <rect x="5" y="10" width="9" height="2.2" rx="1.1" fill="#4F46E5" />
      <rect x="5" y="13.5" width="14" height="1.4" rx="0.7" fill="#A5B4FC" />
      <rect x="5" y="16" width="11" height="1.4" rx="0.7" fill="#C7D2FE" />
    </svg>
  </Tile>
);

// ── Brand Kit (overlapping color swatches — my pick) ──
export const BrandKitTile = ({ className }: { className?: string }) => (
  <Tile className={className} bgClass="bg-white dark:bg-zinc-900">
    <svg viewBox="0 0 24 24" className="h-[68%] w-[68%]" aria-hidden>
      <rect x="3.5" y="6" width="8" height="8" rx="2.2" fill="#6366F1" />
      <rect x="8.5" y="9" width="8" height="8" rx="2.2" fill="#EC4899" />
      <rect x="13" y="6.5" width="7.5" height="7.5" rx="2.2" fill="#F59E0B" />
    </svg>
  </Tile>
);
