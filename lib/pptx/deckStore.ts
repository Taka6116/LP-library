// IndexedDB store for multiple imported PPTX decks. Decks persist locally
// (browser only, no server) until explicitly removed, so importing another
// file ADDS a deck instead of replacing the previous one.

const DB_NAME = "ppt-studio";
const STORE = "decks";
const INDEX_KEY = "__index__";
const VERSION = 1;

export type DeckMeta = {
  id: string;
  name: string;
  savedAt: number;
  slideCount: number;
};
type DeckRecord = DeckMeta & { buf: ArrayBuffer };

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function get<T>(db: IDBDatabase, key: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error);
  });
}

function put(db: IDBDatabase, key: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function del(db: IDBDatabase, key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function readIndex(db: IDBDatabase): Promise<DeckMeta[]> {
  return (await get<DeckMeta[]>(db, INDEX_KEY)) ?? [];
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function listDecks(): Promise<DeckMeta[]> {
  const db = await openDB();
  const idx = await readIndex(db);
  db.close();
  return idx.sort((a, b) => a.savedAt - b.savedAt);
}

export async function getDeckBuf(id: string): Promise<ArrayBuffer | null> {
  const db = await openDB();
  const rec = await get<DeckRecord>(db, id);
  db.close();
  return rec?.buf ?? null;
}

export async function addDeck(
  name: string,
  buf: ArrayBuffer,
  slideCount: number,
): Promise<DeckMeta> {
  const db = await openDB();
  const meta: DeckMeta = { id: newId(), name, savedAt: Date.now(), slideCount };
  await put(db, meta.id, { ...meta, buf });
  const idx = await readIndex(db);
  idx.push(meta);
  await put(db, INDEX_KEY, idx);
  db.close();
  return meta;
}

export async function updateDeck(
  id: string,
  patch: { buf?: ArrayBuffer; name?: string; slideCount?: number },
): Promise<void> {
  const db = await openDB();
  const rec = await get<DeckRecord>(db, id);
  if (rec) {
    const next: DeckRecord = {
      ...rec,
      ...patch,
      savedAt: Date.now(),
    };
    await put(db, id, next);
    const idx = await readIndex(db);
    const i = idx.findIndex((m) => m.id === id);
    if (i >= 0) {
      idx[i] = {
        id,
        name: next.name,
        savedAt: next.savedAt,
        slideCount: next.slideCount,
      };
      await put(db, INDEX_KEY, idx);
    }
  }
  db.close();
}

export async function removeDeck(id: string): Promise<void> {
  const db = await openDB();
  await del(db, id);
  const idx = (await readIndex(db)).filter((m) => m.id !== id);
  await put(db, INDEX_KEY, idx);
  db.close();
}
