// Cross-category section bookmarks (favorites), persisted in localStorage.

const KEY = "lp-bookmarks";

export function loadBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* noop */
  }
}
