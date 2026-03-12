import { NextResponse } from "next/server";

import { env } from "~/env";
import { getFooterSignatureLimit, setFooterSignatureLimit } from "~/lib/footer-signature-config";
import { hasRedis } from "~/lib/redis";

function fresh(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

function fail(message: string, status: number) {
  return fresh(NextResponse.json({ error: message }, { status }));
}

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${env.ADMIN_PASSWORD}`;
}

export async function GET(request: Request) {
  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  if (!checkAuth(request)) {
    return fail("Unauthorized", 401);
  }

  const limit = await getFooterSignatureLimit();

  return fresh(NextResponse.json({ limit }, { status: 200 }));
}

export async function PUT(request: Request) {
  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  if (!checkAuth(request)) {
    return fail("Unauthorized", 401);
  }

  const body = await request.json();

  if (typeof body.limit !== "number" || body.limit < 1 || !Number.isInteger(body.limit)) {
    return fail("Invalid limit: must be a positive integer", 400);
  }

  await setFooterSignatureLimit(body.limit);

  return fresh(NextResponse.json({ limit: body.limit }, { status: 200 }));
}
