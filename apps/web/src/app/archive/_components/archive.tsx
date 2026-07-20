"use client";

import type * as React from "react";

import Link from "next/link";
import { useState } from "react";

import { Mist } from "~/app/mist/mist";
import { cn } from "~/utils/cn";

type ArchiveScene = NonNullable<React.ComponentProps<typeof Mist>["scene"]>;

const studies: { scene: ArchiveScene; name: string; label: string }[] = [
  { scene: "city", name: "Rainy city", label: "Interactive night mist with distant city lights." },
  {
    scene: "moon",
    name: "Moonlit cloud",
    label: "Interactive night mist with moonlight through cloud.",
  },
  { scene: "dusk", name: "Dusk horizon", label: "Interactive night mist with a low dusk horizon." },
  {
    scene: "sodium",
    name: "Sodium streetlamp",
    label: "Interactive night mist with sodium streetlamp glow.",
  },
  { scene: "neon", name: "Neon corridor", label: "Interactive night mist with dense neon signs." },
  {
    scene: "storm",
    name: "Lightning storm",
    label: "Interactive night mist during a lightning storm.",
  },
  {
    scene: "aurora",
    name: "Aurora curtains",
    label: "Interactive night mist beneath rippling aurora curtains.",
  },
  {
    scene: "fireflies",
    name: "Fireflies",
    label: "Interactive night mist over a meadow of drifting fireflies.",
  },
  {
    scene: "lighthouse",
    name: "Lighthouse beam",
    label: "Interactive night mist swept by a lighthouse beam.",
  },
  {
    scene: "embers",
    name: "Rising embers",
    label: "Interactive night mist with embers rising from an unseen fire.",
  },
  {
    scene: "tide",
    name: "Bioluminescent tide",
    label: "Interactive night mist over a glowing bioluminescent tide.",
  },
  {
    scene: "lantern",
    name: "Sky lanterns",
    label: "Interactive night mist among floating sky lanterns.",
  },
  {
    scene: "meteor",
    name: "Meteor shower",
    label: "Interactive night mist under a meteor shower.",
  },
  {
    scene: "cathedral",
    name: "Stained glass",
    label: "Interactive night mist through a backlit stained-glass window.",
  },
  {
    scene: "prism",
    name: "Prism veil",
    label: "Interactive night mist behind a refracting prism veil.",
  },
  {
    scene: "fireworks",
    name: "Fireworks finale",
    label: "Interactive night mist under a fireworks finale.",
  },
  {
    scene: "train",
    name: "Passing train",
    label: "Interactive night mist beside a passing night train.",
  },
  {
    scene: "wisps",
    name: "Will-o'-the-wisps",
    label: "Interactive night mist over wandering marsh wisps.",
  },
  {
    scene: "glowworms",
    name: "Glowworm cave",
    label: "Interactive night mist inside a glowworm cave above a still lake.",
  },
  {
    scene: "harbor",
    name: "Harbor lights",
    label: "Interactive night mist over blinking harbor lights.",
  },
  {
    scene: "volcano",
    name: "Distant eruption",
    label: "Interactive night mist facing a distant volcanic eruption.",
  },
  {
    scene: "ferris",
    name: "Ferris wheel",
    label: "Interactive night mist behind a turning ferris wheel.",
  },
  {
    scene: "tv",
    name: "Late-night TV",
    label: "Interactive night mist across from late-night television windows.",
  },
];

export function Archive() {
  const [index, setIndex] = useState(0);
  const study = studies[index] ?? studies[0]!;

  return (
    <div className="relative h-full">
      <Mist
        mode="night"
        scene={study.scene}
        aria-label={study.label}
        aria-describedby="archive-instruction"
        className="h-full"
      />
      <nav
        aria-label="Light studies"
        className="absolute top-4 left-4 max-h-[calc(100%-6rem)] w-52 overflow-y-auto rounded-xs bg-black/55 p-3 font-mono text-base/5 backdrop-blur-sm sm:text-sm/5"
      >
        <Link
          href="/v2"
          className="block pb-2 text-white/55 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          ← Daniel Fu
        </Link>
        <p className="pb-2 text-white/90">
          Archive — light studies
          <span className="block text-white/55">{studies.length} scenes, one shader</span>
        </p>
        <ul>
          {studies.map((item, i) => (
            <li key={item.scene}>
              <button
                type="button"
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "block w-full py-0.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  i === index ? "text-white" : "text-white/55 hover:text-white/90",
                )}
              >
                {i === index ? "● " : "○ "}
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <p
        id="archive-instruction"
        className="pointer-events-none absolute bottom-4 left-4 rounded-xs bg-black/55 px-2 py-1 font-mono text-base/5 text-white/90 backdrop-blur-sm sm:text-sm/5"
      >
        Press or drag to clear the mist.
      </p>
    </div>
  );
}
