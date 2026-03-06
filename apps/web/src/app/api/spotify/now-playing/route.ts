import { NextResponse } from "next/server";

import {
  getAccess,
  getRefresh,
  getTrack,
  hasRedis,
  hasSpotify,
  normalize,
  refresh,
  setAccess,
  setRefresh,
  setTrack,
  type Result,
  type Playback,
  type Track,
  valid,
} from "~/utils/spotify";

const playbackUrl = "https://api.spotify.com/v1/me/player/currently-playing";

export const runtime = "nodejs";

type Payload = {
  connected: boolean;
  playing: boolean;
  source: "live" | "cache" | "none";
  track: Track | null;
};

async function cache(connected: boolean): Promise<Payload> {
  const track = await getTrack();

  if (!track) {
    return {
      connected,
      playing: false,
      source: "none",
      track: null,
    };
  }

  return {
    connected,
    playing: false,
    source: "cache",
    track,
  };
}

async function access(refreshToken: string): Promise<Result<string>> {
  const cached = await getAccess();

  if (cached && valid(cached)) {
    return {
      ok: true,
      data: cached.token,
    };
  }

  const next = await refresh(refreshToken);

  if (!next.ok) {
    return {
      ok: false,
      status: next.status,
      message: next.message,
    };
  }

  const rotated = next.data.refresh;

  if (rotated) {
    await setRefresh(rotated);
  }

  const saved = await setAccess(next.data.access, next.data.expiresIn);

  if (!saved) {
    return {
      ok: false,
      status: 503,
      message: "Unable to persist Spotify access token",
    };
  }

  return {
    ok: true,
    data: next.data.access,
  };
}

export async function GET() {
  if (!hasSpotify()) {
    return NextResponse.json({ error: "Spotify credentials are not configured" }, { status: 503 });
  }

  if (!hasRedis()) {
    return NextResponse.json({ error: "Upstash Redis is not configured" }, { status: 503 });
  }

  const refreshToken = await getRefresh();

  if (!refreshToken) {
    return NextResponse.json({ connected: false, playing: false, source: "none", track: null });
  }

  const token = await access(refreshToken);

  if (!token.ok) {
    const data = await cache(true);

    return NextResponse.json(data);
  }

  const res = await fetch(playbackUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.data}`,
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    const data = await cache(true);

    return NextResponse.json(data);
  }

  if (!res.ok) {
    const data = await cache(true);

    return NextResponse.json(data);
  }

  const body = (await res.json()) as Playback;
  const track = normalize(body.item);

  if (!body.is_playing || !track) {
    const data = await cache(true);

    return NextResponse.json(data);
  }

  await setTrack(track);

  return NextResponse.json({
    connected: true,
    playing: true,
    source: "live",
    track,
  });
}
