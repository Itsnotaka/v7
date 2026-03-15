import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

import { SITE_VARIANT_AUTO, type SiteVariant } from "~/lib/site-variant";

export async function POST() {
  const variant = await (async (): Promise<SiteVariant> => {
    try {
      const result = await checkBotId();

      if (result.isBot) return "machine";

      return "human";
    } catch {
      return "human";
    }
  })();

  const response = NextResponse.json({ variant });

  response.cookies.set(SITE_VARIANT_AUTO, variant, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
