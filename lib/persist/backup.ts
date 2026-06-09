// 全資産バックアップ（エクスポート/インポート）。
// 対象: localStorage 全キー + IndexedDB（swipe-bank の items / ppt-studio の decks）。
// クラウド同期の前提となる共通シリアライズ表現でもある。

import { loadSwipe, saveSwipe, type SwipeItem } from "@/lib/swipe/store";
import { listDecks, getDeckBuf, addDeck } from "@/lib/pptx/deckStore";

const BACKUP_VERSION = 1;
const APP = "marketers-studio";

export type Backup = {
  app: typeof APP;
  version: number;
  exportedAt: string;
  local: Record<string, string>;
  swipe: SwipeItem[];
  decks: { name: string; slideCount: number; buf: string }[]; // buf = base64
};

export type ImportMode = "merge" | "replace";

function bufToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(s);
}

function b64ToBuf(b64: string): ArrayBuffer {
  const s = atob(b64);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes.buffer;
}

/** 全資産を1つの Backup オブジェクトに集約する。 */
export async function exportAll(): Promise<Backup> {
  const local: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    const v = localStorage.getItem(k);
    if (v != null) local[k] = v;
  }
  const swipe = await loadSwipe().catch(() => [] as SwipeItem[]);
  const metas = await listDecks().catch(() => []);
  const decks: Backup["decks"] = [];
  for (const m of metas) {
    const buf = await getDeckBuf(m.id).catch(() => null);
    if (buf) decks.push({ name: m.name, slideCount: m.slideCount, buf: bufToB64(buf) });
  }
  return {
    app: APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    local,
    swipe,
    decks,
  };
}

/** Backup を JSON ファイルとしてダウンロードさせる。 */
export function downloadBackup(b: Backup): void {
  const blob = new Blob([JSON.stringify(b, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `marketers-studio-backup-${b.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** ファイルの中身をパースして Backup として検証する。 */
export function parseBackup(text: string): Backup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("JSON として読み込めませんでした");
  }
  const b = data as Partial<Backup>;
  if (!b || b.app !== APP || typeof b.local !== "object") {
    throw new Error("Marketer's Studio のバックアップ形式ではありません");
  }
  return b as Backup;
}

/**
 * Backup を取り込む。
 * - merge: 既存に追記（同IDのswipeはスキップ、localStorageはバックアップ優先で上書き）
 * - replace: localStorage を全消去してから復元（swipe/decks は現状へ追記）
 * 反映には呼び出し側でリロードを推奨。
 */
export async function importAll(b: Backup, mode: ImportMode): Promise<void> {
  if (mode === "replace") {
    localStorage.clear();
  }
  for (const [k, v] of Object.entries(b.local ?? {})) {
    localStorage.setItem(k, v);
  }

  if (Array.isArray(b.swipe)) {
    const cur = mode === "merge" ? await loadSwipe().catch(() => [] as SwipeItem[]) : [];
    const seen = new Set(cur.map((x) => x.id));
    const merged = [...cur, ...b.swipe.filter((x) => !seen.has(x.id))];
    await saveSwipe(merged);
  }

  if (Array.isArray(b.decks)) {
    for (const d of b.decks) {
      await addDeck(d.name, b64ToBuf(d.buf), d.slideCount);
    }
  }
}
