"use client";

import { useState, useMemo, useEffect, useRef, useId } from "react";
import {
  EMAIL_BLOCKS,
  DEFAULT_FIELDS,
  buildEmailHtml,
  type EmailFields,
} from "@/lib/email/blocks";
import { useBrand } from "@/components/BrandProvider";
import { AppHeader } from "@/components/AppHeader";
import { Button, Input, Textarea, useToast } from "@/components/ui";
import { takeHandoff } from "@/lib/cross/handoff";
import { IconChevronDown } from "@/components/icons";

const DEFAULT_ORDER = ["header", "hero", "divider", "body", "button", "footer"];

export default function EmailPage() {
  const [fields, setFields] = useState<EmailFields>(DEFAULT_FIELDS);
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const { brand } = useBrand();
  const toast = useToast();
  const colorId = useId();
  // ユーザーが手で編集したフィールドは Brand 連動の上書き対象から外す
  const touched = useRef<Set<keyof EmailFields>>(new Set());

  // Brand Kit の会社名・色を未編集フィールドへ自動反映（手動「ブランド適用」を廃止）
  useEffect(() => {
    setFields((f) => ({
      ...f,
      ...(touched.current.has("brandColor") ? {} : { brandColor: brand.primaryColor }),
      ...(touched.current.has("companyName") ? {} : { companyName: brand.companyName }),
    }));
  }, [brand.primaryColor, brand.companyName]);

  // プロンプト集などからの受け渡しがあれば本文に流し込む
  useEffect(() => {
    const text = takeHandoff("email");
    if (text) {
      touched.current.add("bodyText");
      setFields((f) => ({ ...f, bodyText: text }));
      toast.success("プロンプト集から本文を受け取りました");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const html = useMemo(() => buildEmailHtml(order, fields), [order, fields]);

  function set<K extends keyof EmailFields>(k: K, v: EmailFields[K]) {
    touched.current.add(k);
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
    toast.success("email.html をダウンロードしました");
  }
  async function copyHtml() {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(html);
      toast.success("HTMLをコピーしました");
    } catch {
      toast.error("コピーに失敗しました。お使いの環境では手動でコピーしてください");
    }
  }

  const field = (
    label: string,
    k: keyof EmailFields,
    textarea = false,
  ) =>
    textarea ? (
      <Textarea label={label} value={fields[k]} rows={3} onChange={(e) => set(k, e.target.value)} />
    ) : (
      <Input label={label} value={fields[k]} onChange={(e) => set(k, e.target.value)} />
    );

  return (
    <div className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-violet-50 via-white to-fuchsia-50"
      >
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>

      {/* Header */}
      <AppHeader
        current="email"
        title="メール / メルマガ"
        subtitle="ブロックを組んで HTML メールを書き出し。"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={copyHtml}>
              HTMLをコピー
            </Button>
            <Button variant="primary" size="sm" onClick={download}>
              ダウンロード
            </Button>
          </>
        }
      />

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
                          className="rounded p-0.5 text-slate-400 transition hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label={`${b.label}を上へ`}
                        >
                          <IconChevronDown className="h-4 w-4 rotate-180" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(b.id, 1)}
                          className="rounded p-0.5 text-slate-400 transition hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                          aria-label={`${b.label}を下へ`}
                        >
                          <IconChevronDown className="h-4 w-4" />
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
            <div className="block">
              <label htmlFor={colorId} className="mb-1 block text-xs font-semibold text-surface-muted">
                ブランドカラー
              </label>
              <input
                id={colorId}
                type="color"
                value={fields.brandColor}
                onChange={(e) => set("brandColor", e.target.value)}
                className="h-9 w-16 cursor-pointer rounded-[var(--radius-sm)] border border-border"
              />
            </div>
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
