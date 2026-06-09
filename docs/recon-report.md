# Recon Report

**調査日**: 2026-06-09
**コミットハッシュ**: 358ddf95a7d2dd9d1498593e246f262ca9a3227e
**プロダクト名**: Marketer's Studio — マーケ制作資産スタジオ
**本番URL**: https://lp-library-nu.vercel.app/
**リポジトリパス**: C:\Users\goto_\Documents\LP-library

---

## 技術スタック / 依存一覧

### ランタイム・フレームワーク
- **Next.js**: 16.2.6（App Router、SSR/CSR混在）
- **React**: 19.x（`"use client"` 指令で CSR 領域を明示）
- **TypeScript**: 5.x（strict: true、path alias: `@/*`）
- **言語**: 日本語（UI全般）

### 主要依存ライブラリ
| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `jszip` | 3.10.1 | PPTX ファイルの ZIP 処理・スライド抽出 |
| `pptx-preview` | 1.0.7 | PPTX スライドの HTML プレビュー生成（サムネイル） |
| `tailwindcss` | 3.4.x | ユーティリティ CSS フレームワーク |
| `autoprefixer` / `postcss` | - | CSS トランスパイル・プリフィックス |

### デプロイ構成
1. **Vercel（本番）**: Next.js ネイティブ実行、`basePath` なし（ルート `/` 配信）、SSR + Static 混在。
2. **GitHub Pages（静的書き出し・オプション）**: `GITHUB_PAGES=true` → `output: "export"` + `basePath: "/LP-library"`、`NEXT_PUBLIC_BASE_PATH` で動的リンク構成。

---

## アーキテクチャ

### ルーティング（App Router）
| パス | 機能 | 実装ファイル | CSR |
|------|------|-----------|-----|
| `/` | ダッシュボード・ナビ | `app/page.tsx` | ✓ |
| `/library` | LP セクション組み合わせ・プレビュー | `app/library/page.tsx` | ✓ |
| `/ppt` | PPT スライド抽出・選択・DL | `app/ppt/page.tsx` | ✓ |
| `/swipe` | 参考URL・スクショ・コピー銀行 | `app/swipe/page.tsx` | ✓ |
| `/email` | HTML メール組立・DL | `app/email/page.tsx` | ✓ |
| `/social` | SNS リパーパス（X/LinkedIn/Instagram/Threads/Facebook） | `app/social/page.tsx` | ✓ |
| `/brand` | ブランドキット（色・フォント・トーン） | `app/brand/page.tsx` | ✓ |
| `/prompts` | プロンプト集（カテゴリ別・検索・コピー） | `app/prompts/page.tsx` | ✓ |

**全モジュール CSR オンリー** — ブラウザ内状態管理、サーバーとのデータ共有なし。

### データ永続化キー設計
| キー | 保存先 | 型 | モジュール |
|-----|--------|----|-----------|
| `lp-working` | localStorage | `{ selected; order: string[] }` | LP Library（作業中状態） |
| `lp-compositions` | localStorage | `LpComposition[]` | LP Library（保存済み構成） |
| `lp-bookmarks` | localStorage | `string[]` | LP Library（お気に入り） |
| `copy-bank` | localStorage | `CopyItem[]` | Swipe Bank（テキスト断片） |
| `swipe-bank` | IndexedDB | `SwipeItem[]` | Swipe Bank（URL・画像・メモ） |
| `ppt-studio` | IndexedDB | `DeckRecord[]` | PPT Studio（PPTXバッファ） |
| `lp-brand-kit` | localStorage | `BrandKit` | Brand Kit |
| `user-prompts` | localStorage | `UserPrompt[]` | Prompts |
| `user-prompt-categories` | localStorage | `string[]` | Prompts |
| `lp-theme-pref` | localStorage | `ThemeSelection` | LP Preview |

**スキーマ要点**:
- `SelectedSections`: `{ [categoryId]: sectionId }`（1カテゴリ=1セクション）
- `LpComposition`: `{ id, name, selected, order, savedAt }`
- `CopyItem`: `{ id, text, type, tags, savedAt }`
- `SwipeItem`: `{ id, title, url, note, tags, image?: DataURL, savedAt }`
- `DeckRecord`: `{ id, name, savedAt, slideCount, buf: ArrayBuffer }`
- `BrandKit`: `{ companyName, tagline, primaryColor, secondaryColor, accentColor, fontId, tone }`
- `UserPrompt`: `{ id, title, prompt, category, tags, savedAt }`
- `ThemeSelection`: `{ themeId, fontId, hue }`

### SSR/CSR 境界・バージョン管理
- `app/layout.tsx` は Server Component。各 `page.tsx` は `"use client"`。
- 永続化関数は `typeof window === "undefined"` で SSR 耐性。
- **localStorage はバージョン番号なし**（互換性は部分的 deep merge 頼み）。
- **IndexedDB (ppt-studio) は `VERSION = 1`**、`onupgradeneeded` で移行。

---

## モジュール別 現状

### 1. LP Library — `app/library/page.tsx` + `lib/lpCompositions.ts`
**実装**: BuilderHeader / CategoryTabs / SectionPatternCard / SelectedSectionsPanel / GeneratedLPPreview、`components/previews/*`（65+）、`data/sectionLibrary.ts`、`lib/lpCompositions.ts` / `bookmarks.ts` / `previewMap.ts` / `exportHtml.ts` / `exportReact.ts`。
**実装済み**: セクション検索、お気に入り、1カテゴリ=1セクション選択、並び替え、作業状態自動保存、LPプレビュー生成、構成の名前付き保存/読込、テーマ・フォント選択（`lpTheme.ts`）、HTML/React 書き出し。
**未完成・負債**: モジュール情報ハードコード（`app/library/page.tsx:22-87`）、`exportHtml.ts`/`exportReact.ts` の品質検証未実施、テーマCSSが `lpTheme.ts:LP_THEME_CSS` にhard-coded、65+ プレビューのスタイルがTailwind混在（DS化未実施）、`sectionLibrary.ts` 25KB+手管理。

### 2. PPT Studio — `app/ppt/page.tsx` (892行) + `lib/pptx/*`
**実装済み**: PPTX複数インポート（追加型・独立保存）、サムネイル（pptx-preview）、複数選択/全選択、選択スライドのみ書き出し、**クロスデッキ合成カート**、スライド削除・デッキ削除、D&D取り込み、拡大モーダル、キーボード操作（←→/Esc）、per-deck render cache。
**未完成・負債**: `lib/pptx/merge.ts` 検証未実施、スライド削除後のカートindexズレ懸念、大容量PPTX(100+)のパフォーマンス未検証、ZIP破損時のエラーが generic、OPC ZIP処理が複雑、render token競合制御がad-hoc。

### 3. Swipe Bank — `app/swipe/page.tsx` + `lib/swipe/store.ts`
**実装済み**: 参考URL保存（タイトル/URL/メモ/タグ/スクショ paste・drag・click）、コピースニペット保存（タイプ別）、横断検索、ペースト画像自動読込、削除、タブ切替、Copyボタン+トースト。
**未完成・負債**: 画像をDataURLでlocalStorage/IndexedDBに保存→**quota超過リスク**、quota監視なし、画像リサイズ/圧縮なし、ソートは保存日時順のみ。

### 4. Mail Builder — `app/email/page.tsx` + `lib/email/blocks.ts` (141行)
**実装済み**: ブロック選択（header/hero/body/highlight/feature2/numlist/button/divider/footer）、並び替え、フィールド編集、**Brand Kit連携**（`app/email/page.tsx:41-44` applyBrand→primaryColor+companyName）、HTMLコピー/DL、Gmail/Yahoo対応（table-based 600px固定・inline CSS）。
**未完成・負債**: ブロック内個別カスタマイズがstaticの可能性、dark mode非対応、`renderBlock()`がlong switch、テンプレ拡張が困難。

### 5. Social リパーパス — `app/social/page.tsx` + `lib/social/repurpose.ts` (116行)
**実装済み**: 5プラットフォーム（X 280字/LinkedIn 3000字/Instagram 2200字・タグ30/Threads 500字/Facebook 2000字）、hook/body/URL/hashtags/emoji/tone/companyName 入力、自動整形、Copyボタン、**Swipe Bank保存**、**Brand Kit連携**（`app/social/page.tsx:24-28` tone+companyName）。
**未完成・負債**: tone prefixが固定、プラットフォーム拡張性低い、URL短縮なし、**AI実行なし（rule-baseのみ）**。

### 6. Brand Kit — `app/brand/page.tsx` + `lib/brand/store.ts` (59行)
**実装済み**: 会社名・タグライン、3色パレット（primary/secondary/accent picker）、フォント4種（sans/mincho/maru/lato）、tone（formal/casual/energetic）、保存/リセット、localStorage自動保存。
**連携状況**: Email ✓ / Social ✓ / Dashboard ✓（companyName表示, `app/page.tsx:99`）/ **LP Library ❓部分的**（`lpTheme.ts` 独立theme、Brand色を自動消費していない疑い）/ PPT・Swipe・Prompts は連携なし。

### 7. プロンプト集 — `app/prompts/page.tsx` + `lib/prompts/data.ts` / `userStore.ts`
**実装済み**: カテゴリ別キュレーション（LP・広告・SNS・メール・SEO・リサーチ・ペルソナ・CRO・動画・価格）、`{変数}` ハイライト、長文コラプス（160字閾値）、Copyボタン、タグフィルタ、ユーザープロンプト保存/削除、カテゴリ追加。
**未完成・負債**: **「プロンプト実行」なし（LLM API未実装）→手動コピペのみ**、`data.ts` の100+項目が保守性低い。

---

## 共通基盤の現状
- **components/**: ThemeProvider（dark mode）、AuroraBg（グラデ背景）、ModeToggle、BuilderHeader、CategoryTabs、SectionPatternCard、SelectedSectionsPanel、GeneratedLPPreview、GeneratedSectionWrapper、icons.tsx、brandIcons.tsx。
- **lib/**: darkMode.ts、ui/glass.ts（glassmorphism util）、lpTheme.ts（CSS変数）、previewMap.ts、extractCopy.ts。
- **tailwind.config.ts**: Sansanブランド色（blue #004e98）、sofia-pro+Lato、blue-tintedシャドウ、小さめ角丸、fadeInアニメ。デザイン哲学は glassmorphism + aurora gradient + blue/violet/fuchsia accent。
- **Brand Kit連携の実態**: Email/Social/Dashboard の3つにのみ部分連携。LP Library は `lpTheme.ts` の hard-coded 色を使用しており Brand Kit から自動更新されていない。PPT/Swipe/Prompts は未連携。

---

## 既知制約の裏取り結果
1. **「データはブラウザ内のみ」→ ✓正確**。全永続化が `typeof window` ガード、サーバーAPI/認証/共有なし（例 `lib/lpCompositions.ts:48`, `lib/swipe/store.ts:44`）。
2. **「プロンプト集はコピーのみ」→ ✓正確**。LLM呼び出しなし、static data、Copy→手動paste。
3. **「PPTは端末内処理」→ ✓正確**。jszip+pptx-previewで完結、書き出しは Blob client-side。

---

## 技術的負債・リスク総括
**高**: ①Brand Kit→LP Library 連携不足（`lpTheme.ts` hard-coded を Brand色直読みに）②モジュール間データ共有なし（Swipe→Social等、cross-module state統合余地）③大容量PPTX/画像のquota対応なし（監視+画像圧縮）。
**中**: ④export品質検証不足（`exportHtml.ts`/`exportReact.ts` QA）⑤セクションライブラリ保守性（DS化）⑥エラーハンドリング最小限。
**低**: ⑦state management複雑化（Zustand検討）⑧型安全性の隙間（previewMap any）⑨a11y未整備。

---

*Recon Agent (Explore) 調査。コードは一切変更していない。*
