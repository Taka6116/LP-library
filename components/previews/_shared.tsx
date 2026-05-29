import type { ReactNode } from "react";
import type { PreviewComponentProps, PreviewVariant } from "@/types/section";

// Shared building blocks for preview components.
// Every preview is rendered in two contexts:
//   - variant="card"  -> compact thumbnail inside SectionPatternCard
//   - variant="full"  -> full-width section inside the generated LP
// Components scale type/spacing off `variant` so a single component serves both.
// Color/spacing tokens follow the Sansan brand (blue #004e98 accent, brand red,
// #1a1a1a ink, #f8f8f8 muted) and are centralized here so theming swaps one file.

export type SharedPreviewProps = PreviewComponentProps;

export function isCard(variant?: PreviewVariant) {
  return variant === "card";
}

/** Outer section frame. Handles background + responsive vertical rhythm. */
export function SectionFrame({
  children,
  variant,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  variant?: PreviewVariant;
  tone?: "light" | "muted" | "dark" | "accent";
  className?: string;
}) {
  const card = isCard(variant);
  const toneClass = {
    light: "bg-white text-ink",
    muted: "bg-muted text-ink",
    dark: "bg-accent-ink text-white",
    accent: "bg-accent text-white",
  }[tone];

  return (
    <section
      className={`w-full ${toneClass} ${
        card ? "px-5 py-6" : "px-6 py-16 sm:px-10 sm:py-24"
      } ${className}`}
    >
      <div className={`mx-auto w-full ${card ? "max-w-none" : "max-w-6xl"}`}>
        {children}
      </div>
    </section>
  );
}

/** Small eyebrow / kicker label above a heading. Sansan-style: blue, with a short rule. */
export function Eyebrow({
  children,
  variant,
  tone = "accent",
}: {
  children: ReactNode;
  variant?: PreviewVariant;
  tone?: "accent" | "muted" | "light";
}) {
  const card = isCard(variant);
  const toneClass = {
    accent: "text-accent",
    muted: "text-subtle",
    light: "text-white/80",
  }[tone];
  const ruleClass = {
    accent: "bg-accent",
    muted: "bg-subtle",
    light: "bg-white/60",
  }[tone];
  return (
    <p
      className={`inline-flex items-center gap-2 font-semibold tracking-[0.16em] ${toneClass} ${
        card ? "text-[10px]" : "text-xs sm:text-sm"
      }`}
    >
      <span className={`inline-block ${ruleClass} ${card ? "h-px w-3" : "h-px w-6"}`} />
      {children}
    </p>
  );
}

export function Heading({
  children,
  variant,
  className = "",
}: {
  children: ReactNode;
  variant?: PreviewVariant;
  className?: string;
}) {
  const card = isCard(variant);
  return (
    <h2
      className={`font-bold leading-[1.35] tracking-tight text-ink ${
        card ? "text-base" : "text-2xl sm:text-3xl"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

export function SubCopy({
  children,
  variant,
  className = "",
}: {
  children: ReactNode;
  variant?: PreviewVariant;
  className?: string;
}) {
  const card = isCard(variant);
  return (
    <p
      className={`text-subtle ${
        card ? "text-[11px] leading-relaxed" : "text-base sm:text-lg leading-loose"
      } ${className}`}
    >
      {children}
    </p>
  );
}

export function PrimaryButton({
  children,
  variant,
  tone = "accent",
}: {
  children: ReactNode;
  variant?: PreviewVariant;
  tone?: "accent" | "light" | "dark" | "red";
}) {
  const card = isCard(variant);
  const toneClass = {
    accent: "bg-accent text-white hover:bg-accent-ink",
    light: "bg-white text-accent hover:bg-accent-soft",
    dark: "bg-ink text-white hover:bg-black",
    red: "bg-brand-red text-white hover:brightness-110",
  }[tone];
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold shadow-soft transition ${toneClass} ${
        card ? "px-3 py-1.5 text-[11px]" : "px-8 py-3.5 text-sm sm:text-base"
      }`}
    >
      {children}
      <span aria-hidden className={card ? "text-[10px]" : "text-base"}>
        ›
      </span>
    </span>
  );
}

export function GhostButton({
  children,
  variant,
}: {
  children: ReactNode;
  variant?: PreviewVariant;
}) {
  const card = isCard(variant);
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-accent font-bold text-accent transition hover:bg-accent-soft ${
        card ? "px-3 py-1.5 text-[11px]" : "px-8 py-3.5 text-sm sm:text-base"
      }`}
    >
      {children}
    </span>
  );
}

/** Decorative placeholder block (stands in for imagery/illustration). */
export function VisualBlock({
  variant,
  className = "",
  children,
}: {
  variant?: PreviewVariant;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-accent-soft to-white ${className}`}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  variant,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  variant?: PreviewVariant;
  tone?: "light" | "muted" | "accent" | "danger";
  className?: string;
}) {
  const card = isCard(variant);
  const toneClass = {
    light: "bg-white border-slate-200/80",
    muted: "bg-muted border-slate-200/70",
    accent: "bg-accent-soft border-accent/15",
    danger: "bg-brand-red/5 border-brand-red/15",
  }[tone];
  return (
    <div
      className={`rounded-2xl border shadow-soft ${toneClass} ${
        card ? "p-3" : "p-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Reusable responsive grid. Collapses to single column on mobile. */
export function Grid({
  children,
  cols = 3,
  variant,
  className = "",
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  variant?: PreviewVariant;
  className?: string;
}) {
  const card = isCard(variant);
  const colClass = {
    2: card ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
    3: card ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: card ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4",
  }[cols];
  return (
    <div className={`grid gap-${card ? "2" : "5"} ${colClass} ${className}`}>
      {children}
    </div>
  );
}
