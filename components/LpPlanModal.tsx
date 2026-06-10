"use client";

import { useState } from "react";
import { Modal, Input, Textarea, Button, useToast } from "./ui";
import { useBrand } from "./BrandProvider";
import { runPromptStream } from "@/lib/ai/client";
import { brandContext, composeSystem } from "@/lib/ai/system";
import {
  buildLpPlanRequest, parseLpPlan, planLabels, type LpPlan,
} from "@/lib/ai/lpPlan";
import type { SelectedSections } from "@/types/section";
import { IconSparkles } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  /** 提案された構成を LP Builder に反映する */
  onApply: (selected: SelectedSections, order: string[]) => void;
};

/**
 * AI による LP 構成の自動設計。
 * 商材・ターゲット・ゴールを入力 → AI がセクションカタログから構成を提案 →
 * 「この構成を適用」で Builder の選択に直接反映する。
 * AI バックエンド（ANTHROPIC_API_KEY）未設定の環境では実行できない。
 */
export function LpPlanModal({ open, onClose, onApply }: Props) {
  const toast = useToast();
  const { brand } = useBrand();
  const [product, setProduct] = useState("");
  const [target, setTarget] = useState("");
  const [goal, setGoal] = useState("");
  const [running, setRunning] = useState(false);
  const [plan, setPlan] = useState<LpPlan | null>(null);

  async function run() {
    if (!product.trim()) {
      toast.error("商材・サービスの説明を入力してください");
      return;
    }
    const { prompt, system } = buildLpPlanRequest({
      product: product.trim(),
      target: target.trim() || undefined,
      goal: goal.trim() || undefined,
    });
    setRunning(true);
    setPlan(null);
    const res = await runPromptStream(
      { prompt, system: composeSystem(system, brandContext(brand)) ?? system },
      () => {},
    );
    setRunning(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const parsed = parseLpPlan(res.text);
    if (!parsed) {
      toast.error("構成の解析に失敗しました。もう一度お試しください");
      return;
    }
    setPlan(parsed);
  }

  function apply() {
    if (!plan) return;
    onApply(plan.selected, plan.order);
    toast.success(`AIの構成（${plan.items.length}セクション）を適用しました`);
    setPlan(null);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="AIでLP構成を設計"
      widthClass="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>閉じる</Button>
          {plan ? (
            <>
              <Button variant="secondary" size="sm" onClick={run} loading={running}>作り直す</Button>
              <Button variant="primary" size="sm" onClick={apply}>この構成を適用</Button>
            </>
          ) : (
            <Button variant="primary" size="sm" loading={running} onClick={run}>
              構成を設計する
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {!plan && (
          <>
            <Textarea
              label="商材・サービス（必須）"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              rows={3}
              placeholder="例：中小企業向けの補助金申請サポートサービス。着手金0円・成功報酬型"
            />
            <Input
              label="ターゲット（任意）"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="例：補助金を初めて検討する製造業の経営者"
            />
            <Input
              label="LPのゴール / CV（任意）"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="例：無料相談の予約"
            />
            {running && (
              <p className="flex items-center gap-2 text-xs text-surface-muted" role="status" aria-live="polite">
                <IconSparkles className="h-4 w-4 animate-pulse text-primary" />
                セクションカタログ（48種）から最適な構成を設計中…
              </p>
            )}
            <div className="rounded-[var(--radius-sm)] border border-amber-300/50 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
              この機能はサーバ側に <code className="font-mono">ANTHROPIC_API_KEY</code> が設定されている場合のみ動作します。
            </div>
          </>
        )}

        {plan && (
          <div>
            <p className="mb-2 text-xs font-semibold text-surface-muted">
              提案された構成（{plan.items.length}セクション・上から順に表示されます)
            </p>
            <ol className="space-y-2">
              {plan.items.map((it, i) => {
                const { category, section } = planLabels(it);
                return (
                  <li
                    key={it.categoryId}
                    className="rounded-[var(--radius-sm)] border border-border bg-surface/60 px-3 py-2.5"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {i + 1}. {category}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-surface-fg">{section}</p>
                    {it.reason && (
                      <p className="mt-0.5 text-xs leading-relaxed text-surface-muted">{it.reason}</p>
                    )}
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-xs text-surface-muted">
              適用後も Library モードでセクションの差し替え・並び替えができます。
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
