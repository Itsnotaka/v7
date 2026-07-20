import type { ComponentProps } from "react";

import { cn } from "./cn";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("w-full max-w-4xl px-4 sm:px-6", className)}
      {...props}
    />
  );
}

export function Section({ className, ...props }: ComponentProps<"section">) {
  return <section data-slot="section" className={cn("scroll-mt-24", className)} {...props} />;
}
