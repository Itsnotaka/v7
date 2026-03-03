import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

interface RootProps extends useRender.ComponentProps<"header"> {}

function Root({ className, render, ...props }: RootProps) {
  const element = useRender({
    defaultTagName: "header",
    render,
    props: {
      "data-slot": "header-root",
      className,
      ...props,
    },
  });

  return element;
}

const headingVariants = cva("font-semibold tracking-tight", {
  variants: {
    as: {
      h1: "text-3xl",
      h2: "text-2xl",
      h3: "text-xl",
    },
  },
  defaultVariants: {
    as: "h1",
  },
});

type HeadingTag = "h1" | "h2" | "h3";

interface HeadingProps
  extends useRender.ComponentProps<HeadingTag>,
    VariantProps<typeof headingVariants> {}

function Heading({ className, render, as, ...props }: HeadingProps) {
  const tag = as ?? "h1";

  const element = useRender({
    defaultTagName: tag,
    render,
    props: {
      "data-slot": "header-heading",
      className: cn(headingVariants({ as }), className),
      ...props,
    },
  });

  return element;
}

const bodyVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface BodyProps
  extends useRender.ComponentProps<"div">,
    VariantProps<typeof bodyVariants> {}

function Body({ className, render, size, ...props }: BodyProps) {
  const element = useRender({
    defaultTagName: "div",
    render,
    props: {
      "data-slot": "header-body",
      className: cn(bodyVariants({ size }), className),
      ...props,
    },
  });

  return element;
}

export const Header = {
  Root,
  Heading,
  Body,
};