import type * as React from "react";

import type { PortfolioVariant, Story } from "../portfolio-content";
import { CtaBand } from "./cta-band";
import { DemoBinnacle } from "./demo-binnacle";
import { DemoMode } from "./demo-mode";
import { DemoPanel } from "./demo-panel";
import { DemoTorque } from "./demo-torque";
import { InsideStory } from "./inside-story";
import { KineticRibbon } from "./kinetic-ribbon";
import { MediaStage } from "./media-stage";
import { PortfolioHeader } from "./portfolio-header";
import { StorySection } from "./story-section";
import { WebglVeil } from "./webgl-veil";

type Props = {
  variant: PortfolioVariant;
};

function demo(story: Story, variant: PortfolioVariant): React.ReactNode {
  if (story.demo === "mode") {
    return <DemoMode mode={variant.mode} />;
  }

  if (story.demo === "torque") {
    return <DemoTorque torque={variant.torque} />;
  }

  if (story.demo === "panel") {
    return <DemoPanel panel={variant.panel} />;
  }

  if (story.demo === "binnacle") {
    return <DemoBinnacle binnacle={variant.binnacle} />;
  }

  return null;
}

export function PortfolioPage(props: Props) {
  return (
    <main
      id="portfolio-main"
      className={`portfolio-theme ${props.variant.tone} relative isolate overflow-hidden`}
    >
      <WebglVeil id={props.variant.id} />
      <div aria-hidden className="portfolio-grain" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,var(--portfolio-accent-soft),transparent_35%),radial-gradient(circle_at_80%_0%,var(--portfolio-overlay),transparent_40%)]"
      />
      <PortfolioHeader
        id={props.variant.id}
        ctaId={props.variant.cta.id}
        ctaLabel={props.variant.cta.action}
      />

      <section className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:px-8 md:pt-16">
        <article className="portfolio-enter" style={{ "--delay": "30ms" } as React.CSSProperties}>
          <p className="portfolio-tech text-[10px] tracking-[0.2em] text-[color:var(--portfolio-muted)] uppercase">
            {props.variant.hero.kicker}
          </p>
          <div className="mt-4 flex items-end gap-4 md:gap-6">
            <p aria-hidden className="portfolio-outline text-7xl leading-[0.78] md:text-9xl">
              {props.variant.id}
            </p>
            <p className="portfolio-tech pb-3 text-[10px] tracking-[0.22em] text-[color:var(--portfolio-muted)] uppercase">
              {props.variant.label}
            </p>
          </div>
          <h1 className="portfolio-display mt-4 text-5xl leading-[0.92] tracking-tight md:text-7xl">
            {props.variant.hero.title}
          </h1>
          <p className="mt-5 max-w-prose text-[15px] leading-[1.75] text-[color:var(--portfolio-muted)]">
            {props.variant.hero.body}
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {props.variant.hero.stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[color:var(--portfolio-line)] bg-[color:var(--portfolio-overlay)] p-3"
              >
                <dt className="portfolio-tech text-[10px] tracking-[0.14em] text-[color:var(--portfolio-muted)] uppercase">
                  {item.label}
                </dt>
                <dd className="mt-2 text-lg leading-none">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="portfolio-tech mt-7 text-[10px] tracking-[0.16em] text-[color:var(--portfolio-muted)] uppercase">
            {props.variant.memory}
          </p>
        </article>

        <div className="portfolio-enter" style={{ "--delay": "120ms" } as React.CSSProperties}>
          <MediaStage
            media={props.variant.hero.media}
            priority
            className="md:-rotate-[1.5deg] md:translate-y-6"
          />
        </div>
      </section>

      <KineticRibbon label={props.variant.label} id={props.variant.id} />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-20 md:px-8">
        {props.variant.stories.map((story, index) => (
          <StorySection
            key={story.id}
            story={story}
            index={index}
            demo={demo(story, props.variant)}
          />
        ))}
        <CtaBand cta={props.variant.cta} />
        <InsideStory inside={props.variant.inside} />
      </div>
    </main>
  );
}
