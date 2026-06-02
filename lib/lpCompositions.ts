import type { SelectedSections } from "@/types/section";

// Lightweight localStorage persistence for the LP builder:
//  - working state (current selection + order) → auto-restored on reload
//  - named compositions → save/recall assembled LPs by name
// Data is tiny (just category→section ids + order), so localStorage is ideal.

const WORKING_KEY = "lp-working";
const COMP_KEY = "lp-compositions";

export type WorkingState = { selected: SelectedSections; order: string[] };

export type LpComposition = {
  id: string;
  name: string;
  selected: SelectedSections;
  order: string[];
  savedAt: number;
};

function read<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / privacy mode — ignore */
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ---- working state ----
export function loadWorking(): WorkingState | null {
  if (typeof window === "undefined") return null;
  return read<WorkingState | null>(WORKING_KEY, null);
}

export function saveWorking(state: WorkingState): void {
  if (typeof window === "undefined") return;
  write(WORKING_KEY, state);
}

// ---- named compositions ----
export function listCompositions(): LpComposition[] {
  if (typeof window === "undefined") return [];
  return read<LpComposition[]>(COMP_KEY, []).sort((a, b) => b.savedAt - a.savedAt);
}

export function saveComposition(
  name: string,
  selected: SelectedSections,
  order: string[],
): LpComposition {
  const list = listCompositions();
  const comp: LpComposition = {
    id: newId(),
    name,
    selected,
    order,
    savedAt: Date.now(),
  };
  write(COMP_KEY, [comp, ...list]);
  return comp;
}

export function removeComposition(id: string): void {
  write(COMP_KEY, listCompositions().filter((c) => c.id !== id));
}
