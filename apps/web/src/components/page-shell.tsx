import type * as React from "react";

import { cn } from "~/utils/cn";

export function PageMain({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      {...props}
      className={cn("relative z-10 flex min-h-svh h-full w-full flex-col bg-background", className)}
    />
  );
}

export function PageFrame({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cn("mx-auto w-full max-w-[1728px]", className)} />;
}

export function PageGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("grid w-full grid-flow-row auto-rows-auto grid-cols-8 gap-y-0 px-3", className)}
    />
  );
}

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn("col-span-full grid grid-cols-subgrid auto-rows-auto", className)}
    />
  );
}

export function PageSection({
  anchor,
  className,
  ...props
}: React.ComponentProps<"section"> & {
  anchor?: boolean;
}) {
  return (
    <section
      {...props}
      data-anchor={anchor ? true : undefined}
      className={cn(
        "col-span-full grid grid-cols-subgrid py-4.5 data-[anchor=true]:scroll-mt-28",
        className,
      )}
    />
  );
}

export function PageHeading({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      className={cn("font-sans text-2xl leading-[2] tracking-[0.01em] text-foreground", className)}
    />
  );
}

export function SectionHeading({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      {...props}
      className={cn("font-sans text-lg leading-[2] tracking-[0.01em] text-foreground", className)}
    />
  );
}

export function PageCopy({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-4 font-sans text-sm leading-[1.5] tracking-[0.01em] text-foreground/90",
        className,
      )}
    />
  );
}

export function PageBody({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn("text-sm leading-[1.5] tracking-[0.01em] text-foreground/90", className)}
    />
  );
}

export function PageCaption({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn(
        "font-mono text-xs leading-[1.25] tracking-[0.01em] text-foreground/90",
        className,
      )}
    />
  );
}
