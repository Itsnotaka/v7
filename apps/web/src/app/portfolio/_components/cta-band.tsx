import type * as React from "react";

import type { Cta } from "../portfolio-content";

type Props = {
  cta: Cta;
};

export function CtaBand(props: Props) {
  return (
    <section
      id={props.cta.id}
      className="portfolio-enter relative overflow-hidden rounded-[2rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-8 md:p-10"
      style={{ "--delay": "120ms" } as React.CSSProperties}
    >
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_85%_50%,var(--portfolio-accent-soft),transparent_58%)]" />
      <div className="relative max-w-3xl">
        <p className="portfolio-tech text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase">
          Engineering CTA
        </p>
        <h2 className="portfolio-display mt-4 text-4xl leading-[1.05] tracking-tight md:text-5xl">
          {props.cta.title}
        </h2>
        <p className="mt-4 max-w-prose text-[15px] leading-[1.7] text-[color:var(--portfolio-muted)]">
          {props.cta.body}
        </p>
        <a
          href={props.cta.href}
          className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-[color:var(--portfolio-accent)] bg-[color:var(--portfolio-accent-soft)] px-5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--portfolio-accent)] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out hover:bg-[color:var(--portfolio-overlay)] motion-reduce:transition-none"
        >
          {props.cta.action}
        </a>
      </div>
    </section>
  );
}
