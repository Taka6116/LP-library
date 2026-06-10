// Shared SaaS surface tokens — aurora gradient backgrounds + glass surface.

// 鮮やかな violet / fuchsia / indigo を主役にしたオーロラ背景。
export const LIGHT_BG = `
  radial-gradient(at 14% 14%, rgba(167,139,250,0.62) 0px, transparent 50%),
  radial-gradient(at 86% 6%, rgba(244,114,182,0.48) 0px, transparent 46%),
  radial-gradient(at 78% 70%, rgba(129,140,248,0.52) 0px, transparent 52%),
  radial-gradient(at 16% 86%, rgba(232,121,249,0.44) 0px, transparent 48%),
  radial-gradient(at 96% 96%, rgba(125,211,252,0.34) 0px, transparent 42%),
  #f5f3ff`;

export const DARK_BG = `
  radial-gradient(at 14% 14%, rgba(139,92,246,0.30) 0px, transparent 50%),
  radial-gradient(at 86% 6%, rgba(217,70,239,0.22) 0px, transparent 46%),
  radial-gradient(at 78% 70%, rgba(99,102,241,0.26) 0px, transparent 52%),
  radial-gradient(at 16% 86%, rgba(236,72,153,0.18) 0px, transparent 48%),
  #08070d`;

export const glass =
  "border border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(76,29,149,0.18)] " +
  "dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]";
