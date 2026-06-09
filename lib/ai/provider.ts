// AI 生成のプロバイダ抽象（最小）。
// 現状の実装は app/api/ai/generate の Route Handler（Anthropic への fetch）。
// 将来モデル差し替え・ストリーミング・履歴を足す際の型の起点。

export type AiResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export type AiRequest = {
  /** ユーザー変数を埋め込んだ実行プロンプト */
  prompt: string;
  /** 任意のシステムプロンプト（用途別の指示） */
  system?: string;
};
