# Architecture Plan

**作成日**: 2026-06-09
**対象**: Marketer's Studio（`C:\Users\goto_\Documents\LP-library`）/ Next.js 16 (App Router) + React 19 + Tailwind 3.4 / 日本語UI / 7モジュール（library, ppt, swipe, email, social, brand, prompts）
**前提インプット**: `docs/recon-report.md`（現状調査）・`docs/ux-audit.md`（UX診断）
**設計者**: Architecture Agent（設計のみ。コードは未変更）

## 前提・制約

- **デプロイは Vercel 本番を正**とし、GitHub Pages 静的書き出し（`output: "export"` + `basePath`）も壊さない。AI機能の Route Handler は `output: "export"` では動かないため、**AIは「Vercel本番のみで有効・静的版ではグレースフルに無効化」**という二系統前提で設計する（後述）。
- 既存データは**全てブラウザ内**（localStorage 8キー + IndexedDB 2 DB）。**認証・サーバDBは現状なし**。本プランは「ローカル堅牢化を先、クラウド同期は後」の順で段階導入する。
- Claude API は**第一候補**。モデルは `claude-opus-4-8`（高品質）/ `claude-sonnet-4-6`（高速・低コスト）を用途で使い分け、**adaptive thinking**・**streaming** を標準採用。
- TypeScript strict / path alias `@/*` を維持。CSRオンリーの構造は維持しつつ、AIのみサーバ（Route Handler）を足す。

---

## 設計原則

1. **既存ユーザーデータ非破壊（最優先）**: 既存の8 localStorageキー・2 IndexedDB の現行スキーマは「バージョン未付与の生データ」。これを**読み取り時に検出してv1へ昇格（lazy migration）**し、書き戻すまで旧形式も読める。キー名・DB名は原則変えない。
2. **Next.js + Vercel 維持**: フレームワーク差し替えなし。状態管理ライブラリ（Zustand等）導入も「必要になった層だけ」局所的に。
3. **小さなPR**: 各PRは1モジュール or 1基盤レイヤに限定。基盤（トークン/UI/永続化/AI）→ 各モジュール適用、の順で依存を一方向に保つ。
4. **日本語UI統一**: 英語ラベル残骸（Selected / Reset Selection 等）を排し、用語集・語尾ルールに従う（ux-audit P2）。
5. **段階的・後方互換**: トークン/共通UIは「新規導入 → 既存をラップ → 旧実装を撤去」の3段。一度に全置換しない。
6. **a11y を基盤に内蔵**: Toast（`aria-live`）・Modal（focus trap/Esc）・Tabs（`role=tablist`）を共通UI層で一元担保し、各モジュールは恩恵を自動で受ける。

---

## ターゲットアーキテクチャ概観（現状→目標）

**現状の構造的負債（recon + ux-audit の交差点）**

- トークンが3箇所に分裂: `tailwind.config.ts`（Sansan青 `#004e98`・`sansan-*`・小角丸）／ `lib/ui/glass.ts`（violet/fuchsia グラス）／ `lib/lpTheme.ts`（LP専用CSS変数 + `[data-lp-theme]` 上書き）。**実画面は violet 系なのに config は Sansan 青**で、単一の真実源がない。
- 共通UIコンポーネントが皆無。Button/Card/Input/Modal/Tabs/Toast が7ページにインライン重複。
- Brand Kit（`lib/brand/store.ts`、`primary/secondary/accentColor` + `fontId` + `tone`）が「核」なのに、Email/Social/Dashboard へ**手動適用**、LP は別系統（`lpTheme.ts`）、PPT/Swipe/Prompts は未連携。
- 永続化は全キー**バージョン番号なし**。`{...DEFAULT, ...JSON.parse}` の浅いマージのみ。画像は DataURL 生保存で quota 無防備。
- Prompts は static data の手動コピペのみ（**AI実行なし**）。Social も rule-based 整形のみ。

**目標アーキテクチャ（差分）**

```
[トークン]   3分裂 → tailwind.config の CSS変数セマンティックトークン1層に集約
             lpTheme/glass は新トークンの“消費者”に縮退（独自定義を廃止）
[UI]         インライン重複 → components/ui/ 共通層（Button/Card/Input/Modal/Tabs/Toast/EmptyState/Skeleton/AppHeader）
[Brand伝播]  手動適用 → BrandProvider(Context) が :root に CSS変数を書き込み、全モジュール+書き出しが同じ変数を参照（保存即反映）
[永続化]     生JSON → lib/persist/ 統一層（versioned envelope + migration runner + quota/画像圧縮 + export/import）
[AI]         なし → lib/ai/ プロバイダ抽象 + /api/ai/* Route Handler(Claude) + ストリーミングUI + 生成履歴
[横断状態]   なし → 軽量 store（Swipe→Social、生成コピー→各所への受け渡し）
```

---

## 1. デザインシステム基盤

### 1.1 トークン設計（単一真実源）

**方針**: ux-audit の「実態（violet/indigo/fuchsia グラス）を正とする」を採用。`tailwind.config.ts` に **CSS変数を参照するセマンティックトークン**を定義し、変数の実値は `app/globals.css` の `:root` / `.dark` に置く。これにより「Brand Kit による動的上書き」と「ダークモード」を**同じ CSS変数機構**で統一できる。

```css
:root {
  --color-primary: 124 58 237;        /* violet-600 を RGB 分解（Tailwind の <alpha-value> 対応） */
  --color-primary-fg: 255 255 255;
  --color-accent: 217 70 239;         /* fuchsia */
  --color-surface: 255 255 255;
  --color-border: ...; --color-muted: ...; --color-success: ...; --color-danger: ...;
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px;
}
.dark { --color-surface: ...; ... }   /* 反転でなくデサチュレート */
```

```ts
// tailwind.config.ts
colors: {
  primary: "rgb(var(--color-primary) / <alpha-value>)",
  "primary-fg": "rgb(var(--color-primary-fg) / <alpha-value>)",
  accent: "rgb(var(--color-accent) / <alpha-value>)",
  surface: "rgb(var(--color-surface) / <alpha-value>)",
  border: ..., muted: ..., success: ..., danger: ...,
}
```

- 角丸は `sm=8 / md=12 / lg=16 / pill=full` に集約（現状 lg/xl/2xl/3xl の意味ズレを解消）。
- 影は既存 `soft / card / cardhover` を violet-tinted に再定義（boxShadow は流用）。
- **`<alpha-value>` 形式（`rgb(var(--x) / <alpha-value>)`）が必須**: これにより `bg-primary/40` のような alpha 付き utility が CSS変数下でも機能する（Brand 動的色 + 半透明グラスの両立に必要）。

### 1.2 `components/ui/` 構成

ux-audit のデザインシステム提案に沿って新設。各コンポーネントは**セマンティックトークンのみ**を使い、raw hex / `violet-600` 直書きを禁止する。

```
components/ui/
  Button.tsx        variant: primary(グラデ)|secondary(白ピル)|ghost|danger / size: sm|md / loading|disabled 内蔵
  Card.tsx          glass | solid（glass は lib/ui/glass の後継、トークン参照）
  Modal.tsx         scrim + Esc + focus trap + close。library slideover/ppt zoom/swipe lightbox/window.prompt 置換を統合
  Input.tsx Textarea.tsx Select.tsx ColorField.tsx   label(id紐付け)+必須印+inline validation+dark対応
  Tabs.tsx          role=tablist/aria-selected。ModeToggle/swipeタブ/CategoryTabs/prompts chip を統一
  Toast.tsx + ToastProvider.tsx   role=status(polite)/assertive(失敗)。全 copy/save/error を集約
  EmptyState.tsx    swipe の原型を昇格
  Skeleton.tsx Spinner.tsx   ppt の pulse を抽出
  AppHeader.tsx     戻る先・モジュールスイッチャ(7)・ダークトグル・Brand入口を統一（IA/ナビ不統一を根本解消）
  index.ts          バレル
```

統合方針:

- **`lib/ui/glass.ts`** → 廃止せず**縮退**。`LIGHT_BG/DARK_BG`（aurora グラデ）は `AuroraBg` コンポーネント内へ移し、`glass` 文字列は `Card variant="glass"` の実装詳細に吸収。外部からの直 import を段階的に消す。
- **`tailwind.config.ts` の Sansan 残骸**（`sansan-*`, `accent`, `ink`, `brand.red`, `canvas`, `subtle`）→ **即削除しない**。後述「LP テーマ移行」で `sectionLibrary`/65+プレビューの `sansan-*` 参照を新トークンへ移し終えてから撤去（撤去は最終PR）。

### 1.3 Brand Kit → 全モジュールへのトークン伝播（Context vs CSS変数）

**決定: Context + CSS変数の併用（CSS変数を主、Context を従）。**

| 方式 | 長所 | 短所 | 採否 |
|---|---|---|---|
| React Context のみ | 型安全・SSR親和・テスト容易 | 適用に各コンポーネントの明示参照が必要。`<style>`/iframe/書き出しHTMLに届かない | 補助 |
| CSS変数のみ（`:root` 書込） | プレビュー・iframe・書き出しHTML・全モジュールに**自動伝播**。再描画不要 | TS から現在値を読むのが煩雑。初期FOUC | 主 |
| **併用（採用）** | Context で値・型・保存を管理し、`useEffect` で `document.documentElement.style` に `--brand-*` を反映。プレビューと書き出しは変数を参照 | 二重管理だが薄い | ✅ |

設計:

- `components/BrandProvider.tsx`（client）が `loadBrand()` の値を保持し、変更時に `--brand-primary` / `--brand-secondary` / `--brand-accent` / `--brand-font` を `:root` に書き込む。`saveBrand` も内包し、**「保存ボタン」を廃して onChange 即反映+デバウンス保存**（ux-audit: brand の「手動適用」課題を解消）。
- Email/Social は Provider 経由で `brand.primaryColor` / `tone` / `companyName` を取得（現状の手動 applyBrand を撤去）。
- **LP の lpTheme 統合**: `lpTheme.ts` の役割（`[data-lp-theme]` スコープで `text-sansan-600` 等を `--lp-accent` に上書き）は維持しつつ、`--lp-accent` の既定値を **Brand Kit の `primaryColor` から供給**する。`LP_THEMES` プリセットは「Brand追従 / 個別上書き」の二択にし、デフォルトを「Brand追従」に。これで recon の高優先負債①「Brand→LP連携不足」を解消。
- **書き出し（exportHtml/exportReact）**: 生成HTMLの `<style>` に現在の `--brand-*` 値を**インライン定数として焼き込む**（外部 Context に依存しない自己完結HTMLを維持）。

---

## 2. データ永続化の進化

### 2.1 スキーマバージョニング + マイグレーション層

**現状の正確な実態**（コード確認済み）: 全 localStorage キーは `{...DEFAULT, ...JSON.parse(raw)}` の浅いマージのみで**バージョン番号なし**。IndexedDB は `swipe-bank` も `ppt-studio` も `version 1`、単一 objectStore に配列を1キーで丸ごと格納。

**設計: versioned envelope + lazy migration runner**（`lib/persist/`）

```
lib/persist/
  envelope.ts     type Versioned<T> = { v: number; data: T }
  migrate.ts      runMigrations(key, raw, migrations[]) → 最新dataを返す
  storage.ts      loadVersioned<T>(key, latestV, migrations, default) / saveVersioned(key, v, data)
  quota.ts        estimate()（navigator.storage.estimate）・近接時の警告フック
  image.ts        DataURL を canvas で長辺リサイズ+JPEG/WebP圧縮
  backup.ts       export/import（後述）
```

**非破壊移行戦略（キー別）**:

`loadVersioned` は読み取り時に以下を判定する。
1. `raw` をパースし、`{ v, data }` 形か判定。
2. **エンベロープでない（= 旧生データ）** → `v0` とみなし、登録された migration を順に適用して最新へ。**この瞬間はまだ書き戻さない**（read-only 昇格）。次回 `save*` 時に初めてエンベロープ形式で永続化 → **既存ユーザーが一度も保存しなければ旧データのまま壊れない**。

| キー / DB | 現行形 | v1 後 | 移行ロジック |
|---|---|---|---|
| `lp-working` | `{selected, order}` 生 | `Versioned<WorkingState>` | エンベロープで包むだけ |
| `lp-compositions` | `LpComposition[]` 生 | `Versioned<LpComposition[]>` | 同上 |
| `lp-bookmarks` | `string[]` 生 | `Versioned<string[]>` | 同上 |
| `copy-bank` | `CopyItem[]` 生 | `Versioned<CopyItem[]>` | 同上 |
| `lp-brand-kit` | `BrandKit` 生 | `Versioned<BrandKit>` | 同上（`{...DEFAULT_BRAND}` の既存フォールバックは継続） |
| `user-prompts` / `user-prompt-categories` | 生 | `Versioned<...>` | 同上 |
| `lp-theme-pref` | `ThemeSelection` 生 | `Versioned<ThemeSelection>` | 同上 |
| IDB `swipe-bank`(v1) | 配列1キー、画像=DataURL | IDB v2 | `onupgradeneeded(1→2)` で画像を圧縮後 Blob 化（任意）。**読み取りは旧DataURLも許容** |
| IDB `ppt-studio`(v1) | `DeckRecord[]`（ArrayBuffer） | 必要時のみ v2 | 現状維持（移行不要なら触らない） |

**重要原則**: migration は**前方のみ・冪等・例外時は default にフォールバック**（現行の try/catch 文化を踏襲）。各 `lib/*/store.ts` は内部実装を `loadVersioned`/`saveVersioned` に差し替えるだけで**公開関数シグネチャ（`loadBrand()` 等）は不変** → 呼び出し側（各 page.tsx）は無改修。

### 2.2 quota 対応・画像圧縮

- **画像圧縮（`image.ts`）**: Swipe のスクショ取り込み時に `<canvas>` で長辺 ~1600px・WebP/JPEG q≈0.8 へ圧縮してから保存。recon 高優先負債③を解消。既存の生 DataURL は読めるまま（移行は遅延・任意）。
- **quota 監視（`quota.ts`）**: `navigator.storage.estimate()` で使用率を取得し、保存前に閾値（例 80%）超過なら Toast（assertive）で警告。`save*` の catch（現状 silent）を **失敗 Toast** に格上げ（ux-audit: 無言失敗の解消）。

### 2.3 エクスポート / インポート（全資産バックアップ）

- `backup.ts`: 全 localStorage キー + IndexedDB（swipe-bank/ppt-studio）を1つの JSON（PPTX は base64）にまとめ、`marketers-studio-backup-YYYYMMDD.json` としてダウンロード。インポートは**バージョン検証 → migration runner 通過 → 確認モーダル（上書き/マージ）→ 反映**。
- 配置: AppHeader または Dashboard に「バックアップ / 復元」。これは**クラウド同期の前提機能**でもある（同じシリアライズ表現を同期にも使う）。

### 2.4 将来のクラウド/アカウント同期（選択肢比較）

| 選択肢 | 認証 | 同期方式 | Vercel適合 | コスト | 移行容易性 | 推奨度 |
|---|---|---|---|---|---|---|
| **現状維持（ローカルのみ）** | なし | なし | ◎ | 0 | — | Phase継続の基準 |
| **エクスポート/インポート（手動）** | なし | ファイル手動 | ◎ | 0 | ◎（2.3で実装） | **まず必須** |
| **Vercel Postgres + Auth.js** | あり | サーバ正、ローカルはキャッシュ | ◎（同一PF） | 低〜中 | 中（API層追加） | クラウド第一候補 |
| **Supabase（Postgres+Auth+Storage）** | あり | RLS、Realtime可、画像はStorage | ○（外部） | 低〜中 | 中 | 画像が多いなら有力 |
| **Firebase/Firestore** | あり | リアルタイム同期容易 | ○ | 中 | 中 | リアルタイム重視時 |
| **CRDT/ローカルファースト（Yjs等）** | あり | 競合自動解決・オフライン強 | ○ | 中〜高 | 高難度 | 多デバイス編集を本気でやる時のみ |

**推奨**: クラウドは Phase 後半。第一候補は **Supabase**（Auth + Postgres + 画像 Storage が一体で、Swipe/PPT のバイナリ資産に強い）。**同期の単位は 2.3 のバックアップ JSON と同形**にし、`storageDriver` 抽象（`local` / `cloud`）を `lib/persist/storage.ts` に切れるよう設計しておく。**この段で初めて認証が入る**ため、それまでは一切認証を持ち込まない。

---

## 3. AI生成機能

### 3.1 プロバイダ抽象 IF

```
lib/ai/
  provider.ts     interface AIProvider { stream(req: AIRequest): AsyncIterable<AIChunk>; complete(req): Promise<AIResult> }
                  type AIRequest = { task: TaskId; model?: ModelId; vars: Record<string,string>; system?: string }
  claude.ts       Claude 実装（@anthropic-ai/sdk、サーバ専用）
  prompts.ts      task → system/template マッピング（既存 lib/prompts/data.ts と連携）
  models.ts       "claude-opus-4-8"(高品質) / "claude-sonnet-4-6"(高速) の用途マップ
  history.ts      生成履歴（IndexedDB 新DB ai-history）
  client.ts       ブラウザ側 fetch ラッパ（/api/ai/* を叩き、SSE を読む）
```

- **抽象は最小限**: `stream/complete` の2メソッド + 用途別 `model` 選択のみ。将来 OpenAI 等を足す場合も同 IF を実装すれば差し替え可能（実装は Claude SDK のみ）。
- モデルは **adaptive thinking**（`thinking: {type:"adaptive"}`）+ **streaming** を標準。長文生成は `claude-opus-4-8`、短文・整形は `claude-sonnet-4-6`。`output_config.effort` は用途で `medium`〜`high`。

### 3.2 APIキー方式の比較と推奨

| 方式 | キーの所在 | 漏洩リスク | レート制御 | コスト負担 | Vercel本番 | 静的版(GH Pages) |
|---|---|---|---|---|---|---|
| **A. サーバ側 Route Handler（環境変数）** | サーバ env のみ | 低（ブラウザに出ない） | サーバで集中制御可 | 運営持ち | ◎ | ✕（Handlerが動かない） |
| **B. ユーザー入力キーをローカル保持＋ブラウザ直叩き** | ユーザーのlocalStorage | 中（CORS/CSP・XSSで露出） | 不可（各自） | ユーザー持ち | ○ | ○ |
| **C. ハイブリッド（既定A、任意でB）** | 両対応 | A既定で低 | A経路で制御 | 既定運営/任意ユーザー | ◎ | △（B経路のみ） |

**推奨: A を既定（サーバ側 Route Handler `/api/ai/*` + `ANTHROPIC_API_KEY` を Vercel 環境変数）。** 漏洩・コスト・レート制御の全てで最良。ユーザーが自前キーを使いたい場合のために **C への拡張余地**（リクエストヘッダ経由のユーザーキー）を IF に残すが、初期実装は A のみ。

- **静的版（`output: "export"`）への配慮**: Route Handler は静的書き出しで動かないため、ビルド時 `NEXT_PUBLIC_AI_ENABLED` で**AI UI を出し分け**。静的版では Prompts は従来どおり「コピーのみ」にグレースフルデグレード（壊さない原則）。

### 3.3 ストリーミング表示

- Route Handler は **Edge or Node Runtime で SSE/ReadableStream を返す**。SDK の `.stream()` を使い、`text_delta` をそのまま流す（`max_tokens` は streaming 前提で ~64000 まで許容）。
- ブラウザは `lib/ai/client.ts` で `ReadableStream` を読み、共通 UI の `<AIStreamPanel>`（トークン逐次描画 + 停止ボタン + コピー/「各モジュールへ送る」CTA）に表示。300ms 超は `Skeleton`/`Spinner`。

### 3.4 生成履歴

- 新 IndexedDB `ai-history`（versioned、2.1 の runner 配下）: `{ id, task, model, vars, output, usage, createdAt }`。コスト把握（`usage` の token 数）と再利用に使う。Backup(2.3) にも含める。

### 3.5 コスト / レート制限 / 漏洩対策

- **漏洩**: キーはサーバのみ。レスポンスにキーを含めない。CSP で `connect-src` を自APIに限定。
- **レート制限**: Route Handler に IP/セッション単位の簡易スロットル（Vercel KV or インメモリ）+ 1リクエスト `max_tokens` 上限。SDK は 429/5xx を自動リトライ（指数バックオフ）。
- **コスト**: `models.ts` で task ごとに既定モデルを固定（無闇に opus を使わない）。`history.ts` の `usage` 集計を Dashboard に「今月の概算」表示（任意）。
- **濫用**: プロンプトはサーバ側 `prompts.ts` のテンプレに**ユーザー変数を埋め込む形**に限定（system はサーバ固定）。生 system をクライアントから受けない。

### 3.6 モジュール連携フロー（プロンプト集 → AI実行 → 流し込み）

```
[Prompts] 変数フォーム({会社名}{ターゲット}…を入力)
   └→ /api/ai/generate (task=該当, vars) ─SSE→ [AIStreamPanel]
        └→ 結果を「送る」:
             ・LPコピー   → addCopyItem() / Copy Bank
             ・メール本文 → Email ブロックのフィールドへ prefill
             ・SNS投稿    → Social の hook/body へ prefill（rule-based 整形は前段/後段に残す）
             ・Swipe保存  → SwipeItem として保存
```

- `lib/prompts/data.ts` の `{変数}` を**フォーム化**（既存ハイライト機構を流用）。Social の rule-based 整形（文字数/タグ）は AI 出力の**後処理**として活かす（プラットフォーム制約担保）。

---

## 4. 新機能候補と優先度（RICE）

RICE = Reach × Impact × Confidence ÷ Effort（相対値、Effort は S=1/M=2/L=3）。

| # | 機能 | Reach | Impact | Conf | Effort | RICE | 備考 |
|---|---|---|---|---|---|---|---|
| F1 | Brand Kit 自動連動（保存即反映・全モジュール） | 高 | 高 | 高 | M | **最上位** | recon負債①。基盤と一体 |
| F2 | エクスポート/インポート（全資産バックアップ） | 高 | 高 | 高 | M | **最上位** | データ損失保険・同期前提 |
| F3 | プロンプト集 AI 実行＋流し込み | 高 | 高 | 中 | L | 高 | 製品の目玉。Vercel限定 |
| F4 | 横断検索（全モジュール資産を1検索） | 中 | 中 | 中 | M | 中 | 横断 store 前提 |
| F5 | 案件（プロジェクト）単位まとめ | 中 | 高 | 中 | L | 中 | 全モジュール資産をタグ束ね |
| F6 | バージョン履歴（構成/コピーの履歴・復元） | 中 | 中 | 中 | M | 中 | versioned 永続化が前提 |
| F7 | お気に入り強化（全モジュール横断ブックマーク） | 中 | 低 | 高 | S | 中 | 既存 `lp-bookmarks` を一般化 |
| F8 | モジュール間データ共有（Swipe→Social 等） | 中 | 中 | 中 | M | 中 | 横断 store。F3/F4の基盤 |
| F9 | クラウド/アカウント同期 | 低→高 | 高 | 低 | L | 低（今） | 認証導入。最後 |

**横断状態統合（F8 の設計）**: 重い Context を増やさず、`lib/cross/share.ts` に**軽量 pub/sub または Zustand 単一 store**（`pendingHandoff: {kind, payload}`）を置き、受け側モジュールがマウント時に消費。Swipe→Social、生成コピー→Email/Social/Copy Bank の受け渡しに使う。recon 低優先⑦（Zustand検討）はここに限定導入。

---

## Phase 分割と依存関係

各 Phase は前 Phase の基盤に依存。Phase 内は小PR単位。

| Phase | 目的 | 主要PR | 受け入れ条件 |
|---|---|---|---|
| **Phase 2: デザイン基盤** | トークン単一化 + 共通UI層 + Brand伝播 | (a) globals.css 変数 + tailwind セマンティックトークン追加（既存 Sansan は残置）/ (b) `components/ui/` 一式 + ToastProvider / (c) BrandProvider(:root 反映) | 新トークンと共通UIがビルド通過、既存画面は無回帰、Brand 変更が即 :root に反映 |
| **Phase 3: UI/UX 適用** | P0/P1 を共通UIで解消 | 各モジュールを Button/Card/Input/Modal/Tabs/Toast/AppHeader に置換、絵文字→icons.tsx、`window.prompt`→Modal、`min-h-dvh` 統一、`aria-live` 件数読み上げ | ux-audit P0 全消化 + P1 主要消化、a11y 基本水準、英語ラベル排除 |
| **Phase 4: 永続化進化** | 堅牢化 + バックアップ | `lib/persist/`（envelope/migrate/storage/quota/image/backup）、各 store を loadVersioned へ差し替え、Swipe 画像圧縮、export/import UI | 既存データ無回帰で読める、保存後 v1 化、quota 警告動作、バックアップ往復一致 |
| **Phase 5: AI生成** | Claude 連携 + 連携フロー | `lib/ai/`、`/api/ai/*` Route Handler(SSE)、AIStreamPanel、Prompts 変数フォーム、結果流し込み(Copy/Email/Social/Swipe)、生成履歴、`NEXT_PUBLIC_AI_ENABLED` 出し分け | Vercel本番で生成→流し込み動作、静的版は従来コピーにデグレード、キーは非露出、429リトライ |
| **Phase 6: 新機能 & 同期** | 横断機能 + クラウド | 横断 store(F8)、横断検索(F4)、お気に入り強化(F7)、案件まとめ(F5)、バージョン履歴(F6)、（最後に）Supabase 同期 + 認証(F9) | 各機能が既存データ上で動作、同期は backup 同形・ローカル維持と両立 |

LP テーマ移行（`sansan-*` 参照を新トークンへ）と Sansan 残骸撤去は **Phase 3 内の専用PR**として行い、撤去PRは最後。

---

## 推奨 最初の3PR

### PR-1: デザイントークン単一真実源の導入（非破壊・追加のみ）

- **目的**: violet 系の実態を `:root` CSS変数 + `tailwind` セマンティックトークンとして確立。Brand/ダーク/将来同期の共通機構を敷く。
- **変更ファイル想定**: `app/globals.css`（`:root`/`.dark` に `--color-*`/`--radius-*`）、`tailwind.config.ts`（`primary/accent/surface/border/muted/success/danger` を `rgb(var(--x)/<alpha-value>)` で追加。**既存 `sansan-*`/`accent`/`ink` は残置**）。新規 `docs/design-tokens.md`（用語/語尾ルール含む、任意）。
- **テスト方法**: `npm run build` 通過。新トークンを使った捨てコンポーネントで `bg-primary`/`bg-primary/40`/`dark:` が効くことを目視。既存7画面が**見た目無回帰**であること（既存クラスは未変更なので不変のはず）。
- **受け入れ条件**: ビルド成功・既存画面無回帰・新トークンが light/dark/alpha で機能。Sansan トークンは未削除。

### PR-2: 共通UI層の最小セット + ToastProvider

- **目的**: Button/Card/Input/Modal/Toast/EmptyState/Skeleton を新設し、以後の置換土台を用意。`aria-live` を Toast に一元化。
- **変更ファイル想定**: `components/ui/{Button,Card,Input,Textarea,Modal,Toast,EmptyState,Skeleton,index}.tsx`、`components/ui/ToastProvider.tsx`、`app/layout.tsx`（ToastProvider を全体に巻く）。**既存ページは未改修**（提供のみ）。
- **テスト方法**: 各コンポーネントを 1 画面（例 `app/email`）の1要素だけ試験置換し動作確認 → コミットには含めない or 別PR。Modal の Esc/focus trap、Toast の polite/assertive を手動確認。`npm run build` 通過。
- **受け入れ条件**: 共通UIがトークンのみで描画、Toast が `role=status`/`aria-live` を持つ、Modal が Esc とフォーカストラップを満たす、既存挙動に影響なし。

### PR-3: Brand Kit 自動連動（保存即反映・LP/Email/Social へ伝播）

- **目的**: recon 高優先負債①を解消。「手動適用」を撤去し、Brand 変更を `:root` の `--brand-*` 経由で全モジュール+書き出しへ自動反映。
- **変更ファイル想定**: 新規 `components/BrandProvider.tsx`、`app/layout.tsx`（Provider 装着）、`app/brand/page.tsx`（保存ボタン→onChange 即反映+デバウンス、コントラスト警告は別PR可）、`app/email/page.tsx`・`app/social/page.tsx`（手動 applyBrand 撤去 → Provider 参照）、`lib/lpTheme.ts`（`--lp-accent` 既定を Brand `primaryColor` 供給に）、`lib/brand/store.ts`（公開 API 不変のまま内部で onChange 通知）。
- **テスト方法**: Brand で primary を変更 → Email/Social/LP プレビューが即座に追従。リロード後も保持。LP 書き出しHTMLに現在 Brand 色が焼き込まれることを確認。
- **受け入れ条件**: 「適用」操作なしで全連携モジュールが追従、リロード保持、書き出しHTMLが自己完結（外部依存なし）、既存データ無回帰。

---

## トレードオフ・リスク・未決事項（人間に確認すべき論点）

1. **ブランド配色の正**: ux-audit は「violet/indigo を正・Sansan 青を撤去」を推奨。これは**プロダクトのブランド意思決定**。Sansan 青を正にするなら全トークン値が変わる。→ **確認必須**。
2. **AI のコスト負担とキー方式**: 既定 A（運営がキー負担）はサーバコストが発生。利用上限・想定ユーザー数・「ユーザー自前キー(C)」を初期から出すか。→ **確認**。
3. **静的版(GitHub Pages)の今後**: AI は静的版で動かない。静的版を**維持するか廃止するか**で出し分けの手間が変わる。→ **確認**。
4. **クラウド同期の要否と時期**: 認証導入は製品性格（ローカル完結の手軽さ）を変える。F9 を本当にやるか、やるなら Supabase で良いか。→ **Phase 6 前に確認**。
5. **PPTX バイナリのバックアップ容量**: export JSON に PPTX(base64) を含めるとファイルが巨大化。PPT を別ファイルに分けるか除外オプションを設けるか。→ 設計時に決定。
6. **状態管理ライブラリ導入範囲**: Zustand を横断 store(F8) に限定導入する方針。これ以上の全面 Zustand 化はしない（recon 低優先のため）。→ 認識合わせ。
7. **既存 export(HTML/React) の品質未検証**（recon 中優先④）: Brand 焼き込み変更前に現行出力の QA が必要。→ Phase 3 で別途検証PR。
8. **adaptive thinking の表示**: Opus 4.8 は thinking がデフォルト非表示（`display:"omitted"`）。ユーザーに思考過程を見せないなら現状で良いが、「生成中」感を出すため `display:"summarized"` にするか。→ UX 判断。

### 実装上クリティカルなファイル

- `tailwind.config.ts` — トークン単一化の中心（Sansan 残骸の段階撤去もここ）
- `app/globals.css` — CSS変数（`--color-*`/`--brand-*`/`--radius-*`、light/dark）の真実源
- `lib/brand/store.ts` — Brand Kit の単一ソース。Provider 連動の土台（公開シグネチャ不変が条件）
- `lib/lpTheme.ts` — LP テーマ機構。Brand との統合点（`--lp-accent` 供給）
- `lib/swipe/store.ts` — 永続化進化（versioned envelope + 画像圧縮 + IDB v2）の代表実装例

---

*Architecture Agent (Plan) 設計。コード・ファイルは一切変更していない。*
