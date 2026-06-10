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
import { AuroraBg } from "@/components/AuroraBg";
import { Button, Input, Textarea, useToast } from "@/components/ui";
import { takeHandoff, parseEmailParts } from "@/lib/cross/handoff";
import { IconChevronDown } from "@/components/icons";
import { glassPanel } from "@/lib/ui/glass";

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

  // プロンプト集などからの受け渡しがあれば各フィールドへ構造化して流し込む
  useEffect(() => {
    const text = takeHandoff("email");
    if (text) {
      const p = parseEmailParts(text);
      const patch: Partial<EmailFields> = { bodyText: p.body };
      touched.current.add("bodyText");
      if (p.subject) { patch.subject = p.subject; touched.current.add("subject"); }
      if (p.heading) { patch.heading = p.heading; touched.current.add("heading"); }
      if (p.cta) { patch.ctaText = p.cta; touched.current.add("ctaText"); }
      setFields((f) => ({ ...f, ...patch }));
      const n = Object.keys(patch).length;
      toast.success(n > 1 ? `件名・見出しなど${n}項目を受け取りました` : "本文を受け取りました");
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
      <AuroraBg />

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
          <div className={`p-4 ${glassPanel}`}>
            <p className="mb-2 text-sm font-bold text-slate-700 dark:text-zinc-200">ブロック構成</p>
            <div className="space-y-1.5">
              {EMAIL_BLOCKS.map((b) => {
                const on = active(b.id);
                return (
                  <div
                    key={b.id}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm ${
                      on ? "border-violet-200 bg-violet-50/50 dark:border-violet-400/30 dark:bg-violet-500/10" : "border-slate-200 dark:border-white/10"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(b.id)}
                      className="accent-violet-600"
                    />
                    <span className="flex-1 text-slate-700 dark:text-zinc-300">{b.label}</span>
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
          <div className={`space-y-3 p-4 ${glassPanel}`}>
            <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">内容</p>
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
            {field("画像URL（画像ブロック用）", "imageUrl")}
            {field("画像の説明（alt）", "imageAlt")}
            {field("SNSリンク（1行に「ラベル URL」）", "socialLinks", true)}
            {field("フッター注記", "footerNote", true)}
          </div>
        </div>

        {/* Preview */}
        <div className={`p-2 ${glassPanel}`}>
          <div className="mb-2 flex items-center gap-1.5 px-2 pt-1 text-xs text-slate-400 dark:text-zinc-500">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2">メールプレビュー</span>
          </div>
          <iframe
            title="email preview"
            srcDoc={html}
            className="h-[70vh] w-full rounded-lg border border-slate-100 bg-white dark:border-white/10"
          />
        </div>
      </main>
    </div>
  );
}
