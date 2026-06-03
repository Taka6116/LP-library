"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { getSlideRefs, buildPptxSubset, PPTX_MIME } from "@/lib/pptx/subset";
import { buildMergedPptx } from "@/lib/pptx/merge";
import {
  listDecks,
  getDeckBuf,
  addDeck,
  updateDeck,
  removeDeck,
  type DeckMeta,
} from "@/lib/pptx/deckStore";

type Status = "idle" | "loading" | "ready" | "error";

// Thumbnail render size (16:9). pptx-preview renders each slide at this size.
const THUMB_W = 300;
const THUMB_H = Math.round((THUMB_W * 9) / 16);

export default function PptStudioPage() {
  const [decks, setDecks] = useState<DeckMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [slideCount, setSlideCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [zoom, setZoom] = useState<number | null>(null);
  const [zoomLoading, setZoomLoading] = useState(false);
  // Cross-deck merge cart: deckId -> slide indices
  const [cart, setCart] = useState<Record<string, number[]>>({});

  const bufRef = useRef<ArrayBuffer | null>(null);
  const offscreenRef = useRef<HTMLDivElement | null>(null);
  const zoomHostRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const previewerRef = useRef<any>(null);
  const renderTokenRef = useRef(0);
  const decksRef = useRef<DeckMeta[]>([]);
  decksRef.current = decks;
  // Cache rendered slide markup per deck → instant re-display on switch.
  const renderCacheRef = useRef<Map<string, string[]>>(new Map());

  const resetRender = useCallback(() => {
    cellRefs.current = [];
    if (previewerRef.current) {
      try {
        previewerRef.current.destroy();
      } catch {
        /* noop */
      }
      previewerRef.current = null;
    }
    if (offscreenRef.current) offscreenRef.current.innerHTML = "";
  }, []);

  // Load a deck buffer into the viewer: parse count → effect renders.
  const loadFromBuffer = useCallback(
    async (buf: ArrayBuffer, name: string) => {
      resetRender();
      setSelected(new Set());
      setErrorMsg("");
      setStatus("loading");
      setFileName(name);
      bufRef.current = buf;
      try {
        const zip = await JSZip.loadAsync(buf.slice(0));
        const refs = await getSlideRefs(zip);
        if (refs.length === 0) {
          setStatus("error");
          setErrorMsg("スライドが見つかりませんでした。");
          return 0;
        }
        setSlideCount(refs.length);
        return refs.length;
      } catch (e) {
        console.error(e);
        setStatus("error");
        setErrorMsg("読み込みに失敗しました。ファイル形式をご確認ください。");
        return 0;
      }
    },
    [resetRender],
  );

  // Import a NEW deck (adds to the library, does not replace existing ones).
  const handleFile = useCallback(
    async (file: File) => {
      if (!/\.pptx$/i.test(file.name)) {
        setErrorMsg(".pptx ファイルを選択してください。");
        return;
      }
      const buf = await file.arrayBuffer();
      // parse count first (for the deck metadata)
      let count = 0;
      try {
        const zip = await JSZip.loadAsync(buf.slice(0));
        count = (await getSlideRefs(zip)).length;
      } catch {
        /* handled below */
      }
      if (count === 0) {
        setErrorMsg("スライドが見つかりませんでした。.pptx をご確認ください。");
        return;
      }
      try {
        const meta = await addDeck(file.name, buf.slice(0), count);
        setDecks((prev) => [...prev, meta]);
        setActiveId(meta.id);
        await loadFromBuffer(buf, file.name);
      } catch (e) {
        console.error(e);
        setErrorMsg("保存に失敗しました。");
      }
    },
    [loadFromBuffer],
  );

  // Restore decks on mount.
  useEffect(() => {
    (async () => {
      try {
        const list = await listDecks();
        setDecks(list);
        if (list.length > 0) setActiveId(list[list.length - 1].id);
      } catch (e) {
        console.warn("deck restore failed", e);
      } finally {
        setRestoring(false);
      }
    })();
  }, []);

  // When the active deck changes, load its buffer from storage and render.
  useEffect(() => {
    if (!activeId) return;
    let cancelled = false;
    (async () => {
      const meta = decksRef.current.find((d) => d.id === activeId);
      const buf = await getDeckBuf(activeId);
      if (cancelled || !buf) return;
      await loadFromBuffer(buf, meta?.name ?? "deck.pptx");
    })();
    return () => {
      cancelled = true;
    };
  }, [activeId, loadFromBuffer]);

  // Render the active deck's slides — cached per deck for instant re-display.
  useEffect(() => {
    if (status !== "loading" || slideCount === 0 || !bufRef.current || !activeId) return;
    const token = ++renderTokenRef.current;
    const deckId = activeId;

    (async () => {
      try {
        // 1) Let the skeleton grid paint before any heavy work.
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        if (token !== renderTokenRef.current) return;

        // 2) Cache hit → fill cells instantly, no re-parse/re-render.
        const cached = renderCacheRef.current.get(deckId);
        if (cached && cached.length === slideCount) {
          for (let i = 0; i < slideCount; i++) {
            const cell = cellRefs.current[i];
            if (cell) cell.innerHTML = cached[i] ?? "";
          }
          setStatus("ready");
          return;
        }

        // 3) First render of this deck.
        const { init } = await import("pptx-preview");
        const host = offscreenRef.current;
        if (!host) return;
        host.innerHTML = "";
        const previewer = init(host, { mode: "list", width: THUMB_W, height: THUMB_H });
        previewerRef.current = previewer;

        await previewer.preview(bufRef.current!.slice(0));
        if (token !== renderTokenRef.current) return;

        const nodes = host.querySelectorAll<HTMLElement>(".pptx-preview-slide-wrapper");
        const cacheArr: string[] = [];
        for (let i = 0; i < slideCount; i++) {
          const cell = cellRefs.current[i];
          const node = nodes[i];
          if (node) {
            node.style.margin = "0";
            cacheArr[i] = node.outerHTML;
          }
          if (cell && node) {
            cell.innerHTML = "";
            cell.appendChild(node);
          }
        }
        renderCacheRef.current.set(deckId, cacheArr);
        setStatus("ready");
      } catch (e) {
        console.error(e);
        if (token === renderTokenRef.current) {
          setStatus("error");
          setErrorMsg("プレビューの生成に失敗しました。");
        }
      }
    })();
  }, [status, slideCount, activeId]);

  const toggle = useCallback((i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(Array.from({ length: slideCount }, (_, i) => i)));
  }, [slideCount]);

  const clearAll = useCallback(() => setSelected(new Set()), []);

  const download = useCallback(async () => {
    if (!bufRef.current || selected.size === 0) return;
    setBusy(true);
    try {
      const idx = [...selected].sort((a, b) => a - b);
      const blob = await buildPptxSubset(bufRef.current.slice(0), idx);
      const base = fileName.replace(/\.pptx$/i, "") || "slides";
      const url = URL.createObjectURL(new Blob([blob], { type: PPTX_MIME }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${base}-selected-${idx.length}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setErrorMsg("ダウンロードの生成に失敗しました。");
    } finally {
      setBusy(false);
    }
  }, [selected, fileName]);

  // ---- Cross-deck merge cart ----
  const addToCart = useCallback(() => {
    if (!activeId || selected.size === 0) return;
    setCart((prev) => {
      const cur = new Set(prev[activeId] ?? []);
      selected.forEach((i) => cur.add(i));
      return { ...prev, [activeId]: [...cur].sort((a, b) => a - b) };
    });
    setSelected(new Set());
  }, [activeId, selected]);

  const clearCart = useCallback(() => setCart({}), []);

  const cartTotal = Object.values(cart).reduce((n, a) => n + a.length, 0);

  const mergeDownload = useCallback(async () => {
    const entries = Object.entries(cart).filter(([, a]) => a.length > 0);
    if (entries.length === 0) return;
    setBusy(true);
    try {
      const decksSel = [];
      for (const [id, indices] of entries) {
        const buf = await getDeckBuf(id);
        if (buf) decksSel.push({ buf, indices });
      }
      const blob = await buildMergedPptx(decksSel);
      const url = URL.createObjectURL(new Blob([blob], { type: PPTX_MIME }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged-${cartTotal}slides.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setErrorMsg("合成に失敗しました。スライドの組み合わせをご確認ください。");
    } finally {
      setBusy(false);
    }
  }, [cart, cartTotal]);

  // Remove selected slides from the ACTIVE deck (keep the rest), persist.
  const deleteSelected = useCallback(async () => {
    if (!bufRef.current || !activeId || selected.size === 0) return;
    if (selected.size >= slideCount) {
      setErrorMsg("すべてのスライドは削除できません。1枚以上残してください。");
      return;
    }
    setBusy(true);
    try {
      const keep = Array.from({ length: slideCount }, (_, i) => i).filter(
        (i) => !selected.has(i),
      );
      const blob = await buildPptxSubset(bufRef.current.slice(0), keep);
      const newBuf = await blob.arrayBuffer();
      await updateDeck(activeId, { buf: newBuf.slice(0), slideCount: keep.length });
      renderCacheRef.current.delete(activeId); // content changed → invalidate
      setDecks((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, slideCount: keep.length } : d,
        ),
      );
      await loadFromBuffer(newBuf, fileName);
    } catch (e) {
      console.error(e);
      setErrorMsg("削除の処理に失敗しました。");
    } finally {
      setBusy(false);
    }
  }, [selected, slideCount, fileName, activeId, loadFromBuffer]);

  // Remove an entire deck from the library.
  const deleteDeck = useCallback(
    async (id: string) => {
      try {
        await removeDeck(id);
      } catch {
        /* noop */
      }
      renderCacheRef.current.delete(id);
      const remaining = decksRef.current.filter((d) => d.id !== id);
      setDecks(remaining);
      setCart((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (activeId === id) {
        if (remaining.length > 0) {
          setActiveId(remaining[remaining.length - 1].id);
        } else {
          resetRender();
          bufRef.current = null;
          setActiveId(null);
          setSlideCount(0);
          setFileName("");
          setSelected(new Set());
          setStatus("idle");
        }
      }
    },
    [activeId, resetRender],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  // Zoom modal: render a single slide large.
  useEffect(() => {
    if (zoom === null || !bufRef.current) return;
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pv: any = null;
    setZoomLoading(true);
    (async () => {
      try {
        const { init } = await import("pptx-preview");
        const blob = await buildPptxSubset(bufRef.current!.slice(0), [zoom]);
        const sbuf = await blob.arrayBuffer();
        if (cancelled) return;
        const host = zoomHostRef.current;
        if (!host) return;
        host.innerHTML = "";
        const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
        const vh = typeof window !== "undefined" ? window.innerHeight : 700;
        const W = Math.min(Math.floor(vw * 0.86), Math.floor(((vh - 140) * 16) / 9), 1100);
        pv = init(host, { mode: "list", width: W, height: Math.round((W * 9) / 16) });
        await pv.preview(sbuf);
        if (cancelled) {
          try {
            pv.destroy();
          } catch {
            /* noop */
          }
          return;
        }
        setZoomLoading(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) setZoomLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (pv) {
        try {
          pv.destroy();
        } catch {
          /* noop */
        }
      }
    };
  }, [zoom]);

  useEffect(() => {
    if (zoom === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
      else if (e.key === "ArrowRight") setZoom((z) => (z === null ? z : Math.min(slideCount - 1, z + 1)));
      else if (e.key === "ArrowLeft") setZoom((z) => (z === null ? z : Math.max(0, z - 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, slideCount]);

  const hasDecks = decks.length > 0;

  return (
    <div
      className="relative min-h-screen"
      onDragOver={(e) => {
        if (hasDecks) {
          e.preventDefault();
          if (!dragOver) setDragOver(true);
        }
      }}
      onDragLeave={() => hasDecks && setDragOver(false)}
      onDrop={hasDecks ? onDrop : undefined}
    >
      {/* Background */}
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
              className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:text-violet-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              ← Library
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-base font-bold leading-tight text-slate-900 sm:text-lg">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-xs text-white shadow-sm">
                  P
                </span>
                PPT スライド抽出
              </h1>
              <p className="text-xs text-slate-500">
                .pptx を読み込み、使いたいスライドだけを選んで書き出し。
              </p>
            </div>
          </div>

          {status === "ready" && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden text-xs text-slate-500 sm:inline">
                {selected.size} / {slideCount} 選択中
              </span>
              <button
                type="button"
                onClick={selected.size === slideCount ? clearAll : selectAll}
                className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                {selected.size === slideCount ? "全解除" : "全選択"}
              </button>
              <button
                type="button"
                onClick={deleteSelected}
                disabled={selected.size === 0 || selected.size >= slideCount || busy}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/70 px-3 py-2 text-sm font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                title="選択したスライドを削除"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 7h16M9 7V4h6v3m-7 0v13h8V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                選択を削除
              </button>
              <button
                type="button"
                onClick={addToCart}
                disabled={selected.size === 0 || busy}
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="他ファイルのスライドと合成するためカートに追加"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H2m4 17a1 1 0 100 2 1 1 0 000-2zm12 0a1 1 0 100 2 1 1 0 000-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                カートに追加
              </button>
              <button
                type="button"
                onClick={download}
                disabled={selected.size === 0 || busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? (
                  "処理中…"
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    選択をDL（.pptx）
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Empty state importer */}
        {!hasDecks && (
          <div className="mx-auto max-w-2xl">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                if (!dragOver) setDragOver(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-8 py-16 text-center backdrop-blur transition ${
                dragOver
                  ? "border-violet-500 bg-violet-50/80"
                  : "border-violet-300 bg-white/70 hover:border-violet-400 hover:bg-white"
              }`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl text-white shadow">
                ⤓
              </span>
              <span className="text-lg font-bold text-slate-800">
                {restoring ? "復元中…" : dragOver ? "ここにドロップ" : "PowerPoint ファイルを選択"}
              </span>
              <span className="text-sm text-slate-500">
                .pptx をクリックで選択（またはドラッグ＆ドロップ）
              </span>
              <input
                type="file"
                accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
            </label>
            {errorMsg && (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-600">
                {errorMsg}
              </p>
            )}
          </div>
        )}

        {/* Deck switcher + grid */}
        {hasDecks && (
          <>
            {/* Cross-deck merge cart */}
            {cartTotal > 0 && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-bold text-violet-800">
                    🛒 合成カート：{cartTotal}枚
                  </span>
                  <span className="text-violet-500">
                    （
                    {Object.entries(cart)
                      .filter(([, a]) => a.length > 0)
                      .map(([id, a]) => {
                        const nm = decks.find((d) => d.id === id)?.name ?? "?";
                        return `${nm.replace(/\.pptx$/i, "")} ${a.length}`;
                      })
                      .join(" / ")}
                    ）
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
                  >
                    空にする
                  </button>
                  <button
                    type="button"
                    onClick={mergeDownload}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {busy ? "合成中…" : "合成してDL（.pptx）"}
                  </button>
                </div>
              </div>
            )}

            {/* Deck chips */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {decks.map((d) => {
                const isActive = d.id === activeId;
                return (
                  <div
                    key={d.id}
                    className={`group/chip flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                      isActive
                        ? "border-violet-400 bg-white text-violet-700 shadow-sm ring-1 ring-violet-200"
                        : "border-slate-200 bg-white/70 text-slate-600 hover:border-violet-300 hover:text-violet-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(d.id)}
                      className="flex items-center gap-2"
                      title={d.name}
                    >
                      <span className="grid h-4 w-4 place-items-center rounded bg-gradient-to-br from-orange-500 to-amber-500 text-[8px] font-black text-white">
                        P
                      </span>
                      <span className="max-w-[160px] truncate font-semibold">{d.name}</span>
                      <span className="text-xs text-slate-400">{d.slideCount}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`${d.name} を削除`}
                      onClick={() => deleteDeck(d.id)}
                      className="grid h-4 w-4 place-items-center rounded-full text-slate-300 transition hover:bg-rose-100 hover:text-rose-600"
                      title="このファイルを削除"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {/* Add new deck */}
              <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-violet-300 bg-white/60 px-3 py-1.5 text-sm font-semibold text-violet-600 transition hover:border-violet-400 hover:bg-white">
                ＋ ファイルを追加
                <input
                  type="file"
                  accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {/* Active deck header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                <span className="text-slate-900">{fileName}</span>
                <span className="ml-2 text-slate-400">{slideCount} スライド</span>
                {status === "loading" && (
                  <span className="ml-2 text-violet-500">描画中…</span>
                )}
              </p>
              {dragOver && (
                <span className="text-xs font-semibold text-violet-600">
                  ドロップで新しいファイルを追加
                </span>
              )}
            </div>

            {errorMsg && (
              <p className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
                {errorMsg}
              </p>
            )}

            <div
              key={activeId + "::" + slideCount}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
              {Array.from({ length: slideCount }, (_, i) => {
                const isSel = selected.has(i);
                return (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSel}
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle(i);
                      }
                    }}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-white text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      isSel
                        ? "border-violet-500 ring-2 ring-violet-200"
                        : "border-slate-200 hover:border-violet-300"
                    }`}
                  >
                    <div
                      ref={(el) => {
                        cellRefs.current[i] = el;
                      }}
                      className="flex items-center justify-center bg-slate-50"
                      style={{ width: "100%", height: THUMB_H, overflow: "hidden" }}
                    />
                    {/* Skeleton overlay while rendering (sibling — never touched by the JS that fills the cell) */}
                    {status === "loading" && (
                      <div
                        className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100"
                        style={{ height: THUMB_H }}
                      />
                    )}
                    {/* Checkbox */}
                    <span
                      className={`absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-md border-2 text-xs font-bold transition ${
                        isSel
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 bg-white/80 text-transparent group-hover:border-violet-400"
                      }`}
                    >
                      ✓
                    </span>
                    {/* Expand */}
                    <button
                      type="button"
                      aria-label={`スライド ${i + 1} を拡大表示`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoom(i);
                      }}
                      className={`absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-slate-900/70 text-white shadow-sm backdrop-blur-sm transition hover:bg-slate-900 ${
                        isSel ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M9 3H3v6M3 3l7 7M15 21h6v-6M21 21l-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {/* Number */}
                    <span className="absolute bottom-1.5 right-2 rounded bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Zoom modal */}
      {zoom !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/75 p-4 backdrop-blur-sm"
          onClick={() => setZoom(null)}
        >
          <div
            className="mb-3 flex w-full max-w-[1100px] items-center justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-semibold">
              スライド {zoom + 1} <span className="text-white/50">/ {slideCount}</span>
            </span>
            <button
              type="button"
              aria-label="閉じる"
              onClick={() => setZoom(null)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/25"
            >
              ✕
            </button>
          </div>

          <div
            className="relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="前のスライド"
              disabled={zoom <= 0}
              onClick={() => setZoom((z) => (z === null ? z : Math.max(0, z - 1)))}
              className="absolute left-0 z-10 -translate-x-[120%] rounded-full bg-white/15 p-3 text-white transition hover:bg-white/30 disabled:opacity-30"
            >
              <svg width="18" height="30" viewBox="0 0 22 40" fill="none" aria-hidden>
                <path d="M18 4 L5 20 L18 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
              <div ref={zoomHostRef} className="flex items-center justify-center" />
              {zoomLoading && (
                <div className="grid place-items-center px-16 py-20 text-sm text-slate-400">
                  読み込み中…
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="次のスライド"
              disabled={zoom >= slideCount - 1}
              onClick={() => setZoom((z) => (z === null ? z : Math.min(slideCount - 1, z + 1)))}
              className="absolute right-0 z-10 translate-x-[120%] rounded-full bg-white/15 p-3 text-white transition hover:bg-white/30 disabled:opacity-30"
            >
              <svg width="18" height="30" viewBox="0 0 22 40" fill="none" aria-hidden>
                <path d="M4 4 L17 20 L4 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-xs text-white/50">← → で移動 / Esc で閉じる</p>
        </div>
      )}

      {/* Offscreen full render target */}
      <div
        ref={offscreenRef}
        aria-hidden
        style={{
          position: "fixed",
          left: -99999,
          top: 0,
          width: THUMB_W,
          pointerEvents: "none",
          opacity: 0,
        }}
      />
    </div>
  );
}
