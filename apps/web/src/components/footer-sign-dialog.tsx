"use client";

import { Button, Dialog, DialogDescription, DialogRoot, DialogTitle, Text } from "@nyte/ui";
import { useEffect, useState } from "react";

import { FooterSignCanvas } from "~/components/footer-sign-canvas";
import type { FooterSignatureDraft } from "~/lib/footer-signature";

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
      <Dialog size="lg">
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-col gap-1">
            <DialogTitle>Sign the board</DialogTitle>
            <DialogDescription>
              Draw with a mouse, finger, or stylus. When it looks right, place it on the board.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-3">
            <FooterSignCanvas onChange={setValue} reset={reset} />
            <Text variant="secondary" size="sm">
              Use the full width of the pad for the cleanest result. You can clear and redraw before
              placing it.
            </Text>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={() => props.onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              disabled={!value}
              onClick={() => {
                setValue(null);
                setReset((x) => x + 1);
              }}
            >
              Clear
            </Button>
            <Button
              variant="primary"
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
