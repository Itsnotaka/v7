import type { ComponentProps } from "react";

import { cn } from "cn";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-base font-medium text-foreground", className)} {...props} />;
}
