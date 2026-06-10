"use client";

import type { SectionCategory, SelectedSections } from "@/types/section";
import { IconCheck } from "@/components/icons";

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
    <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1.5">
      {categories.map((cat) => {
        const active = cat.id === activeCategoryId;
        const isSelected = Boolean(selected[cat.id]);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={active}
            className={`group flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 ${
              active
                ? "bg-violet-600 text-white shadow-sm"
                : "border border-white/60 bg-white/60 text-slate-600 backdrop-blur hover:border-violet-300 hover:text-violet-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-violet-300"
            }`}
          >
            <span>{cat.label}</span>
            {isSelected && (
              <span
                className={`grid h-4 w-4 place-items-center rounded-full ${
                  active ? "bg-white/25 text-white" : "bg-violet-600 text-white"
                }`}
                aria-label="選択済み"
              >
                <IconCheck className="h-2.5 w-2.5" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
