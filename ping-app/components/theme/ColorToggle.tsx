"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useThemeContext } from "../providers/theme-data-provider";

const availableThemeColors = [
  { name: "Zinc", light: "bg-zinc-900", dark: "bg-zinc-700" },
  { name: "Rose", light: "bg-rose-600", dark: "bg-rose-700" },
  { name: "Blue", light: "bg-blue-600", dark: "bg-blue-700" },
  { name: "Green", light: "bg-green-600", dark: "bg-green-500" },
  { name: "Orange", light: "bg-orange-500", dark: "bg-orange-700" },
  { name: "Yellow", light: "bg-yellow-500", dark: "bg-yellow-400" },
  { name: "Violet", light: "bg-violet-500", dark: "bg-violet-700" },
];

export function ThemeColorToggle() {
  const { themeColor, setThemeColor } = useThemeContext();
  const { theme } = useTheme();

  return (
    <div className="mt-4">
        <p className="font-medium">Color</p>
        <div className="grid grid-cols-3 gap-2 p-4 max-w-lg">
         {availableThemeColors.map(({ name, light, dark }) => (
           <button
           key={name}
           onClick={() => setThemeColor(name as ThemeColors)}
           className={cn(
              "flex items-center justify-center space-x-2 p-2 rounded-lg border transition-all",
              themeColor === name ? "border-primary ring-2 ring-primary" : "border-transparent",
              theme === "light" ? light : dark
          )}
        >
          <div className="text-white text-sm font-medium">{name}</div>
          </button>
      ))}
          </div>
     </div>
  );
}
