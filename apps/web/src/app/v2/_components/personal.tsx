import { Container, Label, Section, Text, theme } from "@v7/ui";

import { cn } from "~/utils/cn";
import { resume } from "@workspace/data";
import Image from "next/image";
import { Suspense } from "react";

import { getSpotifyState } from "~/lib/spotify-status";

async function NowPlaying() {
  const state = await getSpotifyState();

  if (!state.connected) return null;

  if (!state.track) {
    return (
      <Text as="p" variant="body" className="text-muted-foreground">
        Not listening to music right now — which means I am most likely sleeping.
      </Text>
    );
  }

  const lead = state.playing ? "Currently listening to" : "Just listened to";

  return (
    <div className="flex items-center gap-3">
      {state.track.image ? (
        <Image
          src={state.track.image}
          alt=""
          width={40}
          height={40}
          className={cn("border", theme.hairline)}
        />
      ) : null}
      <Text as="p" variant="body" className="text-foreground">
        {lead}{" "}
        <a
          href={state.track.url}
          target="_blank"
          rel="noreferrer"
          className={cn("text-primary", theme.link, theme.ring)}
        >
          {state.track.name}
        </a>{" "}
        <span className="text-muted-foreground">by {state.track.artist}</span>
      </Text>
    </div>
  );
}

function NowPlayingGap() {
  return (
    <Text as="p" variant="meta" className="text-muted-foreground">
      Checking the record player…
    </Text>
  );
}

export function Personal() {
  return (
    <Section id="personal" className="py-16 sm:py-24">
      <Container className="mx-auto">
        <Label as="h2">off hours</Label>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <Label as="h3">now</Label>
            <div className="mt-3">
              <Suspense fallback={<NowPlayingGap />}>
                <NowPlaying />
              </Suspense>
            </div>
          </div>
          <div>
            <Label as="h3">always</Label>
            <ul role="list" className="mt-3 grid gap-2">
              {resume.notes.map((note) => (
                <Text as="li" key={note.icon} variant="body" className="text-foreground">
                  {note.text}
                </Text>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
