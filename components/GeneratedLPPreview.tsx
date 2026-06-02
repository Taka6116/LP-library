"use client";

import { useState, useEffect, useRef } from "react";
import type { SectionCategory, SelectedSections } from "@/types/section";
import { getSection } from "@/data/sectionLibrary";
import { getPreviewComponent } from "@/lib/previewMap";
import { buildLpHtml, buildLpMarkdown, downloadTextFile } from "@/lib/exportLp";
import {
  listCompositions,
  saveComposition,
  removeComposition,
  type LpComposition,
} from "@/lib/lpCompositions";
import { GeneratedSectionWrapper } from "./GeneratedSectionWrapper";

type Props = {
  categories: SectionCategory[];
  selected: SelectedSections;
  order: string[];
  onReorder: (nextOrder: string[]) => void;
  onChangeCategory: (categoryId: string) => void;
  onRemove: (categoryId: string) => void;
  onLoadComposition: (comp: LpComposition) => void;
};

export function GeneratedLPPreview({
  categories,
  selected,
  order,
  onReorder,
  onChangeCategory,
  onRemove,
  onLoadComposition,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragItem = useRef<string | null>(null);

  // ---- Saved compositions ----
  const [comps, setComps] = useState<LpComposition[]>([]);
  const [compMenuOpen, setCompMenuOpen] = useState(false);
  useEffect(() => {
    setComps(listCompositions());
  }, []);

  function handleSaveComposition() {
    const name = window.prompt("この構成に名前を付けて保存します：", "");
    if (!name) return;
    saveComposition(name.trim() || "無題の構成", selected, order);
    setComps(listCompositions());
  }

  function handleDeleteComposition(id: string) {
    removeComposition(id);
    setComps(listCompositions());
  }

  // Build the ordered category list from the order prop
  const ordered = order
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is SectionCategory => !!c);

  // ---- Drag handlers ----
  function handleDragStart(categoryId: string) {
    dragItem.current = categoryId;
    setDraggingId(categoryId);
  }

  function handleDragEnter(targetId: string) {
    if (!dragItem.current || dragItem.current === targetId) return;
    const from = order.indexOf(dragItem.current);
    const to = order.indexOf(targetId);
    if (from === -1 || to === -1) return;
    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, dragItem.current);
    onReorder(next);
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

          {comps.length > 0 && (
            <div className="mx-auto mt-8 max-w-sm text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                保存した構成から読み込む
              </p>
              <ul className="space-y-1.5">
                {comps.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => onLoadComposition(c)}
                      className="flex-1 truncate text-left text-sm font-semibold text-slate-700 hover:text-violet-700"
                      title={c.name}
                    >
                      {c.name}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        {Object.keys(c.selected).length} sections
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteComposition(c.id)}
                      aria-label={`${c.name} を削除`}
                      className="grid h-6 w-6 place-items-center rounded-full text-slate-300 transition hover:bg-rose-100 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
            {/* 構成を保存 */}
            <button
              type="button"
              onClick={handleSaveComposition}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm font-bold text-slate-700 backdrop-blur transition hover:border-violet-300 hover:text-violet-700"
              title="この構成に名前を付けて保存"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 3h11l3 3v15H5V3z M8 3v5h7M8 21v-7h8v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              保存
            </button>

            {/* 構成を読み込む（ドロップダウン） */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCompMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm font-bold text-slate-700 backdrop-blur transition hover:border-violet-300 hover:text-violet-700"
              >
                構成 <span className="text-xs text-slate-400">{comps.length}</span>
                <span className="text-[10px]">▾</span>
              </button>
              {compMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setCompMenuOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 z-40 mt-1 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {comps.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-slate-400">
                        保存された構成はありません
                      </p>
                    ) : (
                      <ul className="max-h-72 overflow-y-auto py-1">
                        {comps.map((c) => (
                          <li
                            key={c.id}
                            className="flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-slate-50"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onLoadComposition(c);
                                setCompMenuOpen(false);
                              }}
                              className="flex-1 truncate text-left text-sm font-semibold text-slate-700"
                              title={c.name}
                            >
                              {c.name}
                              <span className="ml-1.5 text-xs font-normal text-slate-400">
                                {Object.keys(c.selected).length}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteComposition(c.id)}
                              aria-label={`${c.name} を削除`}
                              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-slate-300 transition hover:bg-rose-100 hover:text-rose-600"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>

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
