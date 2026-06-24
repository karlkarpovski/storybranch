// src/hooks/useTheme.ts
import { useEffect } from "react";
import { useStore } from "@/store";

export function useTheme() {
  // ✅ Select primitives individually, never return a new object from a selector
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return { theme, setTheme };
}