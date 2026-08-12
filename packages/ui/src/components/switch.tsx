"use client";

import { Switch as Base } from "@base-ui/react/switch";

import { cn } from "../cn";

type SwitchSize = "sm" | "md";

interface SwitchProps extends Omit<Base.Root.Props, "className"> {
  size?: SwitchSize;
  className?: string;
}

function Switch({ className, size = "md", ...props }: SwitchProps) {
  return (
    <Base.Root
      {...props}
      data-slot="ui-switch"
      className={cn(
        "inline-flex shrink-0 appearance-none items-center rounded-ui-pill border-0 bg-ui-layer-02 p-0.5 shadow-ui-ring-muted outline-ui-accent transition-[background-color,box-shadow] duration-ui-hover ease-ui-out select-none focus-visible:outline-1 focus-visible:outline-offset-2 data-checked:bg-ui-accent data-checked:shadow-none data-disabled:opacity-40 motion-reduce:transition-none",
        size === "sm" ? "h-4 w-6.5" : "h-4.5 w-7.5",
        className,
      )}
    >
      <Base.Thumb
        data-slot="ui-switch-thumb"
        className={cn(
          "block shrink-0 rounded-ui-pill bg-ui-on-accent transition-transform duration-ui-fast ease-ui-out motion-reduce:transition-none",
          size === "sm"
            ? "size-3 data-checked:translate-x-2.5"
            : "size-3.5 data-checked:translate-x-3",
        )}
      />
    </Base.Root>
  );
}

export { Switch };
export type { SwitchProps, SwitchSize };
