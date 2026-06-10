"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDark } from "@/components/ThemeProvider";
import { useToast } from "@/components/ui";
import { listCompositions } from "@/lib/lpCompositions";
import { loadCopy, loadSwipe, type CopyItem, type SwipeItem } from "@/lib/swipe/store";
import { listDecks, type DeckMeta } from "@/lib/pptx/deckStore";
import { PROMPTS, type PromptItem } from "@/lib/prompts/data";
import { loadUserPrompts } from "@/lib/prompts/userStore";
import type { LpComposition } from "@/lib/lpCompositions";
import {
  IconLayers, IconPresentation, IconBookmark, IconMail, IconRepeat,
  IconPalette, IconSparkles, IconSearch, IconSun, IconMoon, IconCopy,
  IconArrowRight, IconExternalLink,
} from "@/components/icons";

type Entry = {
  id: string;
  group: string;
  label: string;
  sub?: string;
  keywords: string;
  icon: React.ReactNode;
  /** Enter / クリック時の動作 */
  run: () => void;
};

const MODULES = [
  { href: "/library", label: "LP Library", sub: "セクションを組み合わせてLP構成を作る", Icon: IconLayers },
  { href: "/ppt", label: "PPT Studio", sub: "デッキからスライドを選んで合成・書き出し", Icon: IconPresentation },
  { href: "/swipe", label: "Swipe Bank", sub: "参考URL・スクショ・コピーを貯める", Icon: IconBookmark },
  { href: "/email", label: "Mail Builder", sub: "HTMLメールを書き出し", Icon: IconMail },
  { href: "/social", label: "Social", sub: "X・LinkedIn・Instagramに最適化", Icon: IconRepeat },
  { href: "/brand", label: "Brand Kit", sub: "色・フォント・トーンを定義", Icon: IconPalette },
  { href: "/prompts", label: "プロンプト集", sub: "即使えるマーケ用プロンプト", Icon: IconSparkles },
] as const;

/**
 * アプリ全体の横断検索（コマンドパレット）。
 * Ctrl/Cmd+K で開き、モジュール移動・LP構成・コピーバンク・スワイプ・
 * PPTデッキ・プロンプトを一括検索できる。
 */
export function CommandPalette() {
  const router = useRouter();
  const toast = useToast();
  const { dark, toggle } = useDark();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // データ（開いたときに読み込み）
  const [comps, setComps] = useState<LpComposition[]>([]);
  const [copies, setCopies] = useState<CopyItem[]>([]);
  const [swipes, setSwipes] = useState<SwipeItem[]>([]);
  const [decks, setDecks] = useState<DeckMeta[]>([]);
  const [myPrompts, setMyPrompts] = useState<PromptItem[]>([]);

  // ショートカット
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(v => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 開いたらデータ読込 + フォーカス
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setCursor(0);
    try { setComps(listCompositions()); } catch { /* noop */ }
    try { setCopies(loadCopy()); } catch { /* noop */ }
    try { setMyPrompts(loadUserPrompts()); } catch { /* noop */ }
    loadSwipe().then(setSwipes).catch(() => {});
    listDecks().then(setDecks).catch(() => {});
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  const go = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  const entries = useMemo<Entry[]>(() => {
    const list: Entry[] = [];

    for (const m of MODULES) {
      list.push({
        id: `nav-${m.href}`, group: "移動", label: m.label, sub: m.sub,
        keywords: `${m.label} ${m.sub} ${m.href}`,
        icon: <m.Icon className="h-4 w-4" />,
        run: () => go(m.href),
      });
    }
    list.push({
      id: "act-dark", group: "アクション",
      label: dark ? "ライトモードに切替" : "ダークモードに切替",
      keywords: "dark light theme ダーク ライト テーマ 切替",
      icon: dark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />,
      run: () => { toggle(); setOpen(false); },
    });

    for (const c of comps) {
      list.push({
        id: `comp-${c.id}`, group: "LP構成", label: c.name,
        sub: `${Object.keys(c.selected).length} sections`,
        keywords: `lp 構成 composition ${c.name}`,
        icon: <IconLayers className="h-4 w-4" />,
        run: () => go("/library"),
      });
    }
    for (const d of decks) {
      list.push({
        id: `deck-${d.id}`, group: "PPTデッキ", label: d.name,
        sub: `${d.slideCount} スライド`,
        keywords: `ppt deck デッキ ${d.name}`,
        icon: <IconPresentation className="h-4 w-4" />,
        run: () => go("/ppt"),
      });
    }
    for (const s of swipes) {
      list.push({
        id: `swipe-${s.id}`, group: "スワイプ", label: s.title,
        sub: s.url || s.note || undefined,
        keywords: `swipe 参考 ${s.title} ${s.url} ${s.note} ${s.tags.join(" ")}`,
        icon: <IconExternalLink className="h-4 w-4" />,
        run: () => go("/swipe"),
      });
    }
    for (const c of copies) {
      list.push({
        id: `copy-${c.id}`, group: "コピーバンク",
        label: c.text.length > 60 ? `${c.text.slice(0, 60)}…` : c.text,
        sub: `${c.type} — Enterでコピー`,
        keywords: `copy コピー ${c.text} ${c.type} ${c.tags.join(" ")}`,
        icon: <IconCopy className="h-4 w-4" />,
        run: () => {
          navigator.clipboard?.writeText(c.text)
            .then(() => toast.success("コピーしました"))
            .catch(() => toast.error("コピーに失敗しました"));
          setOpen(false);
        },
      });
    }
    for (const p of [...myPrompts, ...PROMPTS]) {
      list.push({
        id: `prompt-${p.id}`, group: "プロンプト", label: p.title,
        sub: p.category,
        keywords: `prompt プロンプト ${p.title} ${p.category} ${p.tags.join(" ")} ${p.prompt.slice(0, 80)}`,
        icon: <IconSparkles className="h-4 w-4" />,
        run: () => go("/prompts"),
      });
    }
    return list;
  }, [comps, copies, swipes, decks, myPrompts, dark, go, toggle, toast]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) {
      // 空クエリ: 移動 + アクションのみ
      return entries.filter(e => e.group === "移動" || e.group === "アクション");
    }
    return entries
      .filter(e => q.split(/\s+/).every(w => e.keywords.toLowerCase().includes(w)))
      .slice(0, 30);
  }, [entries, q]);

  // カーソルを範囲内に
  useEffect(() => { setCursor(c => Math.min(c, Math.max(0, results.length - 1))); }, [results.length]);

  // キーボードナビ
  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); results[cursor]?.run(); }
  }

  // 選択行を視界内へ
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal aria-label="横断検索">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/90">
        <div className="flex items-center gap-2.5 border-b border-slate-200/70 px-4 dark:border-white/10">
          <IconSearch className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="検索（LP構成・コピー・スワイプ・デッキ・プロンプト…）"
            aria-label="横断検索"
            className="h-12 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500 sm:inline">esc</kbd>
        </div>
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-zinc-400">一致する項目がありません</p>
          )}
          {results.map((e, i) => {
            const showGroup = e.group !== lastGroup;
            lastGroup = e.group;
            return (
              <div key={e.id}>
                {showGroup && (
                  <p className="px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">{e.group}</p>
                )}
                <button
                  type="button"
                  data-idx={i}
                  onClick={e.run as () => void}
                  onMouseEnter={() => setCursor(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    i === cursor
                      ? "bg-violet-600/10 text-violet-900 dark:bg-violet-400/15 dark:text-violet-100"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    i === cursor
                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
                      : "bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
                  }`}>
                    {e.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{e.label}</span>
                    {e.sub && <span className="block truncate text-xs text-zinc-400 dark:text-zinc-500">{e.sub}</span>}
                  </span>
                  {i === cursor && <IconArrowRight className="h-4 w-4 shrink-0 text-violet-400" />}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-slate-200/70 px-4 py-2 text-[11px] text-zinc-400 dark:border-white/10 dark:text-zinc-500">
          <span>↑↓ 移動 / Enter 決定</span>
          <span>Ctrl(⌘)+K で開閉</span>
        </div>
      </div>
    </div>
  );
}
