import Link from "next/link";
import { notFound } from "next/navigation";

import { DocPage } from "~/app/design-system/_components/doc-page";
import { PrimitivePreview } from "~/app/design-system/_components/primitive-preview";
import { PRIMITIVES, PRIMITIVE_BY_SLUG } from "~/app/design-system/libs/primitives";

type Props = {
  params: Promise<{ slug: string }>;
};

function row(item: (typeof PRIMITIVES)[number]) {
  return `import { ${item.name} } from "@base-ui/react/${item.slug}";`;
}

function demo(item: (typeof PRIMITIVES)[number]) {
  return `import { ${item.name} } from "@base-ui/react/${item.slug}";

export function Example() {
  return <${item.name} />;
}`;
}

export function generateStaticParams() {
  return PRIMITIVES.map((item) => ({ slug: item.slug }));
}

export default async function Page(props: Props) {
  const params = await props.params;
  const item = PRIMITIVE_BY_SLUG[params.slug];

  if (!item) {
    notFound();
  }

  return (
    <DocPage title={item.name} body={item.body} tag={item.group}>
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-elevated p-6">
          <h2 className="mb-4 text-lg font-semibold text-default">Preview</h2>
          <div className="flex min-h-44 items-center justify-center rounded-lg border border-line bg-background px-4 py-6">
            <PrimitivePreview item={item} />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-elevated p-6">
          <h2 className="mb-4 text-lg font-semibold text-default">Quick Links</h2>
          <div className="grid gap-3 text-sm">
            <Link
              href="/design-system/components"
              className="rounded-lg border border-line px-3 py-2 text-subtle hover:text-default"
            >
              View all primitives
            </Link>
            <a
              href={`https://base-ui.com/react/components/${item.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-line px-3 py-2 text-subtle hover:text-default"
            >
              Base UI documentation
            </a>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold text-default">Installation</h2>
        <p className="mb-4 text-sm text-subtle">
          Import this primitive directly when you want low-level composition control.
        </p>
        <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4">
          <code className="font-mono text-xs text-default">{row(item)}</code>
        </pre>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-default">Usage</h2>
        <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4">
          <code className="font-mono text-xs text-default">{demo(item)}</code>
        </pre>
      </section>
    </DocPage>
  );
}
