"use client";

import { Combobox as Base } from "@base-ui/react/combobox";
import {
  IconCheckmark1,
  IconChevronDownMedium,
  IconMagnifyingGlass,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import * as React from "react";

import { cn } from "../cn";
import { Icon } from "./icon";

type ComboboxSize = "sm" | "md";
type ComboboxTone = "neutral" | "quiet";
type ComboboxPopupWidth = "trigger" | "wide";
type ComboboxPopupLayer = "menu" | "dialog";

interface ComboboxOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly leading?: React.ReactNode;
  readonly metadata?: React.ReactNode;
  readonly keywords?: readonly string[];
  readonly disabled?: boolean;
}

interface ComboboxGroup {
  readonly label: string;
  readonly options: readonly ComboboxOption[];
  readonly pinned?: boolean;
}

interface ComboboxAction {
  readonly label: string;
  readonly leading?: React.ReactNode;
  readonly disabled?: boolean;
  readonly onSelect: () => void;
}

interface ComboboxProps {
  readonly value: string | null;
  readonly onValueChange: (value: string) => void;
  readonly groups: readonly ComboboxGroup[];
  readonly children?: React.ReactNode;
  readonly accessibilityLabel: string;
  readonly searchPlaceholder: string;
  readonly emptyLabel?: string;
  readonly noMatchesLabel?: string;
  readonly status?: string;
  readonly actions?: readonly ComboboxAction[];
  readonly disabled?: boolean;
  readonly size?: ComboboxSize;
  readonly tone?: ComboboxTone;
  readonly title?: string;
  readonly width?: ComboboxPopupWidth;
  readonly layer?: ComboboxPopupLayer;
  readonly side?: "top" | "bottom";
  readonly align?: "start" | "center" | "end";
  readonly onOpenChange?: (open: boolean) => void;
  readonly onOpenChangeComplete?: (open: boolean) => void;
  readonly onQueryChange?: (query: string) => void;
  readonly trigger?: React.ReactElement;
  readonly className?: string;
}

function optionMatches(
  option: ComboboxOption,
  query: string,
  contains: (value: string, query: string) => boolean,
) {
  return [option.label, option.description, option.value, ...(option.keywords ?? [])].some(
    (candidate) => candidate !== undefined && contains(candidate, query),
  );
}

function ComboboxOptionRow({ option }: { option: ComboboxOption }) {
  return (
    <Base.Item
      data-slot="ui-combobox-option"
      disabled={option.disabled}
      value={option.value}
      className={cn(
        "flex min-h-ui-control-sm items-center gap-ui-gap rounded-ui-control px-ui-pad-sm font-ui-control text-ui-body text-ui-primary outline-hidden select-none data-disabled:opacity-40 data-highlighted:bg-ui-state-hover data-selected:bg-ui-control-selected",
        option.description !== undefined && "py-ui-gap",
      )}
    >
      {option.leading === undefined ? null : (
        <span className="grid shrink-0 place-items-center">{option.leading}</span>
      )}
      <span className="flex min-w-0 grow flex-col">
        <span className="truncate font-normal">{option.label}</span>
        {option.description === undefined ? null : (
          <span className="truncate text-ui-detail text-ui-muted">{option.description}</span>
        )}
      </span>
      {option.metadata === undefined ? null : (
        <span className="shrink-0 text-ui-detail text-ui-muted">{option.metadata}</span>
      )}
      <Base.ItemIndicator className="ms-auto inline-flex shrink-0 text-ui-accent">
        <Icon icon={IconCheckmark1} size="xs" />
      </Base.ItemIndicator>
    </Base.Item>
  );
}

function ComboboxOptionGroup({ group }: { group: ComboboxGroup }) {
  return (
    <Base.Group>
      <Base.GroupLabel className="px-ui-pad-sm py-0.75 text-ui-caption font-normal text-ui-muted select-none">
        {group.label}
      </Base.GroupLabel>
      {group.options.map((option) => (
        <ComboboxOptionRow key={option.value} option={option} />
      ))}
    </Base.Group>
  );
}

function Combobox({
  accessibilityLabel,
  actions = [],
  align = "start",
  children,
  className,
  disabled,
  emptyLabel = "No matching options.",
  groups,
  layer = "menu",
  noMatchesLabel = "No matching options.",
  onOpenChange,
  onOpenChangeComplete,
  onQueryChange,
  onValueChange,
  searchPlaceholder,
  side = "bottom",
  size = "md",
  status,
  title,
  tone = "neutral",
  trigger,
  value,
  width = "trigger",
}: ComboboxProps) {
  const filter = Base.useFilter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const options = new Map(
    groups.flatMap((group) => group.options.map((option) => [option.value, option] as const)),
  );
  const values = groups.flatMap((group) => group.options.map((option) => option.value));
  const search = query.trim();
  const filtered = groups
    .map((group) => ({
      ...group,
      options:
        group.pinned === true || search.length === 0
          ? group.options
          : group.options.filter((option) => optionMatches(option, search, filter.contains)),
    }))
    .filter((group) => group.options.length > 0);
  const filteredValues = filtered.flatMap((group) => group.options.map((option) => option.value));
  const pinned = filtered.filter((group) => group.pinned === true);
  const scrolling = filtered.filter((group) => group.pinned !== true);
  const empty = search.length === 0 ? emptyLabel : noMatchesLabel;
  const message = status ?? (pinned.length > 0 && scrolling.length === 0 ? empty : undefined);

  const updateQuery = (next: string) => {
    setQuery(next);
    onQueryChange?.(next);
  };

  return (
    <Base.Root
      disabled={disabled}
      filter={null}
      filteredItems={filteredValues}
      inputValue={query}
      items={values}
      itemToStringLabel={(item) => options.get(item)?.label ?? item}
      open={open}
      value={value}
      onInputValueChange={updateQuery}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) updateQuery("");
        onOpenChange?.(next);
      }}
      onOpenChangeComplete={onOpenChangeComplete}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      {trigger !== undefined ? (
        <Base.Trigger aria-label={accessibilityLabel} render={trigger} title={title} />
      ) : (
        <Base.Trigger
          aria-label={accessibilityLabel}
          data-slot="ui-combobox-trigger"
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
          <Base.Icon className="inline-flex shrink-0 text-ui-muted transition-transform duration-ui-fast group-data-popup-open:rotate-180 motion-reduce:transition-none">
            <Icon icon={IconChevronDownMedium} size="sm" />
          </Base.Icon>
        </Base.Trigger>
      )}
      <Base.Portal>
        <Base.Positioner
          align={align}
          side={side}
          sideOffset={4}
          className={cn(
            "min-w-(--anchor-width) max-w-(--available-width)",
            layer === "dialog" ? "z-[calc(var(--v7-ui-z-dialog)+1)]" : "z-[var(--v7-ui-z-menu)]",
          )}
        >
          <Base.Popup
            aria-label={accessibilityLabel}
            data-slot="ui-combobox-popup"
            className={cn(
              "flex max-h-[min(360px,var(--available-height))] max-w-ui-picker-max flex-col overflow-hidden rounded-ui-menu bg-ui-base font-ui-control text-ui-body text-ui-primary shadow-ui-floating ring-1 ring-ui-edge-muted outline-hidden transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
              width === "wide" ? "w-ui-picker-max" : "w-(--anchor-width)",
            )}
          >
            <div className="flex h-ui-control-lg shrink-0 items-center gap-ui-gap px-3 shadow-[inset_0_-1px_0_var(--v7-ui-color-border-muted)]">
              <Icon icon={IconMagnifyingGlass} size="sm" tone="muted" />
              <Base.Input
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                className="min-w-0 grow border-0 bg-transparent p-0 font-ui-control text-ui-body text-ui-primary outline-hidden placeholder:text-ui-faint"
              />
            </div>
            <Base.List className="min-h-0 outline-hidden">
              {pinned.length === 0 ? null : (
                <div className="shrink-0 p-1 shadow-[inset_0_-1px_0_var(--v7-ui-color-border-muted)]">
                  {pinned.map((group, index) => (
                    <ComboboxOptionGroup key={`${group.label}:${index}`} group={group} />
                  ))}
                </div>
              )}
              <div className="max-h-full overflow-y-auto p-1">
                <Base.Status>
                  {message === undefined ? null : (
                    <div className="p-ui-gutter text-ui-detail text-ui-muted">{message}</div>
                  )}
                </Base.Status>
                <Base.Empty>
                  {status === undefined ? (
                    <div className="p-ui-gutter text-ui-detail text-ui-muted">{empty}</div>
                  ) : null}
                </Base.Empty>
                {scrolling.map((group, index) => (
                  <ComboboxOptionGroup key={`${group.label}:${index}`} group={group} />
                ))}
              </div>
            </Base.List>
            {actions.length === 0 ? null : (
              <div className="shrink-0 p-1 shadow-[inset_0_1px_0_var(--v7-ui-color-border-muted)]">
                {actions.map((action, index) => (
                  <button
                    key={`${action.label}:${index}`}
                    disabled={action.disabled}
                    type="button"
                    className="flex h-ui-control-sm w-full items-center gap-ui-gap rounded-ui-control border-0 bg-transparent px-ui-pad-sm text-start font-ui-control text-ui-body text-ui-primary outline-ui-accent hover:bg-ui-state-hover active:bg-ui-state-press focus-visible:outline-1 focus-visible:outline-offset-2 disabled:opacity-40"
                    onClick={() => {
                      setOpen(false);
                      updateQuery("");
                      onOpenChange?.(false);
                      action.onSelect();
                    }}
                  >
                    {action.leading}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}

export { Combobox };
export type {
  ComboboxAction,
  ComboboxGroup,
  ComboboxOption,
  ComboboxPopupLayer,
  ComboboxPopupWidth,
  ComboboxProps,
  ComboboxSize,
  ComboboxTone,
};
