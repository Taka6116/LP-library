"use client";

import { useMemo, useState } from "react";
import { Modal, Input, Button, useToast } from "./ui";
import { extractVars, fillVars } from "@/lib/prompts/vars";
import { runPrompt } from "@/lib/ai/client";
import { addCopyItem } from "@/lib/swipe/store";
import { setHandoff, moduleHref } from "@/lib/cross/handoff";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  template: string;
};

/**
 * プロンプトの {変数} を埋めて使うためのモーダル。
 * - 「埋めてコピー」: 変数を反映したプロンプトをコピー（バックエンド不要・常に動作）。
 * - 「AIで実行」: サーバの Route Handler 経由で生成。ANTHROPIC_API_KEY 未設定の環境では
 *   未設定エラーを表示する（＝バックエンド/キーが無いと動かないのが正）。
 */
export function PromptRunModal({ open, onClose, title, template }: Props) {
  const toast = useToast();
  const vars = useMemo(() => extractVars(template), [template]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const filled = useMemo(() => fillVars(template, values), [template, values]);

  async function copyText(text: string, label: string) {
    try {
      if (!navigator.clipboard) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(text);
      toast.success(`${label}をコピーしました`);
    } catch {
      toast.error("コピーに失敗しました。手動でコピーしてください");
    }
  }

  async function runAi() {
    setRunning(true);
    setResult(null);
    const res = await runPrompt({ prompt: filled });
    setRunning(false);
    if (res.ok) {
      setResult(res.text);
      toast.success("生成しました");
    } else {
      toast.error(res.error);
    }
  }

  // 送り先: 生成結果があればそれを、無ければ埋め込み済みプロンプトを渡す
  const outgoing = result ?? filled;

  function sendToCopyBank() {
    addCopyItem(outgoing, "ボディ", ["AI", "プロンプト"]);
    toast.success("コピーバンクに保存しました");
  }
  function sendToModule(kind: "email" | "social") {
    setHandoff(kind, outgoing);
    toast.success(kind === "email" ? "メールへ送ります…" : "SNSへ送ります…");
    window.setTimeout(() => {
      window.location.href = moduleHref(kind === "email" ? "/email" : "/social");
    }, 400);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      widthClass="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>閉じる</Button>
          <Button variant="secondary" size="sm" onClick={() => copyText(filled, "プロンプト")}>
            埋めてコピー
          </Button>
          <Button variant="primary" size="sm" loading={running} onClick={runAi}>
            AIで実行
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {vars.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-surface-muted">変数を入力</p>
            {vars.map((v) => (
              <Input
                key={v}
                label={`{${v}}`}
                value={values[v] ?? ""}
                placeholder={v}
                onChange={(e) => setValues((s) => ({ ...s, [v]: e.target.value }))}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-surface-muted">
            このプロンプトに変数（{"{…}"}）はありません。そのまま実行できます。
          </p>
        )}

        <div>
          <p className="mb-1 text-xs font-semibold text-surface-muted">プレビュー（埋め込み後）</p>
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-sm)] border border-border bg-surface/60 p-3 text-[13px] leading-relaxed text-surface-fg">
            {filled}
          </pre>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-surface-muted">
            送る（{result ? "生成結果" : "埋め込み後プロンプト"}を渡す）
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={sendToCopyBank}>コピーバンク</Button>
            <Button variant="secondary" size="sm" onClick={() => sendToModule("email")}>メールへ</Button>
            <Button variant="secondary" size="sm" onClick={() => sendToModule("social")}>SNSへ</Button>
          </div>
        </div>

        <div className="rounded-[var(--radius-sm)] border border-amber-300/50 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
          アプリ内AI実行は、サーバ側に <code className="font-mono">ANTHROPIC_API_KEY</code> が設定されている場合のみ動作します。
          未設定の環境では「AIで実行」は使えません（「埋めてコピー」や上の「送る」で外部AI・各モジュールへ渡せます）。
        </div>

        {result && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-semibold text-surface-muted">生成結果</p>
              <Button variant="ghost" size="sm" onClick={() => copyText(result, "生成結果")}>
                結果をコピー
              </Button>
            </div>
            <pre className="max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-sm)] border border-border bg-surface/60 p-3 text-[13px] leading-relaxed text-surface-fg">
              {result}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}
