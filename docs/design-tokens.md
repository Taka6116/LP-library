# デザイントークン仕様

**導入PR**: PR-1（feat/design-tokens） / 2026-06-09
**方針**: 配色は実画面の実態（violet / fuchsia 系グラスモーフィズム）を「正」とする。
既存の Sansan 青トークン（`accent` / `sansan-*` / `ink` / `canvas` / `subtle` / `brand-*` / `muted`）は
LP プレビュー等で 100箇所超が使用中のため**当面併存**し、撤去は後続 Phase（LPテーマ移行後）に行う。

## 仕組み（単一の真実源）

実値は `app/globals.css` の CSS 変数（`:root` と `.dark`）に **RGB を空白区切り**で持つ。
`tailwind.config.ts` のセマンティックトークンは `rgb(var(--x) / <alpha-value>)` でそれを参照する。

- alpha 付き utility（`bg-primary/40` 等）が CSS 変数下でも機能する。
- ダークモード（`.dark`）と、後続PRで入れる **Brand Kit の動的上書き**（`:root` への `--brand-*` 反映）を
  同一機構で扱える。

```
globals.css(:root / .dark)  ──CSS変数──▶  tailwind.config.ts(セマンティック名)  ──▶  bg-primary / text-surface-fg ...
```

## トークン一覧

| Tailwind クラス例 | CSS 変数 | light | dark | 用途 |
|---|---|---|---|---|
| `bg-primary` `text-primary` | `--color-primary` | violet-600 | violet-500 | ブランド主色（ボタン/強調） |
| `text-primary-fg` | `--color-primary-fg` | white | white | primary 面の上の前景 |
| `bg-primary-accent` | `--color-primary-accent` | fuchsia-500 | fuchsia-400 | グラデの相方・アクセント |
| `bg-primary-muted` | `--color-primary-muted` | violet-100 | indigo-900 | 淡い面・選択背景 |
| `bg-bg` | `--color-bg` | #faf8ff | #0a0a0f | ページ背景 |
| `bg-surface` | `--color-surface` | white | #181821 | カード等の面 |
| `text-surface-fg` | `--color-surface-fg` | #1a1a1a | #f5f5f7 | 本文 |
| `text-surface-muted` | `--color-surface-muted` | slate-500 | slate-400 | 補助テキスト |
| `border-border` | `--color-border` | slate-200 | ≒white/10 | 罫線 |
| `bg-success` `text-success-fg` | `--color-success(-fg)` | emerald-600 | emerald-400 | 成功状態 |
| `bg-danger` `text-danger-fg` | `--color-danger(-fg)` | red-600 | red-400 | エラー・破壊操作 |
| `rounded-[var(--radius-sm)]` | `--radius-sm` | 8px | – | 小角丸 |
| `rounded-[var(--radius-md)]` | `--radius-md` | 12px | – | 標準角丸 |
| `rounded-[var(--radius-lg)]` | `--radius-lg` | 16px | – | 大角丸 |

> 角丸は当面 CSS 変数のみで提供（既存 `rounded-2xl/3xl` の意味を変えないため）。
> 共通UI層（PR-2）で `rounded-[var(--radius-md)]` 等として消費する。

## 使い方ルール（PR-2 以降）

1. 新規・置換コンポーネントは **セマンティックトークンのみ**を使う（`bg-primary` `text-surface-fg` 等）。
2. raw hex（`#7c3aed`）や generic 直書き（`bg-violet-600`）を新規に増やさない。
3. 既存の Sansan 系クラスは**触らない**（撤去は後続Phaseの専用PRで一括）。
4. ダーク対応は `.dark` 変数が吸収するため、原則 `dark:` バリアントを個別に書かなくてよい
   （トークンベースで描く限り）。

## 後続Phaseでの発展

- **Brand Kit 連動（PR-3）**: `BrandProvider` が `:root` に `--brand-primary` 等を反映し、
  `--color-primary` 既定値を Brand 値から供給 → 全モジュール＋書き出しが自動追従。
- **Sansan 撤去（Phase 3 最終PR）**: LPプレビューの `sansan-*` / `accent` 参照を
  セマンティックトークンへ移行し終えたのち、`tailwind.config.ts` の旧トークンを削除。
