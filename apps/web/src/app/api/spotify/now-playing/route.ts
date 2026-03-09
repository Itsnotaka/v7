import { NextResponse } from "next/server";

import { hasRedis } from "~/lib/redis";
import { getSpotifyState } from "~/lib/spotify-status";
import { hasSpotify } from "~/utils/spotify";

export async function GET() {
  if (!hasSpotify()) {
    return NextResponse.json({ error: "Spotify credentials are not configured" }, { status: 503 });
  }

  if (!hasRedis()) {
    return NextResponse.json({ error: "Upstash Redis is not configured" }, { status: 503 });
  }

  const data = await getSpotifyState();

  return NextResponse.json(data);
}
