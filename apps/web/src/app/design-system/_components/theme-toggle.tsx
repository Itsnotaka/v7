"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";
import { IconMoon, IconSun } from "@central-icons-react/round-filled-radius-2-stroke-1.5";

export function ThemeToggle() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <IconSun className="size-5" />
      </Button>
    );
  }

  const mode = theme.theme === "system" ? theme.systemTheme : theme.theme;
  const dark = mode === "dark";
  const next = dark ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      onClick={() => theme.setTheme(next)}
    >
      {dark ? <IconSun className="size-5" /> : <IconMoon className="size-5" />}
    </Button>
  );
}
