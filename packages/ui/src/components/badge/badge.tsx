import type { ReactNode } from "react";

import { cn } from "../../utils/cn";

export const NYTE_BADGE_BASE_STYLES =
  "inline-flex w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap";

export const NYTE_BADGE_VARIANTS = {
  variant: {
    primary: {
      classes: "bg-primary text-primary-foreground",
      description: "High-emphasis badge for important labels",
    },
    secondary: {
      classes: "bg-secondary text-secondary-foreground",
      description: "Subtle badge for supporting information",
    },
    destructive: {
      classes: "bg-destructive text-destructive-foreground",
      description: "Badge for errors and dangerous states",
    },
    outline: {
      classes: "border border-border bg-transparent text-foreground",
      description: "Bordered badge with transparent fill",
    },
    beta: {
      classes: "border border-dashed border-primary bg-transparent text-primary",
      description: "Badge for beta or experimental states",
    },
  },
} as const;

export const NYTE_BADGE_DEFAULT_VARIANTS = {
  variant: "primary",
} as const;

export type NyteBadgeVariant = keyof typeof NYTE_BADGE_VARIANTS.variant;

export interface NyteBadgeVariantsProps {
  variant?: NyteBadgeVariant;
}

export function badgeVariants({
  variant = NYTE_BADGE_DEFAULT_VARIANTS.variant,
}: NyteBadgeVariantsProps = {}) {
  return cn(NYTE_BADGE_BASE_STYLES, NYTE_BADGE_VARIANTS.variant[variant].classes);
}

export interface BadgeProps {
  variant?: NyteBadgeVariant;
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = NYTE_BADGE_DEFAULT_VARIANTS.variant,
  className,
  children,
}: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
