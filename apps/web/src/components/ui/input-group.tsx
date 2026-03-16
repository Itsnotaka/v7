"use client";

import { Button } from "@ticu/ui/components/button";
import { Input } from "@ticu/ui/components/input";
import React, { type PropsWithChildren, useContext, type ComponentProps } from "react";

import { cn } from "~/utils/cn";

type ButtonProps = ComponentProps<typeof Button>;
type InputProps = ComponentProps<typeof Input>;

export const TICU_INPUT_GROUP_VARIANTS = {
  focusMode: {
    container: {
      classes: "",
      description: "Focus indicator on container",
    },
    individual: {
      classes: "",
      description: "Focus indicators on individual elements",
    },
  },
} as const;

export const TICU_INPUT_GROUP_DEFAULT_VARIANTS = {
  focusMode: "container",
} as const;

export type TicuInputGroupFocusMode = keyof typeof TICU_INPUT_GROUP_VARIANTS.focusMode;

export interface TicuInputGroupVariantsProps {
  focusMode?: TicuInputGroupFocusMode;
}

interface InputGroupRootProps extends TicuInputGroupVariantsProps {
  className?: string;
  size?: "xs" | "sm" | "base" | "lg";
}

interface InputGroupContextValue extends InputGroupRootProps {
  inputId: string;
  descriptionId: string;
}

const InputGroupContext = React.createContext<InputGroupContextValue | null>(null);

function Root({
  size,
  children,
  className,
  focusMode = TICU_INPUT_GROUP_DEFAULT_VARIANTS.focusMode,
}: PropsWithChildren<InputGroupRootProps>) {
  const inputId = React.useId();
  const descriptionId = React.useId();
  const value = React.useMemo(
    () => ({ size, inputId, descriptionId, focusMode }),
    [descriptionId, focusMode, inputId, size],
  );
  const individual = focusMode === "individual";

  return (
    <InputGroupContext.Provider value={value}>
      <div
        className={cn(
          "flex h-9 w-full gap-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          size === "xs" && "h-7 text-xs",
          size === "sm" && "h-8 text-sm",
          size === "lg" && "h-10 text-base",
          "flex w-full gap-0 border-0 px-0",
          individual
            ? "isolate overflow-visible"
            : "overflow-hidden shadow-xs ring ring-border focus-within:ring-ring",
          className,
        )}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}

function Label({ children }: PropsWithChildren) {
  const value = useContext(InputGroupContext);
  const individual = value?.focusMode === "individual";

  return (
    <label
      htmlFor={value?.inputId}
      className={cn(
        "flex h-full items-center px-2 text-muted-foreground",
        individual && "first:rounded-l-[inherit] last:rounded-r-[inherit]",
      )}
    >
      {children}
    </label>
  );
}

function GroupInput(props: InputProps) {
  const value = useContext(InputGroupContext);
  const individual = value?.focusMode === "individual";

  return (
    <Input
      id={value?.inputId}
      aria-describedby={value?.descriptionId}
      {...props}
      className={cn(
        "grow rounded-none border-0 bg-background font-sans px-2",
        individual
          ? "relative ring ring-border first:rounded-l-[inherit] last:rounded-r-[inherit] focus:relative"
          : "focus:border-border",
        props.className,
      )}
    />
  );
}

function Description({ children }: PropsWithChildren) {
  const value = useContext(InputGroupContext);
  const individual = value?.focusMode === "individual";

  return (
    <span
      id={value?.descriptionId}
      className={cn(
        "flex h-full items-center px-2 text-muted-foreground",
        individual && "first:rounded-l-[inherit] last:rounded-r-[inherit]",
      )}
    >
      {children}
    </span>
  );
}

function GroupButton({ children, className, ...props }: PropsWithChildren<ButtonProps>) {
  const value = useContext(InputGroupContext);
  const individual = value?.focusMode === "individual";

  // Map local size to @ticu/ui Button size
  const buttonSize = value?.size === "base" ? "default" : value?.size;

  // Only pass string classNames to cn, function classNames are not supported
  const resolvedClassName = typeof className === "string" ? className : undefined;

  return (
    <Button
      {...props}
      size={buttonSize}
      className={cn(
        "rounded-none disabled:bg-muted disabled:text-muted-foreground",
        individual &&
          "relative ring ring-border first:rounded-l-[inherit] last:rounded-r-[inherit] focus:relative",
        resolvedClassName,
      )}
    >
      {children}
    </Button>
  );
}

const InputGroup = Root;

export {
  Description as InputGroupDescription,
  InputGroup,
  GroupButton as InputGroupButton,
  GroupInput as InputGroupInput,
  Label as InputGroupLabel,
};
