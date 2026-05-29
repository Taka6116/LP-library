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
  }

  return (
    <div className="min-h-screen">
      <BuilderHeader
        mode={mode}
        onModeChange={setMode}
        selectedCount={selectedCount}
        onReset={handleReset}
      />

      {mode === "library" ? (
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* 左: カテゴリタブ + セクション一覧 */}
            <div className="space-y-5">
              <div>
                <CategoryTabs
                  categories={sortedCategories}
                  activeCategoryId={activeCategoryId}
                  selected={selected}
                  onSelectCategory={setActiveCategoryId}
                />
              </div>

              {activeCategory && (
                <div key={activeCategory.id} className="animate-fadeIn space-y-4">
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

                  <div className="space-y-6">
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
            </div>

            {/* 右: 選択済みサマリー（PCではsticky） */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <SelectedSectionsPanel
                categories={sortedCategories}
                selected={selected}
                onGeneratePreview={() => setMode("preview")}
                onReset={handleReset}
                onJumpToCategory={handleJumpToCategory}
                onRemove={handleRemove}
              />
            </aside>
          </div>
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
    </div>
  );
}
