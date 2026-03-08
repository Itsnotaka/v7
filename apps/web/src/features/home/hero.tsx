import type { JSX } from "react";

import { IconEmojiLolDefault } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import Image from "next/image";
import { Suspense } from "react";

import { Section } from "~/components/page-shell";
import { getSpotifyState, type SpotifyState } from "~/lib/spotify-status";

const idle = "Not listening to music right now (Which means I am most likely sleeping)";

function SpotifyLine({ text, track }: { text: string; track: SpotifyState["track"] }) {
  if (!track) {
    return (
      <div className="mt-8">
        <span className="text-xs text-muted-foreground">{text}</span>
      </div>
    );
  }

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-8 flex w-fit items-center gap-3"
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
      <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
        {text}
      </span>
    </a>
  );
}

async function SpotifyStatus() {
  const song = await getSpotifyState();

  if (!song.connected) return null;
  if (song.source === "none" || !song.track) return <SpotifyLine text={idle} track={null} />;

  const text =
    song.source === "live" && song.playing
      ? `currently listening to ${song.track.name}`
      : `Just listened to ${song.track.name}`;

  return <SpotifyLine text={text} track={song.track} />;
}

export function Hero(): JSX.Element {
  return (
    <Section className="relative mt-8">
      <div className="col-span-8 tablet:col-span-5">
        <p className="first-letter:pr-1 first-letter:[-webkit-initial-letter:2] first-letter:[initial-letter:2] text-2xl/[1.5] tracking-wide text-balance">
          Daniel is a graduate student in Human-Computer Interaction at NYU. Previously a design
          engineer, now exploring how humans and AI can work together.{" "}
          <IconEmojiLolDefault className="inline-block align-middle text-[0.85em]" />
        </p>
        <Suspense fallback={null}>
          <SpotifyStatus />
        </Suspense>
      </div>
    </Section>
  );
}
