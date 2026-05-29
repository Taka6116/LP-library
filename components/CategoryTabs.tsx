"use client";

import type { SectionCategory, SelectedSections } from "@/types/section";

type Props = {
  categories: SectionCategory[];
  activeCategoryId: string;
  selected: SelectedSections;
  onSelectCategory: (categoryId: string) => void;
};

export function CategoryTabs({
  categories,
  activeCategoryId,
  selected,
  onSelectCategory,
}: Props) {
  return (
    <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {categories.map((cat) => {
        const active = cat.id === activeCategoryId;
        const isSelected = Boolean(selected[cat.id]);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={active}
            className={`group flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              active
                ? "border-sansan-300 bg-sansan-50 text-sansan-700 shadow-soft"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            <span>{cat.label}</span>
            {isSelected && (
              <span
                className={`grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold ${
                  active
                    ? "bg-sansan-600 text-white"
                    : "bg-emerald-500 text-white"
                }`}
                aria-label="selected"
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
