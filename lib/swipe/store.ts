// Swipe file (reference inbox) + Copy bank (snippet bank), persisted locally.
//  - Swipe items may include a pasted/uploaded screenshot → IndexedDB.
//  - Copy items are small text → localStorage.

export type SwipeItem = {
  id: string;
  title: string;
  url: string;
  note: string;
  tags: string[];
  image?: string; // data URL (optional screenshot)
  savedAt: number;
};

export const COPY_TYPES = [
  "見出し",
  "CTA",
  "フック",
  "メール件名",
  "ボディ",
  "その他",
] as const;
export type CopyType = (typeof COPY_TYPES)[number];

export type CopyItem = {
  id: string;
  text: string;
  type: CopyType;
  tags: string[];
  savedAt: number;
};

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ───────────────────────── Copy bank (localStorage) ─────────────────────────
const COPY_KEY = "copy-bank";

export function loadCopy(): CopyItem[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(COPY_KEY);
    return s ? (JSON.parse(s) as CopyItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCopy(items: CopyItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COPY_KEY, JSON.stringify(items));
  } catch {
    /* noop */
  }
}

/** Convenience: prepend a snippet to the bank (used by the LP copy modal). */
export function addCopyItem(
  text: string,
  type: CopyType = "その他",
  tags: string[] = [],
): CopyItem {
  const item: CopyItem = { id: newId(), text, type, tags, savedAt: Date.now() };
  saveCopy([item, ...loadCopy()]);
  return item;
}

// ───────────────────────── Swipe file (IndexedDB) ─────────────────────────
const DB_NAME = "swipe-bank";
const STORE = "kv";
const KEY = "items";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadSwipe(): Promise<SwipeItem[]> {
  if (typeof window === "undefined") return [];
  const db = await openDB();
  const items = await new Promise<SwipeItem[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => resolve((req.result as SwipeItem[]) ?? []);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return items;
}

export async function saveSwipe(items: SwipeItem[]): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(items, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
