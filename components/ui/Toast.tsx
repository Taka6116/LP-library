"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "@/lib/ui/cn";

export type ToastVariant = "success" | "error" | "info";

type Toast = { id: number; message: string; variant: ToastVariant };

type ToastCtx = {
  /** トーストを表示。失敗は variant:"error"（aria-live=assertive で読み上げ） */
  toast: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

const VARIANT: Record<ToastVariant, string> = {
  success: "border-success/40 bg-success/10 text-surface-fg",
  error: "border-danger/40 bg-danger/10 text-surface-fg",
  info: "border-border bg-surface text-surface-fg",
};

const DOT: Record<ToastVariant, string> = {
  success: "bg-success",
  error: "bg-danger",
  info: "bg-primary",
};

/**
 * アプリ全体の通知を集約する Provider。
 * copy / save / error などのフィードバックをここに一元化し、
 * `aria-live`（polite/assertive）でスクリーンリーダーにも届ける（ux-audit P0）。
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++seq.current;
      setToasts(prev => [...prev, { id, message, variant }]);
      window.setTimeout(() => remove(id), variant === "error" ? 5000 : 3000);
    },
    [remove],
  );

  const success = useCallback((m: string) => toast(m, "success"), [toast]);
  const error = useCallback((m: string) => toast(m, "error"), [toast]);

  const polite = toasts.filter(t => t.variant !== "error");
  const assertive = toasts.filter(t => t.variant === "error");

  return (
    <Ctx.Provider value={{ toast, success, error }}>
      {children}
      <ToastRegion toasts={polite} live="polite" onClose={remove} />
      <ToastRegion toasts={assertive} live="assertive" onClose={remove} />
    </Ctx.Provider>
  );
}

function ToastRegion({
  toasts,
  live,
  onClose,
}: {
  toasts: Toast[];
  live: "polite" | "assertive";
  onClose: (id: number) => void;
}) {
  return (
    <div
      role="status"
      aria-live={live}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-sm shadow-card backdrop-blur-xl animate-fadeIn",
            VARIANT[t.variant],
          )}
        >
          <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT[t.variant])} aria-hidden />
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => onClose(t.id)}
            aria-label="通知を閉じる"
            className="shrink-0 rounded p-0.5 text-surface-muted transition hover:text-surface-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

/** 通知を出すためのフック。ToastProvider 配下でのみ使用可。 */
export function useToast(): ToastCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast は ToastProvider の内側で使ってください");
  return ctx;
}
