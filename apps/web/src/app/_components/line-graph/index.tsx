"use client";

import { useMemo, useRef, useState } from "react";

const POINTS = 122;
const MARKER_HEIGHT = 170;
const MORPH_HEIGHT = 260;

export const lineGraphConfig = {
  width: 840,
  lineMultiplier: 0.65,
  renderedLines: 79,
  morphMultiplier: 0.8,
  morphProximity: 4,
} as const;

export const timeline = {
  start: "2019-01-01",
  events: [
    { date: "2019-01-01", event: "Software Engineer, Flowapp" },
    { date: "2021-05-01", event: "Student, Penn State" },
    { date: "2024-08-01", event: "Lead Frontend Developer, AIPLUX" },
    { date: "2024-10-01", event: "Software Engineer, Noya Software" },
    { date: "2025-05-01", event: "System Engineer, Firetiger" },
    { date: "2025-11-01", event: "Founding Engineer, Comp AI" },
    { date: "2026-01-01", event: "Student, NYU" },
  ],
} as const;

export function LineGraph() {
  const railRef = useRef<HTMLDivElement | null>(null);

  const [morph, setMorph] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const graphWidth = lineGraphConfig.width;
  const morphMultiplier = lineGraphConfig.morphMultiplier;
  const proximity = lineGraphConfig.morphProximity;
  const fromMultiplier = Math.round(POINTS * lineGraphConfig.lineMultiplier);
  const lineCount = clamp(lineGraphConfig.renderedLines || fromMultiplier, [24, 320]);
  const step = graphWidth / Math.max(lineCount - 1, 1);

  const events = useMemo(() => {
    const from = new Date(timeline.start).getTime();
    const to = Date.now();
    const span = Math.max(to - from, 1);

    return timeline.events.map((item) => {
      const stamp = new Date(item.date).getTime();
      const ratio = clamp((stamp - from) / span, [0, 1]);
      const index = Math.round(ratio * (lineCount - 1));
      return { ...item, index };
    });
  }, [lineCount]);

  const markerMap = useMemo(() => {
    return events.reduce<Map<number, (typeof events)[number]>>((map, item) => {
      map.set(item.index, item);
      return map;
    }, new Map());
  }, [events]);

  const lines = useMemo(() => {
    let smoothedNoise = 0.5;

    return Array.from({ length: lineCount }, (_, index) => {
      const marker = markerMap.get(index);

      if (marker) {
        return { index, marker, height: MARKER_HEIGHT };
      }

      const targetNoise = random01(index * 13.37 + 4.2);
      smoothedNoise = smoothedNoise * 0.64 + targetNoise * 0.36;

      const wave = (Math.sin(index / 7.5) + 1) / 2;
      const jitter = random01(index * 5.17 + 19.8);
      const blend = smoothedNoise * 0.6 + wave * 0.3 + jitter * 0.1;

      return { index, marker: null, height: 96 + blend * 68 };
    });
  }, [lineCount, markerMap]);

  const activeEvent = activeIndex === null ? null : markerMap.get(activeIndex) ?? null;
  const markerIndices = useMemo(() => {
    return events.map((item) => item.index);
  }, [events]);

  function getHit(clientX: number, clientY: number) {
    if (!railRef.current) return null;
    const rail = railRef.current.getBoundingClientRect();

    const insideX = clientX >= rail.left && clientX <= rail.right;
    const insideY = clientY >= rail.top && clientY <= rail.bottom;
    if (!insideX || !insideY) return null;

    const raw = Math.round((clientX - rail.left) / step);
    const index = clamp(raw, [0, lineCount - 1]);
    return index;
  }

  function getNearestMarker(index: number | null) {
    if (index === null) return null;

    return markerIndices.reduce<number | null>((closest, marker) => {
      const distance = Math.abs(marker - index);
      if (distance > proximity) return closest;
      if (closest === null) return marker;

      const closestDistance = Math.abs(closest - index);
      return distance < closestDistance ? marker : closest;
    }, null);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;

    const hit = getHit(e.clientX, e.clientY);
    const nearest = getNearestMarker(hit);

    if (nearest !== null) {
      setMorph(true);
      setActiveIndex(nearest);
      return;
    }

    if (morph) {
      setMorph(false);
    }

    setActiveIndex(hit);
  }

  const activeHeight = MORPH_HEIGHT * morphMultiplier;

  return (
    <div
      className="relative mx-auto h-[460px] overflow-hidden"
      style={{ width: graphWidth }}
      onPointerMove={onPointerMove}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        setMorph(false);
        setActiveIndex(null);
      }}
    >
      <div ref={railRef} className="absolute top-0 left-0 h-[360px]" style={{ width: graphWidth }}>
        {lines.map((line) => {
          const active = morph && activeEvent?.index === line.index;
          const color = line.marker ? "bg-[#ff4d00]" : "bg-foreground/35";
          return (
            <div
              key={line.index}
              className={`absolute bottom-0 w-px ${color} transition-[height] duration-150 ease-out`}
              style={{
                left: line.index * step,
                height: active ? activeHeight : line.height,
              }}
            />
          );
        })}
      </div>

      <div className="pointer-events-none absolute top-0 left-1/2 w-fit -translate-x-1/2 font-mono text-[13px] whitespace-nowrap text-muted-foreground">
        {activeEvent ? activeEvent.event : null}
      </div>
      <div className="pointer-events-none absolute bottom-10 left-1/2 w-fit -translate-x-1/2 font-mono text-[13px] whitespace-nowrap text-muted-foreground">
        {activeEvent ? formatDate(activeEvent.date) : "Hover timeline"}
      </div>
    </div>
  );
}

function clamp(val: number, [min, max]: [number, number]) {
  return Math.min(Math.max(val, min), max);
}

function formatDate(input: string) {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function random01(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return value - Math.floor(value);
}
