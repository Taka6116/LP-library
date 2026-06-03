"use client";

import { useState } from "react";
import Link from "next/link";
import { useDark } from "@/components/ThemeProvider";
import { AuroraBg } from "@/components/AuroraBg";
import { glass } from "@/lib/ui/glass";
import { PROMPTS, PROMPT_CATEGORIES } from "@/lib/prompts/data";
import {
  IconArrowRight, IconSearch, IconSun, IconMoon, IconSparkles,
  IconCopy, IconCheck,
} from "@/components/icons";

// highlight {placeholder} tokens inside a prompt
function renderPrompt(text: string) {
  return text.split(/(\{[^}]+\})/g).map((part, i) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={i} className="rounded bg-indigo-100 px-1 font-semibold text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-200">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function PromptsPage() {
  const { dark, toggle } = useDark();
  const [cat, setCat] = useState<string | "all">("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const results = PROMPTS.filter((p) => {
    if (cat !== "all" && p.category !== cat) return false;
    if (!q) return true;
    return [p.title, p.prompt, p.category, ...p.tags].join(" ").toLowerCase().includes(q);
  });

  function copy(p: { id: string; prompt: string }) {
    navigator.clipboard?.writeText(p.prompt);
    setCopiedId(p.id);
    window.setTimeout(() => setCopiedId(null), 1400);
  }

  return (
    <div className="relative min-h-dvh text-zinc-900 dark:text-zinc-50">
      <AuroraBg />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/30 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-zinc-600 transition hover:bg-white/40 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10">
              <IconArrowRight className="h-4 w-4 rotate-180" /> ホーム
            </Link>
            <div className="h-4 w-px bg-zinc-300/60 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-sm">
                <IconSparkles className="h-4 w-4" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight">プロンプト集</span>
            </div>
          </div>
          <button type="button" onClick={toggle} aria-label={dark ? "ライトモード" : "ダークモード"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/50 bg-white/40 text-zinc-600 backdrop-blur transition hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            {dark ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">マーケ用プロンプト集</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300/80">
            カテゴリ別の即使えるプロンプト。<span className="rounded bg-indigo-100 px-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-200">{"{変数}"}</span> を埋めてAIに貼り付けるだけ。
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="プロンプトを検索…"
            className="w-full rounded-xl border border-white/60 bg-white/50 py-2.5 pl-9 pr-4 text-sm text-zinc-900 outline-none backdrop-blur transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/60 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
        </div>

        {/* Category chips */}
        <div className="mb-7 flex flex-wrap gap-2">
          {(["all", ...PROMPT_CATEGORIES] as const).map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                cat === c
                  ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
                  : `${glass} text-zinc-600 hover:text-zinc-900 dark:text-zinc-300`
              }`}>
              {c === "all" ? "すべて" : c}
            </button>
          ))}
        </div>

        {/* Prompt grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((p) => (
            <div key={p.id} className={`flex flex-col rounded-2xl p-5 ${glass}`}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                    {p.category}
                  </span>
                  <h3 className="mt-0.5 text-[15px] font-semibold tracking-tight">{p.title}</h3>
                </div>
                <button type="button" onClick={() => copy(p)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    copiedId === p.id
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  }`}>
                  {copiedId === p.id ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
                  {copiedId === p.id ? "コピー済" : "コピー"}
                </button>
              </div>
              <pre className="flex-1 whitespace-pre-wrap break-words rounded-xl border border-white/40 bg-white/40 p-3.5 font-sans text-[13px] leading-relaxed text-zinc-700 dark:border-white/5 dark:bg-black/20 dark:text-zinc-300">
                {renderPrompt(p.prompt)}
              </pre>
              {p.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md bg-white/50 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <p className="py-16 text-center text-sm text-zinc-500">一致するプロンプトがありません。</p>
        )}
      </main>
    </div>
  );
}
