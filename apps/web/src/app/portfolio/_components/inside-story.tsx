import type * as React from "react";

import type { Inside } from "../portfolio-content";
import { MediaStage } from "./media-stage";

type Props = {
  inside: Inside;
};

export function InsideStory(props: Props) {
  return (
    <section
      className="portfolio-enter rounded-[2rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-6 md:p-8"
      style={{ "--delay": "170ms" } as React.CSSProperties}
    >
      <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
        <article>
          <p className="portfolio-tech text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase">
            {props.inside.kicker}
          </p>
          <h2 className="portfolio-display mt-4 text-4xl leading-[1.08] tracking-tight md:text-5xl">
            {props.inside.title}
          </h2>
          <p className="mt-4 max-w-prose text-[15px] leading-[1.7] text-[color:var(--portfolio-muted)]">
            {props.inside.body}
          </p>
          <p className="portfolio-tech mt-6 text-[10px] tracking-[0.16em] text-[color:var(--portfolio-muted)] uppercase">
            Replace media slot in `portfolio-content.ts` when final footage is ready.
          </p>
        </article>
        <MediaStage media={props.inside.media} />
      </div>
    </section>
  );
}
