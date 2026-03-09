"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import SignaturePad, { type PointGroup } from "signature_pad";

import type { FooterSignatureDraft } from "~/lib/footer-signature";

export function FooterSignCanvas(props: {
  onChange: (value: FooterSignatureDraft | null) => void;
  reset: number;
}) {
  const { resolvedTheme } = useTheme();
  const onChange = props.onChange;
  const reset = props.reset;
  const frame = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const pad = useRef<SignaturePad | null>(null);
  const data = useRef<PointGroup[]>([]);
  const ink = resolvedTheme === "dark" ? "#f7f3ea" : "#151823";

  useEffect(() => {
    const box = frame.current;
    const node = ref.current;

    if (!box || !node) return;

    const sync = () => {
      const next = pad.current;

      if (!next || next.isEmpty()) {
        data.current = [];
        onChange(null);
        return;
      }

      data.current = next.toData();
      onChange({
        svg: next.toDataURL("image/svg+xml"),
        aspect: node.width / node.height,
        x: 0,
        y: 0,
      });
    };

    const mount = () => {
      const rect = box.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const wide = Math.max(1, Math.floor(rect.width * ratio));
      const tall = Math.max(1, Math.floor(rect.height * ratio));
      const next = data.current;

      pad.current?.removeEventListener("endStroke", sync);
      pad.current?.off();

      node.width = wide;
      node.height = tall;
      node.style.width = `${rect.width}px`;
      node.style.height = `${rect.height}px`;

      const ctx = node.getContext("2d");

      if (!ctx) return;

      ctx.scale(ratio, ratio);

      const BASE_WIDTH = 400;
      const scale = rect.width / BASE_WIDTH;
      const sign = new SignaturePad(node, {
        minDistance: 0,
        minWidth: 0.8 * scale,
        maxWidth: 2.2 * scale,
        penColor: ink,
        throttle: 0,
      });

      sign.addEventListener("endStroke", sync);
      pad.current = sign;

      if (!next.length) {
        onChange(null);
        return;
      }

      sign.fromData(next);
      sync();
    };

    mount();

    const watch = new ResizeObserver(mount);
    watch.observe(box);

    return () => {
      watch.disconnect();
      pad.current?.removeEventListener("endStroke", sync);
      pad.current?.off();
      pad.current = null;
    };
  }, [ink, onChange]);

  useEffect(() => {
    const next = pad.current;

    if (!next) return;

    data.current = [];
    next.clear();
    onChange(null);
  }, [onChange, reset]);

  return (
    <div ref={frame} className="overflow-hidden rounded-2px ring ring-border">
      <canvas
        ref={ref}
        data-vaul-no-drag
        className="block aspect-[2/1] w-full touch-none select-none bg-card"
      />
    </div>
  );
}
