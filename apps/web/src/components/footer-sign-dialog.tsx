"use client";

import {
  Button,
  Dialog,
  DialogRoot,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@nyte/ui";
import { useEffect, useState } from "react";

import type { FooterSignatureDraft } from "~/lib/footer-signature";

import { FooterSignCanvas } from "~/components/footer-sign-canvas";

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

function FooterSignContent(props: {
  value: FooterSignatureDraft | null;
  onChange: (value: FooterSignatureDraft | null) => void;
  onClear: () => void;
  reset: number;
  onOpenChange: (open: boolean) => void;
  onDraft: (value: FooterSignatureDraft) => void;
}) {
  return (
    <>
      <FooterSignCanvas onChange={props.onChange} reset={props.reset} />

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-sm"
          onClick={() => props.onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-sm"
          disabled={!props.value}
          onClick={props.onClear}
        >
          Clear
        </Button>
        <Button
          size="sm"
          variant="primary"
          className="rounded-sm"
          disabled={!props.value}
          onClick={() => {
            if (!props.value) return;
            props.onDraft(props.value);
            props.onOpenChange(false);
          }}
        >
          Place signature
        </Button>
      </div>
    </>
  );
}

export function FooterSignDialog(props: {
  open: boolean;
  onDraft: (value: FooterSignatureDraft) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [reset, setReset] = useState(0);
  const [value, setValue] = useState<FooterSignatureDraft | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (props.open) return;
    setValue(null);
    setReset((x) => x + 1);
  }, [props.open]);

  const clear = () => {
    setValue(null);
    setReset((x) => x + 1);
  };

  if (isMobile) {
    return (
      <Drawer open={props.open} onOpenChange={props.onOpenChange}>
        <DrawerContent className="p-3">
          <DrawerTitle className="mb-3">Sign the board</DrawerTitle>
          <FooterSignContent
            value={value}
            onChange={setValue}
            onClear={clear}
            reset={reset}
            onOpenChange={props.onOpenChange}
            onDraft={props.onDraft}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DialogRoot open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog size="lg" className="rounded-sm">
        <div className="flex flex-col gap-3 p-3">
          <DialogTitle>Sign the board</DialogTitle>
          <FooterSignContent
            value={value}
            onChange={setValue}
            onClear={clear}
            reset={reset}
            onOpenChange={props.onOpenChange}
            onDraft={props.onDraft}
          />
        </div>
      </Dialog>
    </DialogRoot>
  );
}
