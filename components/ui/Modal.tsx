"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/ui/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** フッター（ボタン群など） */
  footer?: React.ReactNode;
  /** 最大幅クラス（既定 max-w-lg） */
  widthClass?: string;
  children: React.ReactNode;
};

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/**
 * 共通モーダル。scrim + Esc 閉じ + フォーカストラップ + 復帰フォーカスを内蔵。
 * library のスライドオーバー、ppt zoom、swipe lightbox、window.prompt 置換を統合する土台。
 */
export function Modal({ open, onClose, title, footer, widthClass = "max-w-lg", children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // 初期フォーカスをパネル内へ
    const t = window.setTimeout(() => {
      const node = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (node ?? panelRef.current)?.focus();
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      lastActive.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={onKeyDown}
    >
      {/* scrim */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeInSlow"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative w-full rounded-[var(--radius-lg)] border border-border bg-surface text-surface-fg shadow-card animate-fadeIn outline-none",
          widthClass,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="ml-auto rounded-[var(--radius-sm)] p-1 text-surface-muted transition hover:bg-primary-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
