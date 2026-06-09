import { cn } from "@/lib/ui/cn";

export type EmptyStateProps = {
  /** SVG アイコン要素（components/icons.tsx を推奨。絵文字は使わない） */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** 行動を促す要素（Button など） */
  action?: React.ReactNode;
  className?: string;
};

/**
 * 空状態の共通表示。swipe の良質な空状態を昇格・共通化したもの。
 * 偽の数字やダミーを出さず、次の一手を促す。
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/40 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-primary" aria-hidden>{icon}</div>}
      <h3 className="text-sm font-semibold text-surface-fg">{title}</h3>
      {description && <p className="max-w-sm text-xs leading-relaxed text-surface-muted">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
