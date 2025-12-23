"use client"

import { useCallback, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { AlbumStackView } from "./album-stack-view"
import { TrackDetailView } from "./track-detail-view"
import type { NowPlayingResponse, Track, WidgetView } from "./types"

async function fetchSpotifyData(): Promise<NowPlayingResponse> {
  const response = await fetch("/api/spotify")
  if (!response.ok) {
    throw new Error("Failed to fetch")
  }
  return response.json()
}

async function controlPlayback(action: "play" | "pause" | "next" | "previous") {
  const endpoints: Record<string, string> = {
    play: "/api/spotify/player/play",
    pause: "/api/spotify/player/pause",
    next: "/api/spotify/player/next",
    previous: "/api/spotify/player/previous",
  }
  await fetch(endpoints[action], { method: "POST" })
}

export function MusicWidget() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<WidgetView>("stack")
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["spotify", "now-playing"],
    queryFn: fetchSpotifyData,
  })

  const playbackMutation = useMutation({
    mutationFn: controlPlayback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spotify", "now-playing"] })
    },
  })

  const handleSelectTrack = useCallback((track: Track) => {
    setSelectedTrack(track)
    setView("detail")
  }, [])

  const handleBack = useCallback(() => {
    setView("stack")
    setSelectedTrack(null)
  }, [])

  const handlePlaybackAction = useCallback(
    (action: "play" | "pause" | "next" | "previous") => {
      playbackMutation.mutate(action)
    },
    [playbackMutation]
  )

  const tracks = data?.recentTracks ?? []
  const currentTrack = data?.currentTrack ?? null
  const displayTrack = selectedTrack ?? currentTrack

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (!data || (!currentTrack && tracks.length === 0)) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">
            Nothing playing right now.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        {view === "stack" ? (
          <AlbumStackView
            tracks={tracks}
            currentTrack={currentTrack}
            onSelectTrack={handleSelectTrack}
            onRefresh={() => refetch()}
            isLoading={isRefetching}
          />
        ) : displayTrack ? (
          <TrackDetailView
            track={displayTrack}
            onBack={handleBack}
            onPrevious={() => handlePlaybackAction("previous")}
            onPlayPause={() =>
              handlePlaybackAction(displayTrack.isPlaying ? "pause" : "play")
            }
            onNext={() => handlePlaybackAction("next")}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
