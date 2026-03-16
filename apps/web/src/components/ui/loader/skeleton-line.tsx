"use client";

import React, { useId, useMemo } from "react";

import { cn } from "~/utils/cn";

const hash = (value: string) => {
  let sum = 0;

  for (const char of value) {
    sum = (sum * 31 + char.charCodeAt(0)) >>> 0;
  }

  return sum;
};

const sort = (a: number, b: number): [number, number] => (a <= b ? [a, b] : [b, a]);

const ratio = (seed: string) => hash(seed) / 0x100000000;

const int = (seed: string, a: number, b: number) => {
  const [min, max] = sort(a, b);
  const span = max - min + 1;

  if (span <= 1) return min;

  return min + Math.floor(ratio(seed) * span);
};

const float = (seed: string, a: number, b: number) => {
  const [min, max] = sort(a, b);

  if (min === max) return min.toFixed(2);

  return (min + (max - min) * ratio(seed)).toFixed(2);
};

export interface SkeletonLineProps {
  minWidth?: number;
  maxWidth?: number;
  minDuration?: number;
  maxDuration?: number;
  minDelay?: number;
  maxDelay?: number;
  className?: string;
}

export const SkeletonLine = ({
  minWidth = 30,
  maxWidth = 100,
  minDuration = 1.3,
  maxDuration = 1.7,
  minDelay = 0,
  maxDelay = 0.5,
  className,
}: SkeletonLineProps) => {
  const id = useId();
  const style = useMemo<React.CSSProperties & Record<string, string>>(() => {
    const seed = [id, minWidth, maxWidth, minDuration, maxDuration, minDelay, maxDelay].join(":");
    const width = int(`${seed}:width`, minWidth, maxWidth);
    const duration = float(`${seed}:duration`, minDuration, maxDuration);
    const delay = float(`${seed}:delay`, minDelay, maxDelay);

    return {
      "--skeleton-width": `${width}%`,
      "--shimmer-duration": `${duration}s`,
      "--shimmer-delay": `${delay}s`,
    };
  }, [id, minWidth, maxWidth, minDuration, maxDuration, minDelay, maxDelay]);

  return <div className={cn("skeleton-line", className)} style={style}></div>;
};
