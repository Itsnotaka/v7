"use client";

import { AlertDialog as AlertDialogBase } from "@base-ui/react/alert-dialog";
import { Dialog as DialogBase } from "@base-ui/react/dialog";
import { createContext, useContext, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { Surface } from "../surface";

export const NYTE_DIALOG_VARIANTS = {
  size: {
    sm: {
      classes: "min-w-72",
      description: "Small dialog for compact flows",
    },
    base: {
      classes: "sm:min-w-96",
      description: "Default dialog width",
    },
    lg: {
      classes: "min-w-(--dialog-lg)",
      description: "Large dialog",
    },
    xl: {
      classes: "min-w-(--dialog-xl)",
      description: "Extra large dialog",
    },
  },
  role: {
    dialog: {
      classes: "",
      description: "Standard dialog",
    },
    alertdialog: {
      classes: "",
      description: "Confirmation dialog",
    },
  },
} as const;

export const NYTE_DIALOG_DEFAULT_VARIANTS = {
  size: "base",
  role: "dialog",
} as const;

export type NyteDialogSize = keyof typeof NYTE_DIALOG_VARIANTS.size;
export type NyteDialogRole = keyof typeof NYTE_DIALOG_VARIANTS.role;

export interface NyteDialogVariantsProps {
  size?: NyteDialogSize;
}

const DialogRoleContext = createContext<NyteDialogRole>(NYTE_DIALOG_DEFAULT_VARIANTS.role);

function useDialogRole() {
  return useContext(DialogRoleContext);
}

export function dialogVariants({
  size = NYTE_DIALOG_DEFAULT_VARIANTS.size,
}: NyteDialogVariantsProps = {}) {
  return cn(
    "fixed top-1/2 left-1/2 w-full max-w-(--dialog-max) -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg duration-150 sm:w-auto sm:max-w-(--dialog-max-sm)",
    "data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
    "data-[ending-style]:scale-90 data-[ending-style]:opacity-0",
    NYTE_DIALOG_VARIANTS.size[size].classes,
  );
}

export type DialogProps = NyteDialogVariantsProps & {
  className?: string;
  children: ReactNode;
};

function DialogContent({
  className,
  children,
  size = NYTE_DIALOG_DEFAULT_VARIANTS.size,
}: DialogProps) {
  const role = useDialogRole();
  const BasePortal = role === "alertdialog" ? AlertDialogBase.Portal : DialogBase.Portal;
  const BaseBackdrop = role === "alertdialog" ? AlertDialogBase.Backdrop : DialogBase.Backdrop;
  const BasePopup = role === "alertdialog" ? AlertDialogBase.Popup : DialogBase.Popup;

  return (
    <BasePortal>
      <BaseBackdrop className="fixed inset-0 bg-popover/80 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
      <Surface as={BasePopup} className={cn(dialogVariants({ size }), className)}>
        {children}
      </Surface>
    </BasePortal>
  );
}

type BaseDialogRootProps = ComponentPropsWithoutRef<typeof DialogBase.Root>;

export type DialogRootProps = BaseDialogRootProps & {
  role?: NyteDialogRole;
};

function DialogRoot({
  children,
  role = NYTE_DIALOG_DEFAULT_VARIANTS.role,
  ...props
}: DialogRootProps) {
  const BaseRoot = role === "alertdialog" ? AlertDialogBase.Root : DialogBase.Root;

  return (
    <DialogRoleContext.Provider value={role}>
      <BaseRoot {...props}>{children}</BaseRoot>
    </DialogRoleContext.Provider>
  );
}

type BaseDialogTriggerProps = ComponentPropsWithoutRef<typeof DialogBase.Trigger>;
export type DialogTriggerProps = BaseDialogTriggerProps;

function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  const role = useDialogRole();
  const BaseTrigger = role === "alertdialog" ? AlertDialogBase.Trigger : DialogBase.Trigger;

  return <BaseTrigger {...props}>{children}</BaseTrigger>;
}

type BaseDialogTitleProps = ComponentPropsWithoutRef<typeof DialogBase.Title>;
export type DialogTitleProps = BaseDialogTitleProps;

function DialogTitle({ className, ...props }: DialogTitleProps) {
  const role = useDialogRole();
  const BaseTitle = role === "alertdialog" ? AlertDialogBase.Title : DialogBase.Title;

  return (
    <BaseTitle className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  );
}

type BaseDialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogBase.Description>;
export type DialogDescriptionProps = BaseDialogDescriptionProps;

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  const role = useDialogRole();
  const BaseDescription =
    role === "alertdialog" ? AlertDialogBase.Description : DialogBase.Description;

  return (
    <BaseDescription className={cn("text-sm/6 text-muted-foreground", className)} {...props} />
  );
}

type BaseDialogCloseProps = ComponentPropsWithoutRef<typeof DialogBase.Close>;
export type DialogCloseProps = BaseDialogCloseProps;

function DialogClose({ children, ...props }: DialogCloseProps) {
  const role = useDialogRole();
  const BaseClose = role === "alertdialog" ? AlertDialogBase.Close : DialogBase.Close;

  return <BaseClose {...props}>{children}</BaseClose>;
}

DialogRoot.displayName = "Dialog.Root";
DialogTrigger.displayName = "Dialog.Trigger";
DialogTitle.displayName = "Dialog.Title";
DialogDescription.displayName = "Dialog.Description";
DialogClose.displayName = "Dialog.Close";

const Dialog = DialogContent;

export { Dialog, DialogClose, DialogDescription, DialogRoot, DialogTitle, DialogTrigger };
