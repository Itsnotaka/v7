import { DocPage } from "~/app/design-system/_components/doc-page";

const SCALE = [
  { name: "text-2xs", sample: "11px utility for dense metadata.", cls: "text-2xs" },
  { name: "text-xs", sample: "12px utility for helper labels.", cls: "text-xs" },
  { name: "text-sm", sample: "14px base UI copy and controls.", cls: "text-sm" },
  { name: "text-base", sample: "16px body emphasis and reading text.", cls: "text-base" },
  { name: "text-lg", sample: "18px compact subhead treatment.", cls: "text-lg" },
  { name: "text-xl", sample: "20px section-level heading.", cls: "text-xl" },
];

const FONT = `<p className="font-sans text-sm">Interface copy</p>
<p className="font-mono text-xs">Token + code text</p>`;

const TYPE = `<h1 className="text-4xl font-bold">Page title</h1>
<p className="text-sm text-subtle">Supportive copy</p>
<p className="font-mono text-xs text-subtle">Inline code</p>`;

export default function Page() {
  return (
    <DocPage
      title="Typography"
      body="Use the shared type scale and semantic text colors for consistent docs and component pages."
    >
      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-semibold text-default">Scale</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SCALE.map((item) => (
            <div key={item.name} className="rounded-xl border border-line bg-elevated p-4">
              <p className="mb-2 font-mono text-xs text-subtle">{item.name}</p>
              <p className={item.cls}>{item.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-default">Font Families</h2>
          <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4">
            <code className="font-mono text-xs text-default">{FONT}</code>
          </pre>
        </div>

        <div className="rounded-xl border border-line bg-elevated p-4">
          <p className="mb-2 font-sans text-sm text-default">Inter is used for interface copy.</p>
          <p className="font-mono text-xs text-subtle">
            Berkeley Mono is used for code and meta data.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-default">Recommended Pattern</h2>
        <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4">
          <code className="font-mono text-xs text-default">{TYPE}</code>
        </pre>
      </section>
    </DocPage>
  );
}
