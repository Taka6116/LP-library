"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  loadBrand, saveBrand, getFontStack, DEFAULT_BRAND, type BrandKit,
} from "@/lib/brand/store";

type BrandCtx = {
  brand: BrandKit;
  /** 部分更新 → 即座に :root へ反映し、デバウンスで永続化 */
  update: (patch: Partial<BrandKit>) => void;
  /** 既定値へ戻す（即反映・永続化） */
  reset: () => void;
};

const Ctx = createContext<BrandCtx | null>(null);

/**
 * Brand Kit の値を CSS 変数として :root に反映する。
 * 製品のデザインシステム（--color-*）とは独立した、ユーザー資産のブランド色。
 * LP / Email / Social のプレビュー・書き出しがこの変数を参照できる。
 */
function applyVars(b: BrandKit) {
  if (typeof document === "undefined") return;
  const s = document.documentElement.style;
  s.setProperty("--brand-primary", b.primaryColor);
  s.setProperty("--brand-secondary", b.secondaryColor);
  s.setProperty("--brand-accent", b.accentColor);
  s.setProperty("--brand-font", getFontStack(b.fontId));
}

/**
 * Brand Kit の単一ソースを供給する Provider。
 * 「保存ボタン → 手動適用」を廃し、変更を全モジュールへ即時反映する（保存はデバウンス）。
 */
export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandKit>(DEFAULT_BRAND);
  const timer = useRef<number | undefined>(undefined);

  // 初期ロード（SSR とのハイドレーション不一致を避けるため mount 後に適用）
  useEffect(() => {
    const b = loadBrand();
    setBrand(b);
    applyVars(b);
  }, []);

  const persist = useCallback((b: BrandKit) => {
    if (typeof window === "undefined") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveBrand(b), 400);
  }, []);

  const update = useCallback(
    (patch: Partial<BrandKit>) => {
      setBrand(prev => {
        const next = { ...prev, ...patch };
        applyVars(next);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    const next = { ...DEFAULT_BRAND };
    applyVars(next);
    persist(next);
    setBrand(next);
  }, [persist]);

  return <Ctx.Provider value={{ brand, update, reset }}>{children}</Ctx.Provider>;
}

/** Brand Kit を読む／更新するフック。BrandProvider 配下でのみ使用可。 */
export function useBrand(): BrandCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBrand は BrandProvider の内側で使ってください");
  return ctx;
}
