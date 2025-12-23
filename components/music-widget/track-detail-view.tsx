"use client"

import {
  ArrowUpRightIcon,
  CaretLeftIcon,
  SpotifyLogoIcon,
} from "@phosphor-icons/react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

import { PlaybackControls } from "./playback-controls"
import { ProgressDisplay } from "./progress-display"
import type { Track } from "./types"
import { VinylRecord } from "./vinyl-record"

interface TrackDetailViewProps {
  track: Track
  onBack: () => void
  onPrevious: () => void
  onPlayPause: () => void
  onNext: () => void
}

export function TrackDetailView({
  track,
  onBack,
  onPrevious,
  onPlayPause,
  onNext,
}: TrackDetailViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <CaretLeftIcon weight="bold" />
          Back
        </Button>
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors"
        >
          <SpotifyLogoIcon weight="fill" className="size-4" />
          See on Spotify
          <ArrowUpRightIcon weight="bold" className="size-3" />
        </a>
      </div>

      <div className="relative mx-auto w-fit">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2">
          <VinylRecord isPlaying={track.isPlaying} className="size-44" />
        </div>

        <div className="relative z-10 size-44 overflow-hidden rounded-xl shadow-xl">
          <Image
            src={track.albumArt}
            alt={`${track.albumName} album cover`}
            fill
            className="object-cover"
            sizes="176px"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-muted-foreground text-sm">{track.artist}</span>
        <span className="text-foreground text-base font-semibold">
          {track.name}
        </span>
      </div>

      <div className="flex justify-center">
        <ProgressDisplay
          currentMs={track.progressMs}
          durationMs={track.durationMs}
        />
      </div>

      <PlaybackControls
        isPlaying={track.isPlaying}
        onPrevious={onPrevious}
        onPlayPause={onPlayPause}
        onNext={onNext}
      />
    </div>
  )
}
