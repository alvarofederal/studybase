"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type ThemeCtx = { theme: Theme; toggle: () => void };

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

/** Lê o localStorage e sincroniza a classe no <html> uma única vez — sem useEffect. */
function initTheme(): Theme {
  if (typeof window === "undefined") return "dark"; // SSR guard
  const saved = localStorage.getItem("sb-theme") as Theme | null;
  // Padrão: escuro; claro só se o aluno escolheu
  const theme: Theme = saved === "light" ? "light" : "dark";
  // Garante que a classe esteja correta (o anti-flash do layout.tsx já faz isso,
  // mas este guard cobre o caso de o script não ter rodado ainda)
  if (theme === "light") {
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
  }
  return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicialização lazy: roda apenas no cliente, sem disparar re-render extra
  const [theme, setTheme] = useState<Theme>(initTheme);

  // Mantém a classe no <html> sempre sincronizada com o estado
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("sb-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
