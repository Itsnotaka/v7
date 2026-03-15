"use client";

import {
  IconDeskLamp,
  IconEmojiSmiley,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode } from "react";

import type { SiteVariant } from "~/lib/site-variant";

import { useVariant } from "~/lib/variant-context";
import { cn } from "~/utils/cn";

const pill =
  "flex items-center justify-center rounded-xs px-2 py-1 font-light text-xs/[1] tracking-tight backdrop-blur-sm transition-colors duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/30";

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        pill,
        "bg-foreground/5 text-foreground hover:bg-muted dark:bg-foreground dark:text-background",
      )}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <IconDeskLamp size={13} />
    </button>
  );
}

const tabs = [
  { href: "/", key: "H", text: "Home" },
  { href: "/photos", key: "P", text: "Photos" },
  { href: "/design-system", key: "D", text: "Design" },
  { href: "/writing", key: "R", text: "Writing" },
  { href: "/about", key: "A", text: "About" },
] as const;

type Tab = (typeof tabs)[number];

function HeaderLink({
  active,
  tab,
  onClick,
  children,
}: {
  active: boolean;
  tab: Tab;
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
        pill,
        active ? "bg-foreground text-background" : "bg-foreground/5 text-foreground hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}

function VariantToggle(props: { mode: SiteVariant; onSelect: (value: SiteVariant) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {(["human", "machine"] as const).map((item) => {
        const active = props.mode === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => props.onSelect(item)}
            aria-pressed={active}
            className={cn(
              pill,
              active
                ? "bg-foreground text-background"
                : "bg-foreground/5 text-foreground hover:bg-muted",
            )}
          >
            {item === "human" ? "HUMAN" : "MACHINE"}
          </button>
        );
      })}
    </div>
  );
}

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const { variant, select } = useVariant();
  const about = path === "/about" || path.startsWith("/about/");
  const design = path === "/design-system" || path.startsWith("/design-system/");
  const writing = path.startsWith("/writing");
  const photos = path === "/photos" || path.startsWith("/photos/");
  const home = path === "/";

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
      return;
    }

    if (href === "/photos") {
      if (photos) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      router.push("/photos");
    }
  };

  useHotkey("H", () => go("/"));
  useHotkey("P", () => go("/photos"));
  useHotkey("D", () => go("/design-system"));
  useHotkey("R", () => go("/writing"));
  useHotkey("A", () => go("/about"));

  const active = (href: (typeof tabs)[number]["href"]) => {
    if (href === "/") return home;
    if (href === "/design-system") return design;
    if (href === "/writing") return writing;
    if (href === "/photos") return photos;
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
    <header className="sticky top-0 z-50 col-span-full grid grid-cols-subgrid bg-background">
      <nav
        aria-label="Primary"
        className="@container col-span-8 flex items-center justify-between gap-1 py-3"
      >
        <div className="flex items-center gap-0.5">
          <HeaderLink active={home} tab={tabs[0]} onClick={(event) => click(event, tabs[0].href)}>
            <IconEmojiSmiley size={13} />
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
          <VariantToggle mode={variant} onSelect={select} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
