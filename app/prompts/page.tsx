"use client";

import { useState, useEffect } from "react";
import { AuroraBg } from "@/components/AuroraBg";
import { AppHeader } from "@/components/AppHeader";
import { useToast } from "@/components/ui";
import { glass } from "@/lib/ui/glass";
import { PROMPTS, PROMPT_CATEGORIES, type PromptItem } from "@/lib/prompts/data";
import {
  loadUserPrompts, addUserPrompt, removeUserPrompt,
  loadUserCategories, addUserCategory,
} from "@/lib/prompts/userStore";
import {
  IconSearch, IconCopy, IconCheck, IconPlus, IconTrash, IconX, IconChevronDown, IconSparkles,
} from "@/components/icons";
import { PromptRunModal } from "@/components/PromptRunModal";

type Row = PromptItem & { mine?: boolean };

// Threshold: collapse if prompt exceeds this character count
const COLLAPSE_THRESHOLD = 160;

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

// ---- Prompt card with collapse/expand ----
function PromptCard({
  p,
  copiedId,
  onCopy,
  onDelete,
}: {
  p: Row;
  copiedId: string | null;
  onCopy: (p: { id: string; prompt: string }) => void;
  onDelete?: (id: string) => void;
}) {
  const isLong = p.prompt.length > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(false);
  const [runOpen, setRunOpen] = useState(false);

  return (
    <div className={`flex flex-col rounded-2xl p-5 ${glass}`}>
      <PromptRunModal
        open={runOpen}
        onClose={() => setRunOpen(false)}
        title={p.title}
        template={p.prompt}
      />
      {/* Header: category / title / actions */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
            {p.mine && (
              <span className="rounded bg-fuchsia-100 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-700 dark:bg-fuchsia-400/20 dark:text-fuchsia-200">
                マイ
              </span>
            )}
            {p.category}
          </span>
          <h3 className="mt-0.5 text-[15px] font-semibold tracking-tight">{p.title}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {p.mine && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(p.id)}
              aria-label="削除"
              className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setRunOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-400/30 dark:bg-white/5 dark:text-indigo-300"
            title="変数を埋めて使う / AIで実行"
          >
            <IconSparkles className="h-3.5 w-3.5" />
            使う
          </button>
          <button
            type="button"
            onClick={() => onCopy(p)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              copiedId === p.id
                ? "bg-emerald-500 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            }`}
          >
            {copiedId === p.id ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
            {copiedId === p.id ? "コピー済" : "コピー"}
          </button>
        </div>
      </div>

      {/* Prompt body — collapsible */}
      <div className="relative">
        <pre
          className={`whitespace-pre-wrap break-words rounded-xl border border-white/40 bg-white/40 p-3.5 font-sans text-[13px] leading-relaxed text-zinc-700 transition-all dark:border-white/5 dark:bg-black/20 dark:text-zinc-300 ${
            isLong && !expanded ? "line-clamp-4 overflow-hidden" : ""
          }`}
        >
          {renderPrompt(p.prompt)}
        </pre>

        {/* Gradient fade + expand button — shown only when collapsed and long */}
        {isLong && !expanded && (
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center rounded-b-xl bg-gradient-to-t from-white/90 to-transparent pb-1 pt-8 dark:from-zinc-900/90">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[12px] font-bold text-zinc-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:text-indigo-300"
            >
              <IconChevronDown className="h-3.5 w-3.5" />
              全文を見る
            </button>
          </div>
        )}
      </div>

      {/* Collapse button — shown when expanded */}
      {isLong && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-2 inline-flex items-center gap-1 self-center text-[12px] font-semibold text-zinc-400 transition hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:hover:text-zinc-200"
        >
          <IconChevronDown className="h-3.5 w-3.5 rotate-180 transition" />
          折りたたむ
        </button>
      )}

      {/* Tags */}
      {p.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/50 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-white/5 dark:text-zinc-400"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PromptsPage() {
  const toast = useToast();
  const [cat, setCat] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // user prompts
  const [mine, setMine] = useState<Row[]>([]);
  const [userCats, setUserCats] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: PROMPT_CATEGORIES[0] as string, prompt: "", tags: "" });
  // "new" means the user is typing a brand-new category name
  const [catMode, setCatMode] = useState<"select" | "new">("select");
  const [newCatInput, setNewCatInput] = useState("");

  useEffect(() => {
    setMine(loadUserPrompts().map((p) => ({ ...p, mine: true })));
    setUserCats(loadUserCategories());
  }, []);

  // All categories available in the form = built-in + user-defined
  const allCats = [...PROMPT_CATEGORIES, ...userCats];

  function saveMine() {
    if (!form.title.trim() || !form.prompt.trim()) return;
    // If "new category" mode, register it first
    let finalCat = form.category;
    if (catMode === "new") {
      const t = newCatInput.trim();
      if (!t) return; // require a name
      addUserCategory(t);
      const updated = loadUserCategories();
      setUserCats(updated);
      finalCat = t;
    }
    addUserPrompt({
      title: form.title.trim(),
      category: finalCat,
      prompt: form.prompt.trim(),
      tags: form.tags.split(/[,、\s]+/).map((t) => t.trim()).filter(Boolean),
    });
    setMine(loadUserPrompts().map((p) => ({ ...p, mine: true })));
    setForm({ title: "", category: finalCat, prompt: "", tags: "" });
    setCatMode("select");
    setNewCatInput("");
    setShowForm(false);
  }

  function deleteMine(id: string) {
    removeUserPrompt(id);
    setMine(loadUserPrompts().map((p) => ({ ...p, mine: true })));
  }

  const all: Row[] = [...mine, ...PROMPTS];
  const q = query.trim().toLowerCase();
  const results = all.filter((p) => {
    if (cat === "mine" && !p.mine) return false;
    if (cat !== "all" && cat !== "mine" && p.category !== cat) return false;
    if (!q) return true;
    return [p.title, p.prompt, p.category, ...p.tags].join(" ").toLowerCase().includes(q);
  });

  async function copy(p: { id: string; prompt: string }) {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(p.prompt);
      setCopiedId(p.id);
      window.setTimeout(() => setCopiedId(null), 1400);
      toast.success("プロンプトをコピーしました");
    } catch {
      toast.error("コピーに失敗しました。手動でコピーしてください");
    }
  }

  return (
    <div className="relative min-h-dvh text-zinc-900 dark:text-zinc-50">
      <AuroraBg />

      {/* Top bar */}
      <AppHeader
        current="prompts"
        title="プロンプト集"
        subtitle="カテゴリ別の即使えるマーケ用プロンプト"
      />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">マーケ用プロンプト集</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300/80">
              カテゴリ別の即使えるプロンプト。<span className="rounded bg-indigo-100 px-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-200">{"{変数}"}</span> を埋めてAIに貼り付けるだけ。
            </p>
          </div>
          <button type="button" onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
            <IconPlus className="h-4 w-4" /> マイプロンプト追加
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className={`mb-6 rounded-2xl p-5 ${glass}`}>
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-sm font-bold">マイプロンプトを保存</p>
              <button type="button" onClick={() => setShowForm(false)} aria-label="閉じる" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <IconX className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-[1fr_220px]">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="タイトル"
                className="rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5" />

              {/* Category — select existing or create new */}
              <div className="flex flex-col gap-1.5">
                {catMode === "select" ? (
                  <div className="flex items-center gap-1.5">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="flex-1 rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5"
                    >
                      {allCats.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => { setCatMode("new"); setNewCatInput(""); }}
                      title="新しいカテゴリを作る"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/60 bg-white/60 text-zinc-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5"
                    >
                      <IconPlus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      autoFocus
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Escape") setCatMode("select"); }}
                      placeholder="新しいカテゴリ名を入力"
                      className="flex-1 rounded-lg border border-indigo-400 bg-white/60 px-3 py-2 text-sm outline-none ring-2 ring-indigo-200/60 dark:bg-white/5"
                    />
                    <button
                      type="button"
                      onClick={() => setCatMode("select")}
                      title="キャンセル"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/60 bg-white/60 text-zinc-400 transition hover:text-rose-500 dark:border-white/10 dark:bg-white/5"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <p className="pl-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                  {catMode === "new" ? "保存するとカテゴリタブにも追加されます" : "＋ で新しいカテゴリを作成できます"}
                </p>
              </div>
            </div>
            <textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} rows={4}
              placeholder="プロンプト本文（{変数} で埋め込み箇所を作れます）"
              className="mt-2.5 w-full resize-none rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5" />
            <div className="mt-2.5 flex items-center gap-2.5">
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="タグ（スペース区切り）"
                className="flex-1 rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-white/5" />
              <button type="button" onClick={saveMine}
                className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-violet-600 px-5 py-2 text-sm font-bold text-white shadow transition hover:brightness-110">
                保存
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="プロンプトを検索…"
            className="w-full rounded-xl border border-white/60 bg-white/50 py-2.5 pl-9 pr-4 text-sm text-zinc-900 outline-none backdrop-blur transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/60 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100" />
        </div>

        {/* Category chips — built-in + user-defined categories */}
        <div className="mb-7 flex flex-wrap gap-2">
          {([
            "all",
            ...(mine.length > 0 ? ["mine"] : []),
            ...PROMPT_CATEGORIES,
            // user-defined categories that aren't already in PROMPT_CATEGORIES
            ...userCats.filter((c) => !(PROMPT_CATEGORIES as readonly string[]).includes(c)),
          ] as string[]).map((c) => {
            const isUserCat = c !== "all" && c !== "mine" && !(PROMPT_CATEGORIES as readonly string[]).includes(c);
            return (
              <button key={c} type="button" onClick={() => setCat(c)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  cat === c
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900"
                    : `${glass} text-zinc-600 hover:text-zinc-900 dark:text-zinc-300`
                }`}>
                {c === "all"
                  ? "すべて"
                  : c === "mine"
                    ? `★ マイ (${mine.length})`
                    : isUserCat
                      ? `✦ ${c}`
                      : c}
              </button>
            );
          })}
        </div>

        {/* Prompt grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((p) => (
            <PromptCard
              key={p.id}
              p={p}
              copiedId={copiedId}
              onCopy={copy}
              onDelete={p.mine ? deleteMine : undefined}
            />
          ))}
        </div>

        {results.length === 0 && (
          <p className="py-16 text-center text-sm text-zinc-500">一致するプロンプトがありません。</p>
        )}
      </main>
    </div>
  );
}
