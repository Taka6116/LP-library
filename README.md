# LP Builder Library

ランディングページを「カテゴリごとにセクションを1つ選ぶ」だけで組み立てられる、個人用の LP セクションライブラリです。

- **Library モード**: カテゴリ（Hero / Problem / Process …）ごとに、実在LP準拠のセクションをフル幅プレビューで閲覧・選択
- **Generated LP モード**: 選択したセクションをカテゴリ順に連結して 1 本の LP としてプレビュー → **HTML / Markdown でダウンロード**

技術: Next.js 16（App Router / Turbopack）・React 19・TypeScript 5・Tailwind CSS 3

---

## セットアップ（別PCで続きを始めるとき）

前提: **Node.js v20+** と **Git** が入っていること。

```bash
git clone https://github.com/Taka6116/LP-library.git
cd LP-library
npm install
npm run dev      # → http://localhost:3001
```

クローンだけで完全に動きます（`node_modules` / `.next` は自動生成、`.env` は不要）。

### スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバ（ポート **3001**） |
| `npm run build` | 本番ビルド（push 前の確認に推奨） |
| `npm run start` | ビルド結果を起動 |
| `npm run lint` | Lint |

---

## デプロイ

`main` ブランチへ push すると **Vercel が自動デプロイ**します。手動操作は不要です。

> GitHub Pages 用の静的書き出しは `GITHUB_PAGES=true` のときだけ有効化される設定（`next.config.mjs`）。通常の Vercel ビルドはルート配信です。

---

## ディレクトリ構成

```
app/                  画面（page.tsx = ビルダー本体, layout.tsx, globals.css）
components/
  previews/           各セクションのプレビューコンポーネント（1ファイル=1セクション）
  BuilderHeader / CategoryTabs / SelectedSectionsPanel / GeneratedLPPreview ...
data/sectionLibrary.ts  セクションの定義（カテゴリ・並び・メタ情報）= 単一の真実
lib/
  previewMap.ts       componentType(文字列) → コンポーネント の対応表
  asset.ts            画像パスに basePath を付与
  exportLp.ts         生成LPを HTML / Markdown に書き出す
public/               画像素材（ASCII名で配置）
```

---

## 新しいセクションを追加する手順

1. `components/previews/XxxYyy.tsx` を作成（`variant="full" / "card"` の両対応）
2. `lib/previewMap.ts` に import して `previewMap` に登録
3. `data/sectionLibrary.ts` の該当カテゴリ `sections` に 1 項目追加（`componentType` を一致させる）
4. 画像は `public/` に **ASCII名** で置き、`asset("/...")` で参照
5. `npm run build` で確認 → commit → push

> 画像の日本語ファイル名は URL エンコードでデプロイ時に壊れることがあるため、**ASCII名にコピーして使う**運用です。

---

## 共同作業のルール

複数PCで編集するため、**作業前に `git pull` / 作業後に `git push`** を徹底してください。
詳細は [docs/WORKFLOW.md](docs/WORKFLOW.md) を参照。
