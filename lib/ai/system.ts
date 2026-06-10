// 用途別のシステムプロンプト（プリセット）。
// PromptRunModal の「用途」セレクタから選び、/api/ai/generate の system に渡す。

export type SystemPresetId =
  | "none" | "lp-copy" | "email" | "social" | "headline" | "summarize";

export type SystemPreset = {
  id: SystemPresetId;
  label: string;
  /** id === "none" のときは undefined（systemを送らない） */
  system?: string;
};

const BASE =
  "あなたは日本語で書くシニアマーケティングコピーライターです。" +
  "出力は指示された成果物のみを返し、前置き・後書き・説明は不要です。";

export const SYSTEM_PRESETS: SystemPreset[] = [
  { id: "none", label: "指定なし（プロンプトのまま）" },
  {
    id: "lp-copy",
    label: "LPコピー",
    system:
      BASE +
      "ランディングページ向けのコピーを書きます。ベネフィット主導で、見出しは32文字以内、" +
      "本文は短い段落で、CTAは行動を促す動詞で締めてください。",
  },
  {
    id: "email",
    label: "メール/メルマガ",
    system:
      BASE +
      "HTMLメール向けの文章を書きます。件名は40文字以内で開封したくなるもの、" +
      "本文は1スクロールで読める長さ、CTAは1つに絞ってください。" +
      "出力は必ず次のラベル付き形式で:\n件名: …\n見出し: …\n本文: …\nCTA: …",
  },
  {
    id: "social",
    label: "SNS投稿",
    system:
      BASE +
      "SNS投稿文を書きます。1行目で惹きつけ、改行を多めに、" +
      "プラットフォームの文字数制限（X:280字）を意識してください。" +
      "出力は必ず次のラベル付き形式で:\nフック: …\n本文: …\nハッシュタグ: #…",
  },
  {
    id: "headline",
    label: "見出し量産",
    system:
      BASE +
      "見出し・キャッチコピーの候補を番号付きで10案出します。" +
      "切り口（数字訴求・恐怖訴求・ベネフィット・権威・意外性）を変えて多様にしてください。",
  },
  {
    id: "summarize",
    label: "要約・整形",
    system:
      BASE +
      "渡されたテキストを構造化して整形・要約します。重要な数値や固有名詞は落とさないでください。",
  },
];

export function getPreset(id: SystemPresetId): SystemPreset {
  return SYSTEM_PRESETS.find(p => p.id === id) ?? SYSTEM_PRESETS[0];
}

// ---- Brand Kit の自動注入 ----

import { TONE_LABELS, DEFAULT_BRAND, type BrandKit } from "@/lib/brand/store";

/**
 * Brand Kit を system プロンプト向けの文脈に変換する。
 * 会社名が未設定（デフォルトのまま）でタグラインも無い場合は null（注入しない）。
 */
export function brandContext(brand: BrandKit): string | null {
  const hasName = brand.companyName.trim() !== "" && brand.companyName !== DEFAULT_BRAND.companyName;
  const hasTagline = brand.tagline.trim() !== "";
  if (!hasName && !hasTagline) return null;

  const parts: string[] = ["以下のブランド情報を踏まえて書いてください。"];
  if (hasName) parts.push(`会社名・ブランド名: ${brand.companyName}`);
  if (hasTagline) parts.push(`タグライン: ${brand.tagline}`);
  parts.push(`文体トーン: ${TONE_LABELS[brand.tone]}`);
  return parts.join("\n");
}

/** プリセット system と Brand 文脈を結合する（どちらか無ければ片方/undefined）。 */
export function composeSystem(presetSystem: string | undefined, brandCtx: string | null): string | undefined {
  if (presetSystem && brandCtx) return `${presetSystem}\n\n${brandCtx}`;
  return presetSystem ?? brandCtx ?? undefined;
}
