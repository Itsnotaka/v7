import "server-only";

import {
  getAccess,
  getRefresh,
  getTrack,
  normalize,
  refresh,
  setAccess,
  setRefresh,
  setTrack,
  type Playback,
  type Result,
  type Track,
  valid,
} from "~/utils/spotify";

const playbackUrl = "https://api.spotify.com/v1/me/player/currently-playing";

export type SpotifyState = {
  connected: boolean;
  playing: boolean;
  source: "live" | "cache" | "none";
  track: Track | null;
};

async function loadCache(connected: boolean): Promise<SpotifyState> {
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

async function loadAccess(refreshToken: string): Promise<Result<string>> {
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

export async function getSpotifyState(): Promise<SpotifyState> {
  const refreshToken = await getRefresh();

  if (!refreshToken) {
    return {
      connected: false,
      playing: false,
      source: "none",
      track: null,
    };
  }

  const token = await loadAccess(refreshToken);

  if (!token.ok) {
    return loadCache(true);
  }

  const res = await fetch(playbackUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.data}`,
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    return loadCache(true);
  }

  if (!res.ok) {
    return loadCache(true);
  }

  const body = (await res.json()) as Playback;
  const track = normalize(body.item);

  if (!body.is_playing || !track) {
    return loadCache(true);
  }

  await setTrack(track);

  return {
    connected: true,
    playing: true,
    source: "live",
    track,
  };
}
