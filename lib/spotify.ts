import { redis } from "./redis"

const TOKEN_URL = "https://accounts.spotify.com/api/token"
const SPOTIFY_API = "https://api.spotify.com/v1/me"

const ACCESS_TOKEN_KEY = "spotify:access_token"

export async function getAccessToken(): Promise<string> {
  const cached = await redis.get(ACCESS_TOKEN_KEY)
  if (cached) return cached

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials in environment")
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify token")
  }

  const data = await response.json()
  await redis.set(ACCESS_TOKEN_KEY, data.access_token, "EX", data.expires_in - 60)

  return data.access_token
}

interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyArtist {
  name: string
}

interface SpotifyAlbum {
  name: string
  images: SpotifyImage[]
}

interface SpotifyTrack {
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  external_urls: { spotify: string }
  duration_ms: number
}

export interface NormalizedTrack {
  name: string
  artist: string
  albumName: string
  albumArt: string
  spotifyUrl: string
  durationMs: number
  progressMs: number
  isPlaying: boolean
}

function normalizeTrack(
  track: SpotifyTrack,
  isPlaying: boolean,
  progressMs: number
): NormalizedTrack {
  const largestImage = track.album.images.reduce((prev, current) =>
    current.width > prev.width ? current : prev
  )

  return {
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    albumName: track.album.name,
    albumArt: largestImage.url,
    spotifyUrl: track.external_urls.spotify,
    durationMs: track.duration_ms,
    progressMs,
    isPlaying,
  }
}

export async function getCurrentlyPlaying(): Promise<NormalizedTrack | null> {
  const accessToken = await getAccessToken()

  const response = await fetch(`${SPOTIFY_API}/player/currently-playing`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (response.status === 204 || response.status > 400) {
    return null
  }

  const data = await response.json()
  if (!data.item) return null

  return normalizeTrack(data.item, data.is_playing, data.progress_ms)
}

export async function getRecentlyPlayed(): Promise<NormalizedTrack[]> {
  const accessToken = await getAccessToken()

  const response = await fetch(
    `${SPOTIFY_API}/player/recently-played?limit=10`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!response.ok) return []

  const data = await response.json()
  return data.items.map((item: { track: SpotifyTrack }) =>
    normalizeTrack(item.track, false, 0)
  )
}

export async function controlPlayback(
  action: "play" | "pause" | "next" | "previous"
): Promise<boolean> {
  const accessToken = await getAccessToken()

  const endpoints: Record<string, { url: string; method: string }> = {
    play: { url: `${SPOTIFY_API}/player/play`, method: "PUT" },
    pause: { url: `${SPOTIFY_API}/player/pause`, method: "PUT" },
    next: { url: `${SPOTIFY_API}/player/next`, method: "POST" },
    previous: { url: `${SPOTIFY_API}/player/previous`, method: "POST" },
  }

  const { url, method } = endpoints[action]

  const response = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return response.status === 204 || response.ok
}
