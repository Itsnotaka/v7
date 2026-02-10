import Link from "next/link";
import type { Route } from "next";

import { PORTFOLIO_IDS } from "../portfolio-content";

type Props = {
  id: string;
  ctaId: string;
  ctaLabel: string;
};

export function PortfolioHeader(props: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link
          href={"/portfolio" as Route}
          className="portfolio-tech inline-flex min-h-11 items-center rounded-lg border border-[color:var(--portfolio-line)] px-3 text-[10px] tracking-[0.18em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--portfolio-accent)]"
        >
          Ferrari Pattern Portfolio
        </Link>

        <nav aria-label="Portfolio variants" className="flex flex-wrap items-center gap-2">
          {PORTFOLIO_IDS.map((item) => {
            const active = props.id === item;
            return (
              <Link
                key={item}
                href={`/portfolio/${item}` as Route}
                aria-current={active ? "page" : undefined}
                className="portfolio-tech inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-[10px] tracking-[0.16em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--portfolio-accent)] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none"
                style={{
                  borderColor: active ? "var(--portfolio-accent)" : "var(--portfolio-line)",
                  backgroundColor: active ? "var(--portfolio-accent-soft)" : "transparent",
                }}
              >
                {item}
              </Link>
            );
          })}
        </nav>

        <a
          href={`#${props.ctaId}`}
          className="inline-flex min-h-11 items-center rounded-lg border border-[color:var(--portfolio-line)] px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--portfolio-accent)] motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out hover:bg-[color:var(--portfolio-overlay)] motion-reduce:transition-none"
        >
          {props.ctaLabel}
        </a>
      </div>
    </header>
  );
}
