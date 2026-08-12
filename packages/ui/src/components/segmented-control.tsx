"use client";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";

import { cn } from "../cn";

type SegmentedControlSize = "sm" | "md";

interface SegmentedControlOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
}

interface SegmentedControlProps<T extends string> {
  readonly value: T;
  readonly options: readonly SegmentedControlOption<T>[];
  readonly onValueChange: (value: T) => void;
  readonly accessibilityLabel: string;
  readonly size?: SegmentedControlSize;
  readonly disabled?: boolean;
  readonly className?: string;
}

function SegmentedControl<T extends string>({
  accessibilityLabel,
  className,
  disabled = false,
  onValueChange,
  options,
  size = "md",
  value,
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup
      aria-label={accessibilityLabel}
      disabled={disabled}
      value={[value]}
      className={cn(
        "inline-flex items-center rounded-ui-field bg-ui-layer-01 p-0.5 shadow-ui-ring-muted",
        className,
      )}
      onValueChange={(next) => {
        const selected = next[0];
        if (selected !== undefined) onValueChange(selected as T);
      }}
    >
      {options.map((option) => (
        <Toggle
          key={option.value}
          aria-label={option.label}
          disabled={option.disabled}
          value={option.value}
          className={cn(
            "inline-flex min-w-0 appearance-none items-center justify-center whitespace-nowrap rounded-ui-control border-0 bg-transparent px-ui-pad-md font-ui-control font-normal leading-none text-ui-muted outline-ui-accent transition-[background-color,box-shadow,color,opacity] duration-ui-hover ease-ui-out hover:bg-ui-state-hover hover:text-ui-primary focus-visible:outline-1 focus-visible:outline-offset-2 data-disabled:opacity-40 data-pressed:bg-ui-base data-pressed:text-ui-primary data-pressed:shadow-ui-ring motion-reduce:transition-none",
            size === "sm" ? "h-ui-control-sm text-ui-detail" : "h-ui-control-md text-ui-body",
          )}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

export { SegmentedControl };
export type { SegmentedControlOption, SegmentedControlProps, SegmentedControlSize };
