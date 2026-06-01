"use client";

import { useState, useEffect, useRef } from "react";
import type { SectionCategory, SelectedSections } from "@/types/section";
import { getSection } from "@/data/sectionLibrary";
import { getPreviewComponent } from "@/lib/previewMap";
import { buildLpHtml, buildLpMarkdown, downloadTextFile } from "@/lib/exportLp";
import { GeneratedSectionWrapper } from "./GeneratedSectionWrapper";

type Props = {
  categories: SectionCategory[];
  selected: SelectedSections;
  onChangeCategory: (categoryId: string) => void;
  onRemove: (categoryId: string) => void;
};

export function GeneratedLPPreview({
  categories,
  selected,
  onChangeCategory,
  onRemove,
}: Props) {
  // ---- Drag-and-drop order state ----
  // orderedIds tracks the current display order as an array of categoryIds.
  // When selected changes, new items are appended (sorted by category.order);
  // removed items are filtered out.
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragItem = useRef<string | null>(null);

  // Sync orderedIds with selected (add new, remove deselected)
  useEffect(() => {
    const selectedIds = Object.keys(selected);
    setOrderedIds((prev) => {
      const kept = prev.filter((id) => selectedIds.includes(id));
      const added = selectedIds
        .filter((id) => !prev.includes(id))
        .sort((a, b) => {
          const orderA = categories.find((c) => c.id === a)?.order ?? 999;
          const orderB = categories.find((c) => c.id === b)?.order ?? 999;
          return orderA - orderB;
        });
      return [...kept, ...added];
    });
  }, [selected, categories]);

  // Build the ordered category list from orderedIds
  const ordered = orderedIds
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is SectionCategory => !!c);

  // ---- Drag handlers ----
  function handleDragStart(categoryId: string) {
    dragItem.current = categoryId;
    setDraggingId(categoryId);
  }

  function handleDragEnter(targetId: string) {
    if (!dragItem.current || dragItem.current === targetId) return;
    setOrderedIds((prev) => {
      const from = prev.indexOf(dragItem.current!);
      const to = prev.indexOf(targetId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, dragItem.current!);
      return next;
    });
  }

  function handleDragEnd() {
    dragItem.current = null;
    setDraggingId(null);
  }

  // ---- Export handlers ----
  function handleDownloadHtml() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    // Pass ordered category list to export so HTML respects drag order
    const html = buildLpHtml(ordered, selected, origin);
    downloadTextFile("generated-lp.html", html, "text/html;charset=utf-8");
  }

  function handleDownloadMarkdown() {
    const md = buildLpMarkdown(ordered, selected);
    downloadTextFile("generated-lp.md", md, "text/markdown;charset=utf-8");
  }

  if (ordered.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16">
          <h2 className="text-xl font-bold text-slate-800">
            まだLPが生成されていません
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Library モードでセクションを選択すると、ここに1本のLPとして合成されます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeInSlow">
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
        {/* ---- ツールバー ---- */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-soft backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs text-white shadow-sm">
              ✓
            </span>
            <p className="text-sm font-semibold text-slate-700">
              この構成でLPを書き出す
              <span className="ml-2 text-xs font-normal text-slate-400">
                {ordered.length} sections
              </span>
            </p>
            {/* ドラッグヒント */}
            <span className="hidden items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500 sm:inline-flex">
              <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor" className="text-slate-400" aria-hidden>
                <circle cx="3" cy="2" r="1.2" /><circle cx="9" cy="2" r="1.2" />
                <circle cx="3" cy="7" r="1.2" /><circle cx="9" cy="7" r="1.2" />
                <circle cx="3" cy="12" r="1.2" /><circle cx="9" cy="12" r="1.2" />
              </svg>
              ドラッグで順番を入れ替えできます
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              HTMLをダウンロード
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-sm font-bold text-violet-700 backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
            >
              Markdown
            </button>
          </div>
        </div>

        {/* ---- ブラウザフレーム ---- */}
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-card">
          {/* Chrome-like chrome bar */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-rose-300" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-300" />
            <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200">
              your-landing-page.com
            </span>
          </div>

          <div>
            {ordered.map((cat, i) => {
              const section = getSection(cat.id, selected[cat.id]);
              const Preview = section
                ? getPreviewComponent(section.componentType)
                : undefined;
              return (
                <GeneratedSectionWrapper
                  key={cat.id}
                  categoryLabel={cat.label}
                  patternTitle={section?.title ?? ""}
                  index={i}
                  onChange={() => onChangeCategory(cat.id)}
                  onRemove={() => onRemove(cat.id)}
                  onDragStart={() => handleDragStart(cat.id)}
                  onDragEnter={() => handleDragEnter(cat.id)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggingId === cat.id}
                >
                  {Preview ? (
                    <Preview variant="full" />
                  ) : (
                    <div className="grid h-40 place-items-center bg-slate-50 text-sm text-slate-400">
                      Preview not found
                    </div>
                  )}
                </GeneratedSectionWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
