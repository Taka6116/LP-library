"use client";

import { useState } from "react";
import type { SectionPattern } from "@/types/section";
import { getPreviewComponent } from "@/lib/previewMap";
import { IconStar, IconCheck, IconChevronDown } from "@/components/icons";

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
  // Mobile: preview collapsed by default (summary-first). Desktop always shows it.
  const [openOnMobile, setOpenOnMobile] = useState(false);

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition ${
        selected
          ? "border-sansan-400 ring-2 ring-sansan-200"
          : "border-slate-200 shadow-soft hover:shadow-card"
      }`}
    >
      {/* Summary bar — title, tags, use-case, primary CTA */}
      <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {onToggleBookmark && (
                <button
                  type="button"
                  onClick={() => onToggleBookmark(section.id)}
                  aria-label={bookmarked ? "お気に入りから外す" : "お気に入りに追加"}
                  aria-pressed={bookmarked}
                  title={bookmarked ? "お気に入りから外す" : "お気に入りに追加"}
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    bookmarked ? "text-amber-400" : "text-slate-300 hover:text-amber-400"
                  }`}
                >
                  <IconStar className="h-[18px] w-[18px]" filled={bookmarked} />
                </button>
              )}
              <h3 className="truncate text-sm font-bold text-ink sm:text-[15px]">
                {section.title}
              </h3>
              {selected && (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-sansan-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  <IconCheck className="h-3 w-3" /> 選択中
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {section.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
            {section.recommendedFor?.length > 0 && (
              <p className="mt-1.5 truncate text-[11px] text-slate-400">
                用途: {section.recommendedFor.slice(0, 3).join(" / ")}
              </p>
            )}
          </div>

          {/* Primary action — 44px tap target */}
          <div className="flex shrink-0 items-center gap-2">
            {selected ? (
              <button
                type="button"
                onClick={() => onRemove(section.categoryId)}
                className="inline-flex h-11 items-center rounded-full border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                外す
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelect(section)}
                className="inline-flex h-11 items-center rounded-full bg-sansan-600 px-4 text-xs font-semibold text-white transition hover:bg-sansan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sansan-400 focus-visible:ring-offset-2 sm:px-5"
              >
                このセクションを使う
              </button>
            )}
          </div>
        </div>

        {/* Mobile-only: toggle the live preview (avoids unreadable shrink) */}
        {Preview && (
          <button
            type="button"
            onClick={() => setOpenOnMobile((v) => !v)}
            aria-expanded={openOnMobile}
            className="mt-2.5 inline-flex h-9 items-center gap-1 text-xs font-semibold text-sansan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sansan-400 sm:hidden"
          >
            実物プレビューを{openOnMobile ? "隠す" : "見る"}
            <IconChevronDown className={`h-4 w-4 transition ${openOnMobile ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Live preview — collapsed on mobile unless toggled; always shown on desktop */}
      <div className={`relative ${openOnMobile ? "block" : "hidden"} sm:block`}>
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
