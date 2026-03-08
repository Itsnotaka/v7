import { NextRequest, NextResponse } from "next/server";

import { authorize, hasRedis, hasSpotify, state } from "~/utils/spotify";

const stateKey = "spotify_oauth_state";
const stateTtl = 60 * 10;

function fresh(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

function fail(message: string, status: number) {
  return fresh(NextResponse.json({ error: message }, { status }));
}

export async function GET(request: NextRequest) {
  if (!hasSpotify()) {
    return fail("Spotify credentials are not configured", 503);
  }

  if (!hasRedis()) {
    return fail("Upstash Redis is not configured", 503);
  }

  const base = request.nextUrl.origin;

  const value = state();
  const redirect = new URL("/api/spotify/callback", base).toString();
  const url = authorize(value, redirect);

  if (!url) {
    return fail("Spotify credentials are not configured", 503);
  }

  const res = NextResponse.redirect(url);

  res.cookies.set({
    name: stateKey,
    value,
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    maxAge: stateTtl,
    path: "/",
  });

  return fresh(res);
}
