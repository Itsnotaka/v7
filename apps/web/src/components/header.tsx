"use client";

import {
  IconDeskLamp,
  IconEmojiAstonished,
  IconEmojiLol,
  IconEmojiMouthless,
  IconEmojiProfile,
  IconEmojiSmiley,
  IconEmojiSmirking,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode, useEffect, useState } from "react";

import { cn } from "~/utils/cn";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="flex items-center justify-center rounded-xs px-2 py-1 font-light text-xs/[1] tracking-tight backdrop-blur-sm bg-foreground/5 text-foreground opacity-50"
        aria-label="Toggle theme"
      >
        <IconDeskLamp size={13} />
      </button>
    );
  }

  const dark = theme === "dark";

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center justify-center rounded-xs px-2 py-1 font-light text-xs/[1] tracking-tight backdrop-blur-sm transition-colors duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/30",
        dark ? "bg-foreground text-background" : "bg-foreground/5 text-foreground hover:bg-muted",
      )}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <IconDeskLamp size={13} />
    </button>
  );
}

const faces = [
  IconEmojiLol,
  IconEmojiMouthless,
  IconEmojiSmiley,
  IconEmojiSmirking,
  IconEmojiProfile,
  IconEmojiAstonished,
] as const;

const tabs = [
  { href: "/", key: "H", text: "Home" },
  { href: "/design-system", key: "D", text: "Design" },
  { href: "/writing", key: "R", text: "Writing" },
  { href: "/about", key: "A", text: "About" },
] as const;

type Tab = (typeof tabs)[number];

function HeaderLink({
  active,
  tab,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  tab: Tab;
  icon?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={tab.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-keyshortcuts={tab.key}
      aria-label={`${tab.text} (${formatForDisplay(tab.key)})`}
      title={`${tab.text} (${formatForDisplay(tab.key)})`}
      className={cn(
        "flex items-center justify-center rounded-xs px-2 py-1 font-light text-xs/[1] tracking-tight backdrop-blur-sm transition-colors duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/30",
        icon && "px-2",
        active ? "bg-foreground text-background" : "bg-foreground/5 text-foreground hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const about = path === "/about" || path.startsWith("/about/");
  const design = path === "/design-system" || path.startsWith("/design-system/");
  const writing = path.startsWith("/writing");
  const home = path === "/";
  const [face, setFace] = useState(0);
  const Face = faces[face]!;
  useEffect(() => setFace(Math.floor(Math.random() * faces.length)), []);

  const go = (href: (typeof tabs)[number]["href"]) => {
    if (href === "/") {
      if (path === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      router.push("/");
      return;
    }

    if (href === "/about") {
      if (about) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      router.push("/about");
      return;
    }

    if (href === "/design-system") {
      if (design) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      router.push("/design-system");
      return;
    }

    if (href === "/writing") {
      if (path.startsWith("/writing")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      router.push("/writing");
    }
  };

  useHotkey("H", () => go("/"));
  useHotkey("D", () => go("/design-system"));
  useHotkey("R", () => go("/writing"));
  useHotkey("A", () => go("/about"));

  const active = (href: (typeof tabs)[number]["href"]) => {
    if (href === "/") return home;
    if (href === "/design-system") return design;
    if (href === "/writing") return writing;
    return about;
  };

  const click = (event: MouseEvent<HTMLAnchorElement>, href: (typeof tabs)[number]["href"]) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    go(href);
  };

  return (
    <header className="sticky top-0 z-50 col-span-full grid grid-cols-subgrid">
      <nav
        aria-label="Primary"
        className="@container col-span-8 flex items-center justify-between gap-1 py-3"
      >
        <div className="flex items-center gap-0.5">
          <HeaderLink
            active={home}
            tab={tabs[0]}
            onClick={(event) => click(event, tabs[0].href)}
            icon
          >
            <Face size={13} />
          </HeaderLink>

          {tabs.slice(1).map((tab) => {
            const on = active(tab.href);

            return (
              <HeaderLink
                key={tab.text}
                active={on}
                tab={tab}
                onClick={(event) => click(event, tab.href)}
              >
                <span className="flex items-center gap-1">
                  <span className="hidden desktop:inline">[{formatForDisplay(tab.key)}]</span>
                  <span>{tab.text}</span>
                </span>
              </HeaderLink>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
