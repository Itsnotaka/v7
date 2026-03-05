"use client";

import { IconEmojiLolDefault } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { Section } from "~/components/page-shell";
import { useSpotifyQuery } from "~/hooks/use-spotify-query";
import { cn } from "~/utils/cn";

function SpotifyStatus() {
  const { song, loading } = useSpotifyQuery();

  if (!song.connected && !loading) return null;

  if (loading) {
    return (
      <div className="mt-8 flex items-center gap-2">
        <span className="text-2xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const playing = song.playing && song.track;

  return (
    <div className="mt-8 flex items-center gap-2">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          playing ? "bg-[#1DB954] animate-pulse" : "bg-muted-foreground/40",
        )}
      />
      <span className="text-2xs text-muted-foreground">
        {playing
          ? `${song.track!.artist} — ${song.track!.name}`
          : "Not playing"}
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <Section className="relative mt-16">
      <div className="col-span-8 max-w-2xl pt-[120px] tablet:col-span-6 tablet:col-start-2 desktop:col-span-4 desktop:col-start-3">
      <p className="text-[23px] leading-[1.5] tracking-[0.01em]">
        <span className="flex items-center gap-1">
          Daniel <IconEmojiLolDefault className="shrink-0" />
        </span>
        is a Design Engineer that is currently pursuing a Master of Science in Computer
        Engineering with a concentration in Human-Computer Interaction at{" "}
        <span className="underline underline-offset-2">New York University</span>.
      </p>
      <SpotifyStatus />
      </div>
    </Section>
  );
}
