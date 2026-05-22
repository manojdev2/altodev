"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useEffectEvent } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  const initializeTheme = useEffectEvent(() => {
    const stored = localStorage.getItem("admin_theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
    setMounted(true);
  });

  useEffect(() => {
    initializeTheme();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    localStorage.setItem("admin_theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  if (!mounted) {
    return <div className="min-h-screen bg-[#101828]" />;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
