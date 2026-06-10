"use client";

import { useDark } from "./ThemeProvider";
import { LIGHT_BG, DARK_BG } from "@/lib/ui/glass";

/**
 * 鮮やかなオーロラ背景。ベースの放射グラデ + ゆっくり漂う発光ブロブ層。
 * prefers-reduced-motion 時はアニメを止める（globals.css 側で制御）。
 */
export function AuroraBg() {
  const { dark } = useDark();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: dark ? DARK_BG : LIGHT_BG }} />
      {/* ドリフトする発光ブロブ */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
    </div>
  );
}
