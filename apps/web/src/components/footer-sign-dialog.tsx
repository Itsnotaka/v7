"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Button, Input } from "@sachikit/ui";
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";

import { FooterSignCanvas, type FooterSignCanvasHandle } from "~/components/footer-sign-canvas";
import { Drawer, DrawerContent, DrawerTitle, Field, Text } from "~/components/ui";
import { useIsMobile } from "~/hooks/use-is-mobile";
import {
  FOOTER_SIGNATURE_NAME_LIMIT,
  type FooterSignatureInput,
  type FooterSignatureMark,
} from "~/lib/footer-signature";

function SignDialogContent(props: {
  error: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: FooterSignatureInput) => void;
  saving: boolean;
}) {
  const mobile = useIsMobile();
  const canvas = useRef<FooterSignCanvasHandle>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      mark: null as FooterSignatureMark | null,
    },
    onSubmit: ({ value }) => {
      if (!value.mark) return;
      props.onSubmit({
        name: value.name.trim(),
        svg: value.mark.svg,
      });
    },
  });

  const clear = () => {
    canvas.current?.clear();
    form.setFieldValue("mark", null);
  };

  const content = (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div className="grid gap-3">
        <form.Field
          name="name"
          validators={{
            onSubmit: ({ value }) => {
              if (!value.trim()) return "Name is required";
              if (value.trim().length > FOOTER_SIGNATURE_NAME_LIMIT)
                return `Name must be ${FOOTER_SIGNATURE_NAME_LIMIT} characters or less`;
              return undefined;
            },
          }}
        >
          {(field) => (
            <Field
              label="Name"
              error={
                field.state.meta.errors.length
                  ? { match: "customError", message: String(field.state.meta.errors[0]) }
                  : undefined
              }
            >
              <Input
                maxLength={FOOTER_SIGNATURE_NAME_LIMIT}
                placeholder="Your name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>

        <form.Field
          name="mark"
          validators={{
            onSubmit: ({ value }) => (value ? undefined : "Draw your signature"),
          }}
        >
          {(field) => (
            <div className="grid gap-1">
              <FooterSignCanvas ref={canvas} onChange={field.handleChange} />
              {field.state.meta.errors.length > 0 ? (
                <Text variant="error" size="sm">
                  {String(field.state.meta.errors[0])}
                </Text>
              ) : null}
            </div>
          )}
        </form.Field>

        {props.error ? (
          <Text variant="error" size="sm">
            {props.error}
          </Text>
        ) : null}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          type="button"
          variant="ghost"
          disabled={props.saving}
          onClick={() => props.onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button size="sm" type="button" variant="secondary" disabled={props.saving} onClick={clear}>
          Clear
        </Button>
        <Button size="sm" type="submit" variant="default" disabled={props.saving}>
          Save
        </Button>
      </div>
    </form>
  );

  if (mobile) {
    return (
      <Drawer open={props.open} onOpenChange={props.onOpenChange} repositionInputs={false}>
        <DrawerContent>
          <div className="flex flex-col gap-3 p-3">
            <DrawerTitle>Sign the footer</DrawerTitle>
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog.Root open={props.open} onOpenChange={(value) => props.onOpenChange(value)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-background text-sm ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <div className="flex flex-col gap-3 p-3">
            <Dialog.Title className="text-base leading-none font-medium">
              Sign the footer
            </Dialog.Title>
            {content}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function FooterSignDialog(props: {
  error: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: FooterSignatureInput) => void;
  saving: boolean;
}) {
  const [resetKey, setResetKey] = useState(0);

  const onOpenChange = (open: boolean) => {
    props.onOpenChange(open);
    if (!open) {
      setResetKey((k) => k + 1);
    }
  };

  return <SignDialogContent key={resetKey} {...props} onOpenChange={onOpenChange} />;
}
