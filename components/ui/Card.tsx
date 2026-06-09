import { cn } from "@/lib/ui/cn";

type Variant = "glass" | "solid";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
};

const VARIANT: Record<Variant, string> = {
  // グラス面（lib/ui/glass.ts の後継。トークン参照に置換）
  glass:
    "border border-white/60 bg-surface/45 backdrop-blur-xl shadow-card " +
    "dark:border-white/10 dark:bg-white/[0.04]",
  // ソリッド面
  solid: "border border-border bg-surface shadow-soft",
};

/** 共通カード面。padding は呼び出し側で指定（用途差が大きいため最小限）。 */
export function Card({ variant = "solid", className, ...rest }: CardProps) {
  return (
    <div
      className={cn("rounded-[var(--radius-lg)]", VARIANT[variant], className)}
      {...rest}
    />
  );
}
