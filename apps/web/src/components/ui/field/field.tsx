import type { ReactNode } from "react";

import { Field as FieldBase } from "@base-ui/react/field";
import { Label } from "@ticu/ui/components/label";

import { cn } from "~/utils/cn";

export const NYTE_FIELD_VARIANTS = {} as const;
export const NYTE_FIELD_DEFAULT_VARIANTS = {} as const;

export interface NyteFieldVariantsProps {
  controlFirst?: boolean;
}

export function fieldVariants({ controlFirst = false }: NyteFieldVariantsProps = {}) {
  return cn(
    "grid gap-2",
    "has-[input[type=checkbox]]:grid-cols-[auto_1fr] has-[input[type=checkbox]]:items-center",
    "has-[[role=switch]]:grid-cols-[auto_1fr] has-[[role=switch]]:items-center",
    ...(controlFirst
      ? [
          "has-[input[type=checkbox]]:flex has-[input[type=checkbox]]:flex-row-reverse has-[input[type=checkbox]]:flex-wrap has-[input[type=checkbox]]:items-center",
          "has-[[role=switch]]:flex has-[[role=switch]]:flex-row-reverse has-[[role=switch]]:flex-wrap has-[[role=switch]]:items-center",
          "[&>label]:flex-1",
        ]
      : []),
  );
}

export type FieldErrorMatch =
  | boolean
  | "badInput"
  | "customError"
  | "patternMismatch"
  | "rangeOverflow"
  | "rangeUnderflow"
  | "stepMismatch"
  | "tooLong"
  | "tooShort"
  | "typeMismatch"
  | "valid"
  | "valueMissing";

export interface FieldProps extends NyteFieldVariantsProps {
  children: ReactNode;
  label: ReactNode;
  required?: boolean;
  labelTooltip?: ReactNode;
  error?: {
    message: ReactNode;
    match: FieldErrorMatch;
  };
  description?: ReactNode;
}

export function Field({
  children,
  label,
  required,
  labelTooltip,
  error,
  description,
  controlFirst = false,
}: FieldProps) {
  return (
    <FieldBase.Root className={fieldVariants({ controlFirst })}>
      <FieldBase.Label className="text-base font-medium text-foreground">
        <Label>
          {label}
          {required === false ? (
            <span className="text-muted-foreground ml-1">(optional)</span>
          ) : null}
        </Label>
      </FieldBase.Label>
      {children}
      {error ? (
        <FieldBase.Error className="col-span-full text-sm/5 text-destructive" match={error.match}>
          {error.message}
        </FieldBase.Error>
      ) : description ? (
        <FieldBase.Description className="col-span-full text-sm/5 text-muted-foreground">
          {description}
        </FieldBase.Description>
      ) : null}
    </FieldBase.Root>
  );
}
