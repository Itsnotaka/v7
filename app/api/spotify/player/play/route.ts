import { NextResponse } from "next/server";
import { controlPlayback } from "~/lib/spotify";

export async function POST() {
  const success = await controlPlayback("play");
  return NextResponse.json({ success }, { status: success ? 200 : 500 });
}
