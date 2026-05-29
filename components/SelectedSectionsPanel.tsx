"use client";

import type { SectionCategory, SelectedSections } from "@/types/section";
import { getSection } from "@/data/sectionLibrary";

type Props = {
  categories: SectionCategory[];
  selected: SelectedSections;
  onGeneratePreview: () => void;
  onReset: () => void;
  onJumpToCategory: (categoryId: string) => void;
  onRemove: (categoryId: string) => void;
};

export function SelectedSectionsPanel({
  categories,
  selected,
  onGeneratePreview,
  onReset,
  onJumpToCategory,
  onRemove,
}: Props) {
  // Show selected sections in LP order (category.order).
  const ordered = categories.filter((c) => selected[c.id]);
  const count = ordered.length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Selected Sections
        </h2>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-sansan-600 px-2 text-xs font-semibold text-white">
          {count}
        </span>
      </div>

      {count === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
          まだセクションが選択されていません。
          <br />
          各カテゴリから1つずつ選んでください。
        </p>
      ) : (
        <ol className="space-y-2">
          {ordered.map((cat, i) => {
            const section = getSection(cat.id, selected[cat.id]);
            return (
              <li
                key={cat.id}
                className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onJumpToCategory(cat.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block text-xs font-semibold text-sansan-600">
                    {cat.label}
                  </span>
                  <span className="block truncate text-sm font-medium text-slate-700">
                    {section?.title ?? selected[cat.id]}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(cat.id)}
                  aria-label={`Remove ${cat.label}`}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={onGeneratePreview}
          disabled={count === 0}
          className="w-full rounded-xl bg-sansan-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sansan-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate Preview
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={count === 0}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset Selection
        </button>
      </div>
    </div>
  );
}
