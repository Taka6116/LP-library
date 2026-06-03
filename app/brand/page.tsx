"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  loadBrand, saveBrand, FONT_STACKS, TONE_LABELS, DEFAULT_BRAND,
  type BrandKit, type FontId, type BrandTone,
} from "@/lib/brand/store";

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-5 w-5 rounded-full border border-black/10 shadow-sm"
      style={{ background: color }}
    />
  );
}

export default function BrandPage() {
  const [kit, setKit] = useState<BrandKit>(DEFAULT_BRAND);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setKit(loadBrand()); }, []);

  function set<K extends keyof BrandKit>(k: K, v: BrandKit[K]) {
    setKit(prev => ({ ...prev, [k]: v }));
  }
  function save() {
    saveBrand(kit);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }
  function reset() {
    setKit({ ...DEFAULT_BRAND });
  }

  const fontStack = FONT_STACKS.find(f => f.id === kit.fontId)?.stack ?? "";

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-violet-50 via-white to-fuchsia-50">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-3xl border border-white/60 bg-gradient-to-b from-white/85 to-white/55 px-5 py-3.5 shadow-[0_12px_34px_-12px_rgba(76,29,149,0.35)] ring-1 ring-inset ring-white/60 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:text-violet-700">
              ← Library
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-base font-bold leading-tight text-slate-900 sm:text-lg">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-xs text-white shadow-sm">
                  🎨
                </span>
                ブランドキット
              </h1>
              <p className="text-xs text-slate-500">色・フォント・トーンを1か所で定義し、全モジュールに適用。</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={reset}
              className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300">
              リセット
            </button>
            <button type="button" onClick={save}
              className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-110">
              {saved ? "✓ 保存しました" : "保存"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[420px_1fr]">
        {/* Editor */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

          {/* Brand identity */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <p className="mb-4 text-sm font-bold text-slate-700">ブランド基本情報</p>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">会社名 / ブランド名</span>
                <input value={kit.companyName} onChange={e => set("companyName", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">タグライン（任意）</span>
                <input value={kit.tagline} onChange={e => set("tagline", e.target.value)}
                  placeholder="例：補助金申請をシンプルに。"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300" />
              </label>
            </div>
          </section>

          {/* Colors */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <p className="mb-4 text-sm font-bold text-slate-700">カラーパレット</p>
            <div className="space-y-3">
              {([
                ["primaryColor",   "プライマリカラー（メインブランド色）"],
                ["secondaryColor", "セカンダリカラー（テキスト・背景）"],
                ["accentColor",    "アクセントカラー（CTA・強調）"],
              ] as [keyof BrandKit, string][]).map(([k, label]) => (
                <div key={k} className="flex items-center gap-3">
                  <input type="color" value={kit[k] as string}
                    onChange={e => set(k, e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200" />
                  <div>
                    <p className="text-xs font-semibold text-slate-600">{label}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{kit[k] as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Font */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <p className="mb-3 text-sm font-bold text-slate-700">フォント</p>
            <div className="grid grid-cols-2 gap-2">
              {FONT_STACKS.map(f => (
                <button key={f.id} type="button"
                  onClick={() => set("fontId", f.id as FontId)}
                  className={`rounded-xl border px-3 py-2.5 text-sm transition ${
                    kit.fontId === f.id
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-600 hover:border-violet-300"
                  }`}
                  style={{ fontFamily: f.stack }}>
                  {f.label}
                  <span className="block text-xs opacity-60">あいうABC</span>
                </button>
              ))}
            </div>
          </section>

          {/* Tone */}
          <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <p className="mb-3 text-sm font-bold text-slate-700">コミュニケーションの温度感</p>
            <div className="space-y-2">
              {(Object.entries(TONE_LABELS) as [BrandTone, string][]).map(([t, label]) => (
                <button key={t} type="button"
                  onClick={() => set("tone", t)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    kit.tone === t
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-slate-200 text-slate-600 hover:border-violet-300"
                  }`}>
                  <span className="text-lg">
                    {t === "formal" ? "🤝" : t === "casual" ? "😊" : "⚡"}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Live preview */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-600">プレビュー</p>

          {/* Mini LP card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
            style={{ fontFamily: fontStack }}>
            <div className="px-8 py-12 text-white"
              style={{ background: `linear-gradient(135deg, ${kit.secondaryColor} 0%, ${kit.primaryColor} 100%)` }}>
              <p className="mb-2 text-sm font-semibold opacity-70">{kit.companyName}</p>
              <h2 className="text-3xl font-extrabold leading-snug">
                {kit.tagline || "タグラインがここに入ります。"}
              </h2>
              <button className="mt-6 rounded-lg px-6 py-3 text-sm font-bold text-slate-900"
                style={{ background: kit.accentColor }}>
                お問い合わせ →
              </button>
            </div>
          </div>

          {/* Mini email preview */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
            style={{ fontFamily: fontStack }}>
            <div className="border-b-4 px-6 py-3 text-center font-bold"
              style={{ borderColor: kit.primaryColor }}>
              {kit.companyName}
            </div>
            <div className="px-6 py-6">
              <h3 className="mb-2 text-xl font-extrabold" style={{ color: kit.secondaryColor }}>
                メールの見出しがここに入ります
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500">
                {kit.tone === "formal"
                  ? "ご担当者様、平素よりお世話になっております。"
                  : kit.tone === "casual"
                    ? "こんにちは！最新情報をお届けします。"
                    : "⚡ 今すぐチェック！見逃し厳禁の情報です。"}
              </p>
              <span className="inline-block rounded-lg px-5 py-2.5 text-sm font-bold text-white"
                style={{ background: kit.primaryColor }}>
                詳しく見る →
              </span>
            </div>
          </div>

          {/* Mini SNS preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            style={{ fontFamily: fontStack }}>
            <div className="mb-2 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full text-xs font-black text-white"
                style={{ background: kit.primaryColor }}>
                {kit.companyName.slice(0, 1)}
              </span>
              <span className="text-sm font-bold text-slate-800">{kit.companyName}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {kit.tone === "formal"
                ? `【${kit.companyName}】新サービスをご紹介いたします。詳細はリンクからご確認ください。`
                : kit.tone === "casual"
                  ? `${kit.tagline || kit.companyName}のご紹介 ✨ ぜひチェックしてみてください！`
                  : `🔥 ${kit.tagline || "新サービス登場"} 今すぐ確認 → `}
            </p>
          </div>

          {/* Apply to modules hint */}
          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm text-violet-700">
            <p className="font-bold mb-1">💡 各モジュールへの適用方法</p>
            <ul className="space-y-1 text-xs text-violet-600">
              <li>• <strong>LP</strong>：Generated LP の「テーマ」→ ブランドカラーを選択</li>
              <li>• <strong>Mail</strong>：メールビルダーで「ブランド適用」ボタンを使用</li>
              <li>• <strong>Social</strong>：SNSリパーパスで「ブランドから入力」を使用</li>
              <li>• <strong>Swipe</strong>：コピーバンクのタグ検索でブランド名で絞り込み</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
