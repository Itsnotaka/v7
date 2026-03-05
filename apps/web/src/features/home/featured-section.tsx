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
		<div className="col-span-8 tablet:col-span-4 flex flex-col">
			<div className="flex items-center gap-1.5 pb-2">
				<IconFeather2 size={12} className="text-muted-foreground" />
				<span className="text-2xs uppercase tracking-[0.06em] text-muted-foreground">
					Featured Post
				</span>
			</div>
			<hr className="border-t border-border" />

			<Link
				href={`/writing/${props.post.slug}`}
				className="group flex gap-5 pt-6 flex-1"
			>
				<div className="aspect-square w-1/2 shrink-0 overflow-hidden rounded border border-border">
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
				<div className="flex flex-1 flex-col gap-4 min-w-0">
					<h3 className="text-xl font-medium tracking-tight text-foreground">
						{props.post.title}
						<span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
							↗
						</span>
					</h3>
					<p className="text-sm leading-[1.6] text-foreground/60 line-clamp-3">
						{props.post.excerpt}
					</p>
					{props.post.tags.length > 0 && (
						<div className="mt-auto flex flex-wrap gap-1.5">
							{props.post.tags.map((tag) => (
								<Tag key={tag}>{tag}</Tag>
							))}
						</div>
					)}
				</div>
			</Link>

			<Link
				href="/writing"
				className="mt-auto flex items-center justify-center rounded-full border border-border px-4 py-2.5 pt-6 text-xs tracking-[-0.01em] text-foreground transition-colors hover:bg-muted"
			>
				More posts
			</Link>
		</div>
	);
}

function FeaturedProject(props: { item: WorkItem }) {
	return (
		<div className="col-span-8 tablet:col-span-4 flex flex-col">
			<div className="flex items-center gap-1.5 pb-2">
				<IconProjects size={12} className="text-muted-foreground" />
				<span className="text-2xs uppercase tracking-[0.06em] text-muted-foreground">
					Featured Work
				</span>
			</div>
			<hr className="border-t border-border" />

			<Link
				href={props.item.href}
				target="_blank"
				rel="noopener noreferrer"
				className="group flex gap-5 pt-6 flex-1"
			>
				<div className="aspect-square w-1/2 shrink-0 overflow-hidden rounded border border-border">
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
				<div className="flex flex-1 flex-col gap-4 min-w-0">
					<div>
						<p className="text-2xs uppercase tracking-[0.06em] text-muted-foreground mb-1">
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
					{props.item.tags.length > 0 && (
						<div className="mt-auto flex flex-wrap gap-1.5">
							{props.item.tags.map((tag) => (
								<Tag key={tag}>{tag}</Tag>
							))}
						</div>
					)}
				</div>
			</Link>

			<Link
				href="/work"
				className="mt-auto flex items-center justify-center rounded-full border border-border px-4 py-2.5 pt-6 text-xs tracking-[-0.01em] text-foreground transition-colors hover:bg-muted"
			>
				More work
			</Link>
		</div>
	);
}

export function FeaturedSection(props: {
	post: WritingMeta;
	work: WorkItem;
}) {
	return (
		<Section>
			<FeaturedPost post={props.post} />
			<FeaturedProject item={props.work} />
		</Section>
	);
}
