"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadDarkPref, saveDarkPref, applyDark } from "@/lib/darkMode";

type ThemeCtx = { dark: boolean; toggle: () => void };
const Ctx = createContext<ThemeCtx>({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const pref = loadDarkPref();
    setDark(pref);
    applyDark(pref);
  }, []);

  function toggle() {
    setDark(prev => {
      const next = !prev;
      saveDarkPref(next);
      applyDark(next);
      return next;
    });
  }

  return <Ctx.Provider value={{ dark, toggle }}>{children}</Ctx.Provider>;
}

export function useDark() {
  return useContext(Ctx);
}
