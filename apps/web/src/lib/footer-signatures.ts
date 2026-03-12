import {
  FOOTER_SIGNATURE_DATA_PREFIX,
  footerSignatureRecord,
  type FooterSignatureInput,
  type FooterSignatureRecord,
  type FooterSignatureUpdateInput,
} from "~/lib/footer-signature";
import { getFooterSignatureLimit } from "~/lib/footer-signature-config";
import { hasRedis, redis } from "~/lib/redis";

const countKey = "footer:signatures:count";
const idsKey = "footer:signatures:ids";
const keyPrefix = "footer:signature:";

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

function extractAspect(svg: string): number {
  const decoded = (() => {
    if (!svg.startsWith(FOOTER_SIGNATURE_DATA_PREFIX)) return svg;
    const body = svg.slice(FOOTER_SIGNATURE_DATA_PREFIX.length).trim();
    return Buffer.from(body, "base64").toString("utf8");
  })();
  const viewBox = decoded.match(/viewBox=["']([^"']+)["']/i);
  if (viewBox?.[1]) {
    const parts = viewBox[1].split(/\s+/).map(Number);
    const w = parts[2] ?? 0;
    const h = parts[3] ?? 0;
    if (w > 0 && h > 0) return w / h;
  }
  const w = Number(decoded.match(/width=["']([\d.]+)/i)?.[1]);
  const h = Number(decoded.match(/height=["']([\d.]+)/i)?.[1]);
  if (w > 0 && h > 0) return w / h;
  return 1;
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

  const aspect = extractAspect(input.svg);

  const [next, limit] = await Promise.all([redis.incr(countKey), getFooterSignatureLimit()]);

  if (next > limit) {
    await redis.decr(countKey);
    return createError(409, `The list is full. Only ${limit} signatures are allowed.`);
  }

  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const id = `${slug}-${crypto.randomUUID().slice(0, 8)}`;

  const item = footerSignatureRecord.parse({
    id,
    name: input.name,
    svg: input.svg,
    aspect,
    createdAt: Date.now(),
    verified: false,
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

export async function deleteFooterSignature(id: string): Promise<FooterResult<void>> {
  if (!hasRedis()) {
    return createError(503, "Upstash Redis is not configured");
  }

  const existing = await redis.get(key(id));
  if (!existing) {
    return createError(404, "Signature not found");
  }

  try {
    await redis.lrem(idsKey, 1, id);
    await redis.del(key(id));
    await redis.decr(countKey);
  } catch {
    return createError(500, "Unable to delete the signature");
  }

  return {
    ok: true,
    data: undefined,
  };
}

export async function updateFooterSignature(
  id: string,
  updates: FooterSignatureUpdateInput,
): Promise<FooterResult<FooterSignatureRecord>> {
  if (!hasRedis()) {
    return createError(503, "Upstash Redis is not configured");
  }

  const existing = await redis.get<FooterSignatureRecord>(key(id));
  if (!existing) {
    return createError(404, "Signature not found");
  }

  const parsed = footerSignatureRecord.safeParse(existing);
  if (!parsed.success) {
    return createError(500, "Invalid signature data");
  }

  const updated = footerSignatureRecord.parse({
    ...parsed.data,
    ...updates,
  });

  try {
    await redis.set(key(id), updated);
  } catch {
    return createError(500, "Unable to update the signature");
  }

  return {
    ok: true,
    data: updated,
  };
}

export async function reorderFooterSignatures(ids: string[]): Promise<FooterResult<void>> {
  if (!hasRedis()) {
    return createError(503, "Upstash Redis is not configured");
  }

  const current = await redis.lrange<string>(idsKey, 0, -1);
  const currentSet = new Set(current);

  if (ids.length !== currentSet.size || !ids.every((id) => currentSet.has(id))) {
    return createError(400, "Submitted IDs must exactly match the current signature set");
  }

  await redis.del(idsKey);

  if (ids.length > 0) {
    await redis.rpush(idsKey, ...ids);
  }

  return { ok: true, data: undefined };
}
