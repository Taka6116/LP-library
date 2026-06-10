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

/**
 * ストリーミング実行。Anthropic Messages API の SSE をサーバ経由で受け取り、
 * text デルタごとに onDelta を呼ぶ。完了時に全文を返す。
 * SSE が使えない応答（JSONエラー等）の場合はその内容をエラーとして返す。
 */
export async function runPromptStream(
  req: AiRequest,
  onDelta: (textSoFar: string) => void,
): Promise<AiResult> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  try {
    const res = await fetch(`${base}/api/ai/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...req, stream: true }),
    });

    const ctype = res.headers.get("content-type") || "";
    if (!res.ok || !ctype.includes("text/event-stream") || !res.body) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: data?.error || `エラー (${res.status})` };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let text = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      // SSE: イベントは空行区切り。data: 行のJSONから text_delta を拾う。
      const events = buf.split("\n\n");
      buf = events.pop() ?? "";
      for (const ev of events) {
        for (const line of ev.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload) as {
              type?: string;
              delta?: { type?: string; text?: string };
              error?: { message?: string };
            };
            if (j.type === "content_block_delta" && j.delta?.type === "text_delta" && j.delta.text) {
              text += j.delta.text;
              onDelta(text);
            } else if (j.type === "error") {
              return { ok: false, error: j.error?.message || "AI生成中にエラーが発生しました" };
            }
          } catch { /* 不完全なJSONは無視 */ }
        }
      }
    }

    if (!text) return { ok: false, error: "AIから有効な応答がありませんでした" };
    return { ok: true, text };
  } catch {
    return {
      ok: false,
      error: "AIバックエンドに接続できません（この配信環境ではAI実行は利用できません）",
    };
  }
}
