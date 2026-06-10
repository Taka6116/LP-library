// ブラウザストレージの使用量監視。
// navigator.storage.estimate() で使用率を取得し、閾値超過時に警告できるようにする。

const WARN_RATIO = 0.8;

export type StorageStatus = {
  usage: number; // bytes
  quota: number; // bytes
  ratio: number; // 0..1
  warn: boolean;
};

export async function storageStatus(): Promise<StorageStatus | null> {
  try {
    if (typeof navigator === "undefined" || !navigator.storage?.estimate) return null;
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    if (!quota) return null;
    const ratio = usage / quota;
    return { usage, quota, ratio, warn: ratio >= WARN_RATIO };
  } catch {
    return null;
  }
}

export function formatBytes(n: number): string {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`;
  if (n >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}

/** 保存系操作の後に呼ぶ。警告が必要ならメッセージを返す（不要なら null）。 */
export async function quotaWarning(): Promise<string | null> {
  const s = await storageStatus();
  if (!s || !s.warn) return null;
  return `ブラウザ保存領域の ${Math.round(s.ratio * 100)}% を使用中です（${formatBytes(s.usage)} / ${formatBytes(s.quota)}）。バックアップの書き出しと不要データの削除をおすすめします。`;
}
