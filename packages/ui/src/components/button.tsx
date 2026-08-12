"use client";

import type { ReactNode } from "react";

import { Button as Base } from "@base-ui/react/button";

import { cn } from "../cn";

type ButtonVariant = "primary" | "neutral" | "quiet" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<Base.Props, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  block?: boolean;
  className?: string;
}

function Button({
  block = false,
  children,
  className,
  iconEnd,
  iconStart,
  render,
  size = "md",
  type,
  variant = "neutral",
  ...props
}: ButtonProps) {
  return (
    <Base
      {...props}
      data-slot="ui-button"
      render={render}
      type={type ?? (render ? undefined : "button")}
      className={cn(
        "relative isolate inline-flex max-w-full shrink-0 appearance-none items-center justify-center gap-ui-gap whitespace-nowrap rounded-ui-control border-0 font-ui-control font-semibold leading-none no-underline select-none outline-ui-accent transition-[background-color,box-shadow,color,opacity] duration-ui-hover ease-ui-out focus-visible:outline-1 focus-visible:outline-offset-2 disabled:opacity-40 motion-reduce:transition-none",
        size === "sm" && "h-ui-control-sm px-ui-pad-sm text-ui-detail",
        size === "md" && "h-ui-control-md px-ui-pad-md text-ui-body",
        size === "lg" && "h-ui-control-lg px-ui-pad-lg text-ui-body",
        variant === "primary" &&
          "bg-ui-accent text-ui-on-accent shadow-ui-raised hover:bg-[color-mix(in_srgb,var(--v7-ui-color-accent-fill),var(--v7-ui-color-state-hover))] active:brightness-95 disabled:shadow-none",
        variant === "neutral" &&
          "bg-ui-base text-ui-primary shadow-ui-ring hover:bg-ui-state-hover active:bg-ui-state-press disabled:shadow-none",
        variant === "quiet" &&
          "bg-transparent text-ui-muted shadow-none hover:bg-ui-state-hover hover:text-ui-primary active:bg-ui-state-press",
        variant === "destructive" &&
          "bg-ui-err-tint text-ui-err shadow-ui-ring hover:bg-ui-state-hover active:bg-ui-state-press disabled:shadow-none",
        block && "w-full",
        className,
      )}
    >
      {iconStart}
      {children}
      {iconEnd}
    </Base>
  );
}

interface IconButtonProps extends Omit<ButtonProps, "block" | "iconEnd" | "iconStart"> {
  "aria-label": string;
}

function IconButton({ className, size = "md", variant = "quiet", ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      size={size}
      variant={variant}
      data-slot="ui-icon-button"
      className={cn(
        "p-0",
        size === "sm" && "size-ui-control-sm",
        size === "md" && "size-ui-control-md",
        size === "lg" && "size-ui-control-lg",
        className,
      )}
    />
  );
}

export { Button, IconButton };
export type { ButtonProps, ButtonSize, ButtonVariant, IconButtonProps };
