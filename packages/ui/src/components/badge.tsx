import type { ComponentProps } from "react";

import { cn } from "../cn";

type BadgeTone = "neutral" | "accent" | "ok" | "warn" | "err" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps extends ComponentProps<"span"> {
  tone?: BadgeTone;
  size?: BadgeSize;
}

function Badge({ className, size = "md", tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      data-slot="ui-badge"
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-ui-gap whitespace-nowrap rounded-ui-control font-ui-control font-normal leading-none",
        size === "sm" && "h-4 min-w-4 px-1 text-[10px]",
        size === "md" && "h-5 min-w-5 px-1.5 text-ui-caption",
        tone === "neutral" && "bg-ui-layer-01 text-ui-muted",
        tone === "accent" && "bg-ui-accent text-ui-on-accent",
        tone === "ok" && "bg-ui-ok-tint text-ui-ok",
        tone === "warn" && "bg-ui-warn-tint text-ui-warn",
        tone === "err" && "bg-ui-err-tint text-ui-err",
        tone === "outline" && "bg-ui-base text-ui-primary shadow-ui-ring",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps, BadgeSize, BadgeTone };
