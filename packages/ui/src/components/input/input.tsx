import { Input as BaseInput } from "@base-ui/react/input";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Field, type FieldErrorMatch } from "../field";

export const NYTE_INPUT_VARIANTS = {
  size: {
    xs: {
      classes: "h-5 rounded-sm px-1.5 text-xs",
      description: "Extra small input for compact UIs",
    },
    sm: {
      classes: "h-6.5 rounded-md px-2 text-xs",
      description: "Small input for secondary fields",
    },
    base: {
      classes: "h-9 rounded-lg px-3 text-base",
      description: "Default input size",
    },
    lg: {
      classes: "h-10 rounded-lg px-4 text-base",
      description: "Large input for prominent fields",
    },
  },
  variant: {
    default: {
      classes: "focus:ring-ring",
      description: "Default input appearance",
    },
    error: {
      classes: "!ring-destructive focus:ring-destructive",
      description: "Error state for validation failures",
    },
  },
} as const;

export const NYTE_INPUT_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default",
} as const;

export type NyteInputSize = keyof typeof NYTE_INPUT_VARIANTS.size;
export type NyteInputVariant = keyof typeof NYTE_INPUT_VARIANTS.variant;

export interface NyteInputVariantsProps {
  size?: NyteInputSize;
  variant?: NyteInputVariant;
  parentFocusIndicator?: boolean;
  focusIndicator?: boolean;
}

type BaseInputProps = Omit<ComponentPropsWithoutRef<typeof BaseInput>, "size">;

export function inputVariants({
  variant = NYTE_INPUT_DEFAULT_VARIANTS.variant,
  size = NYTE_INPUT_DEFAULT_VARIANTS.size,
  parentFocusIndicator = false,
  focusIndicator = false,
}: NyteInputVariantsProps = {}) {
  return cn(
    "border-0 bg-background text-foreground ring ring-border outline-none placeholder:text-muted-foreground disabled:text-muted-foreground",
    NYTE_INPUT_VARIANTS.size[size].classes,
    NYTE_INPUT_VARIANTS.variant[variant].classes,
    parentFocusIndicator && "[&:has(:focus-within)]:ring-ring",
    focusIndicator && "focus:ring-ring",
  );
}

export type InputProps = Pick<NyteInputVariantsProps, "size" | "variant"> &
  BaseInputProps & {
    label?: ReactNode;
    labelTooltip?: ReactNode;
    description?: ReactNode;
    error?: string | { message: ReactNode; match: FieldErrorMatch };
  };

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    size = NYTE_INPUT_DEFAULT_VARIANTS.size,
    variant = NYTE_INPUT_DEFAULT_VARIANTS.variant,
    label,
    labelTooltip,
    description,
    error,
    ...inputProps
  } = props;
  const required = inputProps.required;

  const hasLabel = Boolean(label);
  const hasPlaceholderAndAriaLabel = Boolean(inputProps.placeholder && inputProps["aria-label"]);
  const hasAriaLabelledBy = Boolean(inputProps["aria-labelledby"]);

  if (!hasLabel && !hasPlaceholderAndAriaLabel && !hasAriaLabelledBy) {
    console.warn(
      "[Nyte Input]: Input must have an accessible name via label, placeholder + aria-label, or aria-labelledby.",
    );
  }

  const input = (
    <BaseInput
      ref={ref}
      className={cn(inputVariants({ size, variant, focusIndicator: true }), className)}
      {...inputProps}
    />
  );

  if (!label) {
    return input;
  }

  return (
    <Field
      label={label}
      required={required}
      labelTooltip={labelTooltip}
      description={description}
      error={error ? (typeof error === "string" ? { message: error, match: true } : error) : undefined}
    >
      {input}
    </Field>
  );
});

Input.displayName = "Input";
