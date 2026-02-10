"use client";

import { memo, useEffect, useState } from "react";
import { LineGraphSection } from "./line-graph-section";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  timeZone: "America/New_York",
});

const LiveTime = memo(function LiveTime({
  initialNow,
}: {
  initialNow: number;
}) {
  const [now, setNow] = useState(() => initialNow);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      setNow(initialNow + (Date.now() - start));
    }, 1000);
    return () => clearInterval(id);
  }, [initialNow]);

  return <span suppressHydrationWarning>{formatter.format(now)}</span>;
});

export function LandingPage({ initialNow }: { initialNow: number }) {
  return (
    <main className="col-span-6 pb-24">
      <hgroup className="flex justify-between gap-5 tracking-tight">
        <h1>Min Chun (Daniel) Fu</h1>
        <h1 className="text-muted-foreground">
          <LiveTime initialNow={initialNow} /> in New York City, New York
        </h1>
      </hgroup>
      <LineGraphSection />
    </main>
  );
}
