"use client";

import { IconCircleInfo } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { Button, Text, Tooltip, TooltipProvider } from "@nyte/ui";
import { useEffect, useRef, useState } from "react";

import { FooterSignDialog } from "~/components/footer-sign-dialog";
import {
  FOOTER_BOARD_HEIGHT,
  FOOTER_SIGNATURE_HEIGHT,
  FOOTER_SIGNATURE_LIMIT,
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

export function FooterBoardClient(props: { items: FooterSignatureRecord[]; ready: boolean }) {
  const board = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ dx: number; dy: number; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<FooterSignatureDraft | null>(null);
  const [items, setItems] = useState(props.items);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [size, setSize] = useState({
    height: FOOTER_BOARD_HEIGHT,
    width: 0,
  });
  const full = items.length >= FOOTER_SIGNATURE_LIMIT;
  const ghost = draft ? point(draft, size.width, size.height) : null;

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

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
      <div className="mx-auto flex w-full max-w-[108rem] flex-col gap-3 px-3 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Text as="h2" variant="heading3" size="base">
              Sign board
            </Text>
            <TooltipProvider>
              <Tooltip asChild content={`Limited to ${FOOTER_SIGNATURE_LIMIT} signatures.`}>
                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <IconCircleInfo className="size-3.5" />
                </button>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Text variant="secondary" size="sm">
            {draft
              ? "Click the board, use the grid, or drag to position."
              : "Leave a mark on the footer."}
          </Text>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
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
                variant="ghost"
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
                variant="secondary"
                onClick={() => {
                  setDraft(null);
                  setError(null);
                }}
              >
                Discard
              </Button>
              <Button
                variant="primary"
                loading={saving}
                onClick={async () => {
                  if (!draft) return;

                  setSaving(true);
                  setError(null);

                  try {
                    const res = await fetch("/api/footer-signatures", {
                      body: JSON.stringify({ svg: draft.svg, x: draft.x, y: draft.y }),
                      headers: { "Content-Type": "application/json" },
                      method: "POST",
                    });
                    const body = (await res.json().catch(() => null)) as
                      | FooterSignatureRecord
                      | { error?: string }
                      | null;

                    if (!res.ok) {
                      setError(
                        body && "error" in body && body.error
                          ? body.error
                          : "Unable to save signature",
                      );
                      return;
                    }

                    if (!body || !("id" in body)) {
                      setError("Unexpected response while saving the signature");
                      return;
                    }

                    setItems((list) => [...list, body]);
                    setDraft(null);
                  } catch {
                    setError("Unable to save signature");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <Button variant="ghost" disabled={!props.ready || full} onClick={() => setOpen(true)}>
              Sign the board
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <div className="mx-auto w-full max-w-[108rem] px-3 pb-2">
          <Text variant="error" size="sm">
            {error}
          </Text>
        </div>
      ) : null}

      {!props.ready ? (
        <div className="mx-auto w-full max-w-[108rem] px-3 pb-2">
          <Text variant="error" size="sm">
            The board is unavailable until Upstash Redis is configured.
          </Text>
        </div>
      ) : null}

      <div
        ref={board}
        className={cn("relative w-full overflow-hidden", draft && "cursor-crosshair")}
        style={{ height: FOOTER_BOARD_HEIGHT }}
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
              <img
                alt=""
                aria-hidden
                className="h-full w-full object-contain object-left"
                draggable={false}
                src={item.svg}
              />
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
            <img
              alt=""
              aria-hidden
              className="h-full w-full object-contain object-left"
              draggable={false}
              src={draft.svg}
            />
          </button>
        ) : null}
      </div>

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
