"use client";

import { useDark } from "./ThemeProvider";
import { LIGHT_BG, DARK_BG } from "@/lib/ui/glass";

export function AuroraBg() {
  const { dark } = useDark();
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{ background: dark ? DARK_BG : LIGHT_BG }}
    />
  );
}
