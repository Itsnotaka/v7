import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import { getWritingContent, getWritingPosts } from '~/lib/content'
import { components } from '~/components/mdx-components'
import { PageSection } from '~/components/page-shell'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getWritingPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params
  const posts = getWritingPosts()
  const exists = posts.some((p) => p.slug === resolved.slug)
  if (!exists) return {}
  const { meta } = await getWritingContent(resolved.slug)
  return { title: meta.title, description: meta.excerpt }
}

export default async function WritingPage({ params }: Props) {
  const resolved = await params
  const posts = getWritingPosts()
  const exists = posts.some((p) => p.slug === resolved.slug)
  if (!exists) notFound()

  const { content, meta } = await getWritingContent(resolved.slug)

  const { content: rendered } = await compileMDX({
    source: content,
    components,
  })

  return (
    <PageSection>
      <header className="col-span-8 tablet:col-span-6 tablet:col-start-2 flex flex-col gap-2 pb-6 animate-article-enter">
        <time className="font-mono text-2xs uppercase tracking-[0.05em] text-foreground/40">
          {new Date(meta.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="font-sans text-xl font-medium tracking-tight text-foreground">
          {meta.title}
        </h1>
        <p className="text-sm leading-[1.5] text-foreground/50">
          {meta.excerpt}
        </p>
      </header>

      <article className="col-span-8 tablet:col-span-6 tablet:col-start-2 animate-article-enter" style={{ animationDelay: '80ms' }}>
        {rendered}
      </article>
    </PageSection>
  )
}
