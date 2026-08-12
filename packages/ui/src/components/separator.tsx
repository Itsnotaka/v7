"use client";

import { Separator as Base } from "@base-ui/react/separator";

import { cn } from "../cn";

type SeparatorTone = "muted" | "base";

interface SeparatorProps extends Omit<Base.Props, "className"> {
  tone?: SeparatorTone;
  className?: string;
}

function Separator({
  className,
  orientation = "horizontal",
  tone = "muted",
  ...props
}: SeparatorProps) {
  return (
    <Base
      {...props}
      data-slot="ui-separator"
      orientation={orientation}
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-auto w-px self-stretch",
        tone === "muted" ? "bg-ui-edge-muted" : "bg-ui-edge",
        className,
      )}
    />
  );
}

export { Separator };
export type { SeparatorProps, SeparatorTone };
