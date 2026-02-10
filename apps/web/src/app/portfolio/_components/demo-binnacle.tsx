"use client";

import { useState } from "react";

import type { BinnacleConfig } from "../portfolio-content";

type Props = {
  binnacle: BinnacleConfig;
};

function ring(fill: number): string {
  return `conic-gradient(var(--portfolio-accent) ${fill}%, color-mix(in oklab, var(--portfolio-line) 82%, black 18%) ${fill}% 100%)`;
}

export function DemoBinnacle(props: Props) {
  const [left, setLeft] = useState(58);
  const [right, setRight] = useState(37);
  const center = Math.round((left + right) / 2);

  return (
    <div className="rounded-[1.6rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-bg)] p-5 md:p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase">
        Live demo / binnacle cluster
      </p>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-[color:var(--portfolio-muted)]">
        {props.binnacle.body}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <label className="block rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-4">
          <span className="portfolio-tech block text-[10px] tracking-[0.12em] text-[color:var(--portfolio-muted)] uppercase">
            {props.binnacle.left}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={left}
            onChange={(event) => setLeft(Number(event.target.value))}
            aria-label={props.binnacle.left}
            className="mt-3 h-11 w-full cursor-pointer accent-[color:var(--portfolio-accent)]"
          />
        </label>

        <div className="relative mx-auto grid h-44 w-44 place-items-center rounded-full border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)]">
          <div
            aria-hidden
            className="absolute inset-2 rounded-full"
            style={{ background: ring(left), opacity: 0.9 }}
          />
          <div
            aria-hidden
            className="absolute inset-8 rounded-full"
            style={{ background: ring(right), opacity: 0.7 }}
          />
          <div className="relative z-10 grid place-items-center rounded-full border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-bg)] px-4 py-3 text-center">
            <p className="portfolio-tech text-[9px] tracking-[0.16em] text-[color:var(--portfolio-muted)] uppercase">
              center load
            </p>
            <p className="portfolio-display text-2xl leading-none">{center}</p>
          </div>
        </div>

        <label className="block rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-4">
          <span className="portfolio-tech block text-[10px] tracking-[0.12em] text-[color:var(--portfolio-muted)] uppercase">
            {props.binnacle.right}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={right}
            onChange={(event) => setRight(Number(event.target.value))}
            aria-label={props.binnacle.right}
            className="mt-3 h-11 w-full cursor-pointer accent-[color:var(--portfolio-accent)]"
          />
        </label>
      </div>
    </div>
  );
}
