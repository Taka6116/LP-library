# 引き継ぎ（Marketer's Studio 進化プロジェクト）

最終更新: 2026-06-10 / 引き継ぎ元: Claude (デスクトップ) → Claude Code CLI

## このリポジトリ
- 実体: `C:\Users\goto_\Documents\LP-library`（package名 `lp-builder-library`）
- Next.js 16 (App Router) + React 19 + Tailwind 3.4 / 日本語UI / 全データはブラウザ内（localStorage 8キー + IndexedDB: `swipe-bank`/`ppt-studio`）
- 本番: https://lp-library-nu.vercel.app/ （Vercel が `main` を自動デプロイ）
- remote: `origin` = https://github.com/Taka6116/LP-library.git
- 開発: `npm run dev`（→ http://localhost:3001 ）/ ビルド: `npm run build`
- 設計ドキュメント: `docs/recon-report.md` / `docs/ux-audit.md` / `docs/architecture-plan.md` / `docs/design-tokens.md`

## ブランチ状況
- **`main`（push済・本番反映済み）**: PR-1〜13 が入っている（基盤トークン / 共通UI / Brand自動連動 / AppHeader統一 / LP↔Brand焼き込み / AI生成シェル / バックアップ復元 / ハイドレーション修正 / AI流し込み / クラウド同期シェル / a11y）。
- **`feat/redesign`（push済・未マージ）**: PR-14「鮮やかグラデの全画面リデザイン（第1版）」。`main` から分岐。
  - AuroraBg刷新（彩度UP+漂う発光ブロブ, reduced-motion配慮）/ 全モジュール背景を AuroraBg に統一（swipeのzinc基調も廃止）/ AppHeader をグラデ文字+三色アイコン+グローに。
  - **次の判断**: ①コンテンツパネルのガラス化まで進めてから main へマージ、または ②この第1版で良ければそのまま main へマージ。CEOは「鮮やかグラデ×全画面一気に」を希望済み。
- 旧ブランチ（`feat/design-tokens`/`feat/email-ui`/`feat/library-brand`/`feat/ai-shell`/`feat/all-phases`）は main に内包済み（削除可）。

## 確定方針（CEO承認済み）
1. 配色は **violet系を正**（Sansan青は後続で撤去）。
2. AIキーは **ユーザー自前キーも対応するハイブリッド**。
3. Brand保存は **即時反映**（保存ボタン廃止）。
4. AI/クラウド同期は **「形は作るが、バックエンド/キー無しでは動かないのが正」**。

## 「動くもの」と「形だけ（仕様どおり動かない）」
- 動く: AppHeader / Brand自動連動 / LP↔Brand焼き込み / バックアップ・復元 / AI結果の各モジュール流し込み / a11y。
- 形だけ（キー/バックエンド無しでは動かない）:
  - **AI実行** … `app/api/ai/generate`。サーバ env `ANTHROPIC_API_KEY` がある時のみ実動（未設定は503）。モデル既定 `claude-sonnet-4-6`、SDK非依存（Anthropic Messages APIへ fetch）。
  - **クラウド同期** … `lib/cloud/sync.ts` + `CloudSyncControls`。`NEXT_PUBLIC_CLOUD_ENABLED` 未設定で常に「未設定」。

## 残作業（おすすめ順）
1. **リデザイン仕上げ**: `feat/redesign` でコンテンツパネルをガラス化（`components/ui/Card` variant="glass" や `lib/ui/glass.ts` の `glass` を各モジュール本文の白パネルへ）。完了後 main へマージ。
2. **C: AI有効化**（ユーザー操作）: Vercel → Settings → Environment Variables に `ANTHROPIC_API_KEY` を追加 → Redeploy。これで `/prompts`「AIで実行」が実動。
3. **Sansan残骸トークン撤去**: `tailwind.config.ts` の `sansan-*`/`accent`/`ink`/`canvas`/`subtle`/`brand.red`。ただしLPプレビュー100箇所超が `sansan-*`/`accent` を参照（`lib/lpTheme.ts` の `[data-lp-theme]` remap CSS と連動）。移行してから削除。**大規模・要注意**。
4. **AI本実装の拡張**: ストリーミング(SSE)/生成履歴(IndexedDB)/用途別 system プロンプト（`lib/ai/` に骨組みあり）。
5. **Phase5 クラウド同期の実装**: Supabase等を `lib/cloud/sync.ts` の driver として接続（認証導入）。バックアップJSON（`lib/persist/backup.ts`）と同形のシリアライズを流用可能。

## 設計上の要点（壊さないために）
- **製品DSの色 `--color-*`（violet）** と **ユーザーのBrand色 `--brand-*`** は分離している（混同するとアプリのボタンがユーザー色になる事故）。`components/BrandProvider.tsx` が `:root` に `--brand-*` を反映。
- 各 store の公開API（`loadBrand`/`saveBrand` 等）は不変を保ち、呼び出し側を無改修にしている。
- localStorage を `useState` 初期化子で同期読みすると **ハイドレーション不一致**（PR-9で library を修正済み: マウント後復元 + `hydratedRef` で自動保存クロバー防止）。他で同パターンを足す時は注意。
- AIルートは `output:export`（GITHUB_PAGES=true）と非互換になりやすい。`force-dynamic` を付けないことで両ビルドを通している。新規ルート追加時は両方ビルド確認（`npm run build` と `GITHUB_PAGES=true npm run build`）。

## ⚠ セキュリティ（要対応）
- git remote `private`（gottyan6116）に **GitHub Personal Access Token が平文**で埋め込まれている。**GitHubで当該トークンを無効化（regenerate）** し、remote URL をクリーンにすること。push は `origin` を使用。

## CLIでの続け方（例）
```
git checkout feat/redesign
npm install   # 念のため
npm run dev   # http://localhost:3001 で確認
# パネルのガラス化を進める → npm run build → コミット → main へマージ → push（Vercel自動デプロイ）
```
