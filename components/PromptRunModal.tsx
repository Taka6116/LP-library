"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal, Input, Button, useToast } from "./ui";
import { extractVars, fillVars } from "@/lib/prompts/vars";
import { runPromptStream } from "@/lib/ai/client";
import { SYSTEM_PRESETS, getPreset, type SystemPresetId } from "@/lib/ai/system";
import {
  loadAiHistory, addAiHistory, removeAiHistory, type AiHistoryItem,
} from "@/lib/ai/history";
import { addCopyItem } from "@/lib/swipe/store";
import { setHandoff, moduleHref } from "@/lib/cross/handoff";
import { IconTrash } from "@/components/icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  template: string;
};

/**
 * プロンプトの {変数} を埋めて使うためのモーダル。
 * - 「埋めてコピー」: 変数を反映したプロンプトをコピー（バックエンド不要・常に動作）。
 * - 「AIで実行」: サーバの Route Handler 経由でストリーミング生成。
 *   ANTHROPIC_API_KEY 未設定の環境では未設定エラーを表示する。
 * - 用途プリセット（lib/ai/system.ts）で system プロンプトを切替。
 * - 生成結果は履歴（lib/ai/history.ts / localStorage）に保存され、後から再利用できる。
 */
export function PromptRunModal({ open, onClose, title, template }: Props) {
  const toast = useToast();
  const vars = useMemo(() => extractVars(template), [template]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [presetId, setPresetId] = useState<SystemPresetId>("none");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [history, setHistory] = useState<AiHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (open) setHistory(loadAiHistory());
  }, [open]);

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
    const preset = getPreset(presetId);
    setRunning(true);
    setStreaming(true);
    setResult("");
    const res = await runPromptStream(
      { prompt: filled, ...(preset.system ? { system: preset.system } : {}) },
      (textSoFar) => setResult(textSoFar),
    );
    setRunning(false);
    setStreaming(false);
    if (res.ok) {
      setResult(res.text);
      setHistory(addAiHistory({
        title,
        prompt: filled,
        presetLabel: preset.id === "none" ? undefined : preset.label,
        result: res.text,
      }));
      toast.success("生成しました");
    } else {
      setResult(null);
      toast.error(res.error);
    }
  }

  function deleteHistory(id: string) {
    setHistory(removeAiHistory(id));
  }

  // 送り先: 生成結果があればそれを、無ければ埋め込み済みプロンプトを渡す
  const outgoing = result || filled;

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

        {/* 用途プリセット（systemプロンプト） */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-surface-muted" htmlFor="ai-preset">
            用途（AIへの追加指示）
          </label>
          <select
            id="ai-preset"
            value={presetId}
            onChange={(e) => setPresetId(e.target.value as SystemPresetId)}
            className="w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-surface-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {SYSTEM_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

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

        {result !== null && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-semibold text-surface-muted">
                生成結果{streaming && <span className="ml-1.5 text-primary">生成中…</span>}
              </p>
              {!streaming && result && (
                <Button variant="ghost" size="sm" onClick={() => copyText(result, "生成結果")}>
                  結果をコピー
                </Button>
              )}
            </div>
            <pre aria-live="polite" className="max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-sm)] border border-border bg-surface/60 p-3 text-[13px] leading-relaxed text-surface-fg">
              {result}
              {streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-primary align-middle" aria-hidden />}
            </pre>
          </div>
        )}

        {/* 生成履歴 */}
        {history.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              className="text-xs font-semibold text-surface-muted transition hover:text-primary"
              aria-expanded={showHistory}
            >
              {showHistory ? "▾" : "▸"} 生成履歴（{history.length}）
            </button>
            {showHistory && (
              <ul className="mt-2 max-h-48 space-y-1.5 overflow-auto">
                {history.map((h) => (
                  <li key={h.id} className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-border bg-surface/60 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setResult(h.result)}
                      className="min-w-0 flex-1 text-left"
                      title="クリックで結果欄に呼び出し"
                    >
                      <span className="block truncate text-xs font-semibold text-surface-fg">
                        {h.title}
                        {h.presetLabel && <span className="ml-1.5 rounded bg-primary-muted/60 px-1 py-0.5 text-[10px] font-bold text-primary">{h.presetLabel}</span>}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-surface-muted">{h.result}</span>
                      <span className="mt-0.5 block text-[10px] text-surface-muted/70">
                        {new Date(h.createdAt).toLocaleString("ja-JP")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteHistory(h.id)}
                      aria-label="この履歴を削除"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded text-surface-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
