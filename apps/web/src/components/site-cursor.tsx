"use client";

import { Cursor, useCursorState } from "motion-plus/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const ACCENT = "oklch(66.2% 0.228 35.8deg)";

const base: React.CSSProperties = {
  backgroundColor: ACCENT,
};

const dot: React.CSSProperties = {
  ...base,
  width: 14,
  height: 14,
};

const label: React.CSSProperties = {
  color: "white",
  fontSize: 12,
  fontWeight: 500,
  padding: "2px 8px",
  margin: 0,
  whiteSpace: "nowrap",
};

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

  return <Cursor style={zone ? base : dot}>{zone ? <p style={label}>{zone}</p> : null}</Cursor>;
}
