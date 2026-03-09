"use client";

import { IconChevronDownSmall } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import {
  Button,
  Dialog,
  DialogRoot,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerTitle,
  Input,
  Text,
} from "@nyte/ui";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { FooterSignCanvas } from "~/components/footer-sign-canvas";
import {
  FOOTER_SIGNATURE_NAME_LIMIT,
  type FooterSignatureInput,
  type FooterSignatureMark,
} from "~/lib/footer-signature";

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return mobile;
}

export function FooterSignDialog(props: {
  error: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: FooterSignatureInput) => void;
  saving: boolean;
}) {
  const [reset, setReset] = useState(0);
  const [verifyExpanded, setVerifyExpanded] = useState(false);
  const mobile = useIsMobile();

  const form = useForm({
    defaultValues: {
      name: "",
      mark: null as FooterSignatureMark | null,
      email: "",
    },
    onSubmit: ({ value }) => {
      if (!value.mark) return;
      props.onSubmit({
        name: value.name.trim(),
        svg: value.mark.svg,
        email: value.email.trim() || undefined,
      });
    },
  });

  useEffect(() => {
    if (props.open) return;
    form.reset();
    setReset((value) => value + 1);
    setVerifyExpanded(false);
  }, [props.open, form]);

  const clear = () => {
    form.setFieldValue("mark", null);
    setReset((value) => value + 1);
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
            <Input
              label="Name"
              maxLength={FOOTER_SIGNATURE_NAME_LIMIT}
              placeholder="Your name"
              value={field.state.value}
              variant={field.state.meta.errors.length ? "error" : "default"}
              error={
                field.state.meta.errors.length ? String(field.state.meta.errors[0]) : undefined
              }
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
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
              <FooterSignCanvas onChange={field.handleChange} reset={reset} />
              {field.state.meta.errors.length > 0 ? (
                <Text variant="error" size="sm">
                  {String(field.state.meta.errors[0])}
                </Text>
              ) : null}
            </div>
          )}
        </form.Field>

        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => setVerifyExpanded((v) => !v)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Want to verify your signature?</span>
            <motion.span
              animate={{ rotate: verifyExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconChevronDownSmall className="w-4 h-4" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {verifyExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="-mx-1 overflow-hidden px-1"
              >
                <form.Field
                  name="email"
                  validators={{
                    onSubmit: ({ value }) => {
                      if (!value.trim()) return undefined;
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      return emailRegex.test(value) ? undefined : "Invalid email address";
                    },
                  }}
                >
                  {(field) => (
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      value={field.state.value}
                      variant={field.state.meta.errors.length ? "error" : "default"}
                      error={
                        field.state.meta.errors.length
                          ? String(field.state.meta.errors[0])
                          : undefined
                      }
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </form.Field>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
        <Button
          size="sm"
          type="submit"
          variant="primary"
          disabled={props.saving}
          loading={props.saving}
        >
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
    <DialogRoot open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog size="lg" className="rounded-sm">
        <div className="flex flex-col gap-3 p-3">
          <DialogTitle>Sign the footer</DialogTitle>
          {content}
        </div>
      </Dialog>
    </DialogRoot>
  );
}
