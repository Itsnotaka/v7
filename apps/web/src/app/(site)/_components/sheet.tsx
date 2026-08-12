"use client";

import type { ReactNode } from "react";

import { Dot, Text, theme } from "@v7/ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Drawer } from "vaul";

import { cn } from "~/utils/cn";

const sheetVariants = cva(cn("fixed z-50 flex flex-col outline-none", theme.hairline), {
  variants: {
    side: {
      bottom:
        "dark scheme-only-dark inset-x-3 bottom-0 h-[calc(100dvh-1.5rem)] border bg-black sm:inset-x-6 sm:h-[92dvh]",
      right: "inset-y-0 right-0 w-full border-l bg-background sm:w-[min(36rem,calc(100vw-3rem))]",
    },
  },
  defaultVariants: {
    side: "bottom",
  },
});

/**
 * The one sheet chrome: vaul drawer with the shared bar (dot label, optional
 * corner, exit) sized to --spacing-bar so it lines up with the site header rows.
 */
export function Sheet(props: {
  side?: VariantProps<typeof sheetVariants>["side"];
  /** Accessible name; visually hidden. */
  title: string;
  /** Dot-prefixed label shown on the bar. */
  label: ReactNode;
  /** Optional element between label and exit (e.g. an index number). */
  corner?: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const side = props.side ?? "bottom";

  return (
    <Drawer.Root direction={side} open={props.open} onOpenChange={props.onOpenChange}>
      {props.trigger ? <Drawer.Trigger asChild>{props.trigger}</Drawer.Trigger> : null}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xl" />
        <Drawer.Content className={sheetVariants({ side })}>
          <Drawer.Title className="sr-only">{props.title}</Drawer.Title>
          <div
            className={cn(
              "min-h-bar shrink-0 items-center border-b px-5 sm:px-6",
              side === "bottom"
                ? "grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 sm:grid-cols-12 sm:gap-4"
                : "flex justify-between",
              theme.hairline,
            )}
          >
            <Text
              as="p"
              variant="meta"
              className={cn(
                "flex min-w-0 items-center gap-2 truncate font-mono text-muted-foreground",
                side === "bottom" && "sm:col-span-4",
              )}
            >
              <Dot />
              <span className="truncate">{props.label}</span>
            </Text>
            {props.corner ? (
              <div className={side === "bottom" ? "sm:col-start-5" : undefined}>{props.corner}</div>
            ) : null}
            <Drawer.Close asChild>
              <button
                type="button"
                className={cn(
                  "relative cursor-pointer justify-self-end font-mono text-sm text-muted-foreground hover:text-primary",
                  side === "bottom" && "sm:col-start-12",
                  theme.ring,
                )}
              >
                EXIT &times;
                <span
                  className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                  aria-hidden="true"
                />
              </button>
            </Drawer.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{props.children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
