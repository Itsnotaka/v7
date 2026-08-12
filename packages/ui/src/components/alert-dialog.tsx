"use client";

import type { ComponentProps } from "react";

import { AlertDialog as Base } from "@base-ui/react/alert-dialog";

import { cn } from "../cn";

interface AlertDialogPopupProps extends Omit<Base.Popup.Props, "className"> {
  className?: string;
}

function AlertDialogPopup({ children, className, ...props }: AlertDialogPopupProps) {
  return (
    <Base.Portal>
      <Base.Backdrop
        data-slot="ui-alert-dialog-backdrop"
        className="fixed inset-0 z-[var(--v7-ui-z-dialog)] bg-ui-scrim opacity-100 transition-opacity duration-ui-fast ease-ui-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
      />
      <Base.Popup
        {...props}
        data-slot="ui-alert-dialog"
        className={cn(
          "fixed top-1/2 left-1/2 z-[var(--v7-ui-z-dialog)] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-y-auto rounded-ui-window bg-ui-base p-6 font-ui-control text-ui-body text-ui-primary opacity-100 shadow-ui-overlay ring-1 ring-ui-edge outline-hidden transition-[opacity,scale] duration-ui-fast ease-ui-out data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:scale-100 motion-reduce:transition-none",
          className,
        )}
      >
        {children}
      </Base.Popup>
    </Base.Portal>
  );
}

type AlertDialogTitleProps = Base.Title.Props;

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <Base.Title
      data-slot="ui-alert-dialog-title"
      className={cn("m-0 text-ui-heading font-semibold text-ui-primary", className)}
      {...props}
    />
  );
}

type AlertDialogDescriptionProps = Base.Description.Props;

function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps) {
  return (
    <Base.Description
      data-slot="ui-alert-dialog-description"
      className={cn("m-0 text-ui-body text-ui-muted", className)}
      {...props}
    />
  );
}

type AlertDialogHeaderProps = ComponentProps<"div">;

function AlertDialogHeader({ className, ...props }: AlertDialogHeaderProps) {
  return (
    <div
      data-slot="ui-alert-dialog-header"
      className={cn("flex flex-col gap-ui-gutter", className)}
      {...props}
    />
  );
}

type AlertDialogFooterProps = ComponentProps<"div">;

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
  return (
    <div
      data-slot="ui-alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse justify-end gap-ui-panel min-[480px]:flex-row min-[480px]:items-center",
        className,
      )}
      {...props}
    />
  );
}

const AlertDialog = {
  Root: Base.Root,
  Trigger: Base.Trigger,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Close: Base.Close,
};

export { AlertDialog };
export type {
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogPopupProps,
  AlertDialogTitleProps,
};
