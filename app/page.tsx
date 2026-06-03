"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDark } from "@/components/ThemeProvider";
import { listCompositions } from "@/lib/lpCompositions";
import { loadBookmarks } from "@/lib/bookmarks";
import { loadCopy, loadSwipe } from "@/lib/swipe/store";
import { listDecks } from "@/lib/pptx/deckStore";
import { loadBrand } from "@/lib/brand/store";
import type { ReactNode } from "react";
import { AuroraBg } from "@/components/AuroraBg";
import { glass } from "@/lib/ui/glass";
import {
  IconBookmark, IconSun, IconMoon, IconArrowRight, IconTool, IconLayers, IconSparkles,
} from "@/components/icons";
import {
  GmailTile, YahooTile, PowerPointTile, XTile, LinkedInTile,
  InstagramTile, LpMockTile, BrandKitTile,
} from "@/components/brandIcons";

const MODULES: {
  href: string; name: string; nameJa: string; icon: ReactNode;
}[] = [
  {
    href: "/library", name: "LP Library",
    nameJa: "セクションを組み合わせてLP・資料の構成を作る",
    icon: <LpMockTile className="h-11 w-11" />,
  },
  {
    href: "/ppt", name: "PPT Studio",
    nameJa: "複数デッキからスライドを選んで合成・書き出し",
    icon: <PowerPointTile className="h-11 w-11" />,
  },
  {
    href: "/swipe", name: "Swipe Bank",
    nameJa: "参考URL・スクショ・コピースニペットを貯める",
    icon: (
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-100/70 text-rose-600 ring-1 ring-inset ring-white/40 dark:bg-rose-400/15 dark:text-rose-300 dark:ring-white/5">
        <IconBookmark className="h-[22px] w-[22px]" />
      </div>
    ),
  },
  {
    href: "/email", name: "Mail Builder",
    nameJa: "Gmail・Yahoo!メール対応のHTMLメールを書き出し",
    icon: (
      <div className="flex -space-x-2.5">
        <GmailTile className="h-10 w-10" />
        <YahooTile className="h-10 w-10" />
      </div>
    ),
  },
  {
    href: "/social", name: "Social",
    nameJa: "1本の内容をX・LinkedIn・Instagramに最適化",
    icon: (
      <div className="flex -space-x-2.5">
        <XTile className="h-9 w-9" />
        <LinkedInTile className="h-9 w-9" />
        <InstagramTile className="h-9 w-9" />
      </div>
    ),
  },
  {
    href: "/brand", name: "Brand Kit",
    nameJa: "色・フォント・トーンを定義し全体に適用",
    icon: <BrandKitTile className="h-11 w-11" />,
  },
  {
    href: "/prompts", name: "プロンプト集",
    nameJa: "カテゴリ別の即使えるマーケ用プロンプト",
    icon: (
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white ring-1 ring-inset ring-white/30 shadow-sm">
        <IconSparkles className="h-[22px] w-[22px]" />
      </div>
    ),
  },
];

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
    <div className="relative min-h-dvh text-zinc-900 dark:text-zinc-50">
      <AuroraBg />

      {/* Top bar — glass */}
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/30 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <IconTool className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Marketer&apos;s Studio</span>
            {brandName && (
              <span className="hidden rounded-full border border-white/50 bg-white/40 px-2.5 py-0.5 text-xs font-medium text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 sm:inline">
                {brandName}
              </span>
            )}
          </div>
          <button type="button" onClick={toggle} aria-label={dark ? "ライトモードに切替" : "ダークモードに切替"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/50 bg-white/40 text-zinc-600 backdrop-blur transition hover:bg-white/70 hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10">
            {dark ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        {/* Heading */}
        <div className="mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-500/80 dark:text-indigo-300/80">ワークスペース</p>
          <h1 className="text-[1.75rem] font-bold tracking-tight sm:text-4xl">今日は何を作りますか？</h1>
          <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300/80">
            LP・スライド・メール・SNS投稿——マーケティング制作を、一つのワークスペースで。
          </p>
        </div>

        {/* Stats — glass panel */}
        <div className={`mb-9 flex flex-wrap items-stretch divide-x divide-white/40 overflow-hidden rounded-2xl dark:divide-white/10 ${glass}`}>
          {STATS.map(s => (
            <Link key={s.label} href={s.href}
              className="group flex flex-1 flex-col gap-0.5 px-5 py-4 transition hover:bg-white/40 dark:hover:bg-white/[0.04]">
              <span className="font-mono text-2xl font-bold tabular-nums tracking-tight">{s.value}</span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{s.label}</span>
            </Link>
          ))}
        </div>

        {/* Modules — glass cards with lift */}
        <h2 className="mb-3.5 text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">モジュール</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map(({ href, icon, name, nameJa }) => (
            <Link key={href} href={href}
              className={`group relative flex flex-col gap-3.5 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-white/65 hover:shadow-[0_18px_44px_-16px_rgba(76,29,149,0.32)] dark:hover:bg-white/[0.07] ${glass}`}>
              <div className="flex items-center justify-between">
                {icon}
                <IconArrowRight className="h-[18px] w-[18px] text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
              </div>
              <div>
                <p className="text-[15px] font-semibold tracking-tight">{name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">{nameJa}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent — glass panel */}
        {recent.length > 0 && (
          <>
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">最近のLP構成</h2>
              <Link href="/library" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
                すべて見る
              </Link>
            </div>
            <div className={`overflow-hidden rounded-2xl ${glass}`}>
              {recent.map((c, i) => (
                <Link key={c.name + i} href="/library"
                  className={`flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/45 dark:hover:bg-white/[0.04] ${i > 0 ? "border-t border-white/40 dark:border-white/10" : ""}`}>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-100/70 text-indigo-600 ring-1 ring-inset ring-white/40 dark:bg-indigo-400/15 dark:text-indigo-300 dark:ring-white/5">
                    <IconLayers className="h-4 w-4" />
                  </div>
                  <span className="flex-1 truncate text-sm font-medium">{c.name}</span>
                  <span className="font-mono text-xs tabular-nums text-zinc-500 dark:text-zinc-400">{c.sections} sections</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
