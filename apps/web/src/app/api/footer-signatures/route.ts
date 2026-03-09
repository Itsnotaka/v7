import { NextResponse } from "next/server";

import { footerSignatureInput } from "~/lib/footer-signature";
import { createFooterSignature } from "~/lib/footer-signatures";
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

function parse(text: string) {
  if (!text.trim()) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  const text = await request.text();
  const data = parse(text);

  if (!data) {
    return fail("Invalid request body", 400);
  }

  const body = footerSignatureInput.safeParse(data);

  if (!body.success) {
    return fail("Invalid signature payload", 400);
  }

  const item = await createFooterSignature(body.data);

  if (!item.ok) {
    return fail(item.message, item.status);
  }

  return fresh(NextResponse.json(item.data, { status: 201 }));
}
