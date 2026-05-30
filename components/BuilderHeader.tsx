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
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-4">
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
