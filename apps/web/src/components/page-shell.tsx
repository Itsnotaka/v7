import type * as React from "react";

import { cn } from "~/utils/cn";

export function PageMain({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      {...props}
      className={cn(
        "relative z-raised flex min-h-svh h-full w-full flex-col bg-background",
        className,
      )}
    />
  );
}

export function PageFrame({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cn("mx-auto w-full max-w-[108rem]", className)} />;
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
      className={cn("font-sans text-2xl/[2] tracking-wide text-foreground", className)}
    />
  );
}

export function SectionHeading({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      {...props}
      className={cn("font-sans text-lg/[2] tracking-wide text-foreground", className)}
    />
  );
}

export function PageCopy({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-4 font-sans text-sm/[1.5] tracking-wide text-foreground/90",
        className,
      )}
    />
  );
}

export function PageBody({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p {...props} className={cn("text-sm/[1.5] tracking-wide text-foreground/90", className)} />
  );
}

export function PageCaption({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={cn("font-mono text-xs/[1.25] tracking-wide text-foreground/90", className)}
    />
  );
}

export function Masonry({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "relative flex h-min w-full max-w-[1600px] flex-col tablet:flex-row content-start items-stretch justify-center gap-4.5 overflow-visible p-4.5 pb-9",
        className,
      )}
    />
  );
}

export function MasonryColumn({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "relative flex w-full flex-none tablet:w-px tablet:flex-1 tablet:shrink-0 flex-col content-start items-start gap-4.5 overflow-visible",
        className,
      )}
    />
  );
}
