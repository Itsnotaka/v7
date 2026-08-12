"use client";

import type { ReactElement, ReactNode } from "react";

import { Tooltip as Base } from "@base-ui/react/tooltip";

import { cn } from "../cn";

function TooltipProvider(props: Base.Provider.Props) {
  return <Base.Provider closeDelay={0} delay={500} timeout={300} {...props} />;
}

interface TooltipProps {
  label: ReactNode;
  children: ReactElement;
  side?: Base.Positioner.Props["side"];
  align?: Base.Positioner.Props["align"];
  sideOffset?: number;
  defaultOpen?: boolean;
  delay?: number;
  closeDelay?: number;
  disabled?: boolean;
  className?: string;
}

function Tooltip({
  align = "center",
  children,
  className,
  closeDelay,
  defaultOpen,
  delay,
  disabled,
  label,
  side = "top",
  sideOffset = 6,
}: TooltipProps) {
  return (
    <Base.Root defaultOpen={defaultOpen} disabled={disabled}>
      <Base.Trigger closeDelay={closeDelay} delay={delay} render={children} />
      <Base.Portal>
        <Base.Positioner
          align={align}
          positionMethod="fixed"
          side={side}
          sideOffset={sideOffset}
          className="z-[var(--v7-ui-z-tooltip)]"
        >
          <Base.Popup
            data-slot="ui-tooltip"
            className={cn(
              "pointer-events-none max-w-60 origin-(--transform-origin) rounded-ui-control bg-ui-base px-ui-gutter py-0.75 font-ui-control text-ui-caption text-ui-primary opacity-100 shadow-ui-floating ring-1 ring-ui-edge-muted transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
              className,
            )}
          >
            {label}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

type TooltipAnchor = Base.Positioner.Props["anchor"];

interface AnchoredTooltipProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor: TooltipAnchor;
  children: ReactNode;
  side?: Base.Positioner.Props["side"];
  align?: Base.Positioner.Props["align"];
  sideOffset?: number;
  className?: string;
}

function AnchoredTooltip({
  align = "start",
  anchor,
  children,
  className,
  onOpenChange,
  open,
  side = "bottom",
  sideOffset = 6,
}: AnchoredTooltipProps) {
  return (
    <Base.Root open={open} onOpenChange={(next) => onOpenChange?.(next)}>
      <Base.Portal>
        <Base.Positioner
          align={align}
          anchor={anchor}
          positionMethod="fixed"
          side={side}
          sideOffset={sideOffset}
          className="z-[var(--v7-ui-z-tooltip)]"
        >
          <Base.Popup
            className={cn(
              "pointer-events-none max-w-60 origin-(--transform-origin) rounded-ui-control bg-ui-base px-ui-gutter py-0.75 font-ui-control text-ui-caption text-ui-primary shadow-ui-floating ring-1 ring-ui-edge-muted transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
              className,
            )}
          >
            {children}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

export { AnchoredTooltip, Tooltip, TooltipProvider };
export type { AnchoredTooltipProps, TooltipAnchor, TooltipProps };
