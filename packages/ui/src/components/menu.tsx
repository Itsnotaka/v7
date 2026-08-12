"use client";

import type { ReactNode } from "react";

import { ContextMenu as ContextBase } from "@base-ui/react/context-menu";
import { Menu as Base } from "@base-ui/react/menu";
import { IconCheckmark1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";

import { cn } from "../cn";
import { Icon } from "./icon";
import { Switch } from "./switch";

interface MenuPopupProps extends Omit<Base.Popup.Props, "className"> {
  side?: Base.Positioner.Props["side"];
  align?: Base.Positioner.Props["align"];
  sideOffset?: number;
  alignOffset?: Base.Positioner.Props["alignOffset"];
  className?: string;
}

function MenuPopup({
  align = "start",
  alignOffset,
  children,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: MenuPopupProps) {
  return (
    <Base.Portal>
      <Base.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="z-[var(--v7-ui-z-menu)]"
      >
        <Base.Popup
          {...props}
          data-slot="ui-menu"
          className={cn(
            "min-w-40 max-w-70 rounded-ui-menu bg-ui-base p-1 font-ui-control text-ui-body text-ui-primary shadow-ui-floating ring-1 ring-ui-edge-muted outline-hidden transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
            className,
          )}
        >
          {children}
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );
}

type MenuItemProps = Omit<Base.Item.Props, "className"> & { className?: string };

function MenuItem({ className, ...props }: MenuItemProps) {
  return (
    <Base.Item
      {...props}
      data-slot="ui-menu-item"
      className={cn(
        "flex h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm text-ui-body text-ui-primary outline-hidden select-none transition-[background-color,opacity] duration-ui-hover ease-ui-out data-disabled:opacity-40 data-highlighted:bg-ui-state-hover motion-reduce:transition-none",
        className,
      )}
    />
  );
}

type MenuCheckboxItemProps = Omit<Base.CheckboxItem.Props, "className"> & { className?: string };

function MenuCheckboxItem({ children, className, ...props }: MenuCheckboxItemProps) {
  return (
    <Base.CheckboxItem
      {...props}
      className={cn(
        "flex h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm text-ui-body text-ui-primary outline-hidden select-none data-disabled:opacity-40 data-highlighted:bg-ui-state-hover",
        className,
      )}
    >
      {children}
      <MenuCheckboxItemIndicator />
    </Base.CheckboxItem>
  );
}

interface MenuSwitchItemProps extends Omit<MenuCheckboxItemProps, "checked" | "defaultChecked"> {
  checked: boolean;
}

function MenuSwitchItem({ checked, children, className, ...props }: MenuSwitchItemProps) {
  return (
    <Base.CheckboxItem
      {...props}
      checked={checked}
      className={cn(
        "flex h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm text-ui-body text-ui-primary outline-hidden select-none data-disabled:opacity-40 data-highlighted:bg-ui-state-hover",
        className,
      )}
    >
      {children}
      <span className="pointer-events-none ms-auto grid place-items-center">
        <Switch aria-hidden checked={checked} readOnly size="sm" tabIndex={-1} />
      </span>
    </Base.CheckboxItem>
  );
}

type MenuCheckboxItemIndicatorProps = Omit<Base.CheckboxItemIndicator.Props, "className"> & {
  className?: string;
};

function MenuCheckboxItemIndicator({
  children,
  className,
  ...props
}: MenuCheckboxItemIndicatorProps) {
  return (
    <Base.CheckboxItemIndicator
      {...props}
      className={cn("ms-auto grid place-items-center", className)}
    >
      {children ?? <Icon icon={IconCheckmark1} size="xs" />}
    </Base.CheckboxItemIndicator>
  );
}

type MenuRadioItemProps = Omit<Base.RadioItem.Props, "className"> & { className?: string };

function MenuRadioItem({ children, className, ...props }: MenuRadioItemProps) {
  return (
    <Base.RadioItem
      {...props}
      className={cn(
        "flex h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm text-ui-body text-ui-primary outline-hidden select-none data-disabled:opacity-40 data-highlighted:bg-ui-state-hover",
        className,
      )}
    >
      {children}
      <MenuRadioItemIndicator />
    </Base.RadioItem>
  );
}

type MenuRadioItemIndicatorProps = Omit<Base.RadioItemIndicator.Props, "className"> & {
  className?: string;
};

function MenuRadioItemIndicator({ children, className, ...props }: MenuRadioItemIndicatorProps) {
  return (
    <Base.RadioItemIndicator
      {...props}
      className={cn("ms-auto grid place-items-center", className)}
    >
      {children ?? <Icon icon={IconCheckmark1} size="xs" />}
    </Base.RadioItemIndicator>
  );
}

type MenuSubmenuTriggerProps = Omit<Base.SubmenuTrigger.Props, "className"> & {
  className?: string;
};

function MenuSubmenuTrigger({ className, ...props }: MenuSubmenuTriggerProps) {
  return (
    <Base.SubmenuTrigger
      {...props}
      className={cn(
        "flex h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm text-ui-body text-ui-primary outline-hidden select-none data-disabled:opacity-40 data-highlighted:bg-ui-state-hover data-popup-open:bg-ui-state-hover",
        className,
      )}
    />
  );
}

type MenuSubmenuPopupProps = MenuPopupProps;

function MenuSubmenuPopup(props: MenuSubmenuPopupProps) {
  return <MenuPopup align="start" alignOffset={-4} side="inline-end" sideOffset={0} {...props} />;
}

type MenuSeparatorProps = Omit<Base.Separator.Props, "className"> & { className?: string };

function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <Base.Separator {...props} className={cn("-mx-1 my-0.75 h-px bg-ui-edge-muted", className)} />
  );
}

type MenuGroupLabelProps = Omit<Base.GroupLabel.Props, "className"> & { className?: string };

function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return (
    <Base.GroupLabel
      {...props}
      className={cn(
        "px-ui-pad-sm py-0.75 text-ui-caption font-normal text-ui-muted select-none",
        className,
      )}
    />
  );
}

interface MenuItemIconProps {
  children?: ReactNode;
  className?: string;
}
function MenuItemIcon({ children, className }: MenuItemIconProps) {
  return (
    <span className={cn("grid size-4 shrink-0 place-items-center text-ui-muted", className)}>
      {children}
    </span>
  );
}

interface MenuItemMetaProps {
  children?: ReactNode;
  className?: string;
}
function MenuItemMeta({ children, className }: MenuItemMetaProps) {
  return (
    <span
      className={cn("ms-auto shrink-0 whitespace-nowrap text-ui-detail text-ui-muted", className)}
    >
      {children}
    </span>
  );
}

const Menu = {
  Root: Base.Root,
  Trigger: Base.Trigger,
  Popup: MenuPopup,
  Item: MenuItem,
  ItemIcon: MenuItemIcon,
  ItemMeta: MenuItemMeta,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  SwitchItem: MenuSwitchItem,
  RadioGroup: Base.RadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
  Separator: MenuSeparator,
  Group: Base.Group,
  GroupLabel: MenuGroupLabel,
  SubmenuRoot: Base.SubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  SubmenuPopup: MenuSubmenuPopup,
};

interface ContextMenuPopupProps extends Omit<ContextBase.Popup.Props, "className"> {
  className?: string;
}
function ContextMenuPopup({ children, className, ...props }: ContextMenuPopupProps) {
  return (
    <ContextBase.Portal>
      <ContextBase.Positioner className="z-[var(--v7-ui-z-menu)]">
        <ContextBase.Popup
          {...props}
          className={cn(
            "min-w-40 max-w-70 rounded-ui-menu bg-ui-base p-1 font-ui-control text-ui-body text-ui-primary shadow-ui-floating ring-1 ring-ui-edge-muted outline-hidden",
            className,
          )}
        >
          {children}
        </ContextBase.Popup>
      </ContextBase.Positioner>
    </ContextBase.Portal>
  );
}

type ContextMenuItemProps = Omit<ContextBase.Item.Props, "className"> & { className?: string };
function ContextMenuItem({ className, ...props }: ContextMenuItemProps) {
  return (
    <ContextBase.Item
      {...props}
      className={cn(
        "flex h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm text-ui-body text-ui-primary outline-hidden select-none data-disabled:opacity-40 data-highlighted:bg-ui-state-hover",
        className,
      )}
    />
  );
}

type ContextMenuSeparatorProps = Omit<ContextBase.Separator.Props, "className"> & {
  className?: string;
};
function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return (
    <ContextBase.Separator
      {...props}
      className={cn("-mx-1 my-0.75 h-px bg-ui-edge-muted", className)}
    />
  );
}

const ContextMenu = {
  Root: ContextBase.Root,
  Trigger: ContextBase.Trigger,
  Popup: ContextMenuPopup,
  Item: ContextMenuItem,
  ItemIcon: MenuItemIcon,
  ItemMeta: MenuItemMeta,
  Separator: ContextMenuSeparator,
};

export { ContextMenu, Menu };
export type {
  ContextMenuItemProps,
  ContextMenuPopupProps,
  ContextMenuSeparatorProps,
  MenuCheckboxItemIndicatorProps,
  MenuCheckboxItemProps,
  MenuGroupLabelProps,
  MenuItemIconProps,
  MenuItemMetaProps,
  MenuItemProps,
  MenuPopupProps,
  MenuRadioItemIndicatorProps,
  MenuRadioItemProps,
  MenuSeparatorProps,
  MenuSubmenuPopupProps,
  MenuSubmenuTriggerProps,
  MenuSwitchItemProps,
};
