"use client";

import * as React from "react";

import { cn } from "../cn";

type TextFieldSize = "md" | "lg";
type TextFieldAutoComplete =
  | "current-password"
  | "email"
  | "name"
  | "new-password"
  | "off"
  | "one-time-code"
  | "postal-code"
  | "street-address"
  | "tel"
  | "url"
  | "username";
type TextFieldInputMode =
  | "decimal"
  | "email"
  | "none"
  | "numeric"
  | "search"
  | "tel"
  | "text"
  | "url";
type TextFieldReturnKey = "done" | "go" | "next" | "search" | "send";
type TextFieldSubmitBehavior = "blurAndSubmit" | "newline" | "submit";

interface TextFieldSelection {
  readonly start: number;
  readonly end?: number;
}
interface TextFieldHandle {
  readonly focus: () => void;
  readonly blur: () => void;
  readonly clear: () => void;
  readonly isFocused: () => boolean;
  readonly getValue: () => string;
}
interface TextFieldProps {
  readonly label: string;
  readonly labelHidden?: boolean;
  readonly accessibilityHint?: string;
  readonly autoCapitalize?: "characters" | "none" | "sentences" | "words";
  readonly autoComplete?: TextFieldAutoComplete;
  readonly autoCorrect?: boolean;
  readonly autoFocus?: boolean;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly inputMode?: TextFieldInputMode;
  readonly leading?: React.ReactNode;
  readonly maxLength?: number;
  readonly minRows?: number;
  readonly multiline?: boolean;
  readonly onChangeText?: (value: string) => void;
  readonly onFocusChange?: (focused: boolean) => void;
  readonly onSubmit?: (value: string) => void;
  readonly placeholder?: string;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly returnKeyType?: TextFieldReturnKey;
  readonly secureTextEntry?: boolean;
  readonly selection?: TextFieldSelection;
  readonly size?: TextFieldSize;
  readonly submitBehavior?: TextFieldSubmitBehavior;
  readonly testID?: string;
  readonly trailing?: React.ReactNode;
  readonly value?: string;
  readonly className?: string;
}

type WebFieldElement = HTMLInputElement | HTMLTextAreaElement;

const TextField = React.forwardRef<TextFieldHandle, TextFieldProps>(function TextField(
  {
    accessibilityHint,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    className,
    defaultValue,
    disabled = false,
    error,
    inputMode,
    label,
    labelHidden = false,
    leading,
    maxLength,
    minRows = 3,
    multiline = false,
    onChangeText,
    onFocusChange,
    onSubmit,
    placeholder,
    readOnly = false,
    required = false,
    returnKeyType,
    secureTextEntry,
    selection,
    size = "md",
    submitBehavior,
    testID,
    trailing,
    value,
  },
  ref,
) {
  const generated = React.useId();
  const id = testID ?? generated;
  const errorId = `${id}-error`;
  const input = React.useRef<WebFieldElement>(null);
  const current = React.useRef(value ?? defaultValue ?? "");
  const invalid = error !== undefined;
  const behavior = submitBehavior ?? (multiline ? "newline" : "blurAndSubmit");

  const setInput = React.useCallback(
    (node: WebFieldElement | null) => {
      input.current = node;
      if (node !== null && selection !== undefined) {
        node.setSelectionRange(selection.start, selection.end ?? selection.start);
      }
    },
    [selection],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      focus: () => input.current?.focus(),
      blur: () => input.current?.blur(),
      clear: () => {
        if (input.current !== null) input.current.value = "";
        current.current = "";
        onChangeText?.("");
      },
      isFocused: () => input.current === document.activeElement,
      getValue: () => value ?? current.current,
    }),
    [onChangeText, value],
  );

  const change = (next: string) => {
    current.current = next;
    onChangeText?.(next);
  };
  const submit = (event: React.KeyboardEvent<WebFieldElement>) => {
    if (event.key !== "Enter" || behavior === "newline") return;
    event.preventDefault();
    onSubmit?.(value ?? current.current);
    if (behavior === "blurAndSubmit") event.currentTarget.blur();
  };
  const common = {
    "aria-describedby": error === undefined ? undefined : errorId,
    "aria-description": accessibilityHint,
    "aria-invalid": invalid,
    "aria-label": required ? `${label}, required` : label,
    autoCapitalize,
    autoComplete,
    autoCorrect: autoCorrect === undefined ? undefined : autoCorrect ? "on" : "off",
    autoFocus,
    disabled,
    enterKeyHint: returnKeyType,
    id,
    inputMode,
    maxLength,
    placeholder,
    readOnly,
    required,
  };
  const inputClass =
    "min-w-0 grow basis-0 resize-none border-0 bg-transparent p-0 font-ui-control text-ui-body text-ui-primary outline-hidden placeholder:text-ui-faint";

  return (
    <div
      data-testid={testID}
      className={cn("flex w-full flex-col gap-ui-gap", disabled && "opacity-50", className)}
    >
      {labelHidden ? null : (
        <label
          htmlFor={id}
          className={cn("font-ui-control text-ui-detail text-ui-muted", invalid && "text-ui-err")}
        >
          {label}
          {required ? <span className="text-ui-err"> *</span> : null}
        </label>
      )}
      <div
        role="presentation"
        className={cn(
          "flex w-full items-center gap-ui-gap rounded-ui-field bg-ui-base shadow-ui-ring outline-ui-accent focus-within:outline-1 focus-within:outline-offset-2",
          size === "md" ? "min-h-ui-control-md px-ui-pad-md" : "min-h-ui-control-lg px-ui-pad-lg",
          multiline && "min-h-20 items-stretch py-ui-gap",
          invalid &&
            "bg-ui-err-tint shadow-[inset_0_0_0_1px_var(--v7-ui-color-err-border)] outline-ui-err",
        )}
        onMouseDown={(event) => {
          const target = event.target;
          if (
            target === input.current ||
            disabled ||
            (target instanceof Element &&
              target.closest("button, a, input, textarea, select, [role='button']") !== null)
          )
            return;
          event.preventDefault();
          input.current?.focus();
        }}
      >
        {leading === undefined ? null : (
          <span className="flex shrink-0 items-center">{leading}</span>
        )}
        {multiline ? (
          <textarea
            {...common}
            ref={setInput}
            className={inputClass}
            defaultValue={value === undefined ? defaultValue : undefined}
            rows={minRows}
            value={value}
            onBlur={() => onFocusChange?.(false)}
            onChange={(event) => change(event.currentTarget.value)}
            onFocus={() => onFocusChange?.(true)}
            onKeyDown={submit}
          />
        ) : (
          <input
            {...common}
            ref={setInput}
            className={inputClass}
            defaultValue={value === undefined ? defaultValue : undefined}
            type={secureTextEntry ? "password" : "text"}
            value={value}
            onBlur={() => onFocusChange?.(false)}
            onChange={(event) => change(event.currentTarget.value)}
            onFocus={() => onFocusChange?.(true)}
            onKeyDown={submit}
          />
        )}
        {trailing === undefined ? null : (
          <span className="flex shrink-0 items-center">{trailing}</span>
        )}
      </div>
      {error === undefined ? null : (
        <span id={errorId} role="alert" className="font-ui-control text-ui-caption text-ui-err">
          {error}
        </span>
      )}
    </div>
  );
});

export { TextField };
export type {
  TextFieldAutoComplete,
  TextFieldHandle,
  TextFieldInputMode,
  TextFieldProps,
  TextFieldReturnKey,
  TextFieldSelection,
  TextFieldSize,
  TextFieldSubmitBehavior,
};
