import { NextRequest, NextResponse } from "next/server";

import { authorize, hasRedis, hasSpotify, state } from "~/utils/spotify";

const stateKey = "spotify_oauth_state";
const stateTtl = 60 * 10;

function origin(request: NextRequest) {
  const fixed = process.env.SPOTIFY_REDIRECT_ORIGIN?.trim();

  if (fixed) {
    return fixed.replace(/\/$/, "");
  }

  const hostRaw = request.headers.get("host") || request.headers.get("x-forwarded-host") || request.nextUrl.host;
  const host = hostRaw.replace("localhost:", "127.0.0.1:");
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");

  return `${proto}://${host}`;
}

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!hasSpotify()) {
    return NextResponse.json({ error: "Spotify credentials are not configured" }, { status: 503 });
  }

  if (!hasRedis()) {
    return NextResponse.json({ error: "Upstash Redis is not configured" }, { status: 503 });
  }

  const base = origin(request);

  const host = request.headers.get("host") || request.nextUrl.host;

  if (new URL(base).host !== host) {
    return NextResponse.redirect(new URL("/api/spotify/auth", base));
  }

  const value = state();
  const redirect = new URL("/api/spotify/callback", base).toString();
  const url = authorize(value, redirect);

  if (!url) {
    return NextResponse.json({ error: "Spotify credentials are not configured" }, { status: 503 });
  }

  const res = NextResponse.redirect(url);

  res.cookies.set({
    name: stateKey,
    value,
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    maxAge: stateTtl,
    path: "/"
  });

  return res;
}
