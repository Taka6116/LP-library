"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { getSlideRefs, buildPptxSubset, PPTX_MIME } from "@/lib/pptx/subset";
import { saveDeck, loadDeck, clearDeck } from "@/lib/pptx/deckStore";

type Status = "idle" | "loading" | "ready" | "error";

// Thumbnail render size (16:9). pptx-preview renders each slide at this size.
const THUMB_W = 300;
const THUMB_H = Math.round((THUMB_W * 9) / 16);

export default function PptStudioPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [slideCount, setSlideCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [errorMsg, setErrorMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [restoring, setRestoring] = useState(true);

  const bufRef = useRef<ArrayBuffer | null>(null);
  const offscreenRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const previewerRef = useRef<any>(null);
  const renderTokenRef = useRef(0);

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

  // Load a deck from an in-memory buffer: parse slide count → effect renders.
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
          setErrorMsg("スライドが見つかりませんでした。.pptx ファイルかご確認ください。");
          return;
        }
        setSlideCount(refs.length);
      } catch (e) {
        console.error(e);
        setStatus("error");
        setErrorMsg("読み込みに失敗しました。ファイル形式をご確認ください。");
      }
    },
    [resetRender],
  );

  const handleFile = useCallback(
    async (file: File) => {
      if (!/\.pptx$/i.test(file.name)) {
        setStatus("error");
        setErrorMsg(".pptx ファイルを選択してください。");
        return;
      }
      const buf = await file.arrayBuffer();
      await loadFromBuffer(buf, file.name);
      // persist locally so it survives reload / navigation
      try {
        await saveDeck(file.name, buf.slice(0));
      } catch (e) {
        console.warn("deck persist failed", e);
      }
    },
    [loadFromBuffer],
  );

  // Restore a previously imported deck on mount.
  useEffect(() => {
    (async () => {
      try {
        const stored = await loadDeck();
        if (stored?.buf) {
          await loadFromBuffer(stored.buf, stored.name);
        }
      } catch (e) {
        console.warn("deck restore failed", e);
      } finally {
        setRestoring(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render all slides (list mode) once cells exist, then mount each rendered
  // node into its grid cell.
  useEffect(() => {
    if (status !== "loading" || slideCount === 0 || !bufRef.current) return;
    const token = ++renderTokenRef.current;

    (async () => {
      try {
        const { init } = await import("pptx-preview");
        const host = offscreenRef.current;
        if (!host) return;
        host.innerHTML = "";

        const previewer = init(host, {
          mode: "list",
          width: THUMB_W,
          height: THUMB_H,
        });
        previewerRef.current = previewer;

        await previewer.preview(bufRef.current!.slice(0));
        if (token !== renderTokenRef.current) return; // superseded

        const nodes = host.querySelectorAll<HTMLElement>(
          ".pptx-preview-slide-wrapper",
        );
        for (let i = 0; i < slideCount; i++) {
          const cell = cellRefs.current[i];
          const node = nodes[i];
          if (cell && node) {
            cell.innerHTML = "";
            node.style.margin = "0";
            cell.appendChild(node);
          }
        }
        setStatus("ready");
      } catch (e) {
        console.error(e);
        if (token === renderTokenRef.current) {
          setStatus("error");
          setErrorMsg("プレビューの生成に失敗しました。");
        }
      }
    })();
  }, [status, slideCount]);

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

  const startOver = useCallback(async () => {
    resetRender();
    bufRef.current = null;
    setSelected(new Set());
    setSlideCount(0);
    setFileName("");
    setErrorMsg("");
    setStatus("idle");
    try {
      await clearDeck();
    } catch {
      /* noop */
    }
  }, [resetRender]);

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

  // Remove the selected slides from the working deck (keep the rest).
  const deleteSelected = useCallback(async () => {
    if (!bufRef.current || selected.size === 0) return;
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
      await loadFromBuffer(newBuf, fileName);
      try {
        await saveDeck(fileName, newBuf.slice(0));
      } catch (e) {
        console.warn("deck persist failed", e);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("削除の処理に失敗しました。");
    } finally {
      setBusy(false);
    }
  }, [selected, slideCount, fileName, loadFromBuffer]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  return (
    <div className="relative min-h-screen">
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
              href="/"
              className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:text-violet-700"
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
        {/* Importer (idle / error / loading without slides yet) */}
        {status !== "ready" && !(status === "loading" && slideCount > 0) && (
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
                  ? "border-violet-500 bg-violet-50/80 scale-[1.01]"
                  : "border-violet-300 bg-white/70 hover:border-violet-400 hover:bg-white"
              }`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl text-white shadow">
                ⤓
              </span>
              <span className="text-lg font-bold text-slate-800">
                {restoring
                  ? "復元中…"
                  : status === "loading"
                    ? "読み込み中…"
                    : dragOver
                      ? "ここにドロップ"
                      : "PowerPoint ファイルを選択"}
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
            {status === "error" && (
              <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-600">
                {errorMsg}
              </p>
            )}
          </div>
        )}

        {/* Slide grid */}
        {(status === "ready" || (status === "loading" && slideCount > 0)) && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                <span className="text-slate-900">{fileName}</span>
                <span className="ml-2 text-slate-400">{slideCount} スライド</span>
                {status === "loading" && (
                  <span className="ml-2 text-violet-500">描画中…</span>
                )}
              </p>
              <button
                type="button"
                onClick={startOver}
                className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
              >
                別のファイルを読み込む
              </button>
            </div>

            {errorMsg && (
              <p className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
                {errorMsg}
              </p>
            )}

            <div
              key={fileName + "::" + slideCount}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
              {Array.from({ length: slideCount }, (_, i) => {
                const isSel = selected.has(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left transition ${
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
                    <span
                      className={`absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-md border-2 text-xs font-bold transition ${
                        isSel
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-slate-300 bg-white/80 text-transparent group-hover:border-violet-400"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="absolute bottom-1.5 right-2 rounded bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Offscreen full render target (kept in DOM but visually hidden) */}
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
