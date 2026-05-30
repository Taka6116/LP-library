# 共同作業 / ブランチ運用ガイド

自宅PC・会社PC など複数の端末で、同じリポジトリを安全に編集し続けるための手順です。

---

## 1. いちばん大事なルール

> **作業を始める前に `git pull`／終わったら `git push`。**

片方の端末で push した変更を、もう片方で pull せずに編集すると **コンフリクト**します。
「机に座ったらまず pull」を習慣にしてください。

---

## 2. かんたん運用（main 直接・1人で2台を行き来する場合）

```bash
# 作業開始
git pull origin main

# …Claude Code と編集・確認…
npm run build            # push 前の動作確認（任意だが推奨）

# 変更を保存して反映（Vercel が自動デプロイ）
git add -A
git commit -m "変更内容を簡潔に"
git push origin main
```

これで OK。Vercel が `main` を見て自動デプロイします。

---

## 3. ブランチ運用（安全側・レビューしたい場合）

機能ごとにブランチを切り、GitHub の Pull Request にまとめる方法です。
`main` を壊さずに作業でき、Vercel は PR ごとに**プレビューURL**も作ります。

```bash
# 最新の main から作業ブランチを作成
git checkout main
git pull origin main
git checkout -b feature/hero-newsection

# …編集・コミット…
git add -A
git commit -m "Add new hero section"
git push -u origin feature/hero-newsection
```

→ GitHub で **Pull Request** を作成 → 内容を確認 → **Merge** → `main` に反映＆本番デプロイ。

ブランチ名の例:
- `feature/...` 新セクション・新機能
- `fix/...` バグ修正
- `style/...` 見た目・UI調整

---

## 4. コンフリクトが起きたら

```bash
git pull origin main
# CONFLICT と表示されたファイルを開き、<<<<<<< ~ >>>>>>> の該当箇所を手で解消
git add <解消したファイル>
git commit
git push origin main
```

判断に迷ったら、その状態のまま Claude Code に「コンフリクトを直して」と頼めば対応できます。

---

## 5. 端末ごとに分かれるもの（共有されない）

これらは Git 管理外なので、新しいPCでは自動生成／再ログインになります（正常です）。

- `node_modules/` … `npm install` で再生成
- `.next/` … ビルド時に再生成
- `.claude/settings.local.json` … Claude の許可設定（端末ごと・都度プロンプト）
- 日本語名の**元素材**（`public/クラプロ/`, `public/月桂樹.webp`）
  … アプリは ASCII 名のコピー（`public/kurapuro/`, `public/award-2000.webp`）を使うため、
  クローン先でも**問題なく動作**します。

---

## 6. 認証（新しいPCで一度だけ）

- **GitHub**: 初回 push 時にブラウザ / Git Credential Manager でログイン
- **Claude Code**: その端末でログイン
- **Vercel**: GitHub 連携済みのため操作不要（自動デプロイ）

---

## チートシート

```bash
git pull origin main            # 始める前
git add -A && git commit -m "…" # 保存
git push origin main            # 反映（自動デプロイ）
git checkout -b feature/xxx     # ブランチを切る
git status                      # いま何が変わっているか
git log --oneline -10           # 直近の履歴
```
