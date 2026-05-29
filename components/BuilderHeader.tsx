"use client";

import type { BuilderMode } from "@/types/section";
import { ModeToggle } from "./ModeToggle";

type Props = {
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
  selectedCount: number;
  onReset: () => void;
};

export function BuilderHeader({
  mode,
  onModeChange,
  selectedCount,
  onReset,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sansan-600 text-sm font-bold text-white">
            LP
          </div>
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
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700">
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sansan-600 px-1.5 text-xs text-white">
              {selectedCount}
            </span>
            Selected
          </span>
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
