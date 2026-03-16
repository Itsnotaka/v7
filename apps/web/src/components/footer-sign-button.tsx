"use client";

import { IconSignature } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { Tooltip } from "@ticu/ui";
import { Text } from "~/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

import { FooterSignDialog } from "~/components/footer-sign-dialog";
import {
  type FooterSignatureInput,
  type FooterSignatureRecord,
  type FooterSignatureResponse,
  footerSignatureRecord,
} from "~/lib/footer-signature";
import { cn } from "~/utils/cn";

const footerSignatureError = z.object({
  error: z.string().trim().min(1),
});

async function saveSignature(input: FooterSignatureInput) {
  const res = await fetch("/api/footer-signatures", {
    body: JSON.stringify(input),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const data: unknown = await res.json();
  const item = footerSignatureRecord.safeParse(data);

  if (res.ok && item.success) {
    return item.data;
  }

  const error = footerSignatureError.safeParse(data);
  throw new Error(error.success ? error.data.error : "Unable to save signature");
}

export function FooterSignButton(props: {
  full: boolean;
  ready: boolean;
  count: number;
  limit: number;
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const save = useMutation<FooterSignatureRecord, Error, FooterSignatureInput>({
    mutationFn: saveSignature,
    onError: (value) => {
      setError(value.message);
    },
    onSuccess: (record) => {
      setError(null);
      setOpen(false);
      queryClient.setQueryData<FooterSignatureResponse>(["footer-signatures"], (old) =>
        old ? { ...old, items: [...old.items, record] } : { items: [record], limit: props.limit },
      );
      void queryClient.invalidateQueries({ queryKey: ["footer-signatures"] });
    },
  });

  return (
    <>
      <div className="col-span-full flex items-center justify-between">
        <span className="font-serif text-xs/[1.5] italic tracking-wide text-muted-foreground/50">
          {props.count} {props.count === 1 ? "person" : "people"} left their trails here
        </span>

        {props.full ? (
          <Tooltip
            content={`The guestbook has reached its limit of ${props.limit} signatures. Thank you to everyone who signed!`}
          >
            <span className="flex cursor-help items-center gap-1.5 font-serif text-xs/[1.5] italic tracking-wide text-muted-foreground/30">
              <IconSignature size={14} />
              <span>Guestbook full</span>
            </span>
          </Tooltip>
        ) : (
          <button
            className={cn(
              "flex items-center gap-1.5 font-serif text-xs/[1.5] italic tracking-wide transition-colors",
              save.isPending || !props.ready
                ? "pointer-events-none text-muted-foreground/50"
                : "text-muted-foreground hover:text-foreground",
            )}
            disabled={!props.ready || save.isPending}
            onClick={() => {
              setError(null);
              setOpen(true);
            }}
            type="button"
          >
            <IconSignature size={14} />
            <span>Leave your trail</span>
          </button>
        )}
      </div>

      {error ? (
        <div className="col-span-full">
          <Text variant="error" size="sm">
            {error}
          </Text>
        </div>
      ) : null}

      <FooterSignDialog
        error={error}
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (value) return;

          setError(null);
        }}
        onSubmit={(value) => {
          setError(null);
          save.mutate(value);
        }}
        saving={save.isPending}
      />
    </>
  );
}
