import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  FOOTER_SIGNATURE_LIMIT,
  footerSignatureRecord,
  type FooterSignatureInput,
  type FooterSignatureRecord,
} from "~/lib/footer-signature";
import { hasRedis, redis } from "~/lib/redis";

const countKey = "footer:signatures:count";
const idsKey = "footer:signatures:ids";
const keyPrefix = "footer:signature:";
const forbidden =
  /<\s*script|<\s*foreignObject|<\s*iframe|<\s*object|<\s*embed|<\s*audio|<\s*video|<\s*image|<\s*use|<\s*style|<\s*animate|<\s*set|on[a-z]+\s*=|href\s*=|xlink:href\s*=|javascript:/i;
const base64 = /^[A-Za-z0-9+/=]+$/;

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

function parseAspect(svg: string) {
  const box = svg.match(/viewBox=["']\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*["']/i);

  if (box) {
    const width = Number(box[3]);
    const height = Number(box[4]);

    if (width > 0 && height > 0) return width / height;
  }

  const size = svg.match(/width=["']([0-9.]+)[a-z%]*["'][^>]*height=["']([0-9.]+)[a-z%]*["']/i);

  if (!size) return null;

  const width = Number(size[1]);
  const height = Number(size[2]);

  if (!(width > 0) || !(height > 0)) return null;

  return width / height;
}

function sanitizeSvg(input: string) {
  if (!input.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return null;

  const body = input.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();

  if (!body || !base64.test(body)) return null;

  const svg = Buffer.from(body, "base64").toString("utf8").trim();
  const normal = Buffer.from(svg, "utf8").toString("base64");

  if (normal !== body) return null;
  if (!svg.startsWith("<svg")) return null;
  if (forbidden.test(svg)) return null;

  const tags = [...svg.matchAll(/<\/?\s*([a-zA-Z][\w:-]*)\b/g)].map(
    (item) => item[1]?.toLowerCase() || "",
  );

  if (!tags.length) return null;
  if (tags.some((item) => item !== "svg" && item !== "path" && item !== "circle")) return null;
  if (!svg.match(/<path\b|<circle\b/i)) return null;

  const aspect = parseAspect(svg);

  if (!aspect || aspect < 1 || aspect > 8) return null;

  return {
    aspect,
    svg: `${FOOTER_SIGNATURE_DATA_PREFIX}${normal}`,
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
