"use client";

import type { ReactNode } from "react";

import { Select as Base } from "@base-ui/react/select";
import {
  IconCheckmark1,
  IconChevronDownMedium,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";

import { cn } from "../cn";
import { Icon } from "./icon";

type PickerSize = "sm" | "md";
type PickerTone = "neutral" | "quiet";
type PickerPopupWidth = "trigger" | "wide";
type PickerPopupLayer = "menu" | "dialog";

interface PickerRootProps {
  children: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

interface PickerTriggerProps {
  children: ReactNode;
  accessibilityLabel: string;
  size?: PickerSize;
  tone?: PickerTone;
  title?: string;
  className?: string;
}

interface PickerPopupProps {
  children: ReactNode;
  label: string;
  width?: PickerPopupWidth;
  layer?: PickerPopupLayer;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
}

interface PickerOptionProps {
  value: string;
  label: string;
  description?: string;
  leading?: ReactNode;
  metadata?: ReactNode;
  disabled?: boolean;
  className?: string;
}

interface PickerGroupProps {
  children: ReactNode;
}

interface PickerGroupLabelProps {
  children: ReactNode;
  className?: string;
}

function PickerRoot({ children, disabled, name, onValueChange, value }: PickerRootProps) {
  return (
    <Base.Root
      disabled={disabled}
      name={name}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      {children}
    </Base.Root>
  );
}

function PickerTrigger({
  accessibilityLabel,
  children,
  className,
  size = "md",
  title,
  tone = "neutral",
}: PickerTriggerProps) {
  return (
    <Base.Trigger
      aria-label={accessibilityLabel}
      data-slot="ui-picker-trigger"
      title={title}
      className={cn(
        "group inline-flex max-w-ui-picker-max appearance-none items-center justify-between gap-ui-gap rounded-ui-control border-0 px-ui-pad-md font-ui-control text-ui-body font-normal text-ui-primary outline-ui-accent transition-[background-color,box-shadow,opacity] duration-ui-hover ease-ui-out focus-visible:outline-1 focus-visible:outline-offset-2 data-disabled:opacity-40 data-popup-open:bg-ui-state-hover motion-reduce:transition-none",
        size === "sm" ? "h-ui-control-sm" : "h-ui-control-md",
        tone === "neutral"
          ? "min-w-30 bg-ui-base shadow-ui-ring hover:bg-ui-state-hover active:bg-ui-state-press"
          : "bg-transparent hover:bg-ui-state-hover active:bg-ui-state-press",
        className,
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-ui-gap overflow-hidden text-ellipsis">
        {children}
      </span>
      <span className="inline-flex shrink-0 text-ui-muted transition-transform duration-ui-fast group-data-popup-open:rotate-180 motion-reduce:transition-none">
        <Icon icon={IconChevronDownMedium} size="sm" />
      </span>
    </Base.Trigger>
  );
}

function PickerPopup({
  align = "start",
  children,
  className,
  label,
  layer = "menu",
  side = "bottom",
  width = "trigger",
}: PickerPopupProps) {
  return (
    <Base.Portal>
      <Base.Positioner
        align={align}
        alignItemWithTrigger={false}
        collisionPadding={12}
        side={side}
        sideOffset={4}
        className={cn(
          "min-w-(--anchor-width) max-w-(--available-width)",
          layer === "dialog" ? "z-[calc(var(--v7-ui-z-dialog)+1)]" : "z-[var(--v7-ui-z-menu)]",
        )}
      >
        <Base.Popup
          aria-label={label}
          data-slot="ui-picker-popup"
          className={cn(
            "max-h-[min(360px,var(--available-height))] max-w-ui-picker-max overflow-y-auto rounded-ui-menu bg-ui-base p-1 font-ui-control text-ui-body text-ui-primary shadow-ui-floating ring-1 ring-ui-edge-muted outline-hidden transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
            width === "wide" ? "w-ui-picker-max" : "w-max min-w-(--anchor-width)",
            className,
          )}
        >
          <Base.List className="outline-hidden">{children}</Base.List>
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

function PickerOption({
  className,
  description,
  disabled,
  label,
  leading,
  metadata,
  value,
}: PickerOptionProps) {
  return (
    <Base.Item
      data-slot="ui-picker-option"
      disabled={disabled}
      label={label}
      value={value}
      className={cn(
        "flex min-h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm font-ui-control text-ui-body text-ui-primary outline-hidden select-none data-disabled:opacity-40 data-highlighted:bg-ui-state-hover data-selected:bg-ui-control-selected",
        description !== undefined && "py-ui-gap",
        className,
      )}
    >
      {leading === undefined ? null : (
        <span className="grid shrink-0 place-items-center">{leading}</span>
      )}
      <span className="flex min-w-0 grow flex-col">
        <Base.ItemText className="truncate font-normal">{label}</Base.ItemText>
        {description === undefined ? null : (
          <span className="truncate text-ui-detail text-ui-muted">{description}</span>
        )}
      </span>
      {metadata === undefined ? null : (
        <span className="shrink-0 text-ui-detail text-ui-muted">{metadata}</span>
      )}
      <Base.ItemIndicator className="ms-auto inline-flex shrink-0 text-ui-accent">
        <Icon icon={IconCheckmark1} size="xs" />
      </Base.ItemIndicator>
    </Base.Item>
  );
}

function PickerGroup({ children }: PickerGroupProps) {
  return <Base.Group>{children}</Base.Group>;
}

function PickerGroupLabel({ children, className }: PickerGroupLabelProps) {
  return (
    <Base.GroupLabel
      className={cn(
        "px-ui-pad-sm py-0.75 text-ui-caption font-normal text-ui-muted select-none",
        className,
      )}
    >
      {children}
    </Base.GroupLabel>
  );
}

const Picker = {
  Root: PickerRoot,
  Trigger: PickerTrigger,
  Popup: PickerPopup,
  Option: PickerOption,
  Group: PickerGroup,
  GroupLabel: PickerGroupLabel,
};

export { Picker };
export type {
  PickerGroupLabelProps,
  PickerGroupProps,
  PickerOptionProps,
  PickerPopupLayer,
  PickerPopupProps,
  PickerPopupWidth,
  PickerRootProps,
  PickerSize,
  PickerTone,
  PickerTriggerProps,
};
