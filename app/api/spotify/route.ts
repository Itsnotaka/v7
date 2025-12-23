import { NextResponse } from "next/server"
import { getCurrentlyPlaying, getRecentlyPlayed } from "@/lib/spotify"

export async function GET() {
  try {
    const [currentTrack, recentTracks] = await Promise.all([
      getCurrentlyPlaying(),
      getRecentlyPlayed(),
    ])

    return NextResponse.json({ currentTrack, recentTracks })
  } catch (error) {
    console.error("Spotify API error:", error)
    return NextResponse.json(
      { currentTrack: null, recentTracks: [] },
      { status: 200 }
    )
  }
}
