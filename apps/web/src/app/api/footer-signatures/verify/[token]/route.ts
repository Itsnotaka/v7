import { NextResponse } from "next/server";

import { verifyFooterSignatureEmail } from "~/lib/footer-signatures";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const result = await verifyFooterSignatureEmail(token);

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  // Redirect to home with success query param
  return NextResponse.redirect(new URL("/?verified=true", "https://nameisdaniel.com"));
}
