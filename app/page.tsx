"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDark } from "@/components/ThemeProvider";
import { listCompositions } from "@/lib/lpCompositions";
import { loadBookmarks } from "@/lib/bookmarks";
import { loadCopy, loadSwipe } from "@/lib/swipe/store";
import { listDecks } from "@/lib/pptx/deckStore";
import { loadBrand } from "@/lib/brand/store";

const MODULES = [
  {
    href: "/library",
    icon: "🧱",
    name: "LP Library",
    nameJa: "LPライブラリ",
    desc: "セクションを組み合わせてLP・資料の構成を作る",
    gradient: "from-violet-600 to-fuchsia-500",
    border: "border-violet-200 dark:border-violet-800",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    href: "/ppt",
    icon: "📊",
    name: "PPT Studio",
    nameJa: "スライド抽出",
    desc: "複数デッキからスライドを選んで合成・書き出し",
    gradient: "from-orange-500 to-amber-500",
    border: "border-orange-200 dark:border-orange-800",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    href: "/swipe",
    icon: "◆",
    name: "Swipe Bank",
    nameJa: "参考・文言",
    desc: "参考URL・スクショ・コピースニペットを貯める",
    gradient: "from-rose-500 to-pink-500",
    border: "border-rose-200 dark:border-rose-800",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    href: "/email",
    icon: "✉",
    name: "Mail Builder",
    nameJa: "メール作成",
    desc: "ブロックを組み合わせてHTMLメールを書き出し",
    gradient: "from-emerald-500 to-teal-500",
    border: "border-emerald-200 dark:border-emerald-800",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    href: "/social",
    icon: "↻",
    name: "Social Repurpose",
    nameJa: "SNS展開",
    desc: "1本の内容をX・LinkedIn・Instagramに最適化",
    gradient: "from-sky-500 to-cyan-500",
    border: "border-sky-200 dark:border-sky-800",
    bg: "bg-sky-50 dark:bg-sky-950/30",
  },
  {
    href: "/brand",
    icon: "🎨",
    name: "Brand Kit",
    nameJa: "ブランド設定",
    desc: "色・フォント・トーンを1か所で定義し全体に適用",
    gradient: "from-violet-600 to-indigo-500",
    border: "border-indigo-200 dark:border-indigo-800",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
] as const;

type Stats = {
  compositions: number;
  bookmarks: number;
  copyBank: number;
  pptDecks: number;
  swipes: number;
  brandName: string;
};

export default function DashboardPage() {
  const { dark, toggle } = useDark();
  const [stats, setStats] = useState<Stats>({
    compositions: 0,
    bookmarks: 0,
    copyBank: 0,
    pptDecks: 0,
    swipes: 0,
    brandName: "",
  });
  const [recentComps, setRecentComps] = useState<{ name: string; sections: number }[]>([]);

  useEffect(() => {
    const comps = listCompositions();
    const bm = loadBookmarks();
    const cp = loadCopy();
    const brand = loadBrand();
    setStats({
      compositions: comps.length,
      bookmarks: bm.length,
      copyBank: cp.length,
      pptDecks: 0,
      swipes: 0,
      brandName: brand.companyName !== "Your Company" ? brand.companyName : "",
    });
    setRecentComps(
      comps.slice(0, 3).map(c => ({
        name: c.name,
        sections: Object.keys(c.selected).length,
      }))
    );
    // IndexedDB calls (async)
    listDecks().then(d => setStats(s => ({ ...s, pptDecks: d.length }))).catch(() => {});
    loadSwipe().then(sw => setStats(s => ({ ...s, swipes: sw.length }))).catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen dark:bg-slate-950">
      {/* Background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/10" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-400/10 blur-3xl dark:bg-fuchsia-600/8" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/8" />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/80 via-white/60 to-fuchsia-50/80 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/70 px-5 py-3 shadow-lg backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-base shadow-md">
              🛠
            </div>
            <div>
              <h1 className="text-sm font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-base">
                Marketer's Studio
              </h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {stats.brandName ? `${stats.brandName} のワークスペース` : "マーケ制作の母艦"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? "ライトモードに切替" : "ダークモードに切替"}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/60 text-lg transition hover:border-violet-300 hover:bg-violet-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            今日は何を作りますか？
          </h2>
          <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
            LP・PPT・メール・SNS投稿——マーケ制作を一か所で。
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "LP構成", value: stats.compositions, href: "/library" },
            { label: "お気に入り", value: stats.bookmarks, href: "/library" },
            { label: "コピーバンク", value: stats.copyBank, href: "/swipe" },
            { label: "PPTデッキ", value: stats.pptDecks, href: "/ppt" },
            { label: "スワイプ", value: stats.swipes, href: "/swipe" },
          ].map(s => (
            <Link key={s.label} href={s.href}
              className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/60 px-3 py-4 text-center backdrop-blur transition hover:border-violet-200 hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-violet-600">
              <span className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
                {s.value}
              </span>
              <span className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Module grid */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map(m => (
            <Link key={m.href} href={m.href}
              className={`group flex items-start gap-4 rounded-2xl border p-5 backdrop-blur transition hover:shadow-md ${m.bg} ${m.border}`}>
              <div className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br text-2xl shadow-sm ${m.gradient}`}>
                {m.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{m.nameJa}</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-slate-500 dark:text-slate-400">{m.desc}</p>
              </div>
              <span className="ml-auto shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-300">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Recent LP compositions */}
        {recentComps.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                最近のLP構成
              </p>
              <Link href="/library"
                className="text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400">
                すべて見る →
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {recentComps.map(c => (
                <Link key={c.name} href="/library"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm transition hover:border-violet-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-violet-600">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-[10px] text-white">
                    LP
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800 dark:text-slate-200">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.sections} sections</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
