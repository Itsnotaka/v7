"use client";

import { Checkbox as Base } from "@base-ui/react/checkbox";
import { IconCheckmark1 } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";

import { cn } from "../cn";
import { Icon } from "./icon";

type CheckboxSize = "sm" | "md";

interface CheckboxProps extends Omit<Base.Root.Props, "className"> {
  size?: CheckboxSize;
  className?: string;
}

function Checkbox({ className, size = "md", ...props }: CheckboxProps) {
  return (
    <Base.Root
      {...props}
      data-slot="ui-checkbox"
      className={cn(
        "inline-flex shrink-0 appearance-none items-center justify-center rounded-ui-control border-0 bg-ui-layer-01 shadow-ui-ring outline-ui-accent transition-[background-color,box-shadow] duration-ui-hover ease-ui-out select-none focus-visible:outline-1 focus-visible:outline-offset-2 data-checked:bg-ui-accent data-checked:shadow-none data-disabled:opacity-40 data-indeterminate:bg-ui-accent data-indeterminate:shadow-none motion-reduce:transition-none",
        size === "sm" ? "size-4" : "size-4.5",
        className,
      )}
    >
      <Base.Indicator
        data-slot="ui-checkbox-indicator"
        className="relative inline-flex items-center justify-center text-ui-on-accent opacity-100 transition-opacity duration-ui-fast ease-ui-out before:absolute before:m-auto before:hidden before:h-0.5 before:w-2 before:rounded-ui-pill before:bg-ui-on-accent data-ending-style:opacity-0 data-indeterminate:text-transparent data-indeterminate:before:block data-starting-style:opacity-0 motion-reduce:transition-none"
      >
        <Icon icon={IconCheckmark1} size="xs" />
      </Base.Indicator>
    </Base.Root>
  );
}

export { Checkbox };
export type { CheckboxProps, CheckboxSize };
