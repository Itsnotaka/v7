"use client";

import type { ComponentProps, ReactNode } from "react";

import { createContext, useContext } from "react";

import { cn } from "../cn";

type ListRowSize = "sm" | "md" | "menu";
const ListRowContext = createContext<ListRowSize>("md");

interface ListRowProps extends ComponentProps<"button"> {
  isSelected?: boolean;
  isHighlighted?: boolean;
  size?: ListRowSize;
}

function ListRowRoot({
  children,
  className,
  isHighlighted = false,
  isSelected = false,
  size = "md",
  type = "button",
  ...props
}: ListRowProps) {
  return (
    <ListRowContext value={size}>
      <button
        {...props}
        data-size={size}
        data-slot="ui-list-row"
        type={type}
        className={cn(
          "flex w-full shrink-0 appearance-none items-center gap-ui-gap rounded-ui-control border-0 bg-transparent px-ui-pad-md py-ui-gap text-start font-ui-control text-ui-body text-ui-primary outline-ui-accent transition-[background-color,opacity] duration-ui-hover ease-ui-out select-none hover:bg-ui-state-hover active:bg-ui-state-press focus-visible:-outline-offset-1 focus-visible:outline-1 disabled:opacity-40 motion-reduce:transition-none",
          size === "sm" && "min-h-ui-control-sm px-1.5 py-1",
          size === "md" && "min-h-ui-control-md",
          size === "menu" && "h-ui-control-sm min-h-0 px-ui-pad-sm py-0",
          isHighlighted && "bg-ui-state-hover",
          isSelected && "bg-ui-control-selected",
          className,
        )}
      >
        {children}
      </button>
    </ListRowContext>
  );
}

interface ListRowPieceProps {
  children?: ReactNode;
  className?: string;
}
interface ListRowActionProps extends ComponentProps<"button"> {
  isActive?: boolean;
  variant?: "icon" | "meta";
}

function Slot({ children, className }: ListRowPieceProps) {
  const size = useContext(ListRowContext);
  return (
    <span
      className={cn(
        "grid size-5 shrink-0 place-items-center text-ui-muted",
        size === "sm" && "size-4",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Content({ children, className }: ListRowPieceProps) {
  const size = useContext(ListRowContext);
  return (
    <span
      className={cn(
        "flex min-w-0 grow flex-col",
        size === "menu" && "flex-row items-center",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Title({ children, className }: ListRowPieceProps) {
  return <span className={cn("truncate font-normal text-ui-primary", className)}>{children}</span>;
}

function Description({ children, className }: ListRowPieceProps) {
  return <span className={cn("truncate text-ui-detail text-ui-muted", className)}>{children}</span>;
}

function Meta({ children, className }: ListRowPieceProps) {
  return (
    <span
      className={cn(
        "ms-auto inline-flex shrink-0 items-center gap-ui-gap text-ui-detail text-ui-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Action({
  className,
  isActive = false,
  type = "button",
  variant = "icon",
  ...props
}: ListRowActionProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-ui-control border-0 bg-transparent text-ui-muted outline-ui-accent hover:bg-ui-state-hover hover:text-ui-primary focus-visible:outline-1",
        variant === "icon" ? "size-ui-control-sm" : "h-ui-control-sm px-ui-pad-sm text-ui-detail",
        isActive && "bg-ui-state-hover text-ui-primary",
        className,
      )}
    />
  );
}

const ListRow = Object.assign(ListRowRoot, { Slot, Content, Title, Description, Meta, Action });

export { ListRow };
export type { ListRowActionProps, ListRowPieceProps, ListRowProps, ListRowSize };
