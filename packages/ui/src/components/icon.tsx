import type { CentralIconBaseProps } from "@central-icons-react/round-outlined-radius-2-stroke-1.5/CentralIconBase";
import type { ComponentType } from "react";

import { cn } from "../cn";

type Glyph = ComponentType<CentralIconBaseProps>;
type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
type IconTone = "current" | "muted" | "faint" | "accent" | "ok" | "warn" | "err" | "info";

interface IconProps {
  icon: Glyph;
  size?: IconSize;
  tone?: IconTone;
  label?: string;
  className?: string;
}

function Icon({ icon: Glyph, size = "md", tone = "current", label, className }: IconProps) {
  const decorative = label === undefined;

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={label}
      data-slot="ui-icon"
      role={decorative ? undefined : "img"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center leading-none",
        size === "xs" && "text-[length:var(--v7-ui-icon-size-xs)]",
        size === "sm" && "text-[length:var(--v7-ui-icon-size-sm)]",
        size === "md" && "text-[length:var(--v7-ui-icon-size-md)]",
        size === "lg" && "text-[length:var(--v7-ui-icon-size-lg)]",
        size === "xl" && "text-[length:var(--v7-ui-icon-size-xl)]",
        tone === "muted" && "text-ui-muted",
        tone === "faint" && "text-ui-faint",
        tone === "accent" && "text-ui-accent",
        tone === "ok" && "text-ui-ok",
        tone === "warn" && "text-ui-warn",
        tone === "err" && "text-ui-err",
        tone === "info" && "text-ui-info",
        className,
      )}
    >
      <Glyph mode="raw" size="1em" />
    </span>
  );
}

export { Icon };
export type { Glyph, IconProps, IconSize, IconTone };
