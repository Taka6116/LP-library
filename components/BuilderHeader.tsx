"use client";

import type { BuilderMode } from "@/types/section";
import { ModeToggle } from "./ModeToggle";
import { AppHeader } from "./AppHeader";
import { Button } from "./ui";
import { IconSparkles } from "./icons";

type Props = {
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
  selectedCount: number;
  onReset: () => void;
  onOpenSelected: () => void;
  /** AI構成設計モーダルを開く */
  onOpenAiPlan?: () => void;
};

/**
 * LP Builder のヘッダー。共通 AppHeader を土台にし、
 * Builder 固有の操作（モード切替・選択中・選択クリア）を actions に載せる。
 * モジュール横移動・ホーム導線・ダークトグルは AppHeader が一手に担う
 * （以前あった各モジュールへの絵文字ショートカット列は AppHeader のスイッチャに統合）。
 */
export function BuilderHeader({
  mode,
  onModeChange,
  selectedCount,
  onReset,
  onOpenSelected,
  onOpenAiPlan,
}: Props) {
  return (
    <AppHeader
      current="library"
      title="LP Library"
      subtitle="セクションを組み合わせて構成を作る"
      actions={
        <>
          {onOpenAiPlan && (
            <button
              type="button"
              onClick={onOpenAiPlan}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
              title="商材を入力するとAIがセクション構成を設計します"
            >
              <IconSparkles className="h-4 w-4" />
              AIで構成
            </button>
          )}
          <ModeToggle mode={mode} onChange={onModeChange} />
          <button
            type="button"
            onClick={onOpenSelected}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
          >
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-accent px-1.5 text-xs text-primary-fg">
              {selectedCount}
            </span>
            選択中
          </button>
          <Button variant="secondary" size="sm" onClick={onReset} disabled={selectedCount === 0}>
            選択をクリア
          </Button>
        </>
      }
    />
  );
}
