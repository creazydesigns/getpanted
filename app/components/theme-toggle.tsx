"use client";

import { useTheme } from "../context/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={toggleTheme}
      className="relative flex h-7 w-12 shrink-0 items-center rounded-full border border-[rgb(var(--gp-fg-rgb)/0.2)] bg-[rgb(var(--gp-ink-rgb)/0.25)] px-0.5 transition-colors hover:border-[var(--gp-accent)]"
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-[var(--gp-accent)] shadow transition-transform duration-200 ${
          isLight ? "translate-x-5" : "translate-x-0"
        }`}
      />
      <span className="sr-only">{isLight ? "Light" : "Dark"} theme</span>
    </button>
  );
}
