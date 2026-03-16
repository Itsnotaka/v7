import React, { forwardRef, type ComponentPropsWithoutRef, type ElementType } from "react";

import { cn } from "~/utils/cn";

export const NYTE_TEXT_VARIANTS = {
  variant: {
    heading1: {
      classes: "text-3xl font-semibold text-foreground",
      description: "Large heading for page titles",
    },
    heading2: {
      classes: "text-2xl font-semibold text-foreground",
      description: "Section heading",
    },
    heading3: {
      classes: "text-lg font-semibold text-foreground",
      description: "Subsection heading",
    },
    body: {
      classes: "text-foreground",
      description: "Default body copy",
    },
    secondary: {
      classes: "text-muted-foreground",
      description: "Muted supporting copy",
    },
    success: {
      classes: "text-primary",
      description: "Positive emphasis text",
    },
    error: {
      classes: "text-destructive",
      description: "Error or danger text",
    },
    mono: {
      classes: "font-mono text-foreground",
      description: "Monospace text",
    },
    "mono-secondary": {
      classes: "font-mono text-muted-foreground",
      description: "Muted monospace text",
    },
  },
  size: {
    xs: {
      classes: "text-xs",
      description: "Extra small text",
    },
    sm: {
      classes: "text-sm",
      description: "Small text",
    },
    base: {
      classes: "text-base",
      description: "Default text size",
    },
    lg: {
      classes: "text-lg",
      description: "Large text",
    },
  },
} as const;

export const NYTE_TEXT_DEFAULT_VARIANTS = {
  variant: "body",
  size: "base",
} as const;

export type NyteTextVariant = keyof typeof NYTE_TEXT_VARIANTS.variant;
export type NyteTextSize = keyof typeof NYTE_TEXT_VARIANTS.size;

export interface NyteTextVariantsProps {
  variant?: NyteTextVariant;
  size?: NyteTextSize;
}

export function textVariants({
  variant = NYTE_TEXT_DEFAULT_VARIANTS.variant,
  size = NYTE_TEXT_DEFAULT_VARIANTS.size,
}: NyteTextVariantsProps = {}) {
  return cn(NYTE_TEXT_VARIANTS.variant[variant].classes, NYTE_TEXT_VARIANTS.size[size].classes);
}

export type TextProps = ComponentPropsWithoutRef<"p"> & {
  as?: ElementType;
  className?: string;
  variant?: NyteTextVariant;
  size?: NyteTextSize;
  bold?: boolean;
};

function defaultTag(variant: NyteTextVariant) {
  if (variant === "heading1") return "h1";
  if (variant === "heading2") return "h2";
  if (variant === "heading3") return "h3";
  if (variant === "mono" || variant === "mono-secondary") return "span";
  return "p";
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as,
    className,
    variant = NYTE_TEXT_DEFAULT_VARIANTS.variant,
    size = NYTE_TEXT_DEFAULT_VARIANTS.size,
    bold = false,
    ...props
  },
  ref,
) {
  const Component = (as ?? defaultTag(variant)) as ElementType;
  const isCopy = ["body", "secondary", "success", "error"].includes(variant);
  const isMono = variant === "mono" || variant === "mono-secondary";
  const monoSize =
    size === "lg" ? NYTE_TEXT_VARIANTS.size.base.classes : NYTE_TEXT_VARIANTS.size.sm.classes;

  return (
    <Component
      ref={ref}
      className={cn(
        NYTE_TEXT_VARIANTS.variant[variant].classes,
        isCopy ? NYTE_TEXT_VARIANTS.size[size].classes : "",
        isCopy && bold ? "font-medium" : "",
        isMono ? monoSize : "",
        className,
      )}
      {...props}
    />
  );
});
