"use client";

import { useTheme } from "@/components/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  compact?: boolean; // só ícone, sem label
}

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-label="Alternar tema"
      className={`flex items-center gap-2 transition-colors ${className}`}
    >
      <span className="text-base leading-none select-none">
        {isDark ? "☀️" : "🌙"}
      </span>
      {!compact && (
        <span className="text-xs">
          {isDark ? "Claro" : "Escuro"}
        </span>
      )}
    </button>
  );
}
