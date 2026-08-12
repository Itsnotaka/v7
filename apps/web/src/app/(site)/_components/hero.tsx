"use client";

import type { ReactNode } from "react";

import { Text } from "@v7/ui";

import { Mist } from "~/app/mist/mist";

import { useMono, useNight } from "./site-chrome";

export function Hero(props: { name: string; signatures: ReactNode }) {
  const { mono } = useMono();
  const { night } = useNight();

  return (
    <section className="relative h-[calc(100svh-5.75rem)]" aria-label="Refracted light">
      <Mist
        bleed
        clearable
        reveal
        mode={night ? "night" : "mist"}
        scene="storm"
        mono={mono}
        aria-label="Thunderstorm. Drag or swipe through the mist to reveal signatures left by visitors."
        className="h-full"
      >
        {props.signatures}
      </Mist>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 select-none p-4 sm:p-6">
        <Text
          as="h1"
          variant="display"
          className="max-w-[52ch] text-[clamp(1.375rem,1.1rem+1.4vw,2.125rem)]/[1.25] text-primary"
        >
          {props.name} is a product designer building interfaces where people and AI agents work in
          real time.{" "}
          <span className="text-primary/55">
            Currently pursuing an MS in Computer Engineering — Human-Computer Interaction — at New
            York University. Previously at Comp AI, Firetiger, and PartyKit (acquired by
            Cloudflare).
          </span>
        </Text>
      </div>
    </section>
  );
}
