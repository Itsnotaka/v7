"use client";

import { PreviewCard as Base } from "@base-ui/react/preview-card";

import { cn } from "../cn";

type PreviewCardTriggerProps = Base.Trigger.Props;

function PreviewCardTrigger({ className, delay = 400, ...props }: PreviewCardTriggerProps) {
  return (
    <Base.Trigger
      {...props}
      data-slot="ui-preview-card-trigger"
      delay={delay}
      className={className}
    />
  );
}

interface PreviewCardPopupProps extends Omit<Base.Popup.Props, "className"> {
  side?: Base.Positioner.Props["side"];
  sideOffset?: number;
  align?: Base.Positioner.Props["align"];
  anchor?: Base.Positioner.Props["anchor"];
  collisionAvoidance?: Base.Positioner.Props["collisionAvoidance"];
  collisionPadding?: Base.Positioner.Props["collisionPadding"];
  className?: string;
}

function PreviewCardPopup({
  align = "start",
  anchor,
  children,
  className,
  collisionAvoidance,
  collisionPadding,
  side = "inline-end",
  sideOffset = 8,
  ...props
}: PreviewCardPopupProps) {
  return (
    <Base.Portal>
      <Base.Positioner
        align={align}
        anchor={anchor}
        collisionAvoidance={collisionAvoidance}
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
        className="z-[var(--v7-ui-z-menu)]"
      >
        <Base.Popup
          {...props}
          data-slot="ui-preview-card"
          className={cn(
            "rounded-ui-window bg-ui-base p-ui-panel font-ui-control text-ui-body text-ui-primary shadow-ui-floating ring-1 ring-ui-edge-muted transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
            className,
          )}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

const PreviewCard = { Root: Base.Root, Trigger: PreviewCardTrigger, Popup: PreviewCardPopup };

export { PreviewCard };
export type { PreviewCardPopupProps, PreviewCardTriggerProps };
