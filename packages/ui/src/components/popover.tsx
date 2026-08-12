"use client";

import { Popover as Base } from "@base-ui/react/popover";

import { cn } from "../cn";

interface PopoverPopupProps extends Omit<Base.Popup.Props, "className"> {
  side?: Base.Positioner.Props["side"];
  sideOffset?: number;
  align?: Base.Positioner.Props["align"];
  anchor?: Base.Positioner.Props["anchor"];
  positionMethod?: Base.Positioner.Props["positionMethod"];
  collisionAvoidance?: Base.Positioner.Props["collisionAvoidance"];
  collisionPadding?: Base.Positioner.Props["collisionPadding"];
  className?: string;
}

function PopoverPopup({
  align = "center",
  anchor,
  children,
  className,
  collisionAvoidance,
  collisionPadding,
  positionMethod,
  side = "bottom",
  sideOffset = 8,
  ...props
}: PopoverPopupProps) {
  return (
    <Base.Portal>
      <Base.Positioner
        align={align}
        anchor={anchor}
        collisionAvoidance={collisionAvoidance}
        collisionPadding={collisionPadding}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        className="z-[var(--v7-ui-z-menu)]"
      >
        <Base.Popup
          {...props}
          data-slot="ui-popover"
          className={cn(
            "rounded-ui-window bg-ui-base p-ui-panel font-ui-control text-ui-body text-ui-primary shadow-ui-floating ring-1 ring-ui-edge-muted transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
            className,
          )}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

type PopoverTitleProps = Base.Title.Props;

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <Base.Title
      data-slot="ui-popover-title"
      className={cn("m-0 font-ui-control text-ui-body font-normal text-ui-primary", className)}
      {...props}
    />
  );
}

type PopoverDescriptionProps = Base.Description.Props;

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <Base.Description
      data-slot="ui-popover-description"
      className={cn("m-0 font-ui-control text-ui-caption text-ui-muted", className)}
      {...props}
    />
  );
}

const Popover = {
  Root: Base.Root,
  Trigger: Base.Trigger,
  Popup: PopoverPopup,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: Base.Close,
  Arrow: Base.Arrow,
};

export { Popover };
export type { PopoverDescriptionProps, PopoverPopupProps, PopoverTitleProps };
