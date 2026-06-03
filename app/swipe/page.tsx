"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  loadSwipe,
  saveSwipe,
  loadCopy,
  saveCopy,
  newId,
  COPY_TYPES,
  type SwipeItem,
  type CopyItem,
  type CopyType,
} from "@/lib/swipe/store";

type Tab = "swipe" | "copy";

function parseTags(s: string): string[] {
  return [...new Set(s.split(/[,、\s]+/).map((t) => t.trim()).filter(Boolean))];
}
function hostOf(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
  } catch {
    return "";
  }
}

export default function SwipePage() {
  const [tab, setTab] = useState<Tab>("swipe");
  const [query, setQuery] = useState("");

  // ---- swipe state ----
  const [swipes, setSwipes] = useState<SwipeItem[]>([]);
  const [sForm, setSForm] = useState({ title: "", url: "", note: "", tags: "" });
  const [sImage, setSImage] = useState<string | null>(null);

  // ---- copy state ----
  const [copies, setCopies] = useState<CopyItem[]>([]);
  const [cForm, setCForm] = useState<{ text: string; type: CopyType; tags: string }>({
    text: "",
    type: "見出し",
    tags: "",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadSwipe().then(setSwipes).catch(() => {});
    setCopies(loadCopy());
  }, []);

  // persist
  const persistSwipe = useCallback((next: SwipeItem[]) => {
    setSwipes(next);
    saveSwipe(next).catch(() => {});
  }, []);
  const persistCopy = useCallback((next: CopyItem[]) => {
    setCopies(next);
    saveCopy(next);
  }, []);

  function addSwipe() {
    if (!sForm.url.trim() && !sForm.title.trim()) return;
    const item: SwipeItem = {
      id: newId(),
      title: sForm.title.trim() || hostOf(sForm.url) || "参考",
      url: sForm.url.trim(),
      note: sForm.note.trim(),
      tags: parseTags(sForm.tags),
      image: sImage ?? undefined,
      savedAt: Date.now(),
    };
    persistSwipe([item, ...swipes]);
    setSForm({ title: "", url: "", note: "", tags: "" });
    setSImage(null);
  }
  function addCopy() {
    if (!cForm.text.trim()) return;
    const item: CopyItem = {
      id: newId(),
      text: cForm.text.trim(),
      type: cForm.type,
      tags: parseTags(cForm.tags),
      savedAt: Date.now(),
    };
    persistCopy([item, ...copies]);
    setCForm({ text: "", type: cForm.type, tags: "" });
  }

  function onImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setSImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function copyText(item: CopyItem) {
    navigator.clipboard?.writeText(item.text);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(null), 1200);
  }

  const q = query.trim().toLowerCase();
  const swipeResults = swipes.filter((s) =>
    !q
      ? true
      : [s.title, s.url, s.note, ...s.tags].join(" ").toLowerCase().includes(q),
  );
  const copyResults = copies.filter((c) =>
    !q ? true : [c.text, c.type, ...c.tags].join(" ").toLowerCase().includes(q),
  );

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-violet-50 via-white to-fuchsia-50"
      >
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-3xl border border-white/60 bg-gradient-to-b from-white/85 to-white/55 px-5 py-3.5 shadow-[0_12px_34px_-12px_rgba(76,29,149,0.35)] ring-1 ring-inset ring-white/60 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/library"
              className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:text-violet-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
            >
              ← Library
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-base font-bold leading-tight text-slate-900 sm:text-lg">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 text-xs text-white shadow-sm">
                  ◆
                </span>
                スワイプ＆コピーバンク
              </h1>
              <p className="text-xs text-slate-500">
                参考（URL・スクショ・メモ）と文言スニペットを貯める箱。
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 p-0.5">
            {([
              { id: "swipe", label: `参考 ${swipes.length}` },
              { id: "copy", label: `コピー ${copies.length}` },
            ] as const).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  tab === t.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-violet-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* search */}
        <div className="relative mb-5">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "swipe" ? "参考を検索（タイトル・URL・メモ・タグ）" : "コピーを検索（文言・種別・タグ）"}
            className="w-full rounded-full border border-slate-200 bg-white/80 py-2 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {tab === "swipe" ? (
          <>
            {/* add swipe */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={sForm.title}
                  onChange={(e) => setSForm({ ...sForm, title: e.target.value })}
                  placeholder="タイトル（任意）"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                />
                <input
                  value={sForm.url}
                  onChange={(e) => setSForm({ ...sForm, url: e.target.value })}
                  placeholder="https://参考サイトのURL"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                />
              </div>
              <textarea
                value={sForm.note}
                onChange={(e) => setSForm({ ...sForm, note: e.target.value })}
                placeholder="メモ（なぜ参考にしたいか・どこが良いか）"
                rows={2}
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  value={sForm.tags}
                  onChange={(e) => setSForm({ ...sForm, tags: e.target.value })}
                  placeholder="タグ（スペース区切り）"
                  className="flex-1 min-w-[140px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                />
                <label className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-violet-300">
                  {sImage ? "画像変更" : "スクショ追加"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onImageFile(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={addSwipe}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow transition hover:brightness-110"
                >
                  ＋ 追加
                </button>
              </div>
              {sImage && (
                <div className="mt-2 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sImage} alt="" className="h-12 rounded border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => setSImage(null)}
                    className="text-xs text-slate-400 hover:text-rose-600"
                  >
                    画像を外す
                  </button>
                </div>
              )}
            </div>

            {/* swipe grid */}
            {swipeResults.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">
                まだ参考がありません。上のフォームから追加してください。
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {swipeResults.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt="" className="h-32 w-full object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center bg-slate-50">
                        {s.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${hostOf(s.url)}&sz=64`}
                            alt=""
                            className="h-10 w-10 opacity-80"
                          />
                        ) : (
                          <span className="text-3xl">◆</span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-bold text-slate-800">
                          {s.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => persistSwipe(swipes.filter((x) => x.id !== s.id))}
                          aria-label="削除"
                          className="shrink-0 text-slate-300 transition hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                      {s.url && (
                        <a
                          href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 truncate text-xs text-sky-600 hover:underline"
                        >
                          {hostOf(s.url) || s.url} ↗
                        </a>
                      )}
                      {s.note && (
                        <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-500">
                          {s.note}
                        </p>
                      )}
                      {s.tags.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1 pt-2">
                          {s.tags.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setQuery(t)}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 hover:bg-violet-100 hover:text-violet-700"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* add copy */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <textarea
                value={cForm.text}
                onChange={(e) => setCForm({ ...cForm, text: e.target.value })}
                placeholder="文言（見出し・CTA・フック・メール件名など）"
                rows={2}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={cForm.type}
                  onChange={(e) => setCForm({ ...cForm, type: e.target.value as CopyType })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                >
                  {COPY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  value={cForm.tags}
                  onChange={(e) => setCForm({ ...cForm, tags: e.target.value })}
                  placeholder="タグ（スペース区切り）"
                  className="flex-1 min-w-[140px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
                />
                <button
                  type="button"
                  onClick={addCopy}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow transition hover:brightness-110"
                >
                  ＋ 追加
                </button>
              </div>
            </div>

            {/* copy list */}
            {copyResults.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">
                まだコピーがありません。上のフォーム、または Generated LP の「文言」から保存できます。
              </p>
            ) : (
              <div className="space-y-2">
                {copyResults.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                  >
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        c.type === "CTA"
                          ? "bg-amber-100 text-amber-700"
                          : c.type === "見出し"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.type}
                    </span>
                    <span className="flex-1 truncate text-sm text-slate-700">{c.text}</span>
                    {c.tags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setQuery(t)}
                        className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-violet-100 hover:text-violet-700 sm:inline"
                      >
                        {t}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => copyText(c)}
                      className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
                    >
                      {copiedId === c.id ? "✓ コピー" : "コピー"}
                    </button>
                    <button
                      type="button"
                      onClick={() => persistCopy(copies.filter((x) => x.id !== c.id))}
                      aria-label="削除"
                      className="shrink-0 text-slate-300 transition hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
