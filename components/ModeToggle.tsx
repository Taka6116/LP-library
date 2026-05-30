"use client";

import type { BuilderMode } from "@/types/section";

type Props = {
  mode: BuilderMode;
  onChange: (mode: BuilderMode) => void;
};

const options: { value: BuilderMode; label: string }[] = [
  { value: "library", label: "Library" },
  { value: "preview", label: "Generated LP" },
];

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full border border-white/70 bg-white/50 p-1 backdrop-blur">
      {options.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition sm:px-4 ${
              active
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                : "text-slate-500 hover:text-violet-700"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
