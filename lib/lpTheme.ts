// Brand/theme swap for the Generated LP.
//
// Generic sections (built on _shared tokens) use Tailwind utility classes like
// `bg-accent`, `text-sansan-600`, `bg-accent-soft`, etc. We remap those to CSS
// variables, scoped under a [data-lp-theme] container, so a single picker can
// re-skin the whole LP. The same CSS is injected into the HTML export so the
// downloaded file carries the chosen brand.

export type LpThemeId =
  | "default"
  | "blue"
  | "teal"
  | "orange"
  | "purple"
  | "navy"
  | "rose";

export type LpTheme = {
  id: LpThemeId;
  name: string;
  accent: string; // main brand color
  soft: string; // light tint (backgrounds)
};

export const LP_THEMES: LpTheme[] = [
  { id: "default", name: "デフォルト", accent: "#004e98", soft: "#e9f0f8" },
  { id: "blue", name: "ブルー", accent: "#1d4ed8", soft: "#e6edfd" },
  { id: "teal", name: "ティール", accent: "#0f9b8e", soft: "#e2f6f3" },
  { id: "orange", name: "オレンジ", accent: "#ea580c", soft: "#fdece1" },
  { id: "purple", name: "パープル", accent: "#7c3aed", soft: "#f0e9fd" },
  { id: "navy", name: "ネイビー", accent: "#0f2a52", soft: "#e6ebf2" },
  { id: "rose", name: "ローズ", accent: "#e11d6b", soft: "#fde4ee" },
];

export type LpFontId = "default" | "mincho" | "maru" | "gothic";

export type LpFont = { id: LpFontId; name: string; stack: string };

const SANS_FALLBACK =
  '"Noto Sans JP","Hiragino Kaku Gothic ProN","Hiragino Sans",Meiryo,sans-serif';

export const LP_FONTS: LpFont[] = [
  { id: "default", name: "標準", stack: SANS_FALLBACK },
  {
    id: "gothic",
    name: "ゴシック",
    stack: '"Hiragino Kaku Gothic ProN","Yu Gothic","Meiryo",sans-serif',
  },
  {
    id: "mincho",
    name: "明朝",
    stack: '"Hiragino Mincho ProN","Yu Mincho","YuMincho",serif',
  },
  {
    id: "maru",
    name: "丸ゴシック",
    stack: '"Hiragino Maru Gothic ProN","Rounded Mplus 1c",sans-serif',
  },
];

export type ThemeSelection = {
  themeId: LpThemeId;
  fontId: LpFontId;
  /** whole-LP hue rotation in degrees (0 = off). Recolors EVERYTHING incl.
   * real sections + images. */
  hue: number;
};

export const DEFAULT_THEME: ThemeSelection = {
  themeId: "default",
  fontId: "default",
  hue: 0,
};

export function getTheme(id: LpThemeId): LpTheme {
  return LP_THEMES.find((t) => t.id === id) ?? LP_THEMES[0];
}

export function getFont(id: LpFontId): LpFont {
  return LP_FONTS.find((f) => f.id === id) ?? LP_FONTS[0];
}

export function isThemed(sel: ThemeSelection): boolean {
  return sel.themeId !== "default" || sel.fontId !== "default" || (sel.hue ?? 0) !== 0;
}

/** CSS filter string for the whole-LP hue shift (or undefined when off). */
export function hueFilter(sel: ThemeSelection): string | undefined {
  const h = sel.hue ?? 0;
  return h === 0 ? undefined : `hue-rotate(${h}deg)`;
}

/** Inline CSS-variable style for the themed container. */
export function themeStyle(sel: ThemeSelection): Record<string, string> {
  const t = getTheme(sel.themeId);
  const f = getFont(sel.fontId);
  const style: Record<string, string> = {};
  if (sel.themeId !== "default") {
    style["--lp-accent"] = t.accent;
    style["--lp-accent-soft"] = t.soft;
  }
  if (sel.fontId !== "default") {
    style["--lp-font"] = f.stack;
  }
  return style;
}

// CSS that remaps the brand utility classes within a [data-lp-theme] scope.
// Reused by both the in-app preview (<style> tag) and the HTML export.
export const LP_THEME_CSS = `
[data-lp-theme] .text-accent,
[data-lp-theme] .text-accent-ink,
[data-lp-theme] .text-accent-ring,
[data-lp-theme] .text-sansan-400,
[data-lp-theme] .text-sansan-500,
[data-lp-theme] .text-sansan-600,
[data-lp-theme] .text-sansan-700,
[data-lp-theme] .text-sansan-800,
[data-lp-theme] .text-sansan-900{color:var(--lp-accent,#004e98)!important}
[data-lp-theme] .bg-accent,
[data-lp-theme] .bg-accent-ink,
[data-lp-theme] .bg-accent-ring,
[data-lp-theme] .bg-sansan-400,
[data-lp-theme] .bg-sansan-500,
[data-lp-theme] .bg-sansan-600,
[data-lp-theme] .bg-sansan-700,
[data-lp-theme] .bg-sansan-800,
[data-lp-theme] .bg-sansan-900{background-color:var(--lp-accent,#004e98)!important}
[data-lp-theme] .border-accent,
[data-lp-theme] .border-accent-ring,
[data-lp-theme] .border-sansan-300,
[data-lp-theme] .border-sansan-400,
[data-lp-theme] .border-sansan-500,
[data-lp-theme] .border-sansan-600{border-color:var(--lp-accent,#004e98)!important}
[data-lp-theme] .bg-accent-soft,
[data-lp-theme] .bg-sansan-50,
[data-lp-theme] .bg-sansan-100,
[data-lp-theme] .bg-sansan-200{background-color:var(--lp-accent-soft,#e9f0f8)!important}
[data-lp-theme] .text-accent-soft{color:var(--lp-accent-soft,#e9f0f8)!important}
[data-lp-theme] .ring-accent,
[data-lp-theme] .ring-sansan-200,
[data-lp-theme] .ring-sansan-300{--tw-ring-color:var(--lp-accent,#004e98)!important}
[data-lp-theme] .from-accent,
[data-lp-theme] .from-sansan-500,
[data-lp-theme] .from-sansan-600,
[data-lp-theme] .from-sansan-700{--tw-gradient-from:var(--lp-accent,#004e98) var(--tw-gradient-from-position)!important;--tw-gradient-to:rgb(0 0 0 / 0) var(--tw-gradient-to-position)!important;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)!important}
[data-lp-theme] .to-accent,
[data-lp-theme] .to-sansan-500,
[data-lp-theme] .to-sansan-600,
[data-lp-theme] .to-sansan-700{--tw-gradient-to:var(--lp-accent,#004e98) var(--tw-gradient-to-position)!important}
[data-lp-theme] .via-accent,
[data-lp-theme] .via-sansan-500,
[data-lp-theme] .via-sansan-600{--tw-gradient-to:rgb(0 0 0 / 0) var(--tw-gradient-to-position)!important;--tw-gradient-stops:var(--tw-gradient-from),var(--lp-accent,#004e98) var(--tw-gradient-via-position),var(--tw-gradient-to)!important}
[data-lp-theme] .font-sans,
[data-lp-theme] .font-lato{font-family:var(--lp-font,${SANS_FALLBACK})!important}
`.trim();

// ---- persistence (sticky brand preference) ----
const KEY = "lp-theme-pref";

export function loadThemePref(): ThemeSelection {
  if (typeof window === "undefined") return { ...DEFAULT_THEME };
  try {
    const s = localStorage.getItem(KEY);
    if (s) return { ...DEFAULT_THEME, ...(JSON.parse(s) as Partial<ThemeSelection>) };
  } catch {
    /* noop */
  }
  return { ...DEFAULT_THEME };
}

export function saveThemePref(sel: ThemeSelection): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(sel));
  } catch {
    /* noop */
  }
}
