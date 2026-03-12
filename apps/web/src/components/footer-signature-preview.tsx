"use client";

import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_OFFSET_DEFAULT,
  FOOTER_SIGNATURE_SCALE_DEFAULT,
} from "~/lib/footer-signature";
import { cn } from "~/utils/cn";

function parseSvg(src: string) {
  if (!src.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;

  const body = src.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();

  if (!body || body.length % 4 === 1 || !/^[A-Za-z0-9+/]*={0,2}$/.test(body)) return null;

  try {
    return atob(body);
  } catch {
    return null;
  }
}

export function FooterSignaturePreview(props: {
  svg: string;
  scale?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  const svg = parseSvg(props.svg);

  if (!svg) return null;

  const scale = props.scale ?? FOOTER_SIGNATURE_SCALE_DEFAULT;
  const x = props.x ?? FOOTER_SIGNATURE_OFFSET_DEFAULT;
  const y = props.y ?? FOOTER_SIGNATURE_OFFSET_DEFAULT;

  return (
    <span className={cn("block h-full w-full overflow-visible", props.className)}>
      <span
        aria-hidden
        className="block h-full w-full origin-center text-foreground transition-transform [&_circle]:fill-current [&_circle]:stroke-current [&_ellipse]:fill-current [&_ellipse]:stroke-current [&_line]:stroke-current [&_path]:stroke-current [&_polygon]:fill-current [&_polygon]:stroke-current [&_polyline]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:overflow-visible"
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ transform: `translate(${x}%, ${y}%) scale(${scale})` }}
      />
    </span>
  );
}
