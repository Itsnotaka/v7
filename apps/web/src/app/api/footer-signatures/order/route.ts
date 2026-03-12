import { NextResponse } from "next/server";

import { env } from "~/env";
import { reorderFooterSignatures } from "~/lib/footer-signatures";
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

export async function PUT(request: Request) {
  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  if (!checkAuth(request)) {
    return fail("Unauthorized", 401);
  }

  const body = await request.json();

  if (!Array.isArray(body.ids) || !body.ids.every((id: unknown) => typeof id === "string")) {
    return fail("Invalid payload: ids must be a string array", 400);
  }

  const result = await reorderFooterSignatures(body.ids);

  if (!result.ok) {
    return fail(result.message, result.status);
  }

  return fresh(NextResponse.json({ success: true }, { status: 200 }));
}
