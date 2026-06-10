// AI生成履歴（localStorage）。バックアップ（lib/persist/backup.ts）は
// localStorage全キーを対象にするため、履歴も自動でバックアップ対象になる。

export type AiHistoryItem = {
  id: string;
  /** 実行したプロンプトのタイトル（例: プロンプト集のタイトル） */
  title: string;
  /** 実際に送ったプロンプト本文 */
  prompt: string;
  /** 用途プリセットのラベル（任意） */
  presetLabel?: string;
  /** 生成結果 */
  result: string;
  createdAt: number;
};

const KEY = "ai-history";
const MAX = 50;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function loadAiHistory(): AiHistoryItem[] {
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as AiHistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addAiHistory(input: Omit<AiHistoryItem, "id" | "createdAt">): AiHistoryItem[] {
  const item: AiHistoryItem = { ...input, id: newId(), createdAt: Date.now() };
  const next = [item, ...loadAiHistory()].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota — 古い順に半分へ削って再試行 */
    try {
      localStorage.setItem(KEY, JSON.stringify(next.slice(0, Math.ceil(MAX / 2))));
    } catch { /* ignore */ }
  }
  return loadAiHistory();
}

export function removeAiHistory(id: string): AiHistoryItem[] {
  const next = loadAiHistory().filter(h => h.id !== id);
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

export function clearAiHistory(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
