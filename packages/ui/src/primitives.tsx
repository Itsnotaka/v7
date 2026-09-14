import type { ComponentProps, ElementType } from "react";

import { cn } from "cn";

import { Text, type TextProps } from "./text";

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
