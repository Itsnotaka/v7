"use client";

import { useForm } from "@tanstack/react-form";
import { Button, Dialog, DialogContent, DialogTitle, Input } from "@sachikit/ui";
import { useState } from "react";

import { FooterSignCanvas } from "~/components/footer-sign-canvas";
// Local custom components
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
  const [canvasKey, setCanvasKey] = useState(0);

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
    setCanvasKey((k) => k + 1);
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
              <FooterSignCanvas key={canvasKey} onChange={field.handleChange} />
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
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-lg rounded-sm">
        <div className="flex flex-col gap-3 p-3">
          <DialogTitle>Sign the footer</DialogTitle>
          {content}
        </div>
      </DialogContent>
    </Dialog>
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
