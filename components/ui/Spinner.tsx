import { cn } from "@/lib/ui/cn";

type Props = {
  /** ピクセル相当のサイズ（Tailwind の size クラスに対応） */
  size?: "sm" | "md";
  className?: string;
  /** aria-label。装飾目的なら label="" で aria-hidden 扱いにする */
  label?: string;
};

const SIZE = { sm: "h-4 w-4", md: "h-5 w-5" } as const;

/** トークンベースの読み込みスピナー。300ms 超の非同期に使う。 */
export function Spinner({ size = "md", className, label = "読み込み中" }: Props) {
  return (
    <svg
      className={cn("animate-spin", SIZE[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" />
    </svg>
  );
}
