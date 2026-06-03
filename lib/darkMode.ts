const KEY = "lp-dark-mode";

export function loadDarkPref(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(KEY);
  if (stored !== null) return stored === "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function saveDarkPref(dark: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, dark ? "dark" : "light");
}

export function applyDark(dark: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
}
