"use client";

import React, { type PropsWithChildren, useContext } from "react";

import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "../button";
import { Input, type InputProps, inputVariants } from "./input";

export const NYTE_INPUT_GROUP_VARIANTS = {
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

export const NYTE_INPUT_GROUP_DEFAULT_VARIANTS = {
  focusMode: "container",
} as const;

export type NyteInputGroupFocusMode = keyof typeof NYTE_INPUT_GROUP_VARIANTS.focusMode;

export interface NyteInputGroupVariantsProps {
  focusMode?: NyteInputGroupFocusMode;
}

interface InputGroupRootProps extends NyteInputGroupVariantsProps {
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
  focusMode = NYTE_INPUT_GROUP_DEFAULT_VARIANTS.focusMode,
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
          inputVariants({ size, parentFocusIndicator: !individual }),
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
      size={value?.size}
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

  return (
    <Button
      {...props}
      size={value?.size}
      className={cn(
        "rounded-none disabled:bg-muted disabled:text-muted-foreground",
        individual &&
          "relative ring ring-border first:rounded-l-[inherit] last:rounded-r-[inherit] focus:relative",
        className,
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
