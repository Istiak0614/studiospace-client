"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle light and dark theme"
      className="rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-5 transition-transform duration-500 dark:hidden" />
      <Moon className="hidden size-5 transition-transform duration-500 dark:block" />
    </Button>
  );
}