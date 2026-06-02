"use client";

import type { SectionPattern } from "@/types/section";
import { getPreviewComponent } from "@/lib/previewMap";

type Props = {
  section: SectionPattern;
  selected: boolean;
  bookmarked?: boolean;
  onSelect: (section: SectionPattern) => void;
  onRemove: (categoryId: string) => void;
  onToggleBookmark?: (sectionId: string) => void;
};

export function SectionPatternCard({
  section,
  selected,
  bookmarked = false,
  onSelect,
  onRemove,
  onToggleBookmark,
}: Props) {
  const Preview = getPreviewComponent(section.componentType);

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition ${
        selected
          ? "border-sansan-400 ring-2 ring-sansan-200"
          : "border-slate-200 shadow-soft hover:shadow-card"
      }`}
    >
      {/* Control bar — sits above the section like an editor toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(section.id)}
                aria-label={bookmarked ? "お気に入りから外す" : "お気に入りに追加"}
                aria-pressed={bookmarked}
                title={bookmarked ? "お気に入りから外す" : "お気に入りに追加"}
                className={`shrink-0 text-lg leading-none transition ${
                  bookmarked
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-amber-400"
                }`}
              >
                {bookmarked ? "★" : "☆"}
              </button>
            )}
            <h3 className="truncate text-sm font-bold text-ink">
              {section.title}
            </h3>
            {selected && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sansan-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                ✓ 選択中
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {section.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {selected ? (
            <>
              <button
                type="button"
                disabled
                className="cursor-default rounded-full bg-sansan-600 px-4 py-2 text-xs font-semibold text-white"
              >
                ✓ Selected
              </button>
              <button
                type="button"
                onClick={() => onRemove(section.categoryId)}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
              >
                Remove
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(section)}
              className="rounded-full bg-sansan-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-sansan-700"
            >
              このセクションを使う
            </button>
          )}
        </div>
      </div>

      {/* Full live section — rendered exactly as it appears in a real LP.
          Clicking empty areas of the section selects it; interactive controls
          inside a preview (e.g. carousel arrows) call stopPropagation so they
          work without triggering selection. Keyboard users use the toolbar
          buttons above. */}
      <div className="relative">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          onClick={() => (selected ? onRemove(section.categoryId) : onSelect(section))}
          className="cursor-pointer"
        >
          {Preview ? (
            <Preview variant="full" />
          ) : (
            <div className="grid h-40 place-items-center text-sm text-slate-400">
              Preview not found
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
