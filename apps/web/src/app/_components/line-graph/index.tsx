"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const MAX_GRAPH_WIDTH = 1220;
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
  // Add or remove entries here. Marker position is computed from date.
  events: [
    { date: "2020-06-16", event: "Launch V1" },
    { date: "2022-11-03", event: "Design System 2.0" },
    { date: "2024-01-23", event: "Cursor 0.45" },
    { date: "2025-03-14", event: "Composer 1.0" },
  ],
} as const;

export function LineGraph() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const [dev, setDev] = useState(false);
  const [copy, setCopy] = useState<"idle" | "done" | "fail">("idle");
  const [morph, setMorph] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [graphWidth, setGraphWidth] = useState<number>(lineGraphConfig.width);
  const [lineMultiplier, setLineMultiplier] = useState<number>(
    lineGraphConfig.lineMultiplier
  );
  const [morphMultiplier, setMorphMultiplier] = useState<number>(
    lineGraphConfig.morphMultiplier
  );
  const [proximity, setProximity] = useState<number>(
    lineGraphConfig.morphProximity
  );
  const lineCount = useMemo(() => {
    return clamp(Math.round(POINTS * lineMultiplier), [24, 320]);
  }, [lineMultiplier]);
  const step = graphWidth / Math.max(lineCount - 1, 1);

  const snippet = useMemo(() => {
    return `const lineGraphConfig = {
  width: ${Math.round(graphWidth)},
  lineMultiplier: ${lineMultiplier.toFixed(2)},
  renderedLines: ${lineCount},
  morphMultiplier: ${morphMultiplier.toFixed(2)},
  morphProximity: ${proximity},
};`;
  }, [graphWidth, lineCount, lineMultiplier, morphMultiplier, proximity]);

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

  const activeEvent = activeIndex === null ? null : (markerMap.get(activeIndex) ?? null);
  const markerIndices = useMemo(() => {
    return events.map((item) => item.index);
  }, [events]);

  function getRects() {
    if (!rootRef.current || !railRef.current) return null;
    return {
      root: rootRef.current.getBoundingClientRect(),
      rail: railRef.current.getBoundingClientRect(),
    };
  }

  function getHit(clientX: number, clientY: number) {
    const rects = getRects();
    if (!rects) return null;

    const insideX = clientX >= rects.rail.left && clientX <= rects.rail.right;
    const insideY = clientY >= rects.rail.top && clientY <= rects.rail.bottom;
    if (!insideX || !insideY) return null;

    const raw = Math.round((clientX - rects.rail.left) / step);
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

  function onCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopy("fail");
      return;
    }

    navigator.clipboard.writeText(snippet).then(
      () => setCopy("done"),
      () => setCopy("fail")
    );
  }

  const activeHeight = MORPH_HEIGHT * morphMultiplier;

  useEffect(() => {
    if (copy === "idle") {
      return;
    }

    const id = setTimeout(() => setCopy("idle"), 1800);
    return () => clearTimeout(id);
  }, [copy]);

  return (
    <div
      ref={rootRef}
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

      <div className="absolute top-0 right-0 z-10 flex flex-col items-end gap-2">
        <button
          type="button"
          className="rounded bg-foreground px-2 py-1 font-mono text-xs text-background"
          onClick={() => setDev((state) => !state)}
        >
          Dev mode: {dev ? "on" : "off"}
        </button>

        {dev && (
          <div className="w-64 rounded bg-background/90 p-3 font-mono text-xs text-foreground shadow-sm">
            <label className="mb-1 block">Width: {Math.round(graphWidth)}px</label>
            <input
              className="mb-3 w-full"
              type="range"
              min="840"
              max={String(MAX_GRAPH_WIDTH)}
              step="10"
              value={graphWidth}
              onChange={(e) => setGraphWidth(Number(e.currentTarget.value))}
            />

            <label className="mb-1 block">
              Line multiplier: {lineMultiplier.toFixed(2)} ({lineCount} lines)
            </label>
            <input
              className="mb-3 w-full"
              type="range"
              min="0.50"
              max="2.50"
              step="0.05"
              value={lineMultiplier}
              onChange={(e) => setLineMultiplier(Number(e.currentTarget.value))}
            />

            <label className="mb-1 block">Morph multiplier: {morphMultiplier.toFixed(2)}</label>
            <input
              className="mb-3 w-full"
              type="range"
              min="0.50"
              max="2.50"
              step="0.05"
              value={morphMultiplier}
              onChange={(e) => setMorphMultiplier(Number(e.currentTarget.value))}
            />

            <label className="mb-1 block">Morph proximity: {proximity}</label>
            <input
              className="w-full"
              type="range"
              min="0"
              max="12"
              step="1"
              value={proximity}
              onChange={(e) => setProximity(Number(e.currentTarget.value))}
            />

            <button
              type="button"
              className="mt-3 w-full rounded bg-foreground px-2 py-1 text-background"
              onClick={onCopy}
            >
              Copy config
            </button>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {copy === "done" && "Copied"}
              {copy === "fail" && "Clipboard not available"}
              {copy === "idle" && "Copies width and multipliers as code"}
            </div>
          </div>
        )}
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
