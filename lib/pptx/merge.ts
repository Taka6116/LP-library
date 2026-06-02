import JSZip from "jszip";
import { PPTX_MIME, getSlideRefs, buildPptxSubset } from "./subset";

// ─────────────────────────────────────────────────────────────────────────────
// Cross-deck slide merge.
//
// Combines selected slides from MULTIPLE .pptx files into one new editable
// deck. Strategy: "namespace everything, merge all".
//   - Base = subset of the first deck (its selected slides) → keeps its
//     masters/layouts/theme/media intact.
//   - Each additional deck: copy its ENTIRE ppt/ subtree (slides, layouts,
//     masters, theme, media, notes…) under a unique filename prefix, rewrite
//     every .rels target + content-type override to the prefixed names, then
//     wire the selected slides (+ that deck's masters) into the base
//     presentation. Prefixing by construction avoids id/path collisions, and
//     copying the whole subtree guarantees every transitive dependency exists.
// Result: a valid, editable PowerPoint that PowerPoint opens without repair.
// ─────────────────────────────────────────────────────────────────────────────

export type DeckSelection = { buf: ArrayBuffer; indices: number[] };

// presentation-level parts that must NOT be copied from secondary decks
const EXCLUDE = new Set([
  "ppt/presentation.xml",
  "ppt/_rels/presentation.xml.rels",
  "ppt/presProps.xml",
  "ppt/viewProps.xml",
  "ppt/tableStyles.xml",
]);

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function dirOf(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}
function baseOf(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? path : path.slice(i + 1);
}
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
/** prefix the filename part of a path, keeping its directory */
function prefixName(path: string, prefix: string): string {
  return `${dirOf(path)}/${prefix}${baseOf(path)}`;
}
/** owner part path for a .rels file: ppt/x/_rels/y.rels → ppt/x/y */
function ownerOfRels(relsPath: string): string {
  return relsPath.replace("/_rels/", "/").replace(/\.rels$/, "");
}

async function readText(zip: JSZip, path: string): Promise<string | null> {
  const f = zip.file(path);
  return f ? await f.async("string") : null;
}

// Allocate unique relationship ids / element ids against the base presentation.
function maxRelId(relsXml: string): number {
  let max = 0;
  const re = /Id="rId(\d+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(relsXml))) max = Math.max(max, parseInt(m[1], 10));
  return max;
}
function maxSldId(presXml: string, tag: string): number {
  let max = 255;
  const re = new RegExp(`<${tag}\\b[^>]*\\bid="(\\d+)"`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(presXml))) max = Math.max(max, parseInt(m[1], 10));
  return max;
}

type MergeCtx = {
  presXml: string;
  presRels: string;
  ct: string;
  nextRid: number;
  nextSldId: number;
  nextMasterId: number;
};

async function mergeDeckInto(
  baseZip: JSZip,
  ctx: MergeCtx,
  srcBuf: ArrayBuffer,
  indices: number[],
  prefix: string,
): Promise<void> {
  const src = await JSZip.loadAsync(srcBuf);
  const refs = await getSlideRefs(src);
  const selectedSlideParts = indices
    .map((i) => refs[i]?.partPath)
    .filter((p): p is string => !!p);
  if (selectedSlideParts.length === 0) return;

  // 1) collect all copyable ppt/ parts (referenceable targets, excludes _rels)
  const srcCtXml = (await readText(src, "[Content_Types].xml")) ?? "";
  const ctOverride = new Map<string, string>(); // origPartName(/ppt/..) -> contentType
  for (const tag of srcCtXml.match(/<Override\b[^>]*\/>/g) ?? []) {
    const pn = tag.match(/PartName="([^"]+)"/)?.[1];
    const cty = tag.match(/ContentType="([^"]+)"/)?.[1];
    if (pn && cty) ctOverride.set(pn, cty);
  }
  const srcDefaults = new Map<string, string>(); // ext -> contentType
  for (const tag of srcCtXml.match(/<Default\b[^>]*\/>/g) ?? []) {
    const ext = tag.match(/Extension="([^"]+)"/)?.[1];
    const cty = tag.match(/ContentType="([^"]+)"/)?.[1];
    if (ext && cty) srcDefaults.set(ext.toLowerCase(), cty);
  }

  const allPaths = Object.keys(src.files).filter(
    (p) => p.startsWith("ppt/") && !src.files[p].dir,
  );
  // parts that can be referenced (exclude rels files + excluded parts)
  const copyParts = allPaths.filter(
    (p) => !EXCLUDE.has(p) && !p.includes("/_rels/"),
  );
  const copySet = new Set(copyParts);

  // 2) copy each part (binary as-is; .rels with target rewrite), prefixed
  const relsFiles = allPaths.filter(
    (p) => p.includes("/_rels/") && !EXCLUDE.has(p),
  );
  // copy referenceable parts
  for (const p of copyParts) {
    const data = await src.files[p].async("uint8array");
    baseZip.file(prefixName(p, prefix), data);
  }
  // copy + rewrite rels
  for (const rp of relsFiles) {
    let xml = (await src.files[rp].async("string")) ?? "";
    const owner = ownerOfRels(rp);
    const ownerDir = dirOf(owner);
    xml = xml.replace(/<Relationship\b[^>]*\/>/g, (tag) => {
      if (/TargetMode="External"/.test(tag)) return tag;
      const t = tag.match(/Target="([^"]+)"/)?.[1];
      if (!t || /^https?:/i.test(t)) return tag;
      const resolved = resolvePath(ownerDir, t);
      if (copySet.has(resolved)) {
        // prefix just the basename of the target
        const newT = t.replace(
          new RegExp(`${escapeRe(baseOf(t))}$`),
          `${prefix}${baseOf(t)}`,
        );
        return tag.replace(
          new RegExp(`Target="${escapeRe(t)}"`),
          `Target="${newT}"`,
        );
      }
      return tag;
    });
    baseZip.file(prefixName(rp, prefix), xml);
  }

  // 3) content types: merge defaults + add overrides for copied parts
  for (const [ext, cty] of srcDefaults) {
    if (!new RegExp(`<Default\\b[^>]*Extension="${escapeRe(ext)}"`, "i").test(ctx.ct)) {
      ctx.ct = ctx.ct.replace(
        /<\/Types>/,
        `<Default Extension="${ext}" ContentType="${cty}"/></Types>`,
      );
    }
  }
  for (const p of copyParts) {
    const cty = ctOverride.get("/" + p);
    if (cty) {
      const newPart = "/" + prefixName(p, prefix);
      ctx.ct = ctx.ct.replace(
        /<\/Types>/,
        `<Override PartName="${newPart}" ContentType="${cty}"/></Types>`,
      );
    }
  }

  // 4) wire selected slides + this deck's masters into base presentation
  const addRel = (type: string, target: string): string => {
    const rid = `rId${ctx.nextRid++}`;
    ctx.presRels = ctx.presRels.replace(
      /<\/Relationships>/,
      `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}" Target="${target}"/></Relationships>`,
    );
    return rid;
  };

  // slides → sldIdLst
  let sldIds = "";
  for (const sp of selectedSlideParts) {
    const target = "slides/" + prefix + baseOf(sp);
    const rid = addRel("slide", target);
    sldIds += `<p:sldId id="${ctx.nextSldId++}" r:id="${rid}"/>`;
  }
  ctx.presXml = ctx.presXml.replace(/<\/p:sldIdLst>/, `${sldIds}</p:sldIdLst>`);

  // masters → sldMasterIdLst (so the presentation is valid/complete)
  const masters = copyParts.filter((p) =>
    /^ppt\/slideMasters\/slideMaster\d+\.xml$/.test(p),
  );
  let masterIds = "";
  for (const mp of masters) {
    const target = "slideMasters/" + prefix + baseOf(mp);
    const rid = addRel("slideMaster", target);
    masterIds += `<p:sldMasterId id="${ctx.nextMasterId++}" r:id="${rid}"/>`;
  }
  if (masterIds) {
    if (/<p:sldMasterIdLst>/.test(ctx.presXml)) {
      ctx.presXml = ctx.presXml.replace(
        /<\/p:sldMasterIdLst>/,
        `${masterIds}</p:sldMasterIdLst>`,
      );
    } else if (/<p:sldMasterIdLst\s*\/>/.test(ctx.presXml)) {
      ctx.presXml = ctx.presXml.replace(
        /<p:sldMasterIdLst\s*\/>/,
        `<p:sldMasterIdLst>${masterIds}</p:sldMasterIdLst>`,
      );
    }
  }
}

/**
 * Merge selected slides from multiple decks into one editable .pptx Blob.
 * Slides appear deck-by-deck, in each deck's selected order.
 */
export async function buildMergedPptx(decks: DeckSelection[]): Promise<Blob> {
  const active = decks.filter((d) => d.indices.length > 0);
  if (active.length === 0) throw new Error("no slides selected");

  // single deck → reuse the proven subset path
  if (active.length === 1) {
    return buildPptxSubset(active[0].buf, active[0].indices);
  }

  // base = first deck's subset
  const baseBlob = await buildPptxSubset(active[0].buf, active[0].indices);
  const baseBuf = await baseBlob.arrayBuffer();
  const baseZip = await JSZip.loadAsync(baseBuf);

  const ctx: MergeCtx = {
    presXml: (await readText(baseZip, "ppt/presentation.xml")) ?? "",
    presRels: (await readText(baseZip, "ppt/_rels/presentation.xml.rels")) ?? "",
    ct: (await readText(baseZip, "[Content_Types].xml")) ?? "",
    nextRid: maxRelId(
      (await readText(baseZip, "ppt/_rels/presentation.xml.rels")) ?? "",
    ) + 1,
    nextSldId: maxSldId(
      (await readText(baseZip, "ppt/presentation.xml")) ?? "",
      "p:sldId",
    ) + 1,
    nextMasterId: maxSldId(
      (await readText(baseZip, "ppt/presentation.xml")) ?? "",
      "p:sldMasterId",
    ) + 1,
  };

  for (let i = 1; i < active.length; i++) {
    await mergeDeckInto(baseZip, ctx, active[i].buf, active[i].indices, `m${i}_`);
  }

  baseZip.file("ppt/presentation.xml", ctx.presXml);
  baseZip.file("ppt/_rels/presentation.xml.rels", ctx.presRels);
  baseZip.file("[Content_Types].xml", ctx.ct);

  return baseZip.generateAsync({ type: "blob", mimeType: PPTX_MIME });
}
