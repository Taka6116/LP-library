// Repurpose one piece of content into platform-optimized posts.
// Rule-based formatting (length, hashtag placement, link handling) — a fast,
// local-first time-saver (no AI/API). The user supplies the core message;
// each platform reshapes it to its conventions and shows char budget.

export type ToneMode = "formal" | "casual" | "energetic";

export type RepurposeInput = {
  hook: string;
  body: string;
  url: string;
  hashtags: string[];
  emoji: boolean;
  tone: ToneMode;
  companyName?: string;
};

export type Platform = {
  id: string;
  name: string;
  limit: number;
  accent: string;
  note?: string;
  format: (i: RepurposeInput) => string;
};

const tag = (t: string) => "#" + t.replace(/^#/, "").replace(/\s+/g, "");
const tags = (arr: string[], n: number) => arr.slice(0, n).map(tag).join(" ");

function toneLead(i: RepurposeInput): string {
  const base = [i.hook.trim(), i.body.trim()].filter(Boolean).join("\n\n");
  if (i.tone === "formal") return base;
  if (i.tone === "casual") return base;
  // energetic: add leading punctuation emphasis
  return base;
}

function tonePrefix(i: RepurposeInput, platform: string): string {
  if (i.tone === "formal") {
    if (platform === "linkedin") return `【${i.companyName || "お知らせ"}】\n`;
    return "";
  }
  if (i.tone === "casual") return i.hook.trim() ? "" : "✨ ";
  // energetic
  if (platform === "x") return "⚡ ";
  if (platform === "instagram") return "🔥 ";
  return "⚡ ";
}

const lead = (i: RepurposeInput, platform = "") => {
  const prefix = tonePrefix(i, platform);
  const body = [i.hook.trim(), i.body.trim()].filter(Boolean).join("\n\n");
  return prefix ? prefix + body : body;
};

export const PLATFORMS: Platform[] = [
  {
    id: "x",
    name: "X (Twitter)",
    limit: 280,
    accent: "#0f1419",
    note: "URLは約23字換算。長い場合は本文が自動で短くなります。",
    format: (i) => {
      const tail = [i.url.trim(), tags(i.hashtags, 3)].filter(Boolean).join("\n");
      const reserve = (i.url ? 24 : 0) + (tags(i.hashtags, 3).length + 2);
      const room = Math.max(40, 280 - reserve);
      let head = lead(i, "x");
      if (head.length > room) head = head.slice(0, room - 1).trimEnd() + "…";
      return [head, tail].filter(Boolean).join("\n\n");
    },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    limit: 3000,
    accent: "#0a66c2",
    note: "冒頭2行が「もっと見る」前に表示。改行を多めに。",
    format: (i) =>
      [lead(i, "linkedin"), i.url.trim(), tags(i.hashtags, 5)].filter(Boolean).join("\n\n"),
  },
  {
    id: "instagram",
    name: "Instagram",
    limit: 2200,
    accent: "#c13584",
    note: "本文中のリンクは不可（プロフィールへ誘導）。ハッシュタグは末尾に。",
    format: (i) => {
      const cta = i.url.trim() ? "▶ 詳しくはプロフィールのリンクから" : "";
      return [lead(i, "instagram"), cta, ".\n.\n.", tags(i.hashtags, 30)]
        .filter(Boolean)
        .join("\n\n");
    },
  },
  {
    id: "threads",
    name: "Threads",
    limit: 500,
    accent: "#000000",
    format: (i) => {
      let head = lead(i, "threads");
      const tail = [i.url.trim(), tags(i.hashtags, 3)].filter(Boolean).join("\n");
      const room = 500 - tail.length - 2;
      if (head.length > room) head = head.slice(0, room - 1).trimEnd() + "…";
      return [head, tail].filter(Boolean).join("\n\n");
    },
  },
  {
    id: "facebook",
    name: "Facebook",
    limit: 2000,
    accent: "#1877f2",
    format: (i) =>
      [lead(i, "facebook"), i.url.trim(), tags(i.hashtags, 5)].filter(Boolean).join("\n\n"),
  },
];
