import { cn } from "@/lib/ui/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * 読み込み中のプレースホルダ。ppt の pulse skeleton を抽出・共通化。
 * 300ms 超の非同期領域に適用する。サイズは className（h-/w-）で指定。
 */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-[var(--radius-sm)] bg-surface-muted/20",
        className,
      )}
      {...rest}
    />
  );
}
