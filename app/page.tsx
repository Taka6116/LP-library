"use client";

import { useState } from "react";
import type {
  BuilderMode,
  SectionPattern,
  SelectedSections,
} from "@/types/section";
import { sortedCategories } from "@/data/sectionLibrary";
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
  const [selected, setSelected] = useState<SelectedSections>({});
  // 「選択済みセクション」はレイアウトを圧迫しないよう、右からのスライドオーバーで表示。
  const [panelOpen, setPanelOpen] = useState(false);

  const selectedCount = Object.keys(selected).length;
  const activeCategory =
    sortedCategories.find((c) => c.id === activeCategoryId) ??
    sortedCategories[0];

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
  }

  function handleJumpToCategory(categoryId: string) {
    setActiveCategoryId(categoryId);
    setMode("library");
    setPanelOpen(false);
  }

  function handleGeneratePreview() {
    setMode("preview");
    setPanelOpen(false);
  }

  return (
    <div className="min-h-screen">
      <BuilderHeader
        mode={mode}
        onModeChange={setMode}
        selectedCount={selectedCount}
        onReset={handleReset}
        onOpenSelected={() => setPanelOpen(true)}
      />

      {mode === "library" ? (
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
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
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      ) : (
        <main>
          <GeneratedLPPreview
            categories={sortedCategories}
            selected={selected}
            onChangeCategory={handleJumpToCategory}
            onRemove={handleRemove}
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
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                Selected Sections
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-sansan-600 px-2 text-xs font-semibold text-white">
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
