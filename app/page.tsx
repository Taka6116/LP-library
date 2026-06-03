"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDark } from "@/components/ThemeProvider";
import { listCompositions } from "@/lib/lpCompositions";
import { loadBookmarks } from "@/lib/bookmarks";
import { loadCopy, loadSwipe } from "@/lib/swipe/store";
import { listDecks } from "@/lib/pptx/deckStore";
import { loadBrand } from "@/lib/brand/store";
import {
  IconLayers, IconPresentation, IconBookmark, IconMail, IconRepeat,
  IconPalette, IconSun, IconMoon, IconArrowRight, IconTool,
} from "@/components/icons";

const MODULES = [
  { href: "/library", Icon: IconLayers,       name: "LP Library",   nameJa: "セクションを組み合わせてLP・資料の構成を作る", tint: "text-indigo-600 dark:text-indigo-400", tintBg: "bg-indigo-50 dark:bg-indigo-500/10" },
  { href: "/ppt",     Icon: IconPresentation, name: "PPT Studio",   nameJa: "複数デッキからスライドを選んで合成・書き出し", tint: "text-amber-600 dark:text-amber-400",   tintBg: "bg-amber-50 dark:bg-amber-500/10" },
  { href: "/swipe",   Icon: IconBookmark,     name: "Swipe Bank",   nameJa: "参考URL・スクショ・コピースニペットを貯める", tint: "text-rose-600 dark:text-rose-400",     tintBg: "bg-rose-50 dark:bg-rose-500/10" },
  { href: "/email",   Icon: IconMail,         name: "Mail Builder", nameJa: "ブロックを組み合わせてHTMLメールを書き出し", tint: "text-emerald-600 dark:text-emerald-400", tintBg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { href: "/social",  Icon: IconRepeat,       name: "Social",       nameJa: "1本の内容をX・LinkedIn・Instagramに最適化", tint: "text-sky-600 dark:text-sky-400",       tintBg: "bg-sky-50 dark:bg-sky-500/10" },
  { href: "/brand",   Icon: IconPalette,      name: "Brand Kit",    nameJa: "色・フォント・トーンを定義し全体に適用",     tint: "text-violet-600 dark:text-violet-400", tintBg: "bg-violet-50 dark:bg-violet-500/10" },
] as const;

export default function DashboardPage() {
  const { dark, toggle } = useDark();
  const [stats, setStats] = useState({ compositions: 0, bookmarks: 0, copyBank: 0, pptDecks: 0, swipes: 0 });
  const [brandName, setBrandName] = useState("");
  const [recent, setRecent] = useState<{ name: string; sections: number }[]>([]);

  useEffect(() => {
    const comps = listCompositions();
    const brand = loadBrand();
    setStats(s => ({ ...s, compositions: comps.length, bookmarks: loadBookmarks().length, copyBank: loadCopy().length }));
    setBrandName(brand.companyName !== "Your Company" ? brand.companyName : "");
    setRecent(comps.slice(0, 4).map(c => ({ name: c.name, sections: Object.keys(c.selected).length })));
    listDecks().then(d => setStats(s => ({ ...s, pptDecks: d.length }))).catch(() => {});
    loadSwipe().then(sw => setStats(s => ({ ...s, swipes: sw.length }))).catch(() => {});
  }, []);

  const STATS = [
    { label: "LP構成", value: stats.compositions, href: "/library" },
    { label: "お気に入り", value: stats.bookmarks, href: "/library" },
    { label: "コピー", value: stats.copyBank, href: "/swipe" },
    { label: "PPTデッキ", value: stats.pptDecks, href: "/ppt" },
    { label: "スワイプ", value: stats.swipes, href: "/swipe" },
  ];

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Top bar — thin, sticky, hairline border */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <IconTool className="h-4 w-4" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Marketer&apos;s Studio</span>
            {brandName && (
              <span className="hidden rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 sm:inline">
                {brandName}
              </span>
            )}
          </div>
          <button type="button" onClick={toggle}
            aria-label={dark ? "ライトモードに切替" : "ダークモードに切替"}
            className="grid h-8 w-8 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
            {dark ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        {/* Heading — left aligned, restrained */}
        <div className="mb-10">
          <p className="mb-1.5 text-sm font-medium text-zinc-400 dark:text-zinc-500">ワークスペース</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">今日は何を作りますか？</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            LP・スライド・メール・SNS投稿——マーケティング制作を一つのワークスペースで。
          </p>
        </div>

        {/* Stats — compact, hairline-separated inline */}
        <div className="mb-10 flex flex-wrap items-stretch divide-x divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {STATS.map(s => (
            <Link key={s.label} href={s.href}
              className="group flex flex-1 flex-col gap-0.5 px-5 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <span className="font-mono text-xl font-semibold tabular-nums tracking-tight">{s.value}</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.label}</span>
            </Link>
          ))}
        </div>

        {/* Modules — refined cards, subtle tinted icon, hairline border */}
        <h2 className="mb-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">モジュール</h2>
        <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map(({ href, Icon, name, nameJa, tint, tintBg }) => (
            <Link key={href} href={href}
              className="group relative flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${tintBg} ${tint}`}>
                  <Icon className="h-[22px] w-[22px]" />
                </div>
                <IconArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-400" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">{name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{nameJa}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent */}
        {recent.length > 0 && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">最近のLP構成</h2>
              <Link href="/library" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                すべて見る
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {recent.map((c, i) => (
                <Link key={c.name + i} href="/library"
                  className={`flex items-center gap-3 px-5 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${i > 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <IconLayers className="h-4 w-4" />
                  </div>
                  <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                  <span className="font-mono text-xs tabular-nums text-zinc-400">{c.sections} sections</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
