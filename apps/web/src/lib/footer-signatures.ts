import { cacheTag, revalidateTag } from "next/cache";

import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_LIMIT,
  footerSignatureRecord,
  type FooterSignatureInput,
  type FooterSignatureRecord,
} from "~/lib/footer-signature";
import { hasRedis, redis } from "~/lib/redis";

export const FOOTER_SIGNATURE_TAG = "footer-signatures";

const countKey = "footer:signatures:count";
const idsKey = "footer:signatures:ids";
const keyPrefix = "footer:signature:";
const forbidden =
  /<\s*script|<\s*foreignObject|<\s*iframe|<\s*object|<\s*embed|<\s*audio|<\s*video|<\s*image|<\s*use|<\s*style|<\s*animate|<\s*set|on[a-z]+\s*=|href\s*=|xlink:href\s*=|javascript:/i;
const base64 = /^[A-Za-z0-9+/=]+$/;
const elementTag = /<(path|circle)\b[^>]*?(?:\/\s*>|>\s*<\/\1\s*>)/gi;
const attributeToken = /([:\w-]+)\s*=\s*(["'])(.*?)\2/g;
const SVG_PAD = 0.5;
const MIN_SIGNATURE_ASPECT = 1;
const MAX_SIGNATURE_ASPECT = 8;

type FooterBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type FooterResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

function key(id: string) {
  return `${keyPrefix}${id}`;
}

function formatNumber(value: number) {
  const next = Number(value.toFixed(3));

  if (Object.is(next, -0)) return "0";

  return next.toString();
}

function parseNumber(value: string | null | undefined) {
  if (!value) return null;

  const item = value.trim().match(/^[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?$/);

  if (!item) return null;

  const next = Number(item[0]);

  if (!Number.isFinite(next)) return null;

  return next;
}

function attrs(tag: string) {
  const next: Record<string, string> = {};

  for (const item of tag.matchAll(attributeToken)) {
    const key = item[1]?.toLowerCase();
    const value = item[3];

    if (!key || value == null) continue;
    next[key] = value;
  }

  return next;
}

function includePoint(bounds: FooterBounds | null, x: number, y: number): FooterBounds {
  if (!bounds) {
    return {
      left: x,
      top: y,
      right: x,
      bottom: y,
    };
  }

  return {
    left: Math.min(bounds.left, x),
    top: Math.min(bounds.top, y),
    right: Math.max(bounds.right, x),
    bottom: Math.max(bounds.bottom, y),
  };
}

function includeBounds(bounds: FooterBounds | null, next: FooterBounds | null) {
  if (!next) return bounds;
  if (!bounds) return next;

  return {
    left: Math.min(bounds.left, next.left),
    top: Math.min(bounds.top, next.top),
    right: Math.max(bounds.right, next.right),
    bottom: Math.max(bounds.bottom, next.bottom),
  };
}

function expandBounds(bounds: FooterBounds, padding: number) {
  return {
    left: bounds.left - padding,
    top: bounds.top - padding,
    right: bounds.right + padding,
    bottom: bounds.bottom + padding,
  };
}

function lineBounds(x1: number, y1: number, x2: number, y2: number) {
  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    right: Math.max(x1, x2),
    bottom: Math.max(y1, y2),
  };
}

function cubicPoint(a: number, b: number, c: number, d: number, t: number) {
  const mt = 1 - t;

  return mt ** 3 * a + 3 * mt ** 2 * t * b + 3 * mt * t ** 2 * c + t ** 3 * d;
}

function cubicRoots(a: number, b: number, c: number, d: number) {
  const qa = -a + 3 * b - 3 * c + d;
  const qb = 2 * (a - 2 * b + c);
  const qc = -a + b;

  if (Math.abs(qa) < 1e-9) {
    if (Math.abs(qb) < 1e-9) return [];

    const root = -qc / qb;

    return root > 0 && root < 1 ? [root] : [];
  }

  const delta = qb ** 2 - 4 * qa * qc;

  if (delta < 0) return [];

  const base = Math.sqrt(delta);
  const roots = [(-qb + base) / (2 * qa), (-qb - base) / (2 * qa)];

  return roots.filter(
    (item, index) =>
      item > 0 && item < 1 && roots.findIndex((value) => Math.abs(value - item) < 1e-9) === index,
  );
}

function cubicBounds(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
) {
  let bounds = includePoint(null, x0, y0);
  bounds = includePoint(bounds, x3, y3);

  for (const t of cubicRoots(x0, x1, x2, x3)) {
    bounds = includePoint(bounds, cubicPoint(x0, x1, x2, x3, t), cubicPoint(y0, y1, y2, y3, t));
  }

  for (const t of cubicRoots(y0, y1, y2, y3)) {
    bounds = includePoint(bounds, cubicPoint(x0, x1, x2, x3, t), cubicPoint(y0, y1, y2, y3, t));
  }

  return bounds;
}

function quadraticPoint(a: number, b: number, c: number, t: number) {
  const mt = 1 - t;

  return mt ** 2 * a + 2 * mt * t * b + t ** 2 * c;
}

function quadraticRoots(a: number, b: number, c: number) {
  const base = a - 2 * b + c;

  if (Math.abs(base) < 1e-9) return [];

  const root = (a - b) / base;

  return root > 0 && root < 1 ? [root] : [];
}

function quadraticBounds(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  let bounds = includePoint(null, x0, y0);
  bounds = includePoint(bounds, x2, y2);

  for (const t of quadraticRoots(x0, x1, x2)) {
    bounds = includePoint(bounds, quadraticPoint(x0, x1, x2, t), quadraticPoint(y0, y1, y2, t));
  }

  for (const t of quadraticRoots(y0, y1, y2)) {
    bounds = includePoint(bounds, quadraticPoint(x0, x1, x2, t), quadraticPoint(y0, y1, y2, t));
  }

  return bounds;
}

function pathBounds(tag: string) {
  const item = attrs(tag);
  const d = item.d?.trim();

  if (!d) return null;

  const tokens = [...d.matchAll(/([AaCcHhLlMmQqSsTtVvZz])|([-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?)/g)].map(
    (match) => match[1] || match[2] || "",
  );

  if (!tokens.length) return null;

  let bounds: FooterBounds | null = null;
  let index = 0;
  let command = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let cubicX: number | null = null;
  let cubicY: number | null = null;
  let quadraticX: number | null = null;
  let quadraticY: number | null = null;
  let drew = false;

  const isCommand = (value: string) => /^[A-Za-z]$/.test(value);
  const peek = () => tokens[index] || null;
  const read = () => {
    const value = peek();

    if (!value || isCommand(value)) return null;

    index += 1;

    return Number(value);
  };

  while (index < tokens.length) {
    const head = tokens[index];

    if (head && isCommand(head)) {
      command = head;
      index += 1;
    }
    if (!head || (!isCommand(head) && !command)) return null;

    const relative = command === command.toLowerCase();
    const upper = command.toUpperCase();

    if (upper === "A") return null;

    if (upper === "Z") {
      bounds = includeBounds(bounds, lineBounds(x, y, startX, startY));
      x = startX;
      y = startY;
      cubicX = null;
      cubicY = null;
      quadraticX = null;
      quadraticY = null;
      drew = true;
      continue;
    }

    if (upper === "M") {
      const firstX = read();
      const firstY = read();

      if (firstX == null || firstY == null) return null;

      x = relative ? x + firstX : firstX;
      y = relative ? y + firstY : firstY;
      startX = x;
      startY = y;
      cubicX = null;
      cubicY = null;
      quadraticX = null;
      quadraticY = null;
      command = relative ? "l" : "L";

      while (peek() && !isCommand(peek()!)) {
        const nextX = read();
        const nextY = read();

        if (nextX == null || nextY == null) return null;

        const targetX = relative ? x + nextX : nextX;
        const targetY = relative ? y + nextY : nextY;

        bounds = includeBounds(bounds, lineBounds(x, y, targetX, targetY));
        x = targetX;
        y = targetY;
        drew = true;
      }

      continue;
    }

    if (upper === "L") {
      while (peek() && !isCommand(peek()!)) {
        const nextX = read();
        const nextY = read();

        if (nextX == null || nextY == null) return null;

        const targetX = relative ? x + nextX : nextX;
        const targetY = relative ? y + nextY : nextY;

        bounds = includeBounds(bounds, lineBounds(x, y, targetX, targetY));
        x = targetX;
        y = targetY;
        cubicX = null;
        cubicY = null;
        quadraticX = null;
        quadraticY = null;
        drew = true;
      }

      continue;
    }

    if (upper === "H") {
      while (peek() && !isCommand(peek()!)) {
        const nextX = read();

        if (nextX == null) return null;

        const targetX = relative ? x + nextX : nextX;

        bounds = includeBounds(bounds, lineBounds(x, y, targetX, y));
        x = targetX;
        cubicX = null;
        cubicY = null;
        quadraticX = null;
        quadraticY = null;
        drew = true;
      }

      continue;
    }

    if (upper === "V") {
      while (peek() && !isCommand(peek()!)) {
        const nextY = read();

        if (nextY == null) return null;

        const targetY = relative ? y + nextY : nextY;

        bounds = includeBounds(bounds, lineBounds(x, y, x, targetY));
        y = targetY;
        cubicX = null;
        cubicY = null;
        quadraticX = null;
        quadraticY = null;
        drew = true;
      }

      continue;
    }

    if (upper === "C") {
      while (peek() && !isCommand(peek()!)) {
        const a = read();
        const b = read();
        const c = read();
        const d = read();
        const e = read();
        const f = read();

        if ([a, b, c, d, e, f].some((value) => value == null)) return null;

        const control1X = relative ? x + a! : a!;
        const control1Y = relative ? y + b! : b!;
        const control2X = relative ? x + c! : c!;
        const control2Y = relative ? y + d! : d!;
        const targetX = relative ? x + e! : e!;
        const targetY = relative ? y + f! : f!;

        bounds = includeBounds(
          bounds,
          cubicBounds(x, y, control1X, control1Y, control2X, control2Y, targetX, targetY),
        );
        x = targetX;
        y = targetY;
        cubicX = control2X;
        cubicY = control2Y;
        quadraticX = null;
        quadraticY = null;
        drew = true;
      }

      continue;
    }

    if (upper === "S") {
      while (peek() && !isCommand(peek()!)) {
        const a = read();
        const b = read();
        const c = read();
        const d = read();

        if ([a, b, c, d].some((value) => value == null)) return null;

        const control1X = cubicX == null ? x : 2 * x - cubicX;
        const control1Y = cubicY == null ? y : 2 * y - cubicY;
        const control2X = relative ? x + a! : a!;
        const control2Y = relative ? y + b! : b!;
        const targetX = relative ? x + c! : c!;
        const targetY = relative ? y + d! : d!;

        bounds = includeBounds(
          bounds,
          cubicBounds(x, y, control1X, control1Y, control2X, control2Y, targetX, targetY),
        );
        x = targetX;
        y = targetY;
        cubicX = control2X;
        cubicY = control2Y;
        quadraticX = null;
        quadraticY = null;
        drew = true;
      }

      continue;
    }

    if (upper === "Q") {
      while (peek() && !isCommand(peek()!)) {
        const a = read();
        const b = read();
        const c = read();
        const d = read();

        if ([a, b, c, d].some((value) => value == null)) return null;

        const controlX = relative ? x + a! : a!;
        const controlY = relative ? y + b! : b!;
        const targetX = relative ? x + c! : c!;
        const targetY = relative ? y + d! : d!;

        bounds = includeBounds(bounds, quadraticBounds(x, y, controlX, controlY, targetX, targetY));
        x = targetX;
        y = targetY;
        cubicX = null;
        cubicY = null;
        quadraticX = controlX;
        quadraticY = controlY;
        drew = true;
      }

      continue;
    }

    if (upper === "T") {
      while (peek() && !isCommand(peek()!)) {
        const a = read();
        const b = read();

        if (a == null || b == null) return null;

        const controlX = quadraticX == null ? x : 2 * x - quadraticX;
        const controlY = quadraticY == null ? y : 2 * y - quadraticY;
        const targetX = relative ? x + a : a;
        const targetY = relative ? y + b : b;

        bounds = includeBounds(bounds, quadraticBounds(x, y, controlX, controlY, targetX, targetY));
        x = targetX;
        y = targetY;
        cubicX = null;
        cubicY = null;
        quadraticX = controlX;
        quadraticY = controlY;
        drew = true;
      }

      continue;
    }

    return null;
  }

  if (!drew || !bounds) return null;

  const stroke = parseNumber(item["stroke-width"]) ?? 0;

  if (stroke < 0) return null;

  return stroke > 0 ? expandBounds(bounds, stroke / 2) : bounds;
}

function circleBounds(tag: string) {
  const item = attrs(tag);
  const cx = parseNumber(item.cx);
  const cy = parseNumber(item.cy);
  const radius = parseNumber(item.r);

  if (cx == null || cy == null || radius == null || !(radius > 0)) return null;

  return {
    left: cx - radius,
    top: cy - radius,
    right: cx + radius,
    bottom: cy + radius,
  };
}

function normalizeSvg(svg: string) {
  const tags = [...svg.matchAll(/<\/?\s*([a-zA-Z][\w:-]*)\b/g)].map((item) => item[1]?.toLowerCase() || "");

  if (!tags.length) return null;
  if (tags.some((item) => item !== "svg" && item !== "path" && item !== "circle")) return null;
  if (!svg.match(/<path\b|<circle\b/i)) return null;
  if ([...svg.matchAll(/<\s*svg\b/gi)].length !== 1) return null;
  if ([...svg.matchAll(/<\s*\/\s*svg\b/gi)].length !== 1) return null;

  const elements = [...svg.matchAll(elementTag)];
  const count = [...svg.matchAll(/<(path|circle)\b/gi)].length;

  if (!elements.length || elements.length !== count) return null;

  let bounds: FooterBounds | null = null;

  for (const item of elements) {
    const tag = item[0];
    const name = item[1]?.toLowerCase();
    const next = name === "path" ? pathBounds(tag) : circleBounds(tag);

    if (!next) return null;

    bounds = includeBounds(bounds, next);
  }

  if (!bounds) return null;

  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;

  if (!(width > 0) || !(height > 0)) return null;

  const left = bounds.left - SVG_PAD;
  const top = bounds.top - SVG_PAD;
  const wide = width + SVG_PAD * 2;
  const tall = height + SVG_PAD * 2;
  const aspect = wide / tall;

  if (!Number.isFinite(aspect) || aspect < MIN_SIGNATURE_ASPECT || aspect > MAX_SIGNATURE_ASPECT) return null;

  const viewBox = [formatNumber(left), formatNumber(top), formatNumber(wide), formatNumber(tall)].join(" ");
  const body = elements.map((item) => item[0].replace(/>\s*<\/(?:path|circle)\s*>$/i, " />")).join("");

  return {
    aspect,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${formatNumber(wide)}" height="${formatNumber(tall)}" viewBox="${viewBox}">${body}</svg>`,
  };
}

function sanitizeSvg(input: string) {
  if (!input.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;

  const body = input.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();

  if (!body || !base64.test(body)) return null;

  const raw = Buffer.from(body, "base64").toString("utf8").trim();
  const normal = Buffer.from(raw, "utf8").toString("base64");

  if (normal !== body) return null;
  if (!raw.startsWith("<svg") || !raw.match(/<\/svg>\s*$/i)) return null;
  if (forbidden.test(raw)) return null;

  const next = normalizeSvg(raw);

  if (!next) return null;

  const svg = Buffer.from(next.svg, "utf8").toString("base64");

  return {
    aspect: next.aspect,
    svg: `${FOOTER_SIGNATURE_DATA_PREFIX}${svg}`,
  };
}

function createError(status: number, message: string): FooterResult<never> {
  return {
    ok: false,
    status,
    message,
  };
}

export async function listFooterSignatures(): Promise<FooterSignatureRecord[]> {
  "use cache";

  cacheTag(FOOTER_SIGNATURE_TAG);

  if (!hasRedis()) return [];

  const ids = await redis.lrange<string>(idsKey, 0, -1);

  if (!Array.isArray(ids) || !ids.length) return [];

  const rows = await Promise.all(ids.map((id) => redis.get(key(id))));

  return rows.flatMap((row) => {
    const item = footerSignatureRecord.safeParse(row);

    if (!item.success) return [];

    return item.data;
  });
}

export async function createFooterSignature(
  input: FooterSignatureInput,
): Promise<FooterResult<FooterSignatureRecord>> {
  if (!hasRedis()) {
    return createError(503, "Upstash Redis is not configured");
  }

  const safe = sanitizeSvg(input.svg);

  if (!safe) {
    return createError(400, "Invalid signature image");
  }

  const next = await redis.incr(countKey);

  if (next > FOOTER_SIGNATURE_LIMIT) {
    await redis.decr(countKey);
    return createError(
      409,
      `The list is full. Only ${FOOTER_SIGNATURE_LIMIT} signatures are allowed.`,
    );
  }

  const item = footerSignatureRecord.parse({
    id: crypto.randomUUID(),
    name: input.name,
    svg: safe.svg,
    aspect: safe.aspect,
    createdAt: Date.now(),
  });

  try {
    await redis.set(key(item.id), item);
    await redis.rpush(idsKey, item.id);
    revalidateTag(FOOTER_SIGNATURE_TAG, "max");
  } catch {
    await redis.del(key(item.id));
    await redis.decr(countKey);
    return createError(500, "Unable to save the signature");
  }

  return {
    ok: true,
    data: item,
  };
}
