"use client";

import { Cursor, useCursorState } from "motion-plus/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const dot = {
  width: 14,
  height: 14,
} as const;

export function SiteCursor() {
  const reduce = useReducedMotion();
  const { zone } = useCursorState();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  if (reduce || !fine) return null;

  if (zone) {
    return (
      <Cursor className="flex items-center rounded-full bg-foreground px-2 py-0.5 text-xs font-medium whitespace-nowrap text-background shadow-sm ring-1 ring-foreground/10">
        {zone}
      </Cursor>
    );
  }

  return (
    <Cursor
      className="rounded-full shadow-sm"
      style={{ ...dot, backgroundColor: "oklch(66.2% 0.228 35.8deg)" }}
    />
  );
}
