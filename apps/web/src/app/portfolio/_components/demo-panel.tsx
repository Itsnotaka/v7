"use client";

import { useState } from "react";

import type { PanelTab } from "../portfolio-content";

type Props = {
  panel: PanelTab[];
};

export function DemoPanel(props: Props) {
  const [id, setId] = useState(props.panel[0]?.id ?? "");
  const pick = props.panel.find((item) => item.id === id) ?? props.panel[0];

  if (!pick) {
    return null;
  }

  const panelId = `panel-view-${pick.id}`;

  return (
    <div className="rounded-[1.6rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-bg)] p-5 md:p-6">
      <p className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase">
        Live demo / control panel
      </p>
      <div
        role="tablist"
        aria-label="Control panel tabs"
        className="mt-4 grid gap-2 sm:grid-cols-2"
      >
        {props.panel.map((item) => {
          const active = item.id === pick.id;
          return (
            <button
              key={item.id}
              role="tab"
              id={`panel-tab-${item.id}`}
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
              <span className="portfolio-tech text-[11px] tracking-[0.12em] uppercase">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <section
        role="tabpanel"
        id={panelId}
        aria-labelledby={`panel-tab-${pick.id}`}
        className="mt-5 rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-4"
      >
        <p className="text-sm leading-relaxed text-[color:var(--portfolio-muted)]">{pick.body}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {pick.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-bg)] p-3"
            >
              <dt className="portfolio-tech text-[10px] tracking-[0.12em] text-[color:var(--portfolio-muted)] uppercase">
                {metric.label}
              </dt>
              <dd className="mt-2 text-xl leading-none">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
