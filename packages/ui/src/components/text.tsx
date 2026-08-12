import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "../cn";

type TextSize = "xs" | "sm" | "base" | "lg" | "xl";
type TextTone = "inherit" | "primary" | "muted" | "faint" | "accent" | "ok" | "warn" | "err";
type TextWeight = "regular" | "semibold";
type TextFamily = "ui" | "mono";
type TextAlign = "start" | "center" | "end";

type TextProps<T extends ElementType = "span"> = Omit<ComponentPropsWithoutRef<T>, "as"> & {
  as?: T;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  family?: TextFamily;
  align?: TextAlign;
  truncate?: boolean;
  tabularNums?: boolean;
};

function Text<T extends ElementType = "span">({
  align,
  as,
  className,
  family = "ui",
  size = "base",
  tabularNums,
  tone = "primary",
  truncate,
  weight = "regular",
  ...props
}: TextProps<T>) {
  const Component = as ?? "span";

  return (
    <Component
      data-slot="ui-text"
      className={cn(
        "font-ui-control",
        family === "mono" && "font-ui-mono tracking-normal",
        size === "xs" && "text-ui-caption",
        size === "sm" && "text-ui-detail",
        size === "base" && "text-ui-body",
        size === "lg" && "text-ui-title",
        size === "xl" && "text-ui-heading",
        tone === "primary" && "text-ui-primary",
        tone === "muted" && "text-ui-muted",
        tone === "faint" && "text-ui-faint",
        tone === "accent" && "text-ui-accent",
        tone === "ok" && "text-ui-ok",
        tone === "warn" && "text-ui-warn",
        tone === "err" && "text-ui-err",
        weight === "regular" ? "font-normal" : "font-semibold",
        align === "start" && "text-start",
        align === "center" && "text-center",
        align === "end" && "text-end",
        truncate && "min-w-0 truncate",
        tabularNums && "tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export { Text };
export type { TextAlign, TextFamily, TextProps, TextSize, TextTone, TextWeight };
