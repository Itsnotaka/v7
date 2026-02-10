"use client";

import { useState } from "react";

import type { ModePreset } from "../portfolio-content";

type Props = {
  mode: ModePreset[];
};

export function DemoMode(props: Props) {
  const [id, setId] = useState(props.mode[0]?.id ?? "");
  const pick = props.mode.find((item) => item.id === id) ?? props.mode[0];

  if (!pick) {
    return null;
  }

  const panelId = `mode-panel-${pick.id}`;

  return (
    <div className="rounded-[1.6rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-bg)] p-5 md:p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase">
        Live demo / drive mode
      </p>
      <div role="tablist" aria-label="Drive mode presets" className="mt-4 grid gap-2 sm:grid-cols-3">
        {props.mode.map((item) => {
          const active = item.id === pick.id;
          return (
            <button
              key={item.id}
              role="tab"
              id={`mode-tab-${item.id}`}
              type="button"
              aria-controls={panelId}
              aria-selected={active}
              onClick={() => setId(item.id)}
              className="min-h-11 rounded-xl border px-4 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--portfolio-accent)] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none"
              style={{
                borderColor: active ? "var(--portfolio-accent)" : "var(--portfolio-line)",
                backgroundColor: active ? "var(--portfolio-accent-soft)" : "transparent",
              }}
            >
              <span className="portfolio-tech block text-[11px] tracking-[0.12em] uppercase">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <section
        role="tabpanel"
        id={panelId}
        aria-labelledby={`mode-tab-${pick.id}`}
        className="mt-5 rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-4"
      >
        <p className="text-sm leading-relaxed text-[color:var(--portfolio-muted)]">{pick.body}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="portfolio-tech text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
              Response
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--portfolio-line)]">
              <span
                className="block h-full bg-[color:var(--portfolio-accent)] motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
                style={{ width: `${pick.response}%` }}
              />
            </div>
          </div>
          <div>
            <p className="portfolio-tech text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
              Damping
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--portfolio-line)]">
              <span
                className="block h-full bg-[color:var(--portfolio-accent)] motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
                style={{ width: `${pick.damping}%` }}
              />
            </div>
          </div>
          <div>
            <p className="portfolio-tech text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
              Traction
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--portfolio-line)]">
              <span
                className="block h-full bg-[color:var(--portfolio-accent)] motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
                style={{ width: `${pick.traction}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
