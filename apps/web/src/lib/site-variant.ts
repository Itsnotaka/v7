export const SITE_VARIANT_OVERRIDE = "site-variant";
export const SITE_VARIANT_AUTO = "site-variant-auto";

export type SiteVariant = "human" | "machine";

export function parseSiteVariant(value: string | null | undefined): SiteVariant | null {
  if (value === "human" || value === "machine") return value;

  return null;
}

export function resolveSiteVariant(get: (name: string) => string | null): SiteVariant | null {
  const forced = parseSiteVariant(get(SITE_VARIANT_OVERRIDE));

  if (forced) return forced;

  return parseSiteVariant(get(SITE_VARIANT_AUTO));
}
