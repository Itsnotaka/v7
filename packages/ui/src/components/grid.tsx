import { cn } from "@workspace/ui/lib/utils";

const VARIANTS = {
  "2up": "grid-cols-1 md:grid-cols-2",
  "side-by-side": "grid-cols-2",
  "2-1": "grid-cols-1 md:grid-cols-[2fr_1fr]",
  "1-2": "grid-cols-1 md:grid-cols-[1fr_2fr]",
  "1-3up": "grid-cols-1 lg:grid-cols-3",
  "3up": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "4up": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  "6up": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  "1-2-4up": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
} as const;

const GAPS = {
  none: "gap-0",
  sm: "gap-3",
  base: "gap-2 md:gap-6 lg:gap-8",
  lg: "gap-8",
} as const;

type GridVariant = keyof typeof VARIANTS;
type GridGap = keyof typeof GAPS;

function Grid({
  className,
  variant,
  gap = "base",
  ...props
}: React.ComponentProps<"div"> & { variant?: GridVariant; gap?: GridGap }) {
  return (
    <div className={cn("grid", variant && VARIANTS[variant], GAPS[gap], className)} {...props} />
  );
}

function GridItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}

export { Grid, GridItem };
export type { GridVariant, GridGap };
