export interface Track {
  name: string
  artist: string
  albumName: string
  albumArt: string
  spotifyUrl: string
  durationMs: number
  progressMs: number
  isPlaying: boolean
}

export interface NowPlayingResponse {
  currentTrack: Track | null
  recentTracks: Track[]
}

export type WidgetView = "stack" | "detail"
