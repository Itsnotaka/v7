"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBarsThree,
  IconChevronBottom,
  IconMagnifyingGlass,
} from "@central-icons-react/round-filled-radius-2-stroke-1.5";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const PAGES: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Getting Started", href: "/getting-started" },
  { label: "Colors", href: "/colors" },
  { label: "Typography", href: "/typography" },
];

const ITEMS: NavItem[] = [
  { label: "Button", href: "/components/button" },
  { label: "Input", href: "/components/input" },
  { label: "Card", href: "/components/card" },
  { label: "Badge", href: "/components/badge" },
];

const ITEM_STYLE =
  "block rounded-lg text-subtle hover:text-default hover:bg-muted p-2 my-[.05rem] cursor-pointer transition-colors no-underline";
const ITEM_ACTIVE = "font-semibold text-default bg-muted";

export function SidebarNav() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const path = usePathname();

  return (
    <>
      <div className={cn("fixed inset-y-0 left-0 z-50 w-12 bg-elevated", "border-r border-line")}>
        <div className="relative h-[49px] border-b border-line">
          <div className="absolute top-2 right-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              aria-label="Toggle sidebar"
              aria-pressed={open}
              onClick={() => setOpen(!open)}
            >
              <IconBarsThree className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none fixed top-0 left-12 z-50 flex h-[49px] items-center px-4 font-medium transition-opacity duration-300 select-none",
          open ? "opacity-0" : "opacity-100",
        )}
      >
        <h1 className="flex gap-2 text-base">
          <span>v7</span>
        </h1>
      </div>

      <aside
        data-sidebar-open={open}
        className={cn(
          "fixed inset-y-0 left-12 z-40 flex w-64 flex-col bg-elevated backdrop-blur-sm",
          "transition-transform duration-300 will-change-transform",
          open ? "translate-x-0 border-r border-line" : "-translate-x-full",
        )}
      >
        <div
          className={cn("flex h-[49px] flex-none items-center gap-3 px-3", "border-b border-line")}
        >
          <h1 className="shrink-0 text-base font-medium">v7</h1>
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-muted/50 px-2 py-1 text-sm text-subtle transition-colors hover:bg-muted"
          >
            <IconMagnifyingGlass className="size-3 shrink-0" />
            <span className="flex-1 truncate text-left text-xs">Search...</span>
            <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-line bg-background px-1 py-0.5 text-[10px] sm:inline-flex">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="min-h-0 grow overflow-y-auto overscroll-contain p-4 text-sm text-subtle">
          <ul className="flex flex-col">
            {PAGES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(ITEM_STYLE, path === item.href && ITEM_ACTIVE)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-4 mb-2 ml-2 flex w-full items-center justify-between text-xs font-medium uppercase tracking-wide text-subtle transition-colors select-none hover:text-default"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <span>Components</span>
            <IconChevronBottom
              className={cn("size-3 transition-transform duration-200", expanded && "rotate-180")}
            />
          </button>

          <ul
            className={cn(
              "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
              expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            {ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(ITEM_STYLE, path === item.href && ITEM_ACTIVE)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-none border-t border-line p-3 text-xs text-subtle">
          v7 Design System
        </div>
      </aside>
    </>
  );
}
