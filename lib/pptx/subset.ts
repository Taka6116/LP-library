import JSZip from "jszip";

// ─────────────────────────────────────────────────────────────────────────────
// PPTX slide subset utilities
//
// A .pptx is a ZIP (OPC package). We extract a subset of slides by editing a
// *copy* of the original package in place:
//   - keep all shared parts (masters / layouts / theme / media) → full fidelity
//   - drop unselected slides: remove the slide part + its rels + notesSlide,
//     and prune the references in presentation.xml, presentation.xml.rels and
//     [Content_Types].xml
// The result is a valid, editable PowerPoint file containing only the chosen
// slides, in the same order as the source `<p:sldIdLst>`.
// ─────────────────────────────────────────────────────────────────────────────

export const PPTX_MIME =
  "application/vnd.openxmlformats-officedocument.presentationml.presentation";

export type SlideRef = {
  /** relationship id referenced from presentation.xml `<p:sldId r:id="...">` */
  rId: string;
  /** zip path of the slide part, e.g. "ppt/slides/slide1.xml" */
  partPath: string;
  /** zip path of the slide's .rels, e.g. "ppt/slides/_rels/slide1.xml.rels" */
  relsPath: string;
  /** zip path of the associated notesSlide, if any */
  notesPartPath?: string;
};

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Resolve an OPC relative target against a base directory (zip-style path). */
function resolvePath(baseDir: string, target: string): string {
  if (target.startsWith("/")) return target.replace(/^\/+/, "");
  const parts = (baseDir + "/" + target).split("/");
  const stack: string[] = [];
  for (const p of parts) {
    if (p === "" || p === ".") continue;
    if (p === "..") stack.pop();
    else stack.push(p);
  }
  return stack.join("/");
}

async function readText(zip: JSZip, path: string): Promise<string | null> {
  const f = zip.file(path);
  return f ? await f.async("string") : null;
}

function relsPathFor(partPath: string): string {
  const i = partPath.lastIndexOf("/");
  const dir = partPath.slice(0, i);
  const base = partPath.slice(i + 1);
  return `${dir}/_rels/${base}.rels`;
}

type RelInfo = { target: string; type: string };

function parseRels(relsXml: string): Map<string, RelInfo> {
  const map = new Map<string, RelInfo>();
  const tags = relsXml.match(/<Relationship\b[^>]*\/>/g) || [];
  for (const tag of tags) {
    const id = tag.match(/\bId="([^"]+)"/)?.[1];
    const target = tag.match(/\bTarget="([^"]+)"/)?.[1];
    const type = tag.match(/\bType="([^"]+)"/)?.[1] ?? "";
    if (id && target) map.set(id, { target, type });
  }
  return map;
}

/**
 * Returns the ordered list of slides (matching `<p:sldIdLst>` order), each with
 * its part path and associated notesSlide. Order aligns with how pptx-preview
 * renders slides, so grid indices map 1:1.
 */
export async function getSlideRefs(zip: JSZip): Promise<SlideRef[]> {
  const pres = await readText(zip, "ppt/presentation.xml");
  const presRelsXml = await readText(zip, "ppt/_rels/presentation.xml.rels");
  if (!pres || !presRelsXml) return [];

  // ordered relationship ids from sldIdLst
  const lst = pres.match(/<p:sldIdLst[\s\S]*?<\/p:sldIdLst>/)?.[0] ?? "";
  const rIds: string[] = [];
  const re = /<p:sldId\b[^>]*\br:id="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(lst))) rIds.push(m[1]);

  const presRels = parseRels(presRelsXml);

  const refs: SlideRef[] = [];
  for (const rId of rIds) {
    const rel = presRels.get(rId);
    if (!rel) continue;
    const partPath = resolvePath("ppt", rel.target);
    const relsPath = relsPathFor(partPath);

    // find notesSlide via the slide's own rels
    let notesPartPath: string | undefined;
    const slideRelsXml = await readText(zip, relsPath);
    if (slideRelsXml) {
      const slideDir = partPath.slice(0, partPath.lastIndexOf("/"));
      for (const info of parseRels(slideRelsXml).values()) {
        if (info.type.endsWith("/notesSlide")) {
          notesPartPath = resolvePath(slideDir, info.target);
        }
      }
    }
    refs.push({ rId, partPath, relsPath, notesPartPath });
  }
  return refs;
}

function removeSelfClosingByAttr(
  xml: string,
  tag: string,
  attr: string,
  value: string,
): string {
  const re = new RegExp(
    `<${tag}\\b[^>]*\\b${attr}="${escapeRe(value)}"[^>]*/>\\s*`,
  );
  return xml.replace(re, "");
}

/**
 * Build a new .pptx Blob containing only the slides at `keepIndices`
 * (indices into the ordered list from getSlideRefs). Operates on a fresh copy
 * loaded from `buf`, so the source is never mutated.
 */
export async function buildPptxSubset(
  buf: ArrayBuffer,
  keepIndices: number[],
): Promise<Blob> {
  const zip = await JSZip.loadAsync(buf);
  const refs = await getSlideRefs(zip);
  const keep = new Set(keepIndices);

  let pres = (await readText(zip, "ppt/presentation.xml")) ?? "";
  let presRels = (await readText(zip, "ppt/_rels/presentation.xml.rels")) ?? "";
  let ct = (await readText(zip, "[Content_Types].xml")) ?? "";

  // notesSlides still referenced by a kept slide must be preserved
  const keptNotes = new Set(
    refs.filter((_, i) => keep.has(i)).map((r) => r.notesPartPath).filter(Boolean) as string[],
  );

  refs.forEach((r, i) => {
    if (keep.has(i)) return;

    // prune references
    pres = removeSelfClosingByAttr(pres, "p:sldId", "r:id", r.rId);
    presRels = removeSelfClosingByAttr(presRels, "Relationship", "Id", r.rId);
    ct = removeSelfClosingByAttr(ct, "Override", "PartName", "/" + r.partPath);

    // delete slide part + rels
    zip.remove(r.partPath);
    zip.remove(r.relsPath);

    // delete the notesSlide unless a kept slide still uses it
    if (r.notesPartPath && !keptNotes.has(r.notesPartPath)) {
      zip.remove(r.notesPartPath);
      zip.remove(relsPathFor(r.notesPartPath));
      ct = removeSelfClosingByAttr(ct, "Override", "PartName", "/" + r.notesPartPath);
    }
  });

  zip.file("ppt/presentation.xml", pres);
  zip.file("ppt/_rels/presentation.xml.rels", presRels);
  zip.file("[Content_Types].xml", ct);

  return zip.generateAsync({ type: "blob", mimeType: PPTX_MIME });
}
