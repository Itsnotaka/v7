"use client";

import {
  IconFeather2,
  IconProjects,
} from "@central-icons-react/round-outlined-radius-2-stroke-1.5";
import { ImageDithering } from "@paper-design/shaders-react";
import Link from "next/link";

import type { WorkItem } from "@workspace/data/work";
import type { WritingMeta } from "@workspace/data/writing";

import { Section } from "~/components/page-shell";

function Tag(props: { children: string }) {
  return (
    <span className="rounded border border-border px-2 py-0.5 text-2xs uppercase tracking-[0.06em] text-muted-foreground">
      {props.children}
    </span>
  );
}

function FeaturedPost(props: { post: WritingMeta }) {
  return (
    <div className="col-span-8 tablet:col-span-4 grid grid-cols-subgrid gap-x-5 gap-y-4">
      <div className="col-span-full flex items-center gap-1.5">
        <IconFeather2 size={12} className="text-muted-foreground" />
        <span className="text-2xs uppercase tracking-[0.06em] text-muted-foreground">
          Featured Post
        </span>
      </div>
      <hr className="col-span-full border-t border-border" />

      <Link
        href={`/writing/${props.post.slug}`}
        className="col-span-full tablet:col-span-2 max-tablet:mx-auto max-tablet:w-full max-tablet:max-w-sm"
      >
        <div className="aspect-square w-full overflow-hidden rounded border border-border">
          <ImageDithering
            width={400}
            height={400}
            image="https://paper.design/flowers.webp"
            colorBack="#000000"
            colorFront="#ffffff"
            colorHighlight="#ffffff"
            originalColors
            inverted={false}
            type="8x8"
            size={2}
            colorSteps={5}
            fit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </Link>

      <div className="col-span-full tablet:col-span-2 flex min-w-0 flex-col gap-4">
        <Link href={`/writing/${props.post.slug}`} className="group flex flex-col gap-4">
          <h3 className="text-xl font-medium tracking-tight text-foreground">
            {props.post.title}
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </h3>
          <p className="text-sm leading-[1.6] text-foreground/60 line-clamp-3">
            {props.post.excerpt}
          </p>
        </Link>
        {props.post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {props.post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
        <Link
          href="/writing"
          className="mt-auto self-end rounded-full border border-border px-4 py-2.5 text-xs tracking-[-0.01em] text-foreground transition-colors hover:bg-muted"
        >
          More posts
        </Link>
      </div>
    </div>
  );
}

function FeaturedProject(props: { item: WorkItem }) {
  return (
    <div className="col-span-8 tablet:col-span-4 grid grid-cols-subgrid gap-x-5 gap-y-4">
      <div className="col-span-full flex items-center gap-1.5">
        <IconProjects size={12} className="text-muted-foreground" />
        <span className="text-2xs uppercase tracking-[0.06em] text-muted-foreground">
          Featured Work
        </span>
      </div>
      <hr className="col-span-full border-t border-border" />

      <Link
        href={props.item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="col-span-full tablet:col-span-2 max-tablet:mx-auto max-tablet:w-full max-tablet:max-w-sm"
      >
        <div className="aspect-square w-full overflow-hidden rounded border border-border">
          <ImageDithering
            width={400}
            height={400}
            image="https://paper.design/flowers.webp"
            colorBack="#000000"
            colorFront="#ffffff"
            colorHighlight="#ffffff"
            originalColors
            inverted={false}
            type="8x8"
            size={2}
            colorSteps={5}
            fit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </Link>

      <div className="col-span-full tablet:col-span-2 flex min-w-0 flex-col gap-4">
        <Link
          href={props.item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-4"
        >
          <div>
            <p className="mb-1 text-2xs uppercase tracking-[0.06em] text-muted-foreground">
              {props.item.company}
            </p>
            <h3 className="text-xl font-medium tracking-tight text-foreground">
              {props.item.title}
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </h3>
          </div>
          <p className="text-sm leading-[1.6] text-foreground/60 line-clamp-3">
            {props.item.description}
          </p>
        </Link>
        {props.item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {props.item.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
        <Link
          href="/work"
          className="mt-auto self-end rounded-full border border-border px-4 py-2.5 text-xs tracking-[-0.01em] text-foreground transition-colors hover:bg-muted"
        >
          More work
        </Link>
      </div>
    </div>
  );
}

export function FeaturedSection(props: { post: WritingMeta; work: WorkItem }) {
  return (
    <Section className="relative gap-x-5 gap-y-8 pt-12 tablet:gap-y-0">
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 bottom-0 left-1/2 hidden -translate-x-1/2 border-l border-dashed border-border tablet:block"
      />
      <FeaturedPost post={props.post} />
      <FeaturedProject item={props.work} />
    </Section>
  );
}
