"use client";

import {
  FONT_STACKS, TONE_LABELS,
  type BrandKit, type FontId, type BrandTone,
} from "@/lib/brand/store";
import { useBrand } from "@/components/BrandProvider";
import { AppHeader } from "@/components/AppHeader";
import { Button, useToast } from "@/components/ui";

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-5 w-5 rounded-full border border-black/10 shadow-sm"
      style={{ background: color }}
    />
  );
}

export default function BrandPage() {
  const { brand: kit, update, reset: resetBrand } = useBrand();
  const { success } = useToast();

  function set<K extends keyof BrandKit>(k: K, v: BrandKit[K]) {
    update({ [k]: v } as Partial<BrandKit>);
  }
  function reset() {
    resetBrand();
    success("ブランドを既定値に戻しました");
  }

  const fontStack = FONT_STACKS.find(f => f.id === kit.fontId)?.stack ?? "";

  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-violet-50 via-white to-fuchsia-50">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>

      {/* Header */}
      <AppHeader
        current="brand"
        title="ブランドキット"
        subtitle="色・フォント・トーンを1か所で定義し、全モジュールに適用。"
        actions={
          <>
            <span className="hidden items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 lg:inline-flex dark:bg-violet-500/10 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden />
              自動保存・即反映
            </span>
            <Button variant="secondary" size="sm" onClick={reset}>リセット</Button>
          </>
        }
      />

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

          {/* Auto-linking hint */}
          <div className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 text-sm text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
            <p className="font-bold mb-1">各モジュールへ自動で反映されます</p>
            <ul className="space-y-1 text-xs text-violet-600 dark:text-violet-300/90">
              <li>• <strong>Mail</strong>：会社名・ブランドカラーが自動で入ります（個別に編集した項目はそのまま保持）</li>
              <li>• <strong>Social</strong>：会社名・トーンが自動で入ります（個別編集は保持）</li>
              <li>• <strong>LP</strong>：プレビューのアクセントにブランドカラーを反映（書き出しへの焼き込みは順次対応）</li>
              <li>• ここでの変更は保存ボタン不要で即時反映されます</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
