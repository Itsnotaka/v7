import React, {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ElementType,
  type PropsWithChildren,
} from "react";

import { cn } from "../../utils/cn";

export const NYTE_SURFACE_VARIANTS = {
  tone: {
    default: {
      classes: "bg-card text-card-foreground ring-border",
      description: "Default raised surface",
    },
    muted: {
      classes: "bg-muted text-foreground ring-border",
      description: "Muted surface for secondary sections",
    },
  },
} as const;

export const NYTE_SURFACE_DEFAULT_VARIANTS = {
  tone: "default",
} as const;

export type NyteSurfaceTone = keyof typeof NYTE_SURFACE_VARIANTS.tone;

export interface NyteSurfaceVariantsProps {
  tone?: NyteSurfaceTone;
}

export function surfaceVariants({
  tone = NYTE_SURFACE_DEFAULT_VARIANTS.tone,
}: NyteSurfaceVariantsProps = {}) {
  return cn("rounded-sm shadow-xs ring", NYTE_SURFACE_VARIANTS.tone[tone].classes);
}

type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & PolymorphicAsProp<E>
>;

type PolymorphicRef<E extends ElementType> = ComponentPropsWithRef<E>["ref"];

const defaultElement = "div";

type SurfacePropsGeneric<E extends ElementType = typeof defaultElement> = PolymorphicProps<E> &
  NyteSurfaceVariantsProps;

export interface SurfaceProps {
  as?: ElementType;
  tone?: NyteSurfaceTone;
  className?: string;
  children?: React.ReactNode;
}

type SurfaceComponent = <E extends ElementType = typeof defaultElement>(
  props: SurfacePropsGeneric<E> & { ref?: PolymorphicRef<E> },
) => React.JSX.Element;

const SurfaceImpl = function Surface<E extends ElementType = typeof defaultElement>(
  {
    as,
    children,
    className,
    tone = NYTE_SURFACE_DEFAULT_VARIANTS.tone,
    ...props
  }: SurfacePropsGeneric<E>,
  ref: PolymorphicRef<E>,
) {
  const Component = as ?? defaultElement;

  return (
    <Component ref={ref} {...props} className={cn(surfaceVariants({ tone }), className)}>
      {children}
    </Component>
  );
};

export const Surface = forwardRef(SurfaceImpl as never) as unknown as SurfaceComponent;
