import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { WritingMeta } from "@workspace/data/writing";

const root = path.join(process.cwd(), "content/writing");

export function getWritingPosts(): WritingMeta[] {
  if (!fs.existsSync(root)) return [];

  const files = fs.readdirSync(root).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(root, file), "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: String(data.title ?? ""),
        date: String(data.date ?? ""),
        excerpt: String(data.excerpt ?? ""),
        featured: Boolean(data.featured),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      } satisfies WritingMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPost(): WritingMeta | undefined {
  return getWritingPosts().filter((p) => p.featured)[0];
}

export async function getWritingContent(slug: string) {
  const file = path.join(root, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf-8");
  const { content, data } = matter(raw);

  const meta: WritingMeta = {
    slug,
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    featured: Boolean(data.featured),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };

  return { content, meta };
}
