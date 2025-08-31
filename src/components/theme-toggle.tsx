"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Alternar tema"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300 text-black dark:text-foreground" style={{ opacity: 'var(--sun-opacity, 1)' }} />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 text-black dark:text-foreground" style={{ opacity: 'var(--moon-opacity, 0)' }} />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}