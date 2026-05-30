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
            className={`group flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 ${
              active
                ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
                : "border border-white/70 bg-white/60 text-slate-600 backdrop-blur hover:bg-white hover:text-violet-700"
            }`}
          >
            <span>{cat.label}</span>
            {isSelected && (
              <span
                className={`grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold ${
                  active
                    ? "bg-white/25 text-white"
                    : "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
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
