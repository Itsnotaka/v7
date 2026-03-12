import { DEFAULT_FOOTER_SIGNATURE_LIMIT } from "~/lib/footer-signature";
import { hasRedis, redis } from "~/lib/redis";

const limitKey = "footer:signatures:limit";

export async function getFooterSignatureLimit(): Promise<number> {
  if (!hasRedis()) return DEFAULT_FOOTER_SIGNATURE_LIMIT;

  const value = await redis.get<number>(limitKey);

  return typeof value === "number" && value > 0 ? value : DEFAULT_FOOTER_SIGNATURE_LIMIT;
}

export async function setFooterSignatureLimit(limit: number): Promise<void> {
  await redis.set(limitKey, limit);
}
