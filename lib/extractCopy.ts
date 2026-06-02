import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { SectionCategory, SelectedSections } from "@/types/section";
import { getSection } from "@/data/sectionLibrary";
import { getPreviewComponent } from "./previewMap";

// Extract reusable copy (headings + CTA labels) from the composed LP, so the
// text can be lifted into a snippet/swipe file. Runs client-side (uses
// DOMParser); renders each section to static markup and harvests text.

export type CopyGroup = {
  category: string;
  title: string;
  headings: string[];
  ctas: string[];
};

function clean(t: string | null): string {
  return (t ?? "").replace(/\s+/g, " ").trim();
}
function uniq(arr: string[]): string[] {
  return [...new Set(arr)].filter(Boolean);
}

export function extractCopy(
  ordered: SectionCategory[],
  selected: SelectedSections,
): CopyGroup[] {
  const groups: CopyGroup[] = [];
  for (const cat of ordered) {
    const section = getSection(cat.id, selected[cat.id]);
    if (!section) continue;
    const Preview = getPreviewComponent(section.componentType);
    if (!Preview) continue;

    let doc: Document;
    try {
      const html = renderToStaticMarkup(
        createElement(Preview, { variant: "full" }),
      );
      doc = new DOMParser().parseFromString(html, "text/html");
    } catch {
      continue;
    }

    const headings = uniq(
      [...doc.querySelectorAll("h1,h2,h3")].map((e) => clean(e.textContent)),
    );
    const ctas = uniq(
      [...doc.querySelectorAll("button,a")]
        .map((e) => clean(e.textContent))
        .filter((t) => t.length > 0 && t.length <= 40),
    );

    groups.push({
      category: `${cat.label} · ${cat.labelJa}`,
      title: section.title,
      headings,
      ctas,
    });
  }
  return groups;
}
