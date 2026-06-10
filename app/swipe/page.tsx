"use client";

import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuroraBg } from "@/components/AuroraBg";
import { useToast } from "@/components/ui";
import {
  loadSwipe, saveSwipe, loadCopy, saveCopy, newId, COPY_TYPES,
  type SwipeItem, type CopyItem, type CopyType,
} from "@/lib/swipe/store";
import {
  IconSearch, IconPlus, IconX, IconTrash, IconUpload,
  IconExternalLink, IconImage, IconBookmark,
} from "@/components/icons";

type Tab = "swipe" | "copy";

function parseTags(s: string): string[] {
  return [...new Set(s.split(/[,、\s]+/).map(t => t.trim()).filter(Boolean))];
}
function hostOf(url: string): string {
  try { return new URL(url.startsWith("http") ? url : `https://${url}`).hostname; }
  catch { return ""; }
}

export default function SwipePage() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("swipe");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  // swipe
  const [swipes, setSwipes] = useState<SwipeItem[]>([]);
  const [sForm, setSForm] = useState({ title: "", url: "", note: "", tags: "" });
  const [sImage, setSImage] = useState<string | null>(null);
  const [dragImg, setDragImg] = useState(false);

  // copy
  const [copies, setCopies] = useState<CopyItem[]>([]);
  const [cForm, setCForm] = useState<{ text: string; type: CopyType; tags: string }>({ text: "", type: "見出し", tags: "" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => { loadSwipe().then(setSwipes).catch(() => {}); setCopies(loadCopy()); }, []);

  // paste image anywhere on the swipe tab
  useEffect(() => {
    if (tab !== "swipe") return;
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const it of Array.from(items)) {
        if (it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) { readImage(f); e.preventDefault(); break; }
        }
      }
    }
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [tab]);

  function readImage(file: File) {
    const r = new FileReader();
    r.onload = () => setSImage(r.result as string);
    r.readAsDataURL(file);
  }

  const persistSwipe = useCallback((next: SwipeItem[]) => { setSwipes(next); saveSwipe(next).catch(() => {}); }, []);
  const persistCopy = useCallback((next: CopyItem[]) => { setCopies(next); saveCopy(next); }, []);

  function addSwipe() {
    if (!sForm.url.trim() && !sForm.title.trim() && !sImage) return;
    const item: SwipeItem = {
      id: newId(),
      title: sForm.title.trim() || hostOf(sForm.url) || "参考",
      url: sForm.url.trim(), note: sForm.note.trim(),
      tags: parseTags(sForm.tags), image: sImage ?? undefined, savedAt: Date.now(),
    };
    persistSwipe([item, ...swipes]);
    setSForm({ title: "", url: "", note: "", tags: "" });
    setSImage(null);
  }
  function addCopy() {
    if (!cForm.text.trim()) return;
    persistCopy([{ id: newId(), text: cForm.text.trim(), type: cForm.type, tags: parseTags(cForm.tags), savedAt: Date.now() }, ...copies]);
    setCForm({ text: "", type: cForm.type, tags: "" });
  }
  async function copyText(item: CopyItem) {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(item.text);
      setCopiedId(item.id);
      window.setTimeout(() => setCopiedId(null), 1200);
      toast.success("コピーしました");
    } catch {
      toast.error("コピーに失敗しました。手動でコピーしてください");
    }
  }

  const q = query.trim().toLowerCase();
  const swipeResults = swipes.filter(s => !q || [s.title, s.url, s.note, ...s.tags].join(" ").toLowerCase().includes(q));
  const copyResults = copies.filter(c => !q || [c.text, c.type, ...c.tags].join(" ").toLowerCase().includes(q));

  const inputCls = "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-500/20";

  return (
    <div className="relative min-h-dvh text-zinc-900 dark:text-zinc-50">
      <AuroraBg />
      {/* Top bar */}
      <AppHeader
        current="swipe"
        title="Swipe Bank"
        subtitle="参考URL・スクショ・コピーを貯める"
        actions={
          <div className="flex items-center rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800" role="tablist" aria-label="表示切替">
            {([{ id: "swipe", label: `参考`, n: swipes.length }, { id: "copy", label: `コピー`, n: copies.length }] as const).map(t => (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition ${tab === t.id ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"}`}>
                {t.label} <span className="font-mono text-xs tabular-nums opacity-60">{t.n}</span>
              </button>
            ))}
          </div>
        }
      />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder={tab === "swipe" ? "参考を検索…" : "コピーを検索…"}
            className={`${inputCls} pl-9`} />
        </div>

        {tab === "swipe" ? (
          <>
            {/* Add form */}
            <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid gap-4 md:grid-cols-[1fr_200px]">
                <div className="space-y-2.5">
                  <input value={sForm.title} onChange={e => setSForm({ ...sForm, title: e.target.value })} placeholder="タイトル（任意）" className={inputCls} />
                  <input value={sForm.url} onChange={e => setSForm({ ...sForm, url: e.target.value })} placeholder="参考にしたいURL（例：競合LP・広告・投稿）" className={inputCls} />
                  <textarea value={sForm.note} onChange={e => setSForm({ ...sForm, note: e.target.value })} placeholder="参考理由・盗みたい要素（例：FVの余白の取り方、料金表の3列構成、CTAの言い回し）" rows={2} className={`${inputCls} resize-none`} />
                  <div className="flex items-center gap-2.5">
                    <input value={sForm.tags} onChange={e => setSForm({ ...sForm, tags: e.target.value })} placeholder="タグ（スペース区切り）" className={inputCls} />
                    <button type="button" onClick={addSwipe}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                      <IconPlus className="h-4 w-4" /> 追加
                    </button>
                  </div>
                </div>

                {/* Image dropzone — paste / drag&drop / click */}
                <div
                  onDragOver={e => { e.preventDefault(); if (!dragImg) setDragImg(true); }}
                  onDragLeave={() => setDragImg(false)}
                  onDrop={e => { e.preventDefault(); setDragImg(false); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith("image/")) readImage(f); }}
                  className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition ${dragImg ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10" : "border-zinc-200 dark:border-zinc-700"}`}
                >
                  {sImage ? (
                    <div className="relative w-full p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sImage} alt="プレビュー" className="h-32 w-full rounded object-cover" />
                      <button type="button" onClick={() => setSImage(null)}
                        className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-zinc-900/70 text-white transition hover:bg-zinc-900">
                        <IconX className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex w-full cursor-pointer flex-col items-center gap-2 px-3 py-6">
                      <IconImage className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">スクショを追加</span>
                      <span className="text-[11px] leading-tight text-zinc-400 dark:text-zinc-500">クリック / ドロップ / ⌘V 貼り付け</span>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) readImage(f); e.target.value = ""; }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Tag examples — click to add */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <span className="mr-1 text-[11px] font-semibold text-zinc-400">タグ例</span>
                {["FV", "CTA", "図解", "価格表", "フォーム", "広告バナー", "コピー", "配色", "余白"].map((t) => (
                  <button key={t} type="button"
                    onClick={() => setSForm((f) => ({ ...f, tags: (f.tags + " " + t).trim() }))}
                    className="rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-500 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400">
                    + {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {swipeResults.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 px-6 py-14 text-center dark:border-zinc-800">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                  <IconBookmark className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">参考の制作知見を貯める場所です</p>
                <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  参考URL・スクショ・コピー断片を「なぜ参考にしたか」とセットで保存すると、ここにカードとして並びます。案件のときに検索して転用できます。
                </p>
                {/* faint example cards */}
                <div className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-3 opacity-60">
                  {[
                    { k: "URL", c: "text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-300" },
                    { k: "スクショ", c: "text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300" },
                    { k: "コピー", c: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-300" },
                  ].map((ex) => (
                    <div key={ex.k} className="rounded-lg border border-zinc-200 bg-white p-2.5 text-left dark:border-zinc-800 dark:bg-zinc-900">
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${ex.c}`}>{ex.k}</span>
                      <div className="mt-2 h-1.5 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800" />
                      <div className="mt-1 h-1.5 w-3/5 rounded bg-zinc-100 dark:bg-zinc-800" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {swipeResults.map(s => (
                  <article key={s.id} className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
                    {s.image ? (
                      <button type="button" onClick={() => setLightbox(s.image!)}
                        className="relative block aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image} alt={s.title} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-zinc-900/60 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                          <IconImage className="h-4 w-4" />
                        </span>
                      </button>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-zinc-50 dark:bg-zinc-800/50">
                        {s.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`https://www.google.com/s2/favicons?domain=${hostOf(s.url)}&sz=64`} alt="" className="h-9 w-9 opacity-70" />
                        ) : <IconBookmark className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />}
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold tracking-tight">{s.title}</h3>
                        <button type="button" onClick={() => persistSwipe(swipes.filter(x => x.id !== s.id))} aria-label="削除"
                          className="shrink-0 text-zinc-300 opacity-0 transition hover:text-rose-500 group-hover:opacity-100 dark:text-zinc-600">
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                      {s.url && (
                        <a href={s.url.startsWith("http") ? s.url : `https://${s.url}`} target="_blank" rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 truncate text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                          {hostOf(s.url) || s.url} <IconExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      )}
                      {s.note && <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{s.note}</p>}
                      {s.tags.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1 pt-3">
                          {s.tags.map(t => (
                            <button key={t} type="button" onClick={() => setQuery(t)}
                              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400">
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Add copy */}
            <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <textarea value={cForm.text} onChange={e => setCForm({ ...cForm, text: e.target.value })} placeholder="文言（見出し・CTA・フック・メール件名…）" rows={2} className={`${inputCls} resize-none`} />
              <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                <select value={cForm.type} onChange={e => setCForm({ ...cForm, type: e.target.value as CopyType })} className={`${inputCls} w-auto`}>
                  {COPY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input value={cForm.tags} onChange={e => setCForm({ ...cForm, tags: e.target.value })} placeholder="タグ" className={`${inputCls} flex-1`} />
                <button type="button" onClick={addCopy}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                  <IconPlus className="h-4 w-4" /> 追加
                </button>
              </div>
            </div>

            {copyResults.length === 0 ? (
              <EmptyState icon={<IconBookmark className="h-6 w-6" />} text="まだコピーがありません" sub="上のフォーム、または LP の「文言」から保存できます。" />
            ) : (
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                {copyResults.map((c, i) => (
                  <div key={c.id} className={`flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${i > 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""}`}>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      c.type === "CTA" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      : c.type === "見出し" ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                      {c.type}
                    </span>
                    <span className="flex-1 truncate text-sm">{c.text}</span>
                    <button type="button" onClick={() => copyText(c)}
                      className="shrink-0 rounded-md border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-indigo-400">
                      {copiedId === c.id ? "✓ コピー" : "コピー"}
                    </button>
                    <button type="button" onClick={() => persistCopy(copies.filter(x => x.id !== c.id))} aria-label="削除"
                      className="shrink-0 text-zinc-300 transition hover:text-rose-500 dark:text-zinc-600">
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-6 backdrop-blur-sm"
          onClick={() => setLightbox(null)}>
          <button type="button" aria-label="閉じる" onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <IconX className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="拡大表示" onClick={e => e.stopPropagation()}
            className="max-h-[88vh] max-w-full rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text, sub }: { icon: React.ReactNode; text: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-800">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">{icon}</div>
      <p className="mt-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{text}</p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>
    </div>
  );
}
