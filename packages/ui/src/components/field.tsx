import type { ComponentProps } from "react";

import { cn } from "../cn";

type FieldSize = "md" | "lg";

interface FieldProps extends ComponentProps<"div"> {
  size?: FieldSize;
}

function FieldRoot({ className, size = "md", ...props }: FieldProps) {
  return (
    <div
      data-slot="ui-field"
      className={cn(
        "flex w-full items-center gap-ui-gap rounded-ui-field bg-ui-base shadow-ui-ring outline-ui-accent hover:shadow-[inset_0_0_0_1px_var(--v7-ui-color-border-strong)] focus-within:outline-1 focus-within:outline-offset-2",
        size === "md" && "min-h-ui-control-md px-ui-pad-md",
        size === "lg" && "min-h-ui-control-lg px-ui-pad-lg py-ui-gap",
        className,
      )}
      {...props}
    />
  );
}

type FieldInputProps = ComponentProps<"input">;

function FieldInput({ className, ...props }: FieldInputProps) {
  return (
    <input
      data-slot="ui-field-input"
      className={cn(
        "min-w-0 grow basis-0 border-0 bg-transparent p-0 font-ui-control text-ui-body text-ui-primary outline-hidden placeholder:text-ui-muted",
        className,
      )}
      {...props}
    />
  );
}

const Field = Object.assign(FieldRoot, { Input: FieldInput });

export { Field };
export type { FieldInputProps, FieldProps, FieldSize };
