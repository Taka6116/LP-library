// User's own saved prompts (localStorage). Shown alongside the curated set.

import type { PromptItem } from "./data";

export type UserPrompt = PromptItem & { savedAt: number };

const KEY = "user-prompts";
const CAT_KEY = "user-prompt-categories";

// ---- User-defined categories ----
export function loadUserCategories(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(CAT_KEY);
    return s ? (JSON.parse(s) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveUserCategories(cats: string[]): void {
  try {
    localStorage.setItem(CAT_KEY, JSON.stringify([...new Set(cats)]));
  } catch {
    /* noop */
  }
}

export function addUserCategory(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  saveUserCategories([...loadUserCategories(), trimmed]);
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function loadUserPrompts(): UserPrompt[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(KEY);
    return s ? (JSON.parse(s) as UserPrompt[]).sort((a, b) => b.savedAt - a.savedAt) : [];
  } catch {
    return [];
  }
}

function save(list: UserPrompt[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* noop */
  }
}

export function addUserPrompt(input: {
  title: string;
  prompt: string;
  category: string;
  tags: string[];
}): UserPrompt {
  const item: UserPrompt = { id: "u-" + newId(), savedAt: Date.now(), ...input };
  save([item, ...loadUserPrompts()]);
  return item;
}

export function removeUserPrompt(id: string): void {
  save(loadUserPrompts().filter((p) => p.id !== id));
}
