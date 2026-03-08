import { NextRequest, NextResponse } from "next/server";

import { exchange, hasRedis, hasSpotify, setAccess, setRefresh } from "~/utils/spotify";

const stateKey = "spotify_oauth_state";
const defaultOrigin = "http://127.0.0.1:3000";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const base = origin;

  const host = request.headers.get("host") || request.nextUrl.host;

  if (new URL(base).host !== host) {
    const next = new URL(`/api/spotify/callback${request.nextUrl.search}`, base);

    return fresh(NextResponse.redirect(next));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expected = request.cookies.get(stateKey)?.value;

  if (!code || !state) {
    return fail("Missing Spotify OAuth code or state", 400);
  }

  if (!expected || expected !== state) {
    return fail("Invalid Spotify OAuth state. Start from /api/spotify/auth on the same host.", 400);
  }

  const redirect = new URL("/api/spotify/callback", base).toString();
  const token = await exchange(code, redirect);

  if (!token.ok) {
    return fail(token.message, token.status);
  }

  const refresh = token.data.refresh;

  if (!refresh) {
    return fail("Spotify did not return a refresh token", 502);
  }

  const savedRefresh = await setRefresh(refresh);
  const savedAccess = await setAccess(token.data.access, token.data.expiresIn);

  if (!savedRefresh || !savedAccess) {
    return fail("Unable to persist Spotify tokens", 503);
  }

  const res = NextResponse.redirect(new URL("/", base));

  res.cookies.delete(stateKey);

  return fresh(res);
}
