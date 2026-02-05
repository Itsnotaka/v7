import { useState, useEffect } from "react";
import { IconChevronBottom, IconMagnifyingGlass } from "@central-icons-react/round-filled-radius-2-stroke-1.5";
import { cn } from "../lib/utils";
import { MenuIcon } from "./menu-icon";

interface NavItem {
  label: string;
  href: string;
}

const staticPages: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "Getting Started", href: "/getting-started" },
  { label: "Colors", href: "/colors" },
  { label: "Typography", href: "/typography" },
];

const componentItems: NavItem[] = [
  { label: "Button", href: "/components/button" },
  { label: "Input", href: "/components/input" },
  { label: "Card", href: "/components/card" },
  { label: "Badge", href: "/components/badge" },
];

const LI_STYLE =
  "block rounded-md text-subtle hover:text-default hover:bg-muted px-2 py-1.5 my-px cursor-pointer transition-colors no-underline text-xs";
const LI_ACTIVE_STYLE = "font-medium text-default bg-muted";

interface SidebarNavProps {
  currentPath: string;
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
  const [open, setOpen] = useState(true);
  const [componentsOpen, setComponentsOpen] = useState(true);

  useEffect(() => {
    const sidebar = document.querySelector("aside[data-sidebar-open]");
    if (sidebar) {
      sidebar.setAttribute("data-sidebar-open", String(open));
    }
  }, [open]);

  return (
    <>
      {/* Left rail */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-12 bg-background",
          "border-r border-line"
        )}
      >
        <div className="relative h-12 border-b border-line">
          <div className="absolute right-1 top-1.5">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-md text-subtle transition-colors hover:bg-muted hover:text-default"
              aria-label="Toggle sidebar"
              aria-pressed={open}
              onClick={() => setOpen(!open)}
            >
              <MenuIcon open={!open} />
            </button>
          </div>
        </div>
      </div>

      {/* Brand label when closed */}
      <div
        className={cn(
          "pointer-events-none fixed left-12 top-0 z-50 flex h-12 items-center px-4 transition-opacity duration-300 select-none",
          open ? "opacity-0" : "opacity-100"
        )}
      >
        <span className="text-xs font-medium">v7</span>
      </div>

      {/* Sliding panel */}
      <aside
        data-sidebar-open={open}
        className={cn(
          "fixed inset-y-0 left-12 z-40 flex w-64 flex-col bg-background",
          "transition-transform duration-300 will-change-transform",
          open ? "translate-x-0 border-r border-line" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-12 flex-none items-center gap-2 px-3",
            "border-b border-line"
          )}
        >
          <span className="shrink-0 text-xs font-medium">v7</span>
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-1.5 rounded border border-line bg-muted/50 px-2 py-1 text-subtle transition-colors hover:bg-muted"
          >
            <IconMagnifyingGlass className="size-3 shrink-0" />
            <span className="flex-1 truncate text-left text-xs">Search...</span>
            <kbd className="hidden shrink-0 rounded border border-line bg-background px-1 py-0.5 text-[10px] text-subtle sm:inline-flex">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Nav content */}
        <div className="min-h-0 grow overflow-y-auto overscroll-contain px-3 py-3 text-xs">
          <ul className="flex flex-col">
            {staticPages.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    LI_STYLE,
                    currentPath === item.href && LI_ACTIVE_STYLE
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Components section */}
          <button
            type="button"
            className="mb-1 ml-2 mt-4 flex w-full cursor-pointer items-center justify-between text-[10px] font-medium uppercase tracking-wide text-subtle transition-colors select-none hover:text-default"
            onClick={() => setComponentsOpen(!componentsOpen)}
          >
            <span>Components</span>
            <IconChevronBottom
              className={cn(
                "size-3 transition-transform duration-200",
                componentsOpen && "rotate-180"
              )}
            />
          </button>
          <ul
            className={cn(
              "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
              componentsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {componentItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    LI_STYLE,
                    currentPath === item.href && LI_ACTIVE_STYLE
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex-none border-t border-line px-3 py-2.5 text-[10px] text-subtle">
          v7 Design System
        </div>
      </aside>
    </>
  );
}
