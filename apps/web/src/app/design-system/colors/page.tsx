import { DocPage } from "~/app/design-system/_components/doc-page";

const TOKENS = [
  { name: "background", bg: "bg-background", text: "text-default" },
  { name: "elevated", bg: "bg-elevated", text: "text-default" },
  { name: "line", bg: "bg-line", text: "text-default" },
  { name: "muted", bg: "bg-muted", text: "text-subtle" },
  { name: "primary", bg: "bg-primary", text: "text-primary-foreground" },
  { name: "secondary", bg: "bg-secondary", text: "text-secondary-foreground" },
  { name: "accent", bg: "bg-accent", text: "text-accent-foreground" },
  { name: "destructive", bg: "bg-destructive", text: "text-destructive-foreground" },
];

const GOOD = `<div className="bg-background text-default border border-line">
  <button className="bg-primary text-primary-foreground">Primary</button>
  <button className="bg-muted text-default">Secondary</button>
</div>`;

const BAD = `<div className="bg-white text-black dark:bg-black dark:text-white">
  <button className="bg-blue-500">Primary</button>
</div>`;

const MODE = `<html data-mode="light">
<html data-mode="dark">

<div className="bg-background text-default" />`;

export default function Page() {
  return (
    <DocPage
      title="Colors"
      body="Use semantic color tokens so UI surfaces stay consistent across light and dark modes."
    >
      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-semibold text-default">Usage</h2>
        <p className="mb-4 text-sm text-subtle">
          Match Kumo guidance by using semantic tokens instead of raw palette values.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-default">Correct</p>
            <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4">
              <code className="font-mono text-xs text-default">{GOOD}</code>
            </pre>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-default">Avoid</p>
            <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4">
              <code className="font-mono text-xs text-default">{BAD}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-2xl font-semibold text-default">Mode</h2>
        <p className="mb-4 text-sm text-subtle">
          Set <code className="rounded bg-muted px-1 py-0.5">data-mode</code> on a parent and let
          tokens adapt automatically.
        </p>
        <pre className="overflow-x-auto rounded-xl border border-line bg-background p-4">
          <code className="font-mono text-xs text-default">{MODE}</code>
        </pre>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-default">Token Reference</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOKENS.map((item) => (
            <div key={item.name} className="rounded-xl border border-line bg-elevated p-3">
              <div className={`mb-2 h-14 rounded-md border border-line ${item.bg}`} />
              <p className="font-mono text-xs text-subtle">{item.name}</p>
              <p className={`text-xs ${item.text}`}>Aa</p>
            </div>
          ))}
        </div>
      </section>
    </DocPage>
  );
}
