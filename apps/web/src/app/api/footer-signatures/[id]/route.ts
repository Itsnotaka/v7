import { NextResponse } from "next/server";

import { env } from "~/env";
import { footerSignatureUpdateInput } from "~/lib/footer-signature";
import { deleteFooterSignature, updateFooterSignature } from "~/lib/footer-signatures";
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

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${env.ADMIN_PASSWORD}`;
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  if (!checkAuth(request)) {
    return fail("Unauthorized", 401);
  }

  const { id } = await params;

  if (!id) {
    return fail("Missing signature id", 400);
  }

  const result = await deleteFooterSignature(id);

  if (!result.ok) {
    return fail(result.message, result.status);
  }

  return fresh(NextResponse.json({ success: true }, { status: 200 }));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  if (!checkAuth(request)) {
    return fail("Unauthorized", 401);
  }

  const { id } = await params;

  if (!id) {
    return fail("Missing signature id", 400);
  }

  const text = await request.text();
  const data = parse(text);

  if (!data) {
    return fail("Invalid request body", 400);
  }

  const body = footerSignatureUpdateInput.safeParse(data);

  if (!body.success) {
    return fail("Invalid signature update", 400);
  }

  const result = await updateFooterSignature(id, body.data);

  if (!result.ok) {
    return fail(result.message, result.status);
  }

  return fresh(NextResponse.json(result.data, { status: 200 }));
}
