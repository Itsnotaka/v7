"use client";

import { Button, Text } from "@nyte/ui";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FooterSignDialog } from "~/components/footer-sign-dialog";
import {
  FOOTER_BOARD_HEIGHT,
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_HEIGHT,
  FOOTER_SIGNATURE_LIMIT,
  type FooterSignatureDraft,
  type FooterSignatureRecord,
} from "~/lib/footer-signature";
import { cn } from "~/utils/cn";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/design-system", label: "Design" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
] as const;

const SOCIAL = [
  { href: "https://github.com/itsnotaka", label: "GitHub" },
  { href: "https://www.linkedin.com/in/nameisdaniel/", label: "LinkedIn" },
  { href: "https://x.com/d2ac__", label: "X" },
] as const;

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

function parse(src: string) {
  if (!src.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;

  try {
    return globalThis.atob(src.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim());
  } catch {
    return null;
  }
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

      <div className="flex w-full shrink-0 items-center justify-between px-3 py-3">
        <div className="flex-1" />
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
            <>
              <Button
                className="font-normal"
                variant="ghost"
                disabled={!props.ready || full}
                onClick={() => setOpen(true)}
              >
                Add signature
              </Button>
              <nav className="flex shrink-0 items-center gap-3 text-xs">
                {PAGES.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                {SOCIAL.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </>
          )}
        </div>
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
