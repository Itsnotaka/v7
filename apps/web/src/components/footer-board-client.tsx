"use client";

import { IconSignature } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { Button, Text } from "@nyte/ui";
import { Dithering } from "@paper-design/shaders-react";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { FooterSignDialog } from "~/components/footer-sign-dialog";
import {
  FOOTER_BOARD_HEIGHT,
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_HEIGHT,
  FOOTER_SIGNATURE_LIMIT,
  footerSignatureRecord,
  type FooterSignatureDraft,
  type FooterSignatureRecord,
} from "~/lib/footer-signature";
import { cn } from "~/utils/cn";

const SPOTS = [
  { cx: 0.08, cy: 0.12 },
  { cx: 0.5, cy: 0.12 },
  { cx: 0.92, cy: 0.12 },
  { cx: 0.08, cy: 0.5 },
  { cx: 0.5, cy: 0.5 },
  { cx: 0.92, cy: 0.5 },
  { cx: 0.08, cy: 0.88 },
  { cx: 0.5, cy: 0.88 },
  { cx: 0.92, cy: 0.88 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function box(aspect: number) {
  return {
    height: FOOTER_SIGNATURE_HEIGHT,
    width: FOOTER_SIGNATURE_HEIGHT * aspect,
  };
}

function point(item: { aspect: number; x: number; y: number }, wide: number, tall: number) {
  const size = box(item.aspect);
  const maxX = Math.max(0, wide - size.width);
  const maxY = Math.max(0, tall - size.height);

  return {
    height: size.height,
    left: clamp(item.x * wide, 0, maxX),
    top: clamp(item.y * tall, 0, maxY),
    width: size.width,
  };
}

function snap(draft: FooterSignatureDraft, cx: number, cy: number, wide: number, tall: number) {
  const size = box(draft.aspect);
  const hx = wide > 0 ? size.width / (2 * wide) : 0;
  const hy = tall > 0 ? size.height / (2 * tall) : 0;
  return {
    x: clamp(cx - hx, 0, 1),
    y: clamp(cy - hy, 0, 1),
  };
}

const footerSignatureError = z.object({
  error: z.string().trim().min(1),
});

async function saveSignature(draft: FooterSignatureDraft) {
  const res = await fetch("/api/footer-signatures", {
    body: JSON.stringify({ svg: draft.svg, x: draft.x, y: draft.y }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const body = await res.json();
  const item = footerSignatureRecord.safeParse(body);

  if (res.ok && item.success) {
    return item.data;
  }

  const error = footerSignatureError.safeParse(body);
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

export function FooterBoardDither() {
  const { resolvedTheme } = useTheme();

  return (
    <Dithering
      className="pointer-events-none !absolute inset-0"
      colorBack="#00000000"
      colorFront={resolvedTheme === "dark" ? "#eae3d6" : "#191918"}
      shape="simplex"
      type="4x4"
      size={2}
      speed={0.15}
      scale={0.8}
      style={{ width: "100%", height: "100%", opacity: 0.06 }}
    />
  );
}

export function FooterBoardClient(props: { items: FooterSignatureRecord[]; ready: boolean }) {
  const board = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ dx: number; dy: number; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<FooterSignatureDraft | null>(null);
  const [items, setItems] = useState(() => props.items);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({
    height: FOOTER_BOARD_HEIGHT,
    width: 0,
  });
  const [testFull, setTestFull] = useState(false);
  const full = items.length >= FOOTER_SIGNATURE_LIMIT || testFull;
  const ghost = draft ? point(draft, size.width, size.height) : null;
  const save = useMutation({
    mutationFn: saveSignature,
    onError: (value) => {
      setError(value.message);
    },
    onSuccess: (value) => {
      setItems((list) => [...list, value]);
      setDraft(null);
    },
  });

  useEffect(() => {
    const node = board.current;

    if (!node) return;

    const sync = () => {
      setSize({
        height: node.clientHeight,
        width: node.clientWidth,
      });
    };

    sync();

    const watch = new ResizeObserver(sync);
    watch.observe(node);

    return () => watch.disconnect();
  }, []);

  return (
    <>
      <div className="flex w-full shrink-0 items-center px-3 py-3">
        <div className="flex items-center gap-2">
          {draft ? (
            <>
              <div className="mr-1 grid grid-cols-3 gap-1" aria-label="Quick placement grid">
                {SPOTS.map((spot, i) => (
                  <button
                    key={i}
                    aria-label={`Place at zone ${i + 1}`}
                    className="size-2.5 rounded-full border border-border transition-colors hover:border-foreground/50 hover:bg-foreground/20"
                    onClick={() => {
                      if (!draft) return;
                      const pos = snap(draft, spot.cx, spot.cy, size.width, size.height);
                      setDraft({ ...draft, ...pos });
                    }}
                    type="button"
                  />
                ))}
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="rounded-sm"
                onClick={() => {
                  if (!draft) return;
                  const rx = Math.random() * 0.84 + 0.08;
                  const ry = Math.random() * 0.76 + 0.12;
                  const pos = snap(draft, rx, ry, size.width, size.height);
                  setDraft({ ...draft, ...pos });
                }}
              >
                Shuffle
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-sm"
                onClick={() => {
                  setDraft(null);
                  setError(null);
                }}
              >
                Discard
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="rounded-sm"
                loading={save.isPending}
                onClick={() => {
                  if (!draft) return;

                  setError(null);
                  save.mutate(draft);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  full
                    ? "pointer-events-none text-muted-foreground/50"
                    : "text-muted-foreground hover:text-foreground",
                )}
                disabled={!props.ready || full}
                onClick={() => setOpen(true)}
                type="button"
              >
                <IconSignature size={14} />
                <span>{full ? "Board full" : "Add signature"}</span>
              </button>
              {process.env.NODE_ENV === "development" && (
                <button
                  className="text-[10px] text-muted-foreground/50 transition-colors hover:text-foreground"
                  onClick={() => setTestFull((v) => !v)}
                  title={testFull ? "Disable test full" : "Enable test full"}
                  type="button"
                >
                  [{testFull ? "full on" : "full off"}]
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        ref={board}
        className={cn("relative w-full flex-1 overflow-hidden", draft && "cursor-crosshair")}
        style={{ minHeight: FOOTER_BOARD_HEIGHT }}
        onClick={(event) => {
          if (!draft || !board.current) return;
          const rect = board.current.getBoundingClientRect();
          const cx = (event.clientX - rect.left) / rect.width;
          const cy = (event.clientY - rect.top) / rect.height;
          const pos = snap(draft, cx, cy, rect.width, rect.height);
          setDraft({ ...draft, ...pos });
        }}
      >
        {!items.length && !draft ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center">
            <Text variant="secondary" size="sm">
              No signatures yet. Start the board.
            </Text>
          </div>
        ) : null}

        {items.map((item) => {
          const sig = box(item.aspect);

          return (
            <div
              key={item.id}
              className="pointer-events-none absolute"
              style={{
                height: sig.height,
                left: `${item.x * 100}%`,
                top: `${item.y * 100}%`,
                width: sig.width,
              }}
            >
              <Signature svg={item.svg} />
            </div>
          );
        })}

        {draft && ghost ? (
          <button
            aria-label="Drag your signature"
            className="absolute cursor-grab rounded-sm border border-primary/30 bg-background/50 p-1 shadow-sm active:scale-[0.99] active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onPointerCancel={(event) => {
              if (drag.current?.id !== event.pointerId) return;
              drag.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerDown={(event) => {
              if (!board.current) return;

              event.stopPropagation();

              const rect = board.current.getBoundingClientRect();
              drag.current = {
                dx: event.clientX - rect.left - ghost.left,
                dy: event.clientY - rect.top - ghost.top,
                id: event.pointerId,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (
                !board.current ||
                !draft ||
                !drag.current ||
                drag.current.id !== event.pointerId
              ) {
                return;
              }

              const rect = board.current.getBoundingClientRect();
              const next = box(draft.aspect);
              const maxX = Math.max(0, rect.width - next.width);
              const maxY = Math.max(0, rect.height - next.height);
              const left = clamp(event.clientX - rect.left - drag.current.dx, 0, maxX);
              const top = clamp(event.clientY - rect.top - drag.current.dy, 0, maxY);

              setDraft({
                ...draft,
                x: rect.width ? left / rect.width : 0,
                y: rect.height ? top / rect.height : 0,
              });
            }}
            onPointerUp={(event) => {
              if (drag.current?.id !== event.pointerId) return;
              drag.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            style={{
              height: ghost.height + 8,
              left: Math.max(0, ghost.left - 4),
              top: Math.max(0, ghost.top - 4),
              touchAction: "none",
              width: ghost.width + 8,
            }}
            type="button"
          >
            <Signature svg={draft.svg} />
          </button>
        ) : null}
      </div>

      {error || !props.ready ? (
        <div className="w-full shrink-0 px-3">
          <Text variant="error" size="sm">
            {error ?? "The board is unavailable until Upstash Redis is configured."}
          </Text>
        </div>
      ) : null}

      <FooterSignDialog
        open={open}
        onDraft={(value) => {
          const rect = board.current?.getBoundingClientRect();
          const wide = rect?.width ?? size.width;
          const tall = rect?.height ?? size.height;
          const pos = snap(value, 0.5, 0.5, wide, tall);

          setDraft({ ...value, ...pos });
          setError(null);
        }}
        onOpenChange={setOpen}
      />
    </>
  );
}
