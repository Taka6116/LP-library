"use client";

import type { BuilderMode } from "@/types/section";
import { ModeToggle } from "./ModeToggle";

type Props = {
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
  selectedCount: number;
  onReset: () => void;
  onOpenSelected: () => void;
};

export function BuilderHeader({
  mode,
  onModeChange,
  selectedCount,
  onReset,
  onOpenSelected,
}: Props) {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      {/* 立体的なグラスバー: 半透明 + ブラー + ハイライト枠 + Violet系の落ち影 */}
      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-b from-white/85 to-white/55 px-4 py-3 shadow-[0_12px_34px_-12px_rgba(76,29,149,0.35)] ring-1 ring-inset ring-white/60 backdrop-blur-xl sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-4">
        {/* 上端の光沢ハイライト */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
        />
        {/* やわらかいVioletの艶 */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 h-32 w-40 rounded-full bg-violet-300/30 blur-2xl"
        />
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
              LP Builder Library
            </h1>
            <p className="text-xs text-slate-500">
              Select sections. Generate reusable landing pages.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <ModeToggle mode={mode} onChange={onModeChange} />
          <button
            type="button"
            onClick={onOpenSelected}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:text-violet-700"
          >
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 px-1.5 text-xs text-white">
              {selectedCount}
            </span>
            Selected
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={selectedCount === 0}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset Selection
          </button>
        </div>
      </div>
    </header>
  );
}
