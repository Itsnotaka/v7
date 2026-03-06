"use client";

import Image from "next/image";
import { IconEmojiLolDefault } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { Section } from "~/components/page-shell";
import { useSpotifyQuery } from "~/hooks/use-spotify-query";

function SpotifyStatus() {
  const { song, loading } = useSpotifyQuery();

  if (!song.connected && !loading) return null;

  if (loading) {
    return (
      <div className="mt-8 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const playing = song.playing && song.track;

  if (!playing) {
    return (
      <div className="mt-8 flex items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-muted-foreground/40" />
        <span className="text-xs text-muted-foreground">Not playing</span>
      </div>
    );
  }

  const track = song.track!;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 flex items-center gap-3 group w-fit"
    >
      {track.image && (
        <Image
          src={track.image}
          alt={`${track.name} album cover`}
          width={40}
          height={40}
          className="rounded shadow-sm"
          unoptimized
        />
      )}
      <div className="flex items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-primary animate-pulse" />
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {track.artist} — {track.name}
        </span>
      </div>
    </a>
  );
}

export function Hero() {
  return (
    <Section className="relative mt-16">
      <div className="col-span-8 tablet:col-span-5">
        <p className="text-2xl/[1.5] tracking-wide text-balance">
          <span className="flex items-center gap-1 text-3xl/9">
            Daniel <IconEmojiLolDefault className="shrink-0" />
          </span>
          is a Design Engineer currently pursuing a Master of Science in Computer Engineering with a
          concentration in Human-Computer Interaction at{" "}
          <span className="underline underline-offset-2">New York University</span>.
        </p>
        <SpotifyStatus />
      </div>
    </Section>
  );
}
