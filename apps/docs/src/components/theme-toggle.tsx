import { useState, useEffect } from "react";
import { IconSun, IconMoon } from "@central-icons-react/round-filled-radius-2-stroke-1.5";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-mode", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex size-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-muted hover:text-default"
        aria-label="Toggle theme"
      >
        <IconSun className="size-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className="flex size-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-muted hover:text-default"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggle}
    >
      {theme === "light" ? <IconMoon className="size-5" /> : <IconSun className="size-5" />}
    </button>
  );
}
