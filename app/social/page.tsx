"use client";

import { useState } from "react";
import Link from "next/link";
import { PLATFORMS, type RepurposeInput, type ToneMode } from "@/lib/social/repurpose";
import { addCopyItem } from "@/lib/swipe/store";
import { loadBrand, TONE_LABELS } from "@/lib/brand/store";

function parseTags(s: string): string[] {
  return [...new Set(s.split(/[,、\s]+/).map((t) => t.replace(/^#/, "").trim()).filter(Boolean))];
}

export default function SocialPage() {
  const [hook, setHook] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [hashtagsStr, setHashtagsStr] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [tone, setTone] = useState<ToneMode>("formal");
  const [companyName, setCompanyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  function applyBrand() {
    const b = loadBrand();
    setTone(b.tone as ToneMode);
    setCompanyName(b.companyName);
  }

  const input: RepurposeInput = {
    hook, body, url,
    hashtags: parseTags(hashtagsStr),
    emoji, tone, companyName,
  };
  const ready = body.trim().length > 0 || hook.trim().length > 0;

  function copy(id: string, text: string) {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1200);
  }
  function saveToBank(id: string, text: string) {
    addCopyItem(text, "ボディ", ["SNS", id]);
    setSaved(id);
    window.setTimeout(() => setSaved(null), 1200);
  }

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
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 text-xs text-white shadow-sm">
                  ↻
                </span>
                SNS投稿リパーパス
              </h1>
              <p className="text-xs text-slate-500">
                1本の内容を各SNS向けに整形して量産。
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[380px_1fr]">
        {/* Input */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <p className="mb-2 text-sm font-bold text-slate-700">元ネタ</p>
            <input
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder="フック（1行目・任意）"
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="本文（伝えたい中心メッセージ）"
              rows={6}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="リンクURL（任意）"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
            />
            <input
              value={hashtagsStr}
              onChange={(e) => setHashtagsStr(e.target.value)}
              placeholder="ハッシュタグ（スペース区切り）"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
            />
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={emoji} onChange={e => setEmoji(e.target.checked)} className="accent-violet-600" />
              絵文字を許可
            </label>

            {/* Tone + brand */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600">トーン</p>
                <button type="button" onClick={applyBrand}
                  className="rounded-full border border-indigo-200 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-50">
                  🎨 ブランドから取込
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.entries(TONE_LABELS) as [ToneMode, string][]).map(([t, label]) => (
                  <button key={t} type="button" onClick={() => setTone(t)}
                    className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition ${
                      tone === t
                        ? "border-violet-400 bg-violet-50 text-violet-700"
                        : "border-slate-200 text-slate-500 hover:border-violet-300"
                    }`}>
                    {t === "formal" ? "🤝 " : t === "casual" ? "😊 " : "⚡ "}
                    {label.split("・")[0]}
                  </button>
                ))}
              </div>
              {companyName && (
                <p className="mt-2 text-[11px] text-slate-400">
                  会社名: <strong>{companyName}</strong>（LinkedIn冒頭に使用）
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          {!ready ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-20 text-center text-sm text-slate-400">
              左に元ネタを入力すると、各SNS向けの投稿文がここに生成されます。
            </div>
          ) : (
            PLATFORMS.map((p) => {
              const text = p.format(input);
              const over = text.length > p.limit;
              return (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div
                    className="flex items-center justify-between px-4 py-2.5 text-white"
                    style={{ background: p.accent }}
                  >
                    <span className="text-sm font-bold">{p.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        over ? "bg-rose-500" : "bg-white/20"
                      }`}
                    >
                      {text.length} / {p.limit}
                    </span>
                  </div>
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-700">
                      {text}
                    </pre>
                    {p.note && (
                      <p className="mt-2 text-[11px] text-slate-400">※ {p.note}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copy(p.id, text)}
                        className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-1.5 text-xs font-bold text-white shadow transition hover:brightness-110"
                      >
                        {copiedId === p.id ? "✓ コピー" : "コピー"}
                      </button>
                      <button
                        type="button"
                        onClick={() => saveToBank(p.id, text)}
                        className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                      >
                        {saved === p.id ? "✓ 保存" : "＋バンク"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
