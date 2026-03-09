import { NextResponse } from "next/server";

import { env } from "~/env";
import { footerSignatureInput } from "~/lib/footer-signature";
import {
  createFooterSignature,
  createVerificationToken,
  listFooterSignatures,
} from "~/lib/footer-signatures";
import { hasRedis } from "~/lib/redis";
import { getResend, hasResend } from "~/lib/resend";

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

  // Send verification email if email provided and Resend is configured
  if (body.data.email && hasResend()) {
    const token = await createVerificationToken(item.data.id, body.data.email);
    const verifyUrl = `https://nameisdaniel.com/api/footer-signatures/verify/${token}`;

    const resend = getResend();
    if (resend && env.RESEND_FROM_EMAIL) {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: body.data.email,
        subject: "Verify your signature",
        text: `Thank you for signing the footer! Please verify your email by clicking this link: ${verifyUrl}\n\nThis link will expire in 24 hours.`,
      });
    }
  }

  return fresh(NextResponse.json(item.data, { status: 201 }));
}

export async function GET() {
  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  const items = await listFooterSignatures();
  return fresh(NextResponse.json(items, { status: 200 }));
}
