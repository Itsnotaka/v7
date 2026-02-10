"use client";

import { useState } from "react";

import type { TorqueConfig } from "../portfolio-content";

type Props = {
  torque: TorqueConfig;
};

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function DemoTorque(props: Props) {
  const [pull, setPull] = useState(46);
  const power = Math.round(props.torque.min + ((props.torque.max - props.torque.min) * pull) / 100);
  const reserve = 100 - pull;
  const release = Math.round(35 + reserve * 0.7);

  return (
    <div className="rounded-[1.6rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-bg)] p-5 md:p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase">
        Live demo / manual torque
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <button
          type="button"
          aria-label="Reduce paddle pull"
          onClick={() => setPull((value) => clamp(value - 6))}
          className="min-h-11 rounded-xl border border-[color:var(--portfolio-line)] px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--portfolio-accent)] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out hover:bg-[color:var(--portfolio-overlay)] motion-reduce:transition-none"
        >
          Left Paddle
        </button>

        <label className="block">
          <span className="portfolio-tech mb-2 block text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
            Pull intensity
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pull}
            onChange={(event) => setPull(Number(event.target.value))}
            aria-label="Torque pull intensity"
            className="h-11 w-full cursor-pointer accent-[color:var(--portfolio-accent)]"
          />
        </label>

        <button
          type="button"
          aria-label="Increase paddle pull"
          onClick={() => setPull((value) => clamp(value + 6))}
          className="min-h-11 rounded-xl border border-[color:var(--portfolio-line)] px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--portfolio-accent)] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out hover:bg-[color:var(--portfolio-overlay)] motion-reduce:transition-none"
        >
          Right Paddle
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-4">
          <p className="portfolio-tech text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
            Torque
          </p>
          <p className="portfolio-display mt-2 text-3xl leading-none">
            {power} <span className="text-base">{props.torque.unit}</span>
          </p>
        </article>
        <article className="rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-4">
          <p className="portfolio-tech text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
            {props.torque.low}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--portfolio-line)]">
            <span
              className="block h-full bg-[color:var(--portfolio-accent)] motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
              style={{ width: `${pull}%` }}
            />
          </div>
        </article>
        <article className="rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-4">
          <p className="portfolio-tech text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
            {props.torque.high}
          </p>
          <p className="mt-2 text-2xl">{release}%</p>
          <p className="mt-1 text-xs text-[color:var(--portfolio-muted)]">reserve {reserve}%</p>
        </article>
      </div>
    </div>
  );
}
