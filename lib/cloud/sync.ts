// クラウド同期の抽象（シェル）。
// 現状はバックエンド未接続のため常に「未設定」を返す＝キー/バックエンドが無いと動かない。
// 将来 Supabase/Vercel Postgres 等を storageDriver として差し込めるよう型だけ用意する。

export type SyncResult =
  | { ok: true; at: string }
  | { ok: false; error: string };

/**
 * クラウド同期が有効かどうか。
 * ビルド時環境変数 NEXT_PUBLIC_CLOUD_ENABLED === "true" かつ将来のバックエンド接続が前提。
 * 現状は常に false（＝未設定）。
 */
export function cloudConfigured(): boolean {
  return process.env.NEXT_PUBLIC_CLOUD_ENABLED === "true";
}

const NOT_CONFIGURED: SyncResult = {
  ok: false,
  error:
    "クラウド同期は未設定です。アカウント連携とバックエンド（例: Supabase）の接続が必要です。現状はローカル保存＋バックアップでご利用ください。",
};

/** ローカル資産をクラウドへ送る（未設定では失敗）。 */
export async function syncPush(): Promise<SyncResult> {
  if (!cloudConfigured()) return NOT_CONFIGURED;
  // 将来: 認証トークンを付けて /api/sync へ push。
  return { ok: false, error: "クラウド同期は未実装です（バックエンド接続後に有効化）。" };
}

/** クラウドからローカルへ取り込む（未設定では失敗）。 */
export async function syncPull(): Promise<SyncResult> {
  if (!cloudConfigured()) return NOT_CONFIGURED;
  return { ok: false, error: "クラウド同期は未実装です（バックエンド接続後に有効化）。" };
}
