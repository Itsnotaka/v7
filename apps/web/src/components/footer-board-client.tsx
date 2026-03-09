"use client";

import { IconSignature } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { Text } from "@nyte/ui";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

import { FooterSignDialog } from "~/components/footer-sign-dialog";
import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_HEIGHT,
  FOOTER_SIGNATURE_LIMIT,
  type FooterSignatureDraft,
  type FooterSignatureInput,
  type FooterSignatureRecord,
  footerSignatureRecord,
} from "~/lib/footer-signature";
import { cn } from "~/utils/cn";

const footerSignatureError = z.object({
  error: z.string().trim().min(1),
});

async function saveSignature(draft: FooterSignatureDraft) {
  const body: FooterSignatureInput = { name: draft.name, svg: draft.svg };
  const res = await fetch("/api/footer-signatures", {
    body: JSON.stringify(body),
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

function parse(src: string) {
  if (!src.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;

  const body = src.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();

  if (!body || body.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(body)) return null;

  return globalThis.atob(body);
}

function Signature(props: { svg: string }) {
  const svg = parse(props.svg);

  if (!svg) return null;

  return (
    <span
      aria-hidden
      className="block h-full w-full text-foreground [&_circle]:fill-current [&_circle]:stroke-current [&_path]:stroke-current [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:overflow-visible"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function FooterBoardClient(props: { items: FooterSignatureRecord[]; ready: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState(() => props.items);
  const [open, setOpen] = useState(false);
  const full = items.length >= FOOTER_SIGNATURE_LIMIT;
  const save = useMutation<FooterSignatureRecord, Error, FooterSignatureDraft>({
    mutationFn: saveSignature,
    onError: (value) => {
      setError(value.message);
    },
    onSuccess: (value) => {
      setItems((list) => [...list, value]);
      setError(null);
      setOpen(false);
    },
  });

  return (
    <>
      <div className="col-span-full grid grid-cols-subgrid gap-y-6 py-8">
        <blockquote className="col-span-full text-2xl/[1.4] italic tracking-wide text-foreground desktop:col-span-5">
          Think about why obvious questions are obvious, that makes you understand how to solve
          complex problems.
        </blockquote>

        <div className="col-span-full flex items-center justify-between">
          <button
            className={cn(
              "flex items-center gap-1.5 font-serif text-xs/[1.5] italic tracking-wide transition-colors",
              full || save.isPending || !props.ready
                ? "pointer-events-none text-muted-foreground/50"
                : "text-muted-foreground hover:text-foreground",
            )}
            disabled={!props.ready || full || save.isPending}
            onClick={() => {
              setError(null);
              setOpen(true);
            }}
            type="button"
          >
            <IconSignature size={14} />
            <span>{full ? "List full" : "Add signature"}</span>
          </button>
        </div>

        {items.length > 0 ? (
          <div className="col-span-full flex flex-wrap items-end gap-x-8 gap-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-1">
                <div
                  className="overflow-hidden"
                  style={{ height: FOOTER_SIGNATURE_HEIGHT, aspectRatio: item.aspect }}
                >
                  <Signature svg={item.svg} />
                </div>
                <span className="text-[10px]/[1.25] text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        ) : null}

        {error ? (
          <div className="col-span-full">
            <Text variant="error" size="sm">
              {error}
            </Text>
          </div>
        ) : null}
      </div>

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
