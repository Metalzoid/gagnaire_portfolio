"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setThemeCookie, type Theme } from "@/app/actions/theme";

export type { Theme };

export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isTransitioning: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_ATTR = "data-theme";

/** Durée pendant laquelle on masque les overlays sensibles (ex: PageFadeOverlay) */
const THEME_TRANSITION_MS = 450;

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Valeur envoyée par le serveur (cookie) pour éviter tout mismatch d'hydratation */
  initialTheme: Theme;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsTransitioning(true);
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(THEME_ATTR, next);
    }
    setThemeCookie(next);
  }, [theme]);

  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => setIsTransitioning(false), THEME_TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      isDark: theme === "dark",
      isTransitioning,
      toggleTheme,
    }),
    [theme, isTransitioning, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return ctx;
}
