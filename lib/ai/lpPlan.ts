// AI による LP 構成プラン生成。
// sectionLibrary のカタログを AI に渡し、商材・ターゲットに合うセクション構成
// （カテゴリ → セクションID + 理由）を JSON で提案させる。

import { sectionCategories } from "@/data/sectionLibrary";
import type { SelectedSections } from "@/types/section";

export type LpPlanInput = {
  /** 商材・サービスの説明（必須） */
  product: string;
  /** ターゲット（任意） */
  target?: string;
  /** LPのゴール/CV（任意） */
  goal?: string;
};

export type LpPlanItem = {
  categoryId: string;
  sectionId: string;
  reason: string;
};

export type LpPlan = {
  items: LpPlanItem[];
  /** SelectedSections 形式（categoryId → sectionId） */
  selected: SelectedSections;
  /** カテゴリIDの並び順 */
  order: string[];
};

/** AI に渡す軽量カタログ（id / タイトル / 向き）を生成する。 */
export function sectionCatalogForAi(): string {
  return sectionCategories
    .map((cat) => {
      const lines = cat.sections.map(
        (s) => `  - ${s.id}: ${s.title}（向き: ${(s.recommendedFor ?? []).join("、") || s.tags.join("、")}）`,
      );
      return `■ ${cat.id}（${cat.labelJa} / ${cat.description}）\n${lines.join("\n")}`;
    })
    .join("\n");
}

export function buildLpPlanRequest(input: LpPlanInput): { prompt: string; system: string } {
  const system =
    "あなたはLP設計のプロフェッショナルです。" +
    "与えられたセクションカタログの中から、商材に最適なLP構成を設計します。" +
    "出力はJSONのみ。説明文・前置き・コードフェンスは不要です。";

  const prompt = `以下の商材のランディングページ構成を設計してください。

【商材・サービス】
${input.product}
${input.target ? `\n【ターゲット】\n${input.target}` : ""}
${input.goal ? `\n【LPのゴール（CV）】\n${input.goal}` : ""}

【セクションカタログ】（この中から選ぶこと。IDは正確に）
${sectionCatalogForAi()}

【ルール】
- 1カテゴリにつき最大1セクション。使わないカテゴリがあってよい
- 5〜8カテゴリ程度で、ストーリーが流れる順に並べる
- 各選択に短い理由（30字程度）を付ける

【出力形式】（JSONのみ）
{"sections":[{"categoryId":"hero","sectionId":"<カタログのID>","reason":"<選定理由>"}, ...]}`;

  return { prompt, system };
}

/**
 * AI 応答から LpPlan を取り出す。
 * - コードフェンスや前置きが混ざっても最初の { から最後の } までを抽出
 * - カタログに存在しない categoryId/sectionId、カテゴリ不一致、重複カテゴリは除外
 * - 有効なセクションが1つも無ければ null
 */
export function parseLpPlan(text: string): LpPlan | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  let raw: unknown;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }

  const arr = (raw as { sections?: unknown }).sections;
  if (!Array.isArray(arr)) return null;

  const catMap = new Map(sectionCategories.map((c) => [c.id, c]));
  const items: LpPlanItem[] = [];
  const seenCats = new Set<string>();

  for (const it of arr) {
    const categoryId = String((it as LpPlanItem)?.categoryId ?? "");
    const sectionId = String((it as LpPlanItem)?.sectionId ?? "");
    const reason = String((it as LpPlanItem)?.reason ?? "");
    const cat = catMap.get(categoryId);
    if (!cat || seenCats.has(categoryId)) continue;
    if (!cat.sections.some((s) => s.id === sectionId)) continue;
    seenCats.add(categoryId);
    items.push({ categoryId, sectionId, reason });
  }

  if (items.length === 0) return null;

  const selected: SelectedSections = {};
  for (const it of items) selected[it.categoryId] = it.sectionId;
  return { items, selected, order: items.map((it) => it.categoryId) };
}

/** 表示用: categoryId → 日本語ラベル / sectionId → タイトル */
export function planLabels(item: LpPlanItem): { category: string; section: string } {
  const cat = sectionCategories.find((c) => c.id === item.categoryId);
  const sec = cat?.sections.find((s) => s.id === item.sectionId);
  return {
    category: cat ? `${cat.label}（${cat.labelJa}）` : item.categoryId,
    section: sec?.title ?? item.sectionId,
  };
}
