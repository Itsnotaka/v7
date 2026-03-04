"use client";

import { IconEmojiLolDefault } from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { useEffect, useState } from "react";

import { useTextParams } from "~/components/text-params-provider";

type Track = {
  name: string;
  artist: string;
};

type Playing = {
  connected: boolean;
  playing: boolean;
  source: "live" | "cache" | "none";
  track: Track | null;
};

const idle: Playing = {
  connected: false,
  playing: false,
  source: "none",
  track: null,
};

async function load(signal: AbortSignal) {
  const res = await fetch("/api/spotify/now-playing", {
    method: "GET",
    cache: "no-store",
    signal,
  }).catch(() => null);

  if (!res || !res.ok) return null;

  const data = (await res.json().catch(() => null)) as Playing | null;

  if (!data) return null;

  return data;
}

export function HomePage() {
  const params = useTextParams();
  const [song, setSong] = useState<Playing>(idle);

  useEffect(() => {
    const ctrl = new AbortController();

    const poll = async () => {
      const data = await load(ctrl.signal);

      if (!data) return;

      setSong(data);
    };

    void poll();

    const timer = window.setInterval(() => {
      void poll();
    }, 30_000);

    return () => {
      ctrl.abort();
      window.clearInterval(timer);
    };
  }, []);

  const label = !song.connected
    ? "Spotify disconnected"
    : song.playing
      ? "Listening now"
      : song.source === "cache"
        ? "Last played"
        : "Spotify idle";
  const dot = song.playing ? "bg-green-500" : "bg-zinc-500";

  return (
    <div className="relative h-full flex-col max-w-2xl mx-auto">
      <div className="pt-[120px] motion-reduce:transition-none motion-reduce:hover:transform-none w-full">
        <p
          className="text-[23px]"
          style={{
            letterSpacing: `${params.body.tracking}em`,
            lineHeight: params.body.lineHeight,
          }}
        >
          <span className="flex items-center gap-1">
            Daniel <IconEmojiLolDefault className="shrink-0" />
          </span>
          is an Design Engineer that is currently pursuing a Master of Science in Computer
          Engineering with a concentration in Human-Computer Interaction at New York University.
        </p>

        <div className="mt-10 flex items-start gap-3">
          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dot}`} />

          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>

            {song.track ? (
              <p className="text-sm text-muted-foreground">
                {song.track.name} — {song.track.artist}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {!song.connected ? "Waiting for Spotify connection" : "No recent track"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
