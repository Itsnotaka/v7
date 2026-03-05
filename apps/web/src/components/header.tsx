"use client";

import {
  IconEmojiAstonished,
  IconEmojiLol,
  IconEmojiMouthless,
  IconEmojiProfile,
  IconEmojiSmiley,
  IconEmojiSmirking,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode, useEffect, useState } from "react";

import { cn } from "~/utils/cn";

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
  { href: "/work", key: "W", text: "Work" },
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
        "flex items-center justify-center rounded-[2px] px-2 py-[5px] font-light text-xs/[1] tracking-[-0.012em] backdrop-blur-[10px] transition-colors duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/30",
        icon && "px-[7px]",
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
  const work = path.startsWith("/work");
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

    if (href === "/work") {
      if (path.startsWith("/work")) return;
      router.push("/work");
      return;
    }

    if (href === "/about") {
      if (about) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      router.push("/about");
    }
  };

  useHotkey("H", () => go("/"));
  useHotkey("W", () => go("/work"));
  useHotkey("A", () => go("/about"));

  const active = (href: (typeof tabs)[number]["href"]) => {
    if (href === "/") return home;
    if (href === "/work") return work;
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
    <header className="sticky top-0 z-20 col-span-full grid grid-cols-subgrid">
      <nav
        aria-label="Primary"
        className="@container col-span-8 flex items-center justify-between gap-[3px] py-3"
      >
        <div className="flex items-center gap-[2px]">
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
                  <span className="hidden @min-[960px]:inline">[{formatForDisplay(tab.key)}]</span>
                  <span>{tab.text}</span>
                </span>
              </HeaderLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
