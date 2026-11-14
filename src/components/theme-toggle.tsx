"use client";

import { useEffect, useRef, useState } from "react";
import { DockIcon } from "./dock-icon";
import { themeStorageKey } from "@/lib/theme";

type Theme = "light" | "dark";
// BlogShell remounts between routes. Keep an explicit choice for this browsing
// session even when localStorage is unavailable.
let chosenInSession = false;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const chosen = useRef(chosenInSession);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function apply(next: Theme) {
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    }
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
    try {
      const stored = localStorage.getItem(themeStorageKey);
      chosen.current =
        chosenInSession || stored === "light" || stored === "dark";
    } catch {
      // Storage is optional; the switch still works for this page session.
    }
    function onSystemChange() {
      if (!chosen.current) apply(media.matches ? "dark" : "light");
    }
    function onStorage(event: StorageEvent) {
      if (event.key !== themeStorageKey && event.key !== null) return;
      const value = event.key === null ? null : event.newValue;
      chosen.current = value === "light" || value === "dark";
      chosenInSession = chosen.current;
      apply(
        value === "light" || value === "dark"
          ? value
          : media.matches
            ? "dark"
            : "light",
      );
    }
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggle() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    chosen.current = true;
    chosenInSession = true;
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    setTheme(next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // A denied storage write must not prevent changing the visible theme.
    }
  }

  const label = theme === "dark" ? "切换为浅色主题" : "切换为深色主题";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
    >
      <DockIcon name={theme === "dark" ? "sun" : "moon"} />
      <span className="dock-label" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
