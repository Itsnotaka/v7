"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

/**
 * Scales its children uniformly so they fit entirely inside the box —
 * no cropping. Children lay out at a fixed design width; the measured
 * natural size is transform-scaled to the container. offsetWidth/Height
 * ignore transforms, so observing both boxes cannot feed back.
 */
export function FitBox({ children, designWidth }: { children: ReactNode; designWidth: number }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const outerWidth = outer.clientWidth;
      const outerHeight = outer.clientHeight;
      const innerWidth = inner.offsetWidth;
      const innerHeight = inner.offsetHeight;
      if (!outerWidth || !outerHeight || !innerWidth || !innerHeight) return;
      setScale(Math.min(outerWidth / innerWidth, outerHeight / innerHeight));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="relative h-full w-full overflow-hidden">
      <div
        ref={innerRef}
        aria-hidden
        inert
        className="absolute top-1/2 left-1/2"
        style={{
          width: designWidth,
          transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}
