// モジュール間の受け渡し（handoff）。
// 例: プロンプト集の生成結果を Email / Social へ渡す。
// ナビゲーションを跨ぐため localStorage を一時チャネルに使い、受け側がマウント時に取り出す。

const KEY = "ms-handoff";

export type HandoffKind = "email" | "social";

export type Handoff = {
  kind: HandoffKind;
  text: string;
  at: number;
};

/** 受け渡しデータを書き込む。 */
export function setHandoff(kind: HandoffKind, text: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ kind, text, at: Date.now() } satisfies Handoff));
  } catch {
    /* noop */
  }
}

/** 指定種別の受け渡しがあれば取り出して消費（消去）する。無ければ null。 */
export function takeHandoff(kind: HandoffKind): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const h = JSON.parse(raw) as Handoff;
    if (h.kind !== kind) return null;
    // 古すぎる受け渡し（5分以上）は無視
    if (Date.now() - h.at > 5 * 60 * 1000) {
      localStorage.removeItem(KEY);
      return null;
    }
    localStorage.removeItem(KEY);
    return typeof h.text === "string" ? h.text : null;
  } catch {
    return null;
  }
}

/** 配信環境の basePath（GitHub Pages 等）を加味した遷移先 URL。 */
export function moduleHref(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path}`;
}

// ---- 構造化分解 ----
// AI出力（lib/ai/system.ts のプリセットがラベル付き出力を誘導）や手書きテキストを
// 「件名: …」等のラベル行で分解し、受け側モジュールの各フィールドへ流し込めるようにする。

/** 「ラベル: 内容」形式の行群を { ラベル: 内容 } に分解。ラベル行が無い部分は rest に貯まる。 */
function splitByLabels(text: string, labels: string[]): { parts: Record<string, string>; rest: string } {
  const parts: Record<string, string> = {};
  const restLines: string[] = [];
  let current: string | null = null;
  const re = new RegExp(`^(?:【)?(${labels.join("|")})(?:】)?[:：]\\s*(.*)$`);

  for (const line of text.split(/\r?\n/)) {
    const m = re.exec(line.trim());
    if (m) {
      current = m[1];
      parts[current] = m[2] ?? "";
    } else if (current) {
      parts[current] = `${parts[current]}\n${line}`.trim();
    } else {
      restLines.push(line);
    }
  }
  return { parts, rest: restLines.join("\n").trim() };
}

export type EmailParts = {
  subject?: string;
  heading?: string;
  body: string;
  cta?: string;
};

/**
 * メール向けに分解。「件名/見出し/本文/CTA」ラベルが1つでもあれば構造化、
 * 無ければ全文を body として返す。
 */
export function parseEmailParts(text: string): EmailParts {
  const { parts, rest } = splitByLabels(text, ["件名", "見出し", "本文", "CTA"]);
  if (Object.keys(parts).length === 0) return { body: text.trim() };
  return {
    subject: parts["件名"]?.trim() || undefined,
    heading: parts["見出し"]?.trim() || undefined,
    body: (parts["本文"] ?? rest).trim() || text.trim(),
    cta: parts["CTA"]?.trim() || undefined,
  };
}

export type SocialParts = {
  hook?: string;
  body: string;
  hashtags?: string;
};

/**
 * SNS向けに分解。「フック/本文/ハッシュタグ」ラベルが1つでもあれば構造化、
 * 無ければ全文を body として返す。ハッシュタグは「#」を除いた空白区切りに正規化。
 */
export function parseSocialParts(text: string): SocialParts {
  const { parts, rest } = splitByLabels(text, ["フック", "本文", "ハッシュタグ"]);
  if (Object.keys(parts).length === 0) return { body: text.trim() };
  const tags = parts["ハッシュタグ"]
    ?.replace(/[#＃]/g, " ")
    .split(/[\s,、]+/)
    .filter(Boolean)
    .join(" ");
  return {
    hook: parts["フック"]?.trim() || undefined,
    body: (parts["本文"] ?? rest).trim() || text.trim(),
    hashtags: tags || undefined,
  };
}
