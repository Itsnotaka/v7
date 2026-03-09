import { NextResponse } from "next/server";

import { env } from "~/env";

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (body.password !== env.ADMIN_PASSWORD) {
    return fail("Invalid password", 401);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
