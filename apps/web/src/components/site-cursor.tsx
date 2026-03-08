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
  const state = useCursorState();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  if (reduce || !fine) return null;

  if (state.type === "text") {
    return <Cursor className="bg-foreground" />;
  }

  return (
    <Cursor
      className="rounded-full bg-foreground shadow-sm ring-1 ring-foreground/10"
      style={dot}
    />
  );
}
