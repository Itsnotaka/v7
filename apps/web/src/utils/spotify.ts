import { Redis } from "@upstash/redis";
import { env } from "~/env";

const tokenUrl = "https://accounts.spotify.com/api/token";
const authorizeUrl = "https://accounts.spotify.com/authorize";
const refreshKey = "spotify:refresh-token";
const accessKey = "spotify:access-token";
const trackKey = "spotify:last-track";
const accessBuffer = 30;
const trackTtl = 60 * 60 * 24 * 7;

const spotifyScopes = ["user-read-currently-playing", "user-read-playback-state"] as const;

export type Track = {
  name: string;
  artist: string;
  url: string;
  image: string | null;
};

export type Access = {
  token: string;
  expiresAt: number;
};

export type Playback = {
  is_playing?: boolean;
  item?: Item | null;
};

type Artist = {
  name: string;
};

type Image = {
  url: string;
  width?: number;
  height?: number;
};

type Album = {
  images?: Image[];
};

type Item = {
  name?: string;
  artists?: Artist[];
  album?: Album;
  external_urls?: {
    spotify?: string;
  };
};

type TokenPayload = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

export type Token = {
  access: string;
  expiresIn: number;
  refresh: string | null;
};

export type Result<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const spotify = {
  id: env.SPOTIFY_CLIENT_ID,
  secret: env.SPOTIFY_CLIENT_SECRET,
};

function auth(id: string, secret: string) {
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

async function token(body: URLSearchParams): Promise<Result<Token>> {
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: auth(spotify.id, spotify.secret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = (await res.json()) as TokenPayload;
  const access = data.access_token;
  const expiresIn = data.expires_in;

  if (!res.ok || !access || !expiresIn) {
    const msg = data.error_description || data.error || "Spotify token request failed";

    return {
      ok: false,
      status: res.status || 500,
      message: msg,
    };
  }

  return {
    ok: true,
    data: {
      access,
      expiresIn,
      refresh: data.refresh_token || null,
    },
  };
}

export function hasRedis() {
  return Boolean(redis);
}

export function hasSpotify() {
  return Boolean(spotify.id && spotify.secret);
}

export function authorize(state: string, redirect: string) {
  const query = new URLSearchParams({
    client_id: spotify.id,
    response_type: "code",
    redirect_uri: redirect,
    state,
    scope: spotifyScopes.join(" "),
  });

  return `${authorizeUrl}?${query.toString()}`;
}

export function state() {
  return crypto.randomUUID();
}

export async function exchange(code: string, redirect: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirect,
  });

  return token(body);
}

export async function refresh(refresh: string) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh,
  });

  return token(body);
}

export function valid(access: Access) {
  return access.expiresAt > Date.now();
}

export async function getRefresh() {
  if (!redis) return null;

  const data = await redis.get<string>(refreshKey);

  if (typeof data !== "string") return null;

  return data;
}

export async function setRefresh(refresh: string) {
  if (!redis) return false;

  await redis.set(refreshKey, refresh);

  return true;
}

export async function getAccess() {
  if (!redis) return null;

  const data = await redis.get<Access>(accessKey);

  if (!data || typeof data.token !== "string" || typeof data.expiresAt !== "number") return null;

  return data;
}

export async function setAccess(access: string, expiresIn: number) {
  if (!redis) return null;

  const ttl = Math.max(1, expiresIn - accessBuffer);
  const data: Access = {
    token: access,
    expiresAt: Date.now() + ttl * 1000,
  };

  await redis.set(accessKey, data, { ex: ttl });

  return data;
}

export async function getTrack() {
  if (!redis) return null;

  const data = await redis.get<Track>(trackKey);

  if (
    !data ||
    typeof data.name !== "string" ||
    typeof data.artist !== "string" ||
    typeof data.url !== "string"
  ) {
    return null;
  }

  if (data.image === undefined) {
    data.image = null;
  }

  return data;
}

export async function setTrack(track: Track) {
  if (!redis) return false;

  await redis.set(trackKey, track, { ex: trackTtl });

  return true;
}

export function normalize(item: Item | null | undefined): Track | null {
  if (!item?.name) return null;

  const url = item.external_urls?.spotify;

  if (!url) return null;

  const artist =
    (item.artists || [])
      .map((x) => x.name)
      .filter(Boolean)
      .join(", ") || "Unknown Artist";

  const images = item.album?.images ?? [];
  const image = images.find((i) => i.width === 64)?.url ?? images.at(-1)?.url ?? null;

  return {
    name: item.name,
    artist,
    url,
    image,
  };
}
