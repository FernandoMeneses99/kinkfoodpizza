"use client";

import { useTheme } from "./providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
      title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      aria-label={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
