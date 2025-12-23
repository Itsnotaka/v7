"use client"

import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

interface PlaybackControlsProps {
  isPlaying: boolean
  onPrevious: () => void
  onPlayPause: () => void
  onNext: () => void
}

export function PlaybackControls({
  isPlaying,
  onPrevious,
  onPlayPause,
  onNext,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant="ghost" size="icon-lg" onClick={onPrevious}>
        <SkipBackIcon weight="fill" />
      </Button>
      <Button variant="ghost" size="icon-lg" onClick={onPlayPause}>
        {isPlaying ? <PauseIcon weight="fill" /> : <PlayIcon weight="fill" />}
      </Button>
      <Button variant="ghost" size="icon-lg" onClick={onNext}>
        <SkipForwardIcon weight="fill" />
      </Button>
    </div>
  )
}
