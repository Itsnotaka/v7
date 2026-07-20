import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "./cn";
import { textVariants, type TextVariant } from "./text-variants";

export type { TextVariant } from "./text-variants";

const tags = {
  display: "h1",
  heading: "h2",
  brand: "p",
  nav: "li",
  lead: "p",
  body: "p",
  label: "p",
  meta: "p",
  control: "span",
} as const satisfies Record<TextVariant, ElementType>;

export type TextProps<T extends ElementType = "p"> = {
  as?: T;
  variant?: TextVariant;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Text<T extends ElementType = "p">({
  as,
  className,
  variant = "body",
  ...props
}: TextProps<T>) {
  const Component = (as ?? tags[variant]) as ElementType;

  return (
    <Component
      data-slot="text"
      data-variant={variant}
      className={cn(textVariants[variant], className)}
      {...props}
    />
  );
}
