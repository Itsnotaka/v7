import type { ComponentProps } from "react";

import { cn } from "../cn";

type SpinnerSize = "sm" | "md" | "lg";
type SpinnerTone = "accent" | "muted";

interface SpinnerProps extends Omit<ComponentProps<"span">, "children"> {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  label?: string;
}

function Spinner({ className, label, size = "md", tone = "accent", ...props }: SpinnerProps) {
  const a11y =
    label === undefined ? { "aria-hidden": true } : { "aria-label": label, role: "status" };

  return (
    <span
      {...a11y}
      {...props}
      data-slot="ui-spinner"
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
    >
      <span
        className={cn(
          "block animate-spin rounded-ui-pill border-2 border-ui-edge-muted motion-reduce:animate-none",
          size === "sm" && "size-3.5",
          size === "md" && "size-4",
          size === "lg" && "size-4.5",
          tone === "accent" ? "border-t-ui-accent" : "border-t-ui-muted",
        )}
      />
    </span>
  );
}

export { Spinner };
export type { SpinnerProps, SpinnerSize, SpinnerTone };
