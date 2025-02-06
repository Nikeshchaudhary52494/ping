"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface ThemeModeToggleProps {
  onNavBar?: boolean;
}

export function ThemeModeToggle({ onNavBar }: ThemeModeToggleProps) {
  const { setTheme, theme } = useTheme();

  return onNavBar ? (
    <Button
      className="rounded-full border w-12 h-12 border-primary/10"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  ) : (
    <div className="mt-4">
      <p className="font-medium">Mode</p>
      <div className="flex gap-2 mt-2">
        <Button
          onClick={() => setTheme("light")}
          variant={theme === "light" ? "default" : "outline"}
        >
          <Sun className="mr-2" /> Light
        </Button>
        <Button
          onClick={() => setTheme("dark")}
          variant={theme === "dark" ? "default" : "outline"}
        >
          <Moon className="mr-2" /> Dark
        </Button>
      </div>
    </div>
  );
}
