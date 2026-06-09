"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/ui/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  /** 読み込み中。スピナーを表示し操作を無効化する */
  loading?: boolean;
  /** 左側に置くアイコン要素 */
  leftIcon?: React.ReactNode;
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold " +
  "transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary-accent text-primary-fg shadow-sm hover:brightness-110",
  secondary:
    "border border-border bg-surface text-surface-fg hover:bg-primary-muted/40",
  ghost: "text-surface-fg hover:bg-primary-muted/40",
  danger: "bg-danger text-danger-fg shadow-sm hover:brightness-110",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
};

/**
 * 共通ボタン。トークンのみで描画し、loading/disabled と focus-visible リングを内蔵。
 * 既存のインライン重複ボタン（白ピル/グラデ等）を置換していく土台。
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, leftIcon, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
      {...rest}
    >
      {loading ? <Spinner size="sm" label="" /> : leftIcon}
      {children}
    </button>
  );
});
