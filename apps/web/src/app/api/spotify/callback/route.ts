import { NextRequest, NextResponse } from "next/server";

import { exchange, hasRedis, hasSpotify, setAccess, setRefresh } from "~/utils/spotify";

const stateKey = "spotify_oauth_state";

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
    const next = new URL(`/api/spotify/callback${request.nextUrl.search}`, base);

    return NextResponse.redirect(next);
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expected = request.cookies.get(stateKey)?.value;

  if (!code || !state) {
    return NextResponse.json({ error: "Missing Spotify OAuth code or state" }, { status: 400 });
  }

  if (!expected || expected !== state) {
    return NextResponse.json(
      { error: "Invalid Spotify OAuth state. Start from /api/spotify/auth on the same host." },
      { status: 400 }
    );
  }

  const redirect = new URL("/api/spotify/callback", base).toString();
  const token = await exchange(code, redirect);

  if (!token.ok) {
    return NextResponse.json({ error: token.message }, { status: token.status });
  }

  const refresh = token.data.refresh;

  if (!refresh) {
    return NextResponse.json({ error: "Spotify did not return a refresh token" }, { status: 502 });
  }

  const savedRefresh = await setRefresh(refresh);
  const savedAccess = await setAccess(token.data.access, token.data.expiresIn);

  if (!savedRefresh || !savedAccess) {
    return NextResponse.json({ error: "Unable to persist Spotify tokens" }, { status: 503 });
  }

  const res = NextResponse.redirect(new URL("/", base));

  res.cookies.delete(stateKey);

  return res;
}
