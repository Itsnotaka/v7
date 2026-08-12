"use client";

import type { ComponentProps, ReactNode } from "react";

import { IconCrossSmall } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";

import { cn } from "../cn";
import { Button, IconButton, type ButtonProps } from "./button";
import { Icon } from "./icon";

type PillTone = "control" | "muted" | "surface" | "neutral" | "ok" | "warn" | "err";
type PillSize = "inline" | "sm" | "md";
type PillButtonDensity = "default" | "notification";

interface PillProps extends Omit<ComponentProps<"span">, "children"> {
  tone?: PillTone;
  size?: PillSize;
  isMono?: boolean;
  hasRing?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  isRemoveDisabled?: boolean;
}

function Pill({
  children,
  className,
  hasRing,
  icon,
  isMono,
  isRemoveDisabled,
  onRemove,
  removeLabel,
  size = "sm",
  tone = "control",
  ...props
}: PillProps) {
  return (
    <span
      {...props}
      data-slot="ui-pill"
      className={cn(
        "inline-flex min-w-0 shrink-0 items-center gap-ui-gap whitespace-nowrap rounded-ui-pill",
        size === "inline" && "px-1.25 py-0.25",
        size === "sm" && "h-5.5 px-ui-gutter",
        size === "md" && "h-ui-control-sm px-ui-gutter text-ui-detail",
        tone === "control" && "bg-ui-control",
        tone === "muted" && "bg-ui-layer-02 text-ui-muted",
        (tone === "surface" || tone === "neutral") && "bg-ui-layer-01 text-ui-muted",
        tone === "ok" && "bg-ui-ok-tint text-ui-ok",
        tone === "warn" && "bg-ui-warn-tint text-ui-warn",
        tone === "err" && "bg-ui-err-tint text-ui-err",
        isMono && "font-ui-mono",
        hasRing && "shadow-ui-ring-muted",
        onRemove !== undefined && "pe-0",
        className,
      )}
    >
      {icon === undefined ? null : <span aria-hidden>{icon}</span>}
      <span className="min-w-0 truncate">{children}</span>
      {onRemove === undefined ? null : (
        <IconButton
          aria-label={`Remove ${removeLabel ?? "item"}`}
          disabled={isRemoveDisabled}
          size="sm"
          onClick={onRemove}
        >
          <Icon icon={IconCrossSmall} size="sm" />
        </IconButton>
      )}
    </span>
  );
}

type PillButtonProps = Omit<ButtonProps, "size" | "variant"> & { density?: PillButtonDensity };

function PillButton({ className, density = "default", ...props }: PillButtonProps) {
  return (
    <Button
      {...props}
      size="md"
      variant="quiet"
      className={cn(
        "rounded-ui-pill px-ui-pad-sm text-ui-detail",
        density === "notification" &&
          "h-auto min-w-0 shrink overflow-hidden py-1.25 shadow-ui-ring-muted",
        className,
      )}
    />
  );
}

export { Pill, PillButton };
export type { PillButtonDensity, PillButtonProps, PillProps, PillSize, PillTone };
