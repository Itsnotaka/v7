"use client";

import { useQuery } from "@tanstack/react-query";

export type Track = {
  name: string;
  artist: string;
  url: string;
  image: string | null;
};

type Playing = {
  connected: boolean;
  playing: boolean;
  source: "live" | "cache" | "none";
  track: Track | null;
};

type Song = {
  connected: boolean;
  playing: boolean;
  source: "live" | "cache" | "none";
  track: Track | null;
};

const idle: Song = {
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
  });

  if (!res.ok) {
    throw new Error("Unable to load Spotify now playing");
  }

  const data = (await res.json()) as Playing;

  return data;
}

function pick(data: Playing): Song {
  return {
    connected: data.connected,
    playing: data.playing,
    source: data.source,
    track: data.track,
  };
}

export function useSpotifyQuery() {
  const state = useQuery({
    queryKey: ["spotify", "now-playing"],
    queryFn: ({ signal }) => load(signal),
    select: pick,
    notifyOnChangeProps: ["data"],
    refetchOnWindowFocus: false,
    retry: false,
  });

  const song = state.data ?? idle;
  const loading = state.data === undefined;

  return {
    song,
    loading,
  };
}
