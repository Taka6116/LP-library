"use client";

import type { SectionCategory, SelectedSections } from "@/types/section";
import { getSection } from "@/data/sectionLibrary";
import { getPreviewComponent } from "@/lib/previewMap";
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
  // Only selected categories, ordered by category.order — this is the LP.
  const ordered = categories.filter((c) => selected[c.id]);

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
      {/* Browser-chrome-like frame so it reads as a real page */}
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
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
