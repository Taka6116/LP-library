import { NextResponse } from "next/server";

// AI 生成の Route Handler（Vercel 等の Node ランタイム前提）。
// ANTHROPIC_API_KEY が設定されている時のみ動作する。未設定なら 503 を返す。
// ※ GitHub Pages 静的書き出し(output:export)時はこのルートをビルド対象から外す
//   （next.config 側で AI ルートのディレクトリを退避）。Vercel では通常の動的ルート。
export const runtime = "nodejs";

// 整形・短文生成向けの既定モデル（用途で差し替え可能）。
const MODEL = "claude-sonnet-4-6";

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "AIバックエンドが未設定です。サーバの環境変数 ANTHROPIC_API_KEY を設定すると有効になります。",
      },
      { status: 503 },
    );
  }

  let body: { prompt?: string; system?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "リクエストが不正です" }, { status: 400 });
  }

  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return NextResponse.json({ ok: false, error: "プロンプトが空です" }, { status: 400 });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        ...(body.system ? { system: body.system } : {}),
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json().catch(() => null);
    if (!r.ok) {
      const msg =
        (data && data.error && data.error.message) || `Anthropic APIエラー (${r.status})`;
      return NextResponse.json({ ok: false, error: msg }, { status: 502 });
    }

    const text: string = Array.isArray(data?.content)
      ? data.content
          .filter((b: { type?: string }) => b?.type === "text")
          .map((b: { text?: string }) => b.text ?? "")
          .join("\n")
      : "";

    return NextResponse.json({ ok: true, text });
  } catch {
    return NextResponse.json(
      { ok: false, error: "AI生成中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
