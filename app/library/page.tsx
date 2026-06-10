"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { LpPlanModal } from "@/components/LpPlanModal";
import { AuroraBg } from "@/components/AuroraBg";
import { IconSearch, IconX } from "@/components/icons";
import { glassInput } from "@/lib/ui/glass";

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
  // 作業状態（選択 + 並び順）は SSR と一致させるため空で初期化し、
  // マウント後に localStorage から復元する（ハイドレーション不一致を防ぐ）。
  const [selected, setSelected] = useState<SelectedSections>({});
  const [order, setOrder] = useState<string[]>([]);
  // 復元完了までは自動保存を抑止し、空状態で上書き（クロバー）しないようにする。
  const hydratedRef = useRef(false);
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

  // マウント後に作業状態・お気に入りを localStorage から復元。
  useEffect(() => {
    const w = loadWorking();
    if (w) {
      if (w.selected) setSelected(w.selected);
      if (w.order) setOrder(w.order);
    }
    setBookmarks(loadBookmarks());
    hydratedRef.current = true;
  }, []);

  // 作業状態を自動保存（復元完了後のみ。空状態でのクロバーを防止）。
  useEffect(() => {
    if (!hydratedRef.current) return;
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

  // AI構成設計（LpPlanModal）
  const [aiPlanOpen, setAiPlanOpen] = useState(false);
  const handleApplyAiPlan = useCallback((sel: SelectedSections, ord: string[]) => {
    setSelected(sel);
    setOrder(ord);
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
  // SSR と一致させるため空初期化。復元は上のマウント effect で行う。
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  useEffect(() => {
    if (!hydratedRef.current) return;
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
    <div className="relative min-h-dvh">
      <AuroraBg />

      <BuilderHeader
        mode={mode}
        onModeChange={setMode}
        selectedCount={selectedCount}
        onReset={handleReset}
        onOpenSelected={() => setPanelOpen(true)}
        onOpenAiPlan={() => setAiPlanOpen(true)}
      />

      <LpPlanModal
        open={aiPlanOpen}
        onClose={() => setAiPlanOpen(false)}
        onApply={handleApplyAiPlan}
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
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="全カテゴリからセクションを検索"
                placeholder="全カテゴリから検索（名前・タグ・カテゴリ…）"
                className={`rounded-full py-2 pl-9 pr-9 shadow-sm ${glassInput}`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="検索をクリア"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  <IconX className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFavOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition ${
                favOnly
                  ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-400/50 dark:bg-amber-400/15 dark:text-amber-300"
                  : "border-white/60 bg-white/50 text-slate-600 backdrop-blur hover:border-amber-300 hover:text-amber-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-amber-300"
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
              <p className="text-sm font-semibold text-slate-600 dark:text-zinc-300">
                {favOnly ? "お気に入り" : "検索結果"}
                <span className="ml-2 text-slate-400">{searchResults.length} 件</span>
              </p>
              {searchResults.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center text-sm text-slate-400 dark:border-white/15 dark:bg-white/5 dark:text-zinc-500">
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
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
                      {activeCategory.label}
                    </h2>
                    <span className="text-sm text-slate-400 dark:text-zinc-500">
                      {activeCategory.labelJa}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
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
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-white/50 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80">
            <div className="flex items-center justify-between border-b border-white/60 px-5 py-4 dark:border-white/10">
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-zinc-200">
                Selected Sections
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 px-2 text-xs font-semibold text-white">
                  {selectedCount}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="閉じる"
                className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
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
