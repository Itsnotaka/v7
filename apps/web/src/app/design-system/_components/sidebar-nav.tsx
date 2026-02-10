"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBarsThree,
  IconMagnifyingGlass,
} from "@central-icons-react/round-filled-radius-2-stroke-1.5";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

import { PAGE_NAV, PRIMITIVE_GROUPS } from "~/app/design-system/libs/primitives";
import { Route } from "next";

const ITEM_STYLE =
  "block rounded-lg p-2 text-subtle transition-colors my-[.05rem] cursor-pointer no-underline hover:bg-muted hover:text-default";
const ITEM_ACTIVE = "bg-muted font-semibold text-default";

function active(path: string, href: string) {
  if (href === "/design-system/components") {
    return path === href || path.startsWith("/design-system/components/");
  }

  return path === href;
}

export function SidebarNav() {
  const [open, setOpen] = useState(true);
  const path = usePathname();

  return (
    <>
      <div className={cn("fixed inset-y-0 left-0 z-50 w-12 bg-elevated", "border-r border-line")}>
        <div className="relative h-[49px] border-b border-line">
          <div className="absolute top-2 right-1">
            <Button
              variant="ghost"
              size="icon"
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
            {PAGE_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as Route<"/design-system">}
                  className={cn(ITEM_STYLE, active(path, item.href) && ITEM_ACTIVE)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-4 mb-2 ml-2 text-xs font-medium tracking-wide text-subtle uppercase">
            Primitives
          </p>

          {PRIMITIVE_GROUPS.map((group) => (
            <div key={group.name} className="mt-4 first:mt-0">
              <p className="mb-1 px-2 text-2xs font-medium tracking-wide text-subtle uppercase">
                {group.name}
              </p>

              <ul className="flex flex-col">
                {group.items.map((item) => {
                  const href = `/design-system/components/${item.slug}`;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={href as Route<"/design-system">}
                        className={cn(ITEM_STYLE, path === href && ITEM_ACTIVE)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex-none border-t border-line p-3 text-xs text-subtle">
          v7 Design System
        </div>
      </aside>
    </>
  );
}
