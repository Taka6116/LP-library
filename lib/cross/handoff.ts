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
