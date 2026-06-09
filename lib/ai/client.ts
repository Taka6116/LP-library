import type { AiRequest, AiResult } from "./provider";

/**
 * ブラウザから AI 実行を依頼する。サーバの Route Handler (/api/ai/generate) を叩く。
 * - サーバに ANTHROPIC_API_KEY が無い場合は 503 が返り、その旨を ok:false で返す。
 * - 静的配信(GitHub Pages 等)では Route Handler が存在しないため接続できず ok:false。
 * → 「バックエンド/APIキーが無いと動かない（動かないのが正）」を体現する。
 */
export async function runPrompt(req: AiRequest): Promise<AiResult> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  try {
    const res = await fetch(`${base}/api/ai/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
    const data = (await res.json().catch(() => null)) as Partial<AiResult> & { error?: string } | null;
    if (!res.ok) {
      return { ok: false, error: data?.error || `エラー (${res.status})` };
    }
    if (data && (data as AiResult).ok && typeof (data as { text?: string }).text === "string") {
      return { ok: true, text: (data as { text: string }).text };
    }
    return { ok: false, error: data?.error || "AIから有効な応答がありませんでした" };
  } catch {
    return {
      ok: false,
      error: "AIバックエンドに接続できません（この配信環境ではAI実行は利用できません）",
    };
  }
}
