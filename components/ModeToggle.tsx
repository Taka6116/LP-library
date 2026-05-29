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
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
      {options.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition sm:px-4 ${
              active
                ? "bg-white text-sansan-700 shadow-soft"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
