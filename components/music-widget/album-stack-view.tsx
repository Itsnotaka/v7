"use client"

import Image from "next/image"
import { ArrowsClockwiseIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Track } from "./types"

interface AlbumStackViewProps {
  tracks: Track[]
  currentTrack: Track | null
  onSelectTrack: (track: Track) => void
  onRefresh: () => void
  isLoading?: boolean
}

export function AlbumStackView({
  tracks,
  currentTrack,
  onSelectTrack,
  onRefresh,
  isLoading = false,
}: AlbumStackViewProps) {
  const displayTracks = currentTrack
    ? [currentTrack, ...tracks.filter((t) => t.spotifyUrl !== currentTrack.spotifyUrl)].slice(0, 7)
    : tracks.slice(0, 7)

  const stackCount = displayTracks.length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 className="text-foreground text-sm font-medium tracking-tight">
          Listening to...
        </h2>
        <Button
          variant="outline"
          size="default"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <ArrowsClockwiseIcon
            className={cn("size-3.5", isLoading && "animate-spin")}
            weight="bold"
          />
          Refresh
        </Button>
      </header>

      <div
        className="album-stack relative h-48 w-full sm:h-56 md:h-64"
        style={{ perspective: "1000px" }}
      >
        {displayTracks.map((track, index) => {
          const isFirst = index === 0
          const reverseIndex = stackCount - 1 - index
          const zIndex = reverseIndex + 1

          const baseSize = 140
          const sizeDecrement = 8
          const size = baseSize - index * sizeDecrement
          const mobileSize = size * 0.75

          const xOffset = index * 38
          const mobileXOffset = index * 28
          const rotation = index * 6
          const yOffset = index * 2
          const zDepth = reverseIndex * 20

          return (
            <button
              key={track.spotifyUrl}
              type="button"
              onClick={() => onSelectTrack(track)}
              className={cn(
                "album-cover group/album absolute left-0 top-1/2 cursor-pointer rounded-xl shadow-lg transition-all duration-300 ease-out",
                "hover:!z-50 hover:!scale-110 hover:shadow-2xl",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isFirst && "shadow-xl"
              )}
              style={{
                "--size": `${size}px`,
                "--size-mobile": `${mobileSize}px`,
                "--x": `${xOffset}px`,
                "--x-mobile": `${mobileXOffset}px`,
                "--rotate": `${rotation}deg`,
                "--y": `${yOffset}px`,
                "--z": `${zDepth}px`,
                zIndex,
                width: "var(--size-mobile)",
                height: "var(--size-mobile)",
                transform: `translateY(-50%) translateX(var(--x-mobile)) translateZ(var(--z)) rotateZ(var(--rotate)) translateY(var(--y))`,
              } as React.CSSProperties}
            >
              <div className="relative size-full overflow-hidden rounded-xl ring-1 ring-foreground/10">
                <Image
                  src={track.albumArt}
                  alt={`${track.albumName} by ${track.artist}`}
                  fill
                  sizes="(max-width: 640px) 105px, 140px"
                  className="object-cover"
                  priority={isFirst}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200",
                    "group-hover/album:opacity-100"
                  )}
                />
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute -top-14 left-1/2 z-50 -translate-x-1/2 opacity-0 transition-all duration-200",
                  "group-hover/album:opacity-100"
                )}
              >
                <div className="relative whitespace-nowrap rounded-full bg-popover px-3 py-1.5 shadow-lg ring-1 ring-border">
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-medium text-popover-foreground">
                      {track.artist}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {track.name}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-popover ring-1 ring-border" />
                </div>
              </div>
            </button>
          )
        })}

        {displayTracks.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">No tracks available</p>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .album-stack .album-cover {
            width: var(--size) !important;
            height: var(--size) !important;
            transform: translateY(-50%) translateX(var(--x)) translateZ(var(--z)) rotateZ(var(--rotate)) translateY(var(--y)) !important;
          }
        }
      `}</style>
    </div>
  )
}
