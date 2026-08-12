"use client";

import type { ReactNode } from "react";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";

import { cn } from "../cn";
import { Text } from "./text";

type PreviewPickerOption<T extends string> = {
  readonly value: T;
  readonly label: string;
  readonly preview: ReactNode;
};

type PreviewPickerProps<T extends string> = {
  readonly accessibilityLabel: string;
  readonly value: T;
  readonly options: readonly PreviewPickerOption<T>[];
  readonly onValueChange: (value: T) => void;
  readonly className?: string;
};

function PreviewPicker<T extends string>({
  accessibilityLabel,
  className,
  onValueChange,
  options,
  value,
}: PreviewPickerProps<T>) {
  return (
    <RadioGroup
      aria-label={accessibilityLabel}
      value={value}
      className={cn("flex flex-wrap items-start justify-end gap-ui-gutter", className)}
      onValueChange={(next) => {
        const option = options.find((candidate) => candidate.value === next);
        if (option !== undefined) onValueChange(option.value);
      }}
    >
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          className="group flex appearance-none flex-col items-center gap-ui-gap rounded-ui-field border-0 bg-transparent p-0 text-ui-muted outline-ui-accent transition-colors duration-ui-hover ease-ui-out hover:text-ui-primary focus-visible:outline-1 focus-visible:outline-offset-2 data-checked:text-ui-primary motion-reduce:transition-none"
        >
          <span
            aria-hidden
            className="pointer-events-none grid place-items-center rounded-ui-field border border-ui-edge-muted bg-ui-layer-01 p-ui-gap transition-[border-color,background-color] duration-ui-hover ease-ui-out group-hover:border-ui-edge group-data-checked:border-ui-accent motion-reduce:transition-none"
          >
            {option.preview}
          </span>
          <Text size="sm" tone="inherit" weight={option.value === value ? "semibold" : "regular"}>
            {option.label}
          </Text>
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}

export { PreviewPicker };
export type { PreviewPickerOption, PreviewPickerProps };
