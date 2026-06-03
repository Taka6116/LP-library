// Shared brand kit — single source of truth for colors, fonts, tone.
// Consumed by LP (theme), Email (brandColor + companyName), Social (tone/name).

export const FONT_STACKS = [
  { id: "sans",   label: "ゴシック",  stack: "'Noto Sans JP','Hiragino Kaku Gothic ProN','Yu Gothic',Meiryo,sans-serif" },
  { id: "mincho", label: "明朝",      stack: "'Hiragino Mincho ProN','Yu Mincho','YuMincho',serif" },
  { id: "maru",   label: "丸ゴシック",stack: "'Hiragino Maru Gothic ProN','Rounded Mplus 1c',sans-serif" },
  { id: "lato",   label: "Lato (英文)", stack: "Lato,'Noto Sans JP',sans-serif" },
] as const;

export type FontId = (typeof FONT_STACKS)[number]["id"];

export type BrandTone = "formal" | "casual" | "energetic";

export const TONE_LABELS: Record<BrandTone, string> = {
  formal:    "丁寧・フォーマル",
  casual:    "カジュアル・親しみやすい",
  energetic: "エネルギッシュ・行動喚起",
};

export type BrandKit = {
  companyName: string;
  tagline:     string;
  primaryColor:   string;
  secondaryColor: string;
  accentColor:    string;
  fontId:      FontId;
  tone:        BrandTone;
};

export const DEFAULT_BRAND: BrandKit = {
  companyName:    "Your Company",
  tagline:        "",
  primaryColor:   "#1d4ed8",
  secondaryColor: "#0f172a",
  accentColor:    "#f59e0b",
  fontId:         "sans",
  tone:           "formal",
};

const KEY = "lp-brand-kit";

export function loadBrand(): BrandKit {
  if (typeof window === "undefined") return { ...DEFAULT_BRAND };
  try {
    const s = localStorage.getItem(KEY);
    return s ? { ...DEFAULT_BRAND, ...(JSON.parse(s) as Partial<BrandKit>) } : { ...DEFAULT_BRAND };
  } catch { return { ...DEFAULT_BRAND }; }
}

export function saveBrand(kit: BrandKit): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(kit)); } catch { /* noop */ }
}

export function getFontStack(id: FontId): string {
  return FONT_STACKS.find(f => f.id === id)?.stack ?? FONT_STACKS[0].stack;
}
