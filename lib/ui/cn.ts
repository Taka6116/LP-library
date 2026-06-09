// 最小のクラス名結合ヘルパー（falsy を除去して join）。
// 外部依存（clsx 等）を増やさないための薄い実装。
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
