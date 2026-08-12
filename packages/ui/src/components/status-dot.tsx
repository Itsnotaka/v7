import type { ComponentProps } from "react";

import { cn } from "../cn";

type StatusDotTone = "ok" | "warn" | "err" | "info" | "accent" | "neutral" | "draft";

interface StatusDotProps extends Omit<ComponentProps<"span">, "children"> {
  tone?: StatusDotTone;
  pulse?: boolean;
  label?: string;
}

function StatusDot({
  className,
  label,
  pulse = false,
  tone = "neutral",
  ...props
}: StatusDotProps) {
  const a11y =
    label === undefined ? { "aria-hidden": true } : { "aria-label": label, role: "status" };

  return (
    <span
      {...a11y}
      {...props}
      data-slot="ui-status-dot"
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
    >
      <span
        className={cn(
          "size-1.5 rounded-ui-pill",
          tone === "ok" && "bg-ui-ok",
          tone === "warn" && "bg-ui-warn",
          tone === "err" && "bg-ui-err",
          tone === "info" && "bg-ui-info",
          tone === "accent" && "bg-ui-accent",
          tone === "neutral" && "bg-ui-faint",
          tone === "draft" &&
            "bg-transparent shadow-[inset_0_0_0_1px_var(--v7-ui-color-text-faint)]",
          pulse && "animate-pulse motion-reduce:animate-none",
        )}
      />
    </span>
  );
}

export { StatusDot };
export type { StatusDotProps, StatusDotTone };
