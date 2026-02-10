"use client";

import { memo, useEffect, useState } from "react";
import { LineGraphSection } from "./line-graph-section";

const clock = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  timeZone: "America/New_York",
});

const Clock = memo(function Clock() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => setNow(clock.format(Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span aria-live="polite">{now}</span>;
});

export function LandingPage() {
  return (
    <main className="col-span-6 pb-24">
      <hgroup className="flex justify-between gap-5 tracking-tight">
        <h1>Min Chun (Daniel) Fu</h1>
        <h1 className="text-muted-foreground">
          <Clock /> in New York City, New York
        </h1>
      </hgroup>
      <LineGraphSection />
    </main>
  );
}
