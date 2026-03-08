"use client";

import { useCallback, type ReactNode } from "react";
import * as React from "react";

import { cn } from "../../utils/cn";
import { Field, type FieldErrorMatch } from "../field";
import { inputVariants } from "./input";

export const InputArea = React.forwardRef<HTMLTextAreaElement, InputAreaProps>((props, ref) => {
  const {
    className,
    onValueChange,
    size = "base",
    variant = "default",
    onChange,
    label,
    labelTooltip,
    description,
    error,
    ...inputProps
  } = props;
  const required = inputProps.required;
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    },
    [onChange, onValueChange],
  );

  const textarea = (
    <textarea
      ref={ref}
      className={cn(
        inputVariants({ size, variant, focusIndicator: true }),
        "h-auto py-2",
        className,
      )}
      onChange={handleChange}
      {...inputProps}
    />
  );

  if (!label) {
    return textarea;
  }

  return (
    <Field
      label={label}
      required={required}
      labelTooltip={labelTooltip}
      description={description}
      error={
        error ? (typeof error === "string" ? { message: error, match: true } : error) : undefined
      }
    >
      {textarea}
    </Field>
  );
});

InputArea.displayName = "InputArea";
export const Textarea = InputArea;

export type InputAreaProps = {
  onValueChange?: (value: string) => void;
  variant?: "default" | "error";
  size?: "xs" | "sm" | "base" | "lg";
  children?: React.ReactNode;
  className?: string;
  label?: ReactNode;
  labelTooltip?: ReactNode;
  description?: ReactNode;
  error?: string | { message: ReactNode; match: FieldErrorMatch };
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;
