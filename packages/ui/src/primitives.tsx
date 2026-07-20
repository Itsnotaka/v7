import type { ComponentProps, ElementType } from "react";

import { cn } from "./cn";
import { Text, type TextProps } from "./text";

/** Index-dot bullet. Sized by --spacing-dot; recolor via className (e.g. bg-primary/45). */
export function Dot({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="dot"
      className={cn("size-dot shrink-0 rounded-full bg-primary", className)}
      {...props}
    />
  );
}

/** Section eyebrow: lowercase, muted. Pass lowercase copy. */
export function Label<T extends ElementType = "p">({
  className,
  ...props
}: Omit<TextProps<T>, "variant">) {
  return (
    <Text
      {...(props as TextProps<T>)}
      variant="label"
      className={cn("normal-case text-muted-foreground", className)}
    />
  );
}
