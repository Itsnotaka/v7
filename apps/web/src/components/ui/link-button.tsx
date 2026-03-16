import React from "react";

import { cn } from "~/utils/cn";
import { Loader } from "./loader";

export const NYTE_BUTTON_VARIANTS = {
  shape: {
    base: {
      classes: "",
      description: "Default rectangular button shape",
    },
    square: {
      classes: "items-center justify-center p-0",
      description: "Square button for icon-only actions",
    },
    circle: {
      classes: "items-center justify-center rounded-full p-0",
      description: "Circular button for icon-only actions",
    },
  },
  size: {
    xs: {
      classes: "h-5 gap-1 rounded-sm px-1.5 text-xs",
      description: "Extra small button",
    },
    sm: {
      classes: "h-6.5 gap-1 rounded-md px-2 text-xs",
      description: "Small button",
    },
    base: {
      classes: "h-9 gap-1.5 rounded-lg px-3 text-base",
      description: "Default button size",
    },
    lg: {
      classes: "h-10 gap-2 rounded-lg px-4 text-base",
      description: "Large button",
    },
  },
  compactSize: {
    xs: { classes: "size-3.5" },
    sm: { classes: "size-6.5" },
    base: { classes: "size-9" },
    lg: { classes: "size-10" },
  },
  variant: {
    primary: {
      classes: "bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-60",
      description: "High-emphasis button",
    },
    secondary: {
      classes:
        "bg-background text-foreground ring ring-border hover:bg-muted disabled:text-muted-foreground",
      description: "Default button style",
    },
    ghost: {
      classes: "bg-transparent text-foreground shadow-none hover:bg-muted",
      description: "Minimal button",
    },
    destructive: {
      classes: "bg-destructive text-destructive-foreground hover:opacity-90",
      description: "Danger button",
    },
    outline: {
      classes: "bg-transparent text-foreground ring ring-border hover:bg-muted",
      description: "Bordered button",
    },
  },
} as const;

export const NYTE_BUTTON_DEFAULT_VARIANTS = {
  shape: "base",
  size: "base",
  variant: "secondary",
} as const;

export type NyteButtonShape = keyof typeof NYTE_BUTTON_VARIANTS.shape;
export type NyteButtonSize = keyof typeof NYTE_BUTTON_VARIANTS.size;
export type NyteButtonVariant = keyof typeof NYTE_BUTTON_VARIANTS.variant;

export interface NyteButtonVariantsProps {
  shape?: NyteButtonShape;
  size?: NyteButtonSize;
  variant?: NyteButtonVariant;
}

export function buttonVariants({
  variant = NYTE_BUTTON_DEFAULT_VARIANTS.variant,
  size = NYTE_BUTTON_DEFAULT_VARIANTS.size,
  shape = NYTE_BUTTON_DEFAULT_VARIANTS.shape,
}: NyteButtonVariantsProps = {}) {
  const compact = shape === "square" || shape === "circle";

  return cn(
    "group inline-flex w-max shrink-0 items-center justify-center font-medium select-none shadow-xs transition-colors duration-150 ease-out",
    "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
    NYTE_BUTTON_VARIANTS.variant[variant].classes,
    NYTE_BUTTON_VARIANTS.size[size].classes,
    NYTE_BUTTON_VARIANTS.shape[shape].classes,
    compact && NYTE_BUTTON_VARIANTS.compactSize[size].classes,
  );
}

const renderIcon = (icon?: React.ReactNode) => {
  if (!icon) return null;
  return React.isValidElement(icon) ? icon : <span aria-hidden>{icon}</span>;
};

type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
};

type ButtonWithTextProps = ButtonBaseProps & {
  shape?: "base";
  size?: NyteButtonSize;
  variant?: NyteButtonVariant;
};

type IconOnlyButtonProps = ButtonBaseProps & {
  shape: "square" | "circle";
  size?: NyteButtonSize;
  variant?: NyteButtonVariant;
  "aria-label": string;
};

export type ButtonProps = ButtonWithTextProps | IconOnlyButtonProps;
export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  NyteButtonVariantsProps & {
    children?: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    external?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      loading,
      shape = "base",
      size = "base",
      variant = "secondary",
      icon,
      ...props
    },
    ref,
  ) => {
    const type = props.type ?? "button";

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, shape }),
          "outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className,
        )}
        disabled={loading || disabled}
        type={type}
        {...props}
      >
        {loading ? <Loader size={size === "lg" ? 16 : 14} /> : renderIcon(icon)}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      children,
      className,
      external,
      href,
      shape = "base",
      size = "base",
      variant = "ghost",
      icon,
      ...props
    },
    ref,
  ) => {
    const rel = external ? "noopener noreferrer" : props.rel;
    const target = external ? "_blank" : props.target;

    return (
      <a
        ref={ref}
        className={cn(buttonVariants({ variant, size, shape }), "no-underline", className)}
        href={href}
        rel={rel}
        target={target}
        {...props}
      >
        {renderIcon(icon)}
        {children}
      </a>
    );
  },
);

LinkButton.displayName = "LinkButton";
