"use client";

import { useTheme } from "next-themes";
import { useEffect, useImperativeHandle, useRef } from "react";
import SignaturePad, { type PointGroup } from "signature_pad";

import type { FooterSignatureMark } from "~/lib/footer-signature";

export interface FooterSignCanvasHandle {
  clear: () => void;
}

export function FooterSignCanvas(props: {
  ref?: React.Ref<FooterSignCanvasHandle>;
  onChange: (value: FooterSignatureMark | null) => void;
}) {
  const { resolvedTheme } = useTheme();
  const onChange = props.onChange;
  const frame = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const pad = useRef<SignaturePad | null>(null);
  const data = useRef<PointGroup[]>([]);
  const ink = resolvedTheme === "dark" ? "#f7f3ea" : "#151823";

  useImperativeHandle(props.ref, () => ({
    clear() {
      pad.current?.clear();
      data.current = [];
      onChange(null);
    },
  }));

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

      const sign = new SignaturePad(node, {
        minDistance: 0,
        minWidth: 0.8,
        maxWidth: 2.2,
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

  return (
    <div ref={frame} className="overflow-hidden rounded-lg ring ring-border">
      <canvas
        ref={ref}
        data-vaul-no-drag
        className="block aspect-[2/1] w-full touch-none select-none bg-background"
      />
    </div>
  );
}
