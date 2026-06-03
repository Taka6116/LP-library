"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  BuilderMode,
  SectionPattern,
  SelectedSections,
} from "@/types/section";
import { sortedCategories } from "@/data/sectionLibrary";
import {
  loadWorking,
  saveWorking,
  type LpComposition,
} from "@/lib/lpCompositions";
import { loadBookmarks, saveBookmarks } from "@/lib/bookmarks";
import { BuilderHeader } from "@/components/BuilderHeader";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SectionPatternCard } from "@/components/SectionPatternCard";
import { SelectedSectionsPanel } from "@/components/SelectedSectionsPanel";
import { GeneratedLPPreview } from "@/components/GeneratedLPPreview";

// 開発確認用の初期選択サンプル（必要なときだけ有効化）:
// const initialSelectedSections: SelectedSections = {
//   hero: "hero-problem-first",
//   problem: "problem-hidden-cost",
//   solution: "solution-three-pillars",
//   benefit: "benefit-kpi-grid",
//   cta: "cta-final",
// };

export default function Page() {
  // 状態は今は useState。将来 Zustand などへ移行しやすいよう、
  // 操作はすべて下記のハンドラ経由に集約している。
  const [mode, setMode] = useState<BuilderMode>("library");
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    sortedCategories[0]?.id ?? "hero",
  );
  // 作業状態（選択 + 並び順）は localStorage から復元して初期化。
  const [selected, setSelected] = useState<SelectedSections>(
    () => loadWorking()?.selected ?? {},
  );
  const [order, setOrder] = useState<string[]>(
    () => loadWorking()?.order ?? [],
  );
  // 「選択済みセクション」はレイアウトを圧迫しないよう、右からのスライドオーバーで表示。
  const [panelOpen, setPanelOpen] = useState(false);

  const selectedCount = Object.keys(selected).length;
  const activeCategory =
    sortedCategories.find((c) => c.id === activeCategoryId) ??
    sortedCategories[0];

  // 並び順を選択状態と同期（新規は category.order で末尾追加、解除分は除去）。
  useEffect(() => {
    setOrder((prev) => {
      const ids = Object.keys(selected);
      const kept = prev.filter((id) => ids.includes(id));
      const added = ids
        .filter((id) => !prev.includes(id))
        .sort((a, b) => {
          const oa = sortedCategories.find((c) => c.id === a)?.order ?? 999;
          const ob = sortedCategories.find((c) => c.id === b)?.order ?? 999;
          return oa - ob;
        });
      const next = [...kept, ...added];
      if (next.length === prev.length && next.every((v, i) => v === prev[i])) {
        return prev;
      }
      return next;
    });
  }, [selected]);

  // 作業状態を自動保存（リロードしても消えない）。
  useEffect(() => {
    saveWorking({ selected, order });
  }, [selected, order]);

  function handleSelect(section: SectionPattern) {
    // 同カテゴリ内では1つだけ。別を選べば上書き。
    setSelected((prev) => ({ ...prev, [section.categoryId]: section.id }));
  }

  function handleRemove(categoryId: string) {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  }

  function handleReset() {
    setSelected({});
    setOrder([]);
  }

  const handleReorder = useCallback((nextOrder: string[]) => {
    setOrder(nextOrder);
  }, []);

  const handleLoadComposition = useCallback((comp: LpComposition) => {
    setSelected(comp.selected);
    setOrder(comp.order);
    setMode("preview");
    setPanelOpen(false);
  }, []);

  function handleJumpToCategory(categoryId: string) {
    setActiveCategoryId(categoryId);
    setMode("library");
    setPanelOpen(false);
  }

  function handleGeneratePreview() {
    setMode("preview");
    setPanelOpen(false);
  }

  // ---- Bookmarks + cross-category search ----
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadBookmarks());
  const [query, setQuery] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0 || favOnly;
  const searchResults = sortedCategories
    .flatMap((c) => c.sections.map((s) => ({ s, c })))
    .filter(({ s, c }) => {
      if (favOnly && !bookmarks.includes(s.id)) return false;
      if (!q) return true;
      const hay = [
        s.title,
        s.description,
        s.componentType,
        c.label,
        c.labelJa,
        ...s.tags,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

  return (
    <div className="relative min-h-screen">
      {/* 背景: 淡いVioletグラデーション + ブロブ（グラスモーフィズムの下地） */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-violet-50 via-white to-fuchsia-50"
      >
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <BuilderHeader
        mode={mode}
        onModeChange={setMode}
        selectedCount={selectedCount}
        onReset={handleReset}
        onOpenSelected={() => setPanelOpen(true)}
      />

      {mode === "library" ? (
        <main
          className={
            activeCategoryId === "cta" && !isSearching
              ? "mx-auto max-w-none px-3 py-6 sm:px-3 sm:py-8"
              : "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
          }
        >
          {/* 横断検索 + お気に入りフィルタ */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="全カテゴリから検索（名前・タグ・カテゴリ…）"
                className="w-full rounded-full border border-slate-200 bg-white/80 py-2 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="検索をクリア"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFavOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition ${
                favOnly
                  ? "border-amber-300 bg-amber-50 text-amber-600"
                  : "border-slate-200 bg-white/80 text-slate-600 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {favOnly ? "★" : "☆"} お気に入り
              <span className="text-xs font-normal text-slate-400">
                {bookmarks.length}
              </span>
            </button>
          </div>

          {isSearching ? (
            /* ---- 横断検索結果 ---- */
            <div className="animate-fadeIn space-y-4">
              <p className="text-sm font-semibold text-slate-600">
                {favOnly ? "お気に入り" : "検索結果"}
                <span className="ml-2 text-slate-400">{searchResults.length} 件</span>
              </p>
              {searchResults.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center text-sm text-slate-400">
                  {favOnly
                    ? "お気に入りはまだありません。各セクションの ☆ を押すと追加できます。"
                    : "一致するセクションがありません。"}
                </div>
              ) : (
                <div className="space-y-8">
                  {searchResults.map(({ s, c }) => (
                    <div key={s.id}>
                      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-violet-500">
                        {c.label} · {c.labelJa}
                      </div>
                      <SectionPatternCard
                        section={s}
                        selected={selected[c.id] === s.id}
                        bookmarked={bookmarks.includes(s.id)}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        onToggleBookmark={toggleBookmark}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <CategoryTabs
                categories={sortedCategories}
                activeCategoryId={activeCategoryId}
                selected={selected}
                onSelectCategory={setActiveCategoryId}
              />

              {activeCategory && (
                <div key={activeCategory.id} className="mt-6 animate-fadeIn space-y-4">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {activeCategory.label}
                    </h2>
                    <span className="text-sm text-slate-400">
                      {activeCategory.labelJa}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {activeCategory.description}
                  </p>

                  <div className="space-y-8">
                    {activeCategory.sections.map((section) => (
                      <SectionPatternCard
                        key={section.id}
                        section={section}
                        selected={selected[activeCategory.id] === section.id}
                        bookmarked={bookmarks.includes(section.id)}
                        onSelect={handleSelect}
                        onRemove={handleRemove}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      ) : (
        <main>
          <GeneratedLPPreview
            categories={sortedCategories}
            selected={selected}
            order={order}
            onReorder={handleReorder}
            onChangeCategory={handleJumpToCategory}
            onRemove={handleRemove}
            onLoadComposition={handleLoadComposition}
          />
        </main>
      )}

      {/* 選択済みセクション: 右からのスライドオーバー（本文幅を圧迫しない） */}
      {panelOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] animate-fadeInSlow"
            onClick={() => setPanelOpen(false)}
            aria-hidden
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/50 bg-white/80 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/60 px-5 py-4">
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Selected Sections
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 px-2 text-xs font-semibold text-white">
                  {selectedCount}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="閉じる"
                className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <SelectedSectionsPanel
                categories={sortedCategories}
                selected={selected}
                onGeneratePreview={handleGeneratePreview}
                onReset={handleReset}
                onJumpToCategory={handleJumpToCategory}
                onRemove={handleRemove}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
