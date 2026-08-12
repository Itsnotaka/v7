import type { Metadata } from "next";

import { getExperienceItem, getExperienceItems } from "@workspace/data/experiences";
import { notFound } from "next/navigation";

import { CaseStudy } from "../../_components/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getExperienceItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const item = getExperienceItem(resolved.slug);
  if (!item) return {};
  return { title: `${item.title} — ${item.owner}`, description: item.description };
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const item = getExperienceItem(resolved.slug);
  if (!item) notFound();
  return <CaseStudy item={item} />;
}
