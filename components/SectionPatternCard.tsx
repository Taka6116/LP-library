"use client";

import type { SectionPattern } from "@/types/section";
import { getPreviewComponent } from "@/lib/previewMap";

type Props = {
  section: SectionPattern;
  selected: boolean;
  onSelect: (section: SectionPattern) => void;
  onRemove: (categoryId: string) => void;
};

export function SectionPatternCard({
  section,
  selected,
  onSelect,
  onRemove,
}: Props) {
  const Preview = getPreviewComponent(section.componentType);

  return (
    <article
      className={`overflow-hidden rounded-3xl border bg-white transition ${
        selected
          ? "border-sansan-400 ring-2 ring-sansan-200"
          : "border-slate-200 shadow-soft hover:-translate-y-0.5 hover:shadow-card"
      }`}
    >
      {/* Compact live preview of the actual section */}
      <div className="relative border-b border-slate-100 bg-slate-50">
        {selected && (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-sansan-600 px-2.5 py-1 text-xs font-semibold text-white shadow-soft">
            ✓ Selected
          </span>
        )}
        <div className="pointer-events-none max-h-56 overflow-hidden">
          {Preview ? (
            <Preview variant="card" />
          ) : (
            <div className="grid h-40 place-items-center text-sm text-slate-400">
              Preview not found
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">{section.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {section.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {section.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            おすすめ用途
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            {section.recommendedFor.join(" / ")}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {selected ? (
            <>
              <button
                type="button"
                disabled
                className="flex-1 cursor-default rounded-xl bg-sansan-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                ✓ Selected
              </button>
              <button
                type="button"
                onClick={() => onRemove(section.categoryId)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
              >
                Remove
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(section)}
              className="flex-1 rounded-xl border border-sansan-200 bg-sansan-50 px-4 py-2.5 text-sm font-semibold text-sansan-700 transition hover:bg-sansan-100"
            >
              Use this section
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
