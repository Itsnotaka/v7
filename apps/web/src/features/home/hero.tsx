"use client";

import type { JSX } from "react";

import { IconEmojiLolDefault } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import Image from "next/image";

import { Section } from "~/components/page-shell";
import { useSpotifyQuery } from "~/hooks/use-spotify-query";

function SpotifyStatus() {
  const { song } = useSpotifyQuery();

  if (!song.connected) return null;

  const track = song.track;

  if (song.source === "none" || !track) {
    return (
      <div className="mt-8 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Not listening to music right now (Which means I am most likely sleeping)
        </span>
      </div>
    );
  }

  const text = song.source === "live" && song.playing
    ? `currently listening to ${track.artist} — ${track.name}`
    : `Just listened to ${track.artist} — ${track.name}`;

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
          className="rounded-xs shadow-sm"
          unoptimized
        />
      )}
      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        {text}
      </span>
    </a>
  );
}

export function Hero(): JSX.Element {
  return (
    <Section className="relative mt-16">
      <div className="col-span-8 tablet:col-span-5">
        <p className="first-letter:pr-1 first-letter:[-webkit-initial-letter:2] first-letter:[initial-letter:2] text-2xl/[1.5] tracking-wide text-balance">
          Daniel is a graduate student in Human-Computer Interaction at NYU. Previously a design
          engineer, now exploring how humans and AI can work together.{" "}
          <IconEmojiLolDefault className="inline-block align-middle text-[0.85em]" />
        </p>
        <SpotifyStatus />
      </div>
    </Section>
  );
}
