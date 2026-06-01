"use client";

import type { ReactNode } from "react";

type Props = {
  categoryLabel: string;
  patternTitle: string;
  index: number;
  onChange: () => void;
  onRemove: () => void;
  children: ReactNode;
  // Drag-and-drop props
  onDragStart?: () => void;
  onDragEnter?: () => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
};

// Wraps each section in the generated LP with a discreet management bar.
// The bar is intentionally low-profile so the LP reads as a real page, but
// gives quick access to swap (Change) or drop (Remove) the section.
// Also provides a drag handle for reordering.
export function GeneratedSectionWrapper({
  categoryLabel,
  patternTitle,
  index,
  onChange,
  onRemove,
  children,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging = false,
}: Props) {
  return (
    <div
      className={`group relative transition-opacity duration-150 ${isDragging ? "opacity-40" : "opacity-100"}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnter={() => onDragEnter?.()}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={() => onDragEnd?.()}
    >
      {/* Management bar — top-right, fades in on hover */}
      <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 px-2 py-1 text-xs shadow-soft backdrop-blur-sm opacity-70 transition group-hover:opacity-100">
        {/* Drag handle — 6-dot grid icon */}
        <span
          className="pointer-events-auto cursor-grab select-none text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          title="ドラッグして並び替え"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden>
            <circle cx="3" cy="2" r="1.2" />
            <circle cx="9" cy="2" r="1.2" />
            <circle cx="3" cy="7" r="1.2" />
            <circle cx="9" cy="7" r="1.2" />
            <circle cx="3" cy="12" r="1.2" />
            <circle cx="9" cy="12" r="1.2" />
          </svg>
        </span>
        <span className="w-px self-stretch bg-slate-200" aria-hidden />
        <span className="font-semibold text-sansan-600">{categoryLabel}</span>
        <span className="text-slate-300">·</span>
        <span className="max-w-[120px] truncate text-slate-500">
          {patternTitle}
        </span>
        <button
          type="button"
          onClick={onChange}
          className="pointer-events-auto rounded-lg bg-sansan-50 px-2 py-0.5 font-semibold text-sansan-700 transition hover:bg-sansan-100"
        >
          Change
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="pointer-events-auto rounded-lg px-1.5 py-0.5 font-semibold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
        >
          Remove
        </button>
      </div>

      {/* Order index badge on the left */}
      <span className="pointer-events-none absolute left-3 top-3 z-20 grid h-6 w-6 place-items-center rounded-full bg-slate-900/70 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
        {index + 1}
      </span>

      {/* Drop indicator line — shown when this item is the drag-over target */}
      <div
        className={`absolute inset-x-0 top-0 z-30 h-0.5 rounded-full bg-sansan-500 transition-opacity ${
          isDragging ? "opacity-0" : "opacity-0 group-data-[dragover=true]:opacity-100"
        }`}
      />

      {children}
    </div>
  );
}
