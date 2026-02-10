"use client";

import { memo, useEffect, useState } from "react";
import { LineGraphSection } from "./line-graph-section";

const LiveTime = memo(function LiveTime() {
  const [now, setNow] = useState(() =>
    new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
      timeZone: "America/New_York",
    }).format(Date.now()),
  );

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setNow(now + (Date.now() - start));
    }, 1000);
    return () => clearInterval(id);
  }, [now]);

  return <span suppressHydrationWarning>{now}</span>;
});

export function LandingPage() {
  return (
    <main className="col-span-6 pb-24">
      <hgroup className="flex justify-between gap-5 tracking-tight">
        <h1>Min Chun (Daniel) Fu</h1>
        <h1 className="text-muted-foreground">
          <LiveTime /> in New York City, New York
        </h1>
      </hgroup>
      <LineGraphSection />
    </main>
  );
}
