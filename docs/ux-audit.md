# UX Audit（調査日 2026-06-09）

参照スキル: ui-ux-pro-max / web-design-guidelines

対象: Marketer's Studio（Next.js 16 + React + Tailwind / 日本語UI / 7モジュール: library, ppt, swipe, email, social, brand, prompts）
診断方式: 実コードの静的レビュー（`app/<module>/page.tsx`, `components/`, `app/globals.css`, `app/layout.tsx`, `tailwind.config.ts`, `lib/ui/glass.ts` 等を実読）。アプリの起動・ビルドは未実施。

---

## サマリ（全体の強み / 弱み）

### 強み
1. **空状態（EmptyState）の設計が概ね良質**。PPT（`app/ppt/page.tsx:535`）は「3ステップ + ドロップゾーン + 分類タグ例 + プライバシー注記」、Swipe（`app/swipe/page.tsx:203`）はサンプルカード付き、ダッシュボード（`app/page.tsx:176`）は「偽の数字を出さない」空状態と、空状態の質が業界平均より高い。
2. **キーボード操作とaria配慮の素地がある**。PPTサムネイルは `role=button` + `tabIndex=0` + `aria-pressed` + Enter/Space対応（`app/ppt/page.tsx:744`）、ズームモーダルは矢印キー/Escに対応（`app/ppt/page.tsx:418`）、アイコンボタンの多くに `aria-label` がある。`focus-visible:ring` も主要ボタンに付与済み。
3. **localStorage/IndexedDB自動保存**で作業が消えない（library: `app/library/page.tsx:74`、ppt: deckStore、swipe等）。ユーザーの作業損失リスクが低い。
4. **モバイル配慮の痕跡**。SectionPatternCardはモバイルでプレビューを折りたたみ summary-first（`components/SectionPatternCard.tsx:104`）、タップ領域44px（`min-h-[44px]`, `h-11`）の指定が随所にある。
5. **`prefers-reduced-motion` 対応**（`app/globals.css:44`）がマーキーに入っている。

### 弱み
1. **デザインシステムが二重化・分裂している（最大の問題）**。`tailwind.config.ts` は Sansan ブランド（青 `#004e98` / `sansan-*` / `ink` / `accent`）を定義しているのに、実画面の大半は violet/fuchsia/indigo のグラスモーフィズムで描かれ、トークンが使われていない。さらにモジュール間で配色言語がバラバラ（後述）。一貫性スコアが全観点で最も低い。
2. **共通UIコンポーネントが存在しない**。Button/Card/Modal/Input/Tabs/Toast/Empty/Skeleton がすべて各ページにインラインのTailwindクラス羅列で重複実装されている。同じ「丸ピルの白ボタン」「角丸カード」「入力欄クラス文字列」が7ファイルに散在。保守困難で、一貫性崩れの温床。
3. **アイコンに絵文字を多用**（🎨 ✉ ↻ 🤝 😊 ⚡ 🔥 ✨ 🛒 ✕ ▲ ▼ ⌕ ★ ☆ ◆）。`components/icons.tsx` にSVGアイコンセットがあるのに、ヘッダーやトーン選択、ボタンで絵文字が使われOS依存・サイズ不揃い・トーン不一致を招いている（ui-ux-pro-max の `no-emoji-icons` 違反）。
4. **ナビゲーション/IAが不統一**。ダッシュボードは「ホーム」起点だが、6モジュールのうち library/ppt/email/social/brand は「← Library」へ戻り、swipe も「Library」へ、prompts だけ「ホーム」へ戻る。各ページのヘッダー構造（グラスピル型 vs ボーダー型 vs zinc型）も3パターンに割れている。モジュール間の横移動はBuilderHeader（library内）にしか無く、他モジュールから別モジュールへ直接遷移できない。
5. **フィードバック/エラー処理がトースト不在のアドホック実装**。成功は各所の `setCopied`/`setSaved` によるボタン内テキスト差し替え（1200ms）に依存。失敗は `errorMsg` のインライン赤帯（PPTのみ）か、多くのモジュールでは無言（email/socialのクリップボード失敗は捕捉されない）。`aria-live` による通知が一切ない。

---

## 優先度付き改善リスト

優先度: P0=致命/早急, P1=重要, P2=改善。工数: S=数時間, M=1〜2日, L=数日以上。

| 優先 | モジュール | 問題 | 該当 file_path:line | 推奨改善 | 工数 |
|---|---|---|---|---|---|
| P0 | 全体 | デザイントークンが二重定義され未使用。tailwindはSansan青、実画面はviolet系で乖離。配色の単一の真実源が無い | `tailwind.config.ts:28-58` / `lib/ui/glass.ts:18` / `app/library/page.tsx:158` | brand=実体に合わせ violet/indigo を `primary` トークン化し、全画面を `bg-primary` 等のセマンティック名へ移行。Sansan残骸は削除 | L |
| P0 | 全体 | Button/Card/Input/Modal/Tabs等が各ページにインライン重複。同一スタイル文字列が7ファイルに散在 | `app/email/page.tsx:64`(input) / `app/swipe/page.tsx:97`(inputCls) / `app/social/page.tsx:88` / `app/brand/page.tsx:87` | `components/ui/` に Button/Card/Input/Modal/Tabs/Toast/EmptyState/Skeleton を新設し置換 | L |
| P0 | 全体 | 操作結果（コピー/保存/エラー）の通知が `aria-live` 不在。SRユーザーに成功・失敗が伝わらない | `app/email/page.tsx:57-62` / `app/social/page.tsx:37-46` / `app/ppt/page.tsx:607` | 共通Toast（`role=status`/`aria-live=polite`、失敗は`assertive`）を導入し全成功/失敗を集約 | M |
| P0 | email / social | クリップボード書込が `navigator.clipboard?.writeText()` のみで失敗時フィードバック無し。非対応/権限拒否時に無言で失敗 | `app/email/page.tsx:59` / `app/social/page.tsx:38` | `.then/.catch` で成功・失敗をToast化。`?.` で握り潰さない | S |
| P1 | 全体 | アイコンに絵文字を多用（🎨✉↻🤝😊⚡🔥🛒等）。OS依存・サイズ不揃い・トーン不一致 | `components/BuilderHeader.tsx:65,93,101` / `app/brand/page.tsx:56,153` / `app/social/page.tsx:135` / `app/ppt/page.tsx:622` | 既存 `components/icons.tsx` のSVGに統一。不足分は同セットで追加 | M |
| P1 | 全体 | ヘッダー/戻り先が3系統に分裂（グラスピル型/ボーダー型/zinc型、戻り先がLibrary/ホーム混在） | `app/ppt/page.tsx:453` / `app/swipe/page.tsx:102` / `app/prompts/page.tsx:219` / `app/page.tsx:119` | 共通 `AppHeader`（戻る先・モジュール切替・ダークトグルを統一）を作り全モジュールで共有 | M |
| P1 | 全体 | モジュール間の横移動導線が欠落。library以外からは他モジュールへ直接行けず、必ずホーム/Library経由 | `app/swipe/page.tsx:105` / `app/email/page.tsx:102` / `app/prompts/page.tsx:222` | 共通ヘッダーにモジュールスイッチャ（7モジュールのドロップダウン/タブ）を載せる | M |
| P1 | swipe | 画像が `<img src={dataURL}>` で width/height/aspect未固定の生img。LCP/CLS悪化、Next Image未使用 | `app/swipe/page.tsx:171,235,244` | アスペクト枠は確保済みだがプレビュー(171)は固定高さ無し。`aspect-ratio`明示 + 可能なら最適化。faviconはalt補強 | S |
| P1 | library / 全体 | 検索・お気に入りフィルタ・タブに `aria-label`/`role` 不足。検索結果件数が `aria-live` でアナウンスされない | `app/library/page.tsx:187,221` / `app/prompts/page.tsx:329` | 検索inputに `aria-label`、結果カウントを `aria-live=polite` でラップ | S |
| P1 | email | 全フィールドが `<label><span>…</span><input></label>` だが `htmlFor`/`id` 紐付けが無く、ラベルクリック以外のa11yが弱い。必須/エラー表示も無し | `app/email/page.tsx:64-86,199-218` | label-input を id で関連付け、必須印・inline validation・エラー配置を追加 | M |
| P1 | 全体 | ローディング表現が不統一。PPTはskeleton(pulse)有り、他モジュールはテキスト「処理中…」や無表示。Skeleton共通化なし | `app/ppt/page.tsx:768` / `components/GeneratedLPPreview.tsx`(export) / email iframe(初回) | 共通 `Skeleton`/`Spinner` を導入。300ms超の処理に統一適用 | M |
| P1 | library / preview | 構成保存が `window.prompt()`。ネイティブダイアログでブランド体験を損ね、モバイルで貧弱、検証不可 | `components/GeneratedLPPreview.tsx:81` | 共通Modal + Input + バリデーション（空名/重複）に置換 | S |
| P1 | preview | ドラッグ並べ替えがHTML5 DnDのみでキーボード代替が無い。SR/キーボードユーザーは並べ替え不可 | `components/GeneratedLPPreview.tsx:623` / `components/GeneratedSectionWrapper.tsx` | 各セクションに「上へ/下へ」ボタン（キーボード操作可）を併設 | M |
| P1 | social | トーン選択ボタンが絵文字頼り、`aria-pressed` 無し。3カラムでモバイル幅が窮屈・ラベルが `split("・")[0]` で意味欠落 | `app/social/page.tsx:127-138` | SVGアイコン化 + `aria-pressed` + 省略しない明示ラベル | S |
| P2 | email / social / brand | 背景blob/グラデが各ページにコピペ重複（同一マークアップ4箇所以上） | `app/email/page.tsx:90-96` / `app/social/page.tsx:50-56` / `app/brand/page.tsx:41-44` | `AuroraBg` 既存コンポーネントに統一（ダッシュボード/promptsは使用済み） | S |
| P2 | 全体 | ダークモード対応がページ毎にまだら。library検索UI・brand・email・socialの本文/入力はダーク未対応の `bg-white`/`text-slate` が残る | `app/email/page.tsx:151` / `app/brand/page.tsx:81` / `app/library/page.tsx:266` | 共通コンポーネント化に合わせ dark: バリアントを全面付与 | M |
| P2 | swipe | コピー一覧の行内テキストが `truncate` のみで全文確認手段が無い（長いコピーが切れる） | `app/swipe/page.tsx:308` | hover/クリックで展開、または title属性/モーダルで全文表示 | S |
| P2 | prompts | カテゴリchipにアクティブの `aria-pressed`/role指定が無く、件数の多いchip群でフォーカス移動が冗長 | `app/prompts/page.tsx:345` | `role=tablist`/`aria-selected` 化、もしくは `aria-pressed` 付与 | S |
| P2 | ppt | 主要操作（削除/カート/DL）ボタンがインラインSVG手書きで重複。アイコン管理が分散 | `app/ppt/page.tsx:494,506,521` | `components/icons.tsx` に集約 | S |
| P2 | brand | カラーピッカーが `<input type=color>` のみ。HEX手入力・コントラスト警告が無く、低コントラスト配色を作れてしまう | `app/brand/page.tsx:108` | HEX入力併設 + プレビュー文字とのコントラスト比チェック表示 | M |
| P2 | 全体 | `min-h-screen` と `min-h-dvh` が混在（library/email/social/ppt は screen、dashboard/prompts/swipe は dvh）。モバイルでビューポート高さの挙動が不一致 | `app/library/page.tsx:154` vs `app/page.tsx:115` | `min-h-dvh` に統一 | S |
| P2 | 全体 | マイクロコピーのトーン不統一。英語ラベル（Selected, Reset Selection, Library, Generated LP）と日本語が混在し、語尾も「〜する/〜します/体言止め」が混在 | `components/BuilderHeader.tsx:113,121` / `components/ModeToggle.tsx:11-12` | 日本語UIに統一し、用語集（保存/書き出し/取り込み等）と語尾ルールを定義 | M |

---

## モジュール別所見

### 1. library（LP Library / `app/library/page.tsx`）
中核モジュール。横断検索・お気に入り・カテゴリタブ・スライドオーバーで「選択済み」を表示する設計は良い。課題は (1) 検索/クリアの ⌕ ✕ が絵文字（`:185,200`）、(2) 検索結果件数が `aria-live` で読まれない、(3) preview のドラッグ並べ替えにキーボード代替が無い、(4) SectionPatternCard はSansanトークン（`sansan-600`等）だがページ本体はviolet系で、1画面内で2系統の配色が混在。モバイルのプレビュー折りたたみ（summary-first）は好設計。

### 2. ppt（PPT Studio / `app/ppt/page.tsx`）
最も作り込まれたモジュール。空状態（3ステップ + ドロップゾーン + プライバシー注記）、skeleton、zoomモーダルのキーボード操作、deck cart、selectAll/clear、disabled制御が揃い、フィードバック品質が全モジュールで最高。改善点は (1) 操作ボタンの手書きインラインSVGの重複、(2) 主要破壊操作「選択を削除」に確認ステップが無い（即実行）、(3) ヘッダー型が独自で他と不統一。

### 3. swipe（Swipe Bank / `app/swipe/page.tsx`）
貼り付け/ドロップ/クリックの3経路画像追加、lightbox、タグ click-to-filter が実用的。空状態も良質。課題は (1) 生 `<img>` でCLSリスク（プレビュー171は固定高さ無し）、(2) コピー一覧が truncate のみで全文不可、(3) 唯一 zinc 基調のヘッダーで他モジュールと配色言語が違う、(4) lightbox は Esc 閉じ未対応（背景クリックのみ）。

### 4. email（Mail Builder / `app/email/page.tsx`）
ブロックON/OFF + 上下移動 + ライブ iframe プレビューは分かりやすい。課題は (1) クリップボード失敗の無言握り潰し（`:59`）、(2) label-input の id 紐付け無し・必須/エラー表示無し、(3) 上下移動が ▲▼ 絵文字、(4) iframe初回ロードのローディング表現無し、(5) 入力欄がダーク未対応。

### 5. social（Social / `app/social/page.tsx`）
未入力時にプラットフォーム別スケルトンを見せる空状態は親切。文字数カウンタ + 上限超過の赤バッジも良い。課題は (1) トーンボタンの絵文字依存と `aria-pressed` 欠如、(2) コピー/保存失敗の無言処理、(3) ラベルの `split("・")[0]` で意味が落ちる、(4) ヘッダーにモジュール横移動が無い。

### 6. brand（Brand Kit / `app/brand/page.tsx`）
色・フォント・トーンを定義しライブプレビュー（LP/メール/SNS）に即反映する設計思想は優秀で、本来これがデザインシステムの中心になるべき。課題は (1) 各モジュールへの適用が「手動でボタンを押す」手順依存（自動連動でない、`:226`）、(2) コントラスト警告が無く可読性の低い配色を作れる、(3) 見出しが 🎨 絵文字、(4) 保存成功がボタン内テキストのみでToast/`aria-live`無し。

### 7. prompts（プロンプト集 / `app/prompts/page.tsx`）
glass + AuroraBg を使う最も「設計システム準拠」なページ。collapse/expand、`{変数}` ハイライト、マイプロンプト追加+新規カテゴリ作成のインライン化が良質。課題は (1) 戻り先が「ホーム」で他（Library）と不一致、(2) カテゴリchipのrole/aria-selected無し、(3) 追加フォームに必須フィールドのエラー表示が無く、無効時は無言で `return`（`:170`）。

---

## デザインシステム提案

### 基本方針
1. **トークンの単一真実源を確立**。実画面の実態（violet/indigo/fuchsia のグラス系）を正とし、`tailwind.config.ts` に `primary`/`accent`/`surface`/`muted`/`success`/`danger` 等のセマンティック名で再定義。未使用の Sansan 残骸（`sansan-*`, `accent`, `ink`, `brand.red`）は削除し、SectionPatternCard 等の `sansan-600` 参照を新トークンへ移行。raw hex / アドホックな violet-600 直書きを禁止。
2. **絵文字アイコンの全廃**。`components/icons.tsx` を唯一のアイコン源とし、線幅・サイズ（16/18/20/24）・色をトークンに揃える。
3. **Brand Kit 連動の自動化**。brand で定義したトークン（primary/secondary/accent/font/tone）を Context もしくはCSS変数（`--brand-primary` 等）として全モジュールへ伝播し、「ボタンを押して適用」を「保存即反映」へ。LP/email/social のプレビューと書き出しが同じ変数を参照する構成にする。

### 共通化すべきコンポーネント（`components/ui/` 新設）
- **Button** — variant: `primary`(グラデ) / `secondary`(白ピル) / `ghost` / `danger`、size: sm/md、`loading`/`disabled` 状態を内蔵（PPTの「処理中…」やcopy済表示を吸収）。`focus-visible:ring` を標準装備。
- **Card** — glass / solid の2面。padding・角丸・影スケールをトークン化（現状 rounded-2xl/3xl, shadow が各所バラバラ）。
- **Modal / Drawer** — scrim（不透明度40〜60%）、Escで閉じる、フォーカストラップ、close ボタンを内蔵。library のスライドオーバー、ppt の zoom、swipe の lightbox、`window.prompt` 置換を統合。
- **Tabs / SegmentedControl** — `role=tablist`/`aria-selected` 準拠。ModeToggle・swipeタブ・CategoryTabs・prompts chip を統一API化。
- **Input / Textarea / Select / ColorField** — 常時ラベル（id紐付け）、必須印、inline validation、エラー配置（フィールド直下）、ダーク対応を標準化。`app/swipe` の `inputCls` 文字列が事実上の原型。
- **Toast / ToastProvider** — `role=status`(polite)/`assertive`(失敗)。全モジュールの copy/save/error フィードバックを集約。`aria-live` をここで一元担保。
- **EmptyState** — icon + title + sub + （任意）アクション。swipe(`:342`) に既に良い原型があるので昇格・共通化。
- **Skeleton / Spinner** — ppt の pulse skeleton を抽出。300ms超の非同期に統一適用。
- **AppHeader** — 戻る先・モジュールスイッチャ（7モジュール）・ダークトグル・Brand入口を統一。現状3系統に割れたヘッダーを一本化し、IA/ナビゲーションの不統一を根本解消。
- **AuroraBg** — 既存。email/social/brand のコピペ背景をこれに置換。

### デザイントークン方針（例）
- 色: `primary`(violet-600基調) / `primary-fg` / `accent`(fuchsia) / `surface`(glass) / `border` / `muted` / `success` / `danger`。light/dark をペアで定義（色反転でなくデサチュレート）。
- 角丸: `sm=8 / md=12 / lg=16 / pill=full` に集約（現状 lg/xl/2xl/3xl の意味が config と実使用でズレている）。
- 影: `soft / card / cardhover` を violet-tinted で再定義（既存 boxShadow を流用）。
- スペーシング: 4/8pxリズムに統一。`min-h-dvh` をレイアウト標準に。
- タイポ: body 16px / 行間1.5、見出しスケール（24/30/36）を `font-scale` として固定。日本語UIに用語・語尾ルールを併設。

---

## 今回学んだこと
個別ページの完成度（特に ppt/prompts）は高い一方、**横断の一貫性（トークン・コンポーネント・ナビ・フィードバック）が最大の負債**。Brand Kit という連動の核が既にあるため、「共通UI層 + トークン伝播」を入れれば一貫性は短期間で大幅改善できる。a11yは素地（aria/focus/キーボード）があるので、`aria-live`(Toast) とDnDのキーボード代替を足せば実用水準に届く。
