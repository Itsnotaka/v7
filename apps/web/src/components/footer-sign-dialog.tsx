"use client";

import { Button, Dialog, DialogRoot, DialogTitle } from "@nyte/ui";
import { useEffect, useState } from "react";

import type { FooterSignatureDraft } from "~/lib/footer-signature";

import { FooterSignCanvas } from "~/components/footer-sign-canvas";

export function FooterSignDialog(props: {
  open: boolean;
  onDraft: (value: FooterSignatureDraft) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [reset, setReset] = useState(0);
  const [value, setValue] = useState<FooterSignatureDraft | null>(null);

  useEffect(() => {
    if (props.open) return;

    setValue(null);
    setReset((x) => x + 1);
  }, [props.open]);

  return (
    <DialogRoot open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog size="lg" className="rounded-sm">
        <div className="flex flex-col gap-3 p-3">
          <DialogTitle>Sign the board</DialogTitle>

          <FooterSignCanvas onChange={setValue} reset={reset} />

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
              disabled={!value}
              onClick={() => {
                setValue(null);
                setReset((x) => x + 1);
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="rounded-sm"
              disabled={!value}
              onClick={() => {
                if (!value) return;
                props.onDraft(value);
                props.onOpenChange(false);
              }}
            >
              Place signature
            </Button>
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
