import type * as React from "react";

import type { Story } from "../portfolio-content";
import { MediaStage } from "./media-stage";

type Props = {
  story: Story;
  index: number;
  demo?: React.ReactNode;
};

function mark(index: number): string {
  if (index + 1 < 10) {
    return `0${index + 1}`;
  }

  return `${index + 1}`;
}

function copyOrder(story: Story): string {
  if (story.align === "right") {
    return "md:order-2";
  }

  return "md:order-1";
}

function mediaOrder(story: Story): string {
  if (story.align === "right") {
    return "md:order-1";
  }

  return "md:order-2";
}

export function StorySection(props: Props) {
  return (
    <section
      id={props.story.id}
      className="portfolio-enter relative overflow-hidden rounded-[2rem] border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-6 shadow-[0_40px_80px_-56px_var(--portfolio-shadow)] md:p-8"
      style={{ "--delay": `${props.index * 85 + 90}ms` } as React.CSSProperties}
    >
      <div aria-hidden className="absolute -top-6 -right-3 text-right md:-top-10">
        <p className="portfolio-outline text-6xl leading-[0.85] md:text-8xl">{mark(props.index)}</p>
      </div>
      <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
        <article className={copyOrder(props.story)}>
          <p className="font-mono text-[10px] tracking-[0.24em] text-[color:var(--portfolio-muted)] uppercase">
            {props.story.kicker}
          </p>
          <h2 className="portfolio-display mt-3 text-3xl leading-[1.08] tracking-tight md:text-4xl">
            {props.story.title}
          </h2>
          <p className="mt-4 max-w-prose text-[15px] leading-[1.7] text-[color:var(--portfolio-muted)]">
            {props.story.body}
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-[color:var(--portfolio-ink)]">
            {props.story.points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--portfolio-accent)]"
                />
                {point}
              </li>
            ))}
          </ul>
        </article>

        <div className={mediaOrder(props.story)}>
          <MediaStage media={props.story.media} priority={props.index < 2} />
        </div>
      </div>

      {props.demo ? <div className="mt-6">{props.demo}</div> : null}
    </section>
  );
}
