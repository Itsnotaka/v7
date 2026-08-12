import type { ComponentProps } from "react";

import { cn } from "../cn";

type KbdSize = "sm" | "md";

interface KbdProps extends ComponentProps<"kbd"> {
  size?: KbdSize;
}

function Kbd({ className, size = "md", ...props }: KbdProps) {
  return (
    <kbd
      data-slot="ui-kbd"
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-ui-control bg-ui-layer-01 px-1 font-ui-mono font-normal leading-none text-ui-muted shadow-ui-ring-muted",
        size === "sm" ? "h-4 min-w-4 text-[10px]" : "h-5 min-w-5 text-ui-caption",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
export type { KbdProps, KbdSize };
