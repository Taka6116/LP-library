"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  EMAIL_BLOCKS,
  DEFAULT_FIELDS,
  buildEmailHtml,
  type EmailFields,
} from "@/lib/email/blocks";

const DEFAULT_ORDER = ["header", "hero", "divider", "body", "button", "footer"];

export default function EmailPage() {
  const [fields, setFields] = useState<EmailFields>(DEFAULT_FIELDS);
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);

  const html = useMemo(() => buildEmailHtml(order, fields), [order, fields]);

  function set<K extends keyof EmailFields>(k: K, v: EmailFields[K]) {
    setFields((f) => ({ ...f, [k]: v }));
  }
  const active = (id: string) => order.includes(id);
  function toggle(id: string) {
    setOrder((o) =>
      o.includes(id) ? o.filter((x) => x !== id) : [...o, id],
    );
  }
  function move(id: string, dir: -1 | 1) {
    setOrder((o) => {
      const i = o.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= o.length) return o;
      const next = [...o];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function download() {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  const [copied, setCopied] = useState(false);
  function copyHtml() {
    navigator.clipboard?.writeText(html);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  const field = (
    label: string,
    k: keyof EmailFields,
    textarea = false,
  ) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      {textarea ? (
        <textarea
          value={fields[k]}
          onChange={(e) => set(k, e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
        />
      ) : (
        <input
          value={fields[k]}
          onChange={(e) => set(k, e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300"
        />
      )}
    </label>
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
              href="/"
              className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:text-violet-700"
            >
              ← Library
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-base font-bold leading-tight text-slate-900 sm:text-lg">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-xs text-white shadow-sm">
                  ✉
                </span>
                メール / メルマガ Library
              </h1>
              <p className="text-xs text-slate-500">
                ブロックを組んで HTML メールを書き出し。
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyHtml}
              className="rounded-full border border-violet-200 bg-white/70 px-3 py-2 text-sm font-bold text-violet-700 transition hover:bg-white"
            >
              {copied ? "✓ コピー" : "HTMLをコピー"}
            </button>
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
            >
              HTMLをダウンロード
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[360px_1fr]">
        {/* Editor */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Blocks */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <p className="mb-2 text-sm font-bold text-slate-700">ブロック構成</p>
            <div className="space-y-1.5">
              {EMAIL_BLOCKS.map((b) => {
                const on = active(b.id);
                return (
                  <div
                    key={b.id}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm ${
                      on ? "border-violet-200 bg-violet-50/50" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(b.id)}
                      className="accent-violet-600"
                    />
                    <span className="flex-1 text-slate-700">{b.label}</span>
                    {on && (
                      <>
                        <button
                          type="button"
                          onClick={() => move(b.id, -1)}
                          className="text-slate-400 hover:text-violet-700"
                          aria-label="上へ"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => move(b.id, 1)}
                          className="text-slate-400 hover:text-violet-700"
                          aria-label="下へ"
                        >
                          ▼
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-700">内容</p>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">
                ブランドカラー
              </span>
              <input
                type="color"
                value={fields.brandColor}
                onChange={(e) => set("brandColor", e.target.value)}
                className="h-9 w-16 cursor-pointer rounded border border-slate-200"
              />
            </label>
            {field("会社名", "companyName")}
            {field("件名", "subject")}
            {field("プレヘッダー", "preheader")}
            {field("見出し", "heading", true)}
            {field("本文", "bodyText", true)}
            {field("本文ブロックのテキスト", "bodyText2", true)}
            {field("CTAテキスト", "ctaText")}
            {field("CTAリンク", "ctaUrl")}
            {field("フッター注記", "footerNote", true)}
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5 px-2 pt-1 text-xs text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2">メールプレビュー</span>
          </div>
          <iframe
            title="email preview"
            srcDoc={html}
            className="h-[70vh] w-full rounded-lg border border-slate-100"
          />
        </div>
      </main>
    </div>
  );
}
