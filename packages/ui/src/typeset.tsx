import type { ComponentProps } from "react";

import { cn } from "./cn";

const presets = {
  default: "",
  compact: "typeset-compact",
  reading: "typeset-reading",
} as const;

export type TypesetPreset = keyof typeof presets;

export type TypesetProps = ComponentProps<"div"> & {
  preset?: TypesetPreset;
};

export function Typeset({ className, preset = "default", ...props }: TypesetProps) {
  return (
    <div data-slot="typeset" className={cn("typeset", presets[preset], className)} {...props} />
  );
}
