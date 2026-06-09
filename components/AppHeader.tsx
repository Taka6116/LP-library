"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useDark } from "@/components/ThemeProvider";
import {
  IconLayers, IconPresentation, IconBookmark, IconMail, IconRepeat,
  IconPalette, IconSparkles, IconSun, IconMoon, IconChevronDown, IconArrowRight,
} from "@/components/icons";
import { cn } from "@/lib/ui/cn";

export type ModuleId =
  | "library" | "ppt" | "swipe" | "email" | "social" | "brand" | "prompts";

type NavItem = { id: ModuleId; href: string; label: string; Icon: (p: { className?: string }) => ReactNode };

const NAV: NavItem[] = [
  { id: "library", href: "/library", label: "LP Library", Icon: IconLayers },
  { id: "ppt", href: "/ppt", label: "PPT Studio", Icon: IconPresentation },
  { id: "swipe", href: "/swipe", label: "Swipe Bank", Icon: IconBookmark },
  { id: "email", href: "/email", label: "Mail Builder", Icon: IconMail },
  { id: "social", href: "/social", label: "Social", Icon: IconRepeat },
  { id: "brand", href: "/brand", label: "Brand Kit", Icon: IconPalette },
  { id: "prompts", href: "/prompts", label: "プロンプト集", Icon: IconSparkles },
];

export type AppHeaderProps = {
  /** 現在のモジュール（スイッチャでアクティブ表示） */
  current: ModuleId;
  /** 見出し（未指定なら現在モジュール名） */
  title?: string;
  /** 補足説明（sm 以上で表示） */
  subtitle?: string;
  /** 右側のアクション群（Button など） */
  actions?: ReactNode;
};

/**
 * 全モジュール共通のヘッダー。
 * 「ホームへ戻る」「7モジュールのスイッチャ」「ダークモード切替」を統一し、
 * これまで3系統に割れていたヘッダー/戻り先/横移動の不統一を根本解消する（ux-audit P1）。
 */
export function AppHeader({ current, title, subtitle, actions }: AppHeaderProps) {
  const { dark, toggle } = useDark();
  const cur = NAV.find(n => n.id === current) ?? NAV[0];
  const heading = title ?? cur.label;

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-white/60 bg-gradient-to-b from-white/85 to-white/55 px-4 py-3 shadow-card ring-1 ring-inset ring-white/60 backdrop-blur-xl dark:border-white/10 dark:from-white/10 dark:to-white/[0.04] sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            aria-label="ホームへ"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/70 bg-white/60 text-slate-600 backdrop-blur transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
          >
            <IconArrowRight className="h-4 w-4 rotate-180" />
          </Link>

          {/* モジュールスイッチャ */}
          <details className="group relative min-w-0">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 [&::-webkit-details-marker]:hidden">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-accent text-primary-fg shadow-sm">
                <cur.Icon className="h-4 w-4" />
              </span>
              <span className="truncate text-base font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-lg">
                {heading}
              </span>
              <IconChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
            </summary>
            <nav className="absolute left-0 z-50 mt-2 w-64 rounded-[var(--radius-md)] border border-border bg-surface p-1.5 shadow-card">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-surface-muted">モジュールを切り替え</p>
              {NAV.map(n => {
                const active = n.id === current;
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 text-sm transition",
                      active
                        ? "bg-primary-muted/50 font-semibold text-primary"
                        : "text-surface-fg hover:bg-primary-muted/40",
                    )}
                  >
                    <n.Icon className="h-4 w-4 shrink-0" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </details>

          {subtitle && (
            <p className="hidden truncate text-xs text-slate-500 lg:block">{subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {actions}
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? "ライトモードに切替" : "ダークモードに切替"}
            aria-pressed={dark}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/60 text-slate-600 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
          >
            {dark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
