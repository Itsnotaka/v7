import type { WorkMockupId } from "@workspace/data/work";

const requests = [
  {
    name: "Alex Chen",
    email: "alex@acme.co",
    company: "Acme",
    purpose: "SOC 2 procurement review",
    status: "Approved",
    expiry: "30 days",
    tone: "bg-success/10 text-success",
  },
  {
    name: "Sam Koh",
    email: "sam@globex.io",
    company: "Globex",
    purpose: "Vendor security assessment",
    status: "NDA pending",
    expiry: "7 day link",
    tone: "bg-warning/10 text-warning",
  },
  {
    name: "Jay Liu",
    email: "jay@initech.co",
    company: "Initech",
    purpose: "Enterprise pilot review",
    status: "Denied",
    expiry: "Logged",
    tone: "bg-destructive/10 text-destructive",
  },
] as const;

function Dot(props: { tone: string }) {
  return <span className={`size-1.5 rounded-full ${props.tone}`} />;
}

function Pill(props: { active?: boolean; children: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border px-2 py-1 text-2xs font-medium tracking-wide transition-colors",
        props.active
          ? "border-border bg-card text-foreground shadow-xs"
          : "border-transparent bg-transparent text-muted-foreground",
      ].join(" ")}
    >
      {props.children}
    </span>
  );
}

function Status(props: { tone: string; children: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium ${props.tone}`}
    >
      {props.children}
    </span>
  );
}

function TrustAccess() {
  return (
    <div className="w-full rounded-xl border border-border bg-background p-2 shadow-sm">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-foreground">Trust Access</p>
            <p className="text-2xs text-muted-foreground">Manage external documentation access</p>
          </div>
          <span className="rounded-full border border-border bg-muted px-2 py-1 text-2xs text-muted-foreground">
            Live
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-1">
            <Pill active>Requests</Pill>
            <Pill>Grants</Pill>
          </div>
          <span className="text-2xs text-muted-foreground">12 open</span>
        </div>

        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <div className="flex-1 rounded-md border border-border bg-background px-2.5 py-2 text-2xs text-muted-foreground">
            Search name, email, or company
          </div>
          <div className="rounded-md border border-border bg-background px-2.5 py-2 text-2xs text-muted-foreground">
            All
          </div>
        </div>

        <div className="border-b border-border px-3 py-1.5">
          <div className="flex items-center gap-2 text-2xs uppercase tracking-widest text-muted-foreground">
            <span className="flex-1">Identity</span>
            <span className="w-20 text-right">Status</span>
            <span className="w-14 text-right">Window</span>
          </div>
        </div>

        <div className="flex flex-col">
          {requests.map((row) => (
            <div
              key={row.email}
              className="flex items-start gap-2 border-b border-border px-3 py-2.5 last:border-0"
            >
              <div className="mt-1">
                <Dot tone={row.tone.split(" ")[0] ?? row.tone} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-medium text-foreground">{row.name}</p>
                  <span className="truncate text-2xs text-muted-foreground">{row.company}</span>
                </div>
                <p className="truncate text-2xs text-muted-foreground">{row.email}</p>
                <p className="truncate pt-1 text-2xs text-foreground/70">{row.purpose}</p>
              </div>
              <div className="flex w-20 justify-end">
                <Status tone={row.tone}>{row.status}</Status>
              </div>
              <div className="w-14 pt-0.5 text-right text-2xs text-muted-foreground">
                {row.expiry}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-3 text-2xs text-muted-foreground">
            <span>2 pending review</span>
            <span>1 signed today</span>
          </div>
          <span className="rounded-md bg-background px-2 py-1 text-2xs text-foreground">
            Approve &amp; send NDA
          </span>
        </div>
      </div>
    </div>
  );
}

function Field(props: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-2xs uppercase tracking-widest text-muted-foreground">
        {props.label}
      </label>
      <div className="rounded-lg border border-border bg-background px-3 py-3">
        <p className="text-xs text-foreground">{props.value}</p>
        {props.hint ? <p className="pt-1 text-2xs text-muted-foreground">{props.hint}</p> : null}
      </div>
    </div>
  );
}

function Onboarding() {
  return (
    <div className="w-full rounded-xl border border-border bg-background p-2 shadow-sm">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-2xs font-medium text-primary">
              Step 3
            </span>
            <span className="text-2xs text-muted-foreground">of 8</span>
          </div>
          <span className="text-2xs text-muted-foreground">Personalized by AI</span>
        </div>

        <div className="px-4 pt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-3/5 rounded-full bg-primary" />
          </div>
        </div>

        <div className="flex flex-col gap-5 px-4 py-5">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium tracking-tight text-foreground">
              Tell us about your company
            </p>
            <p className="text-sm text-muted-foreground">
              Our AI will personalize frameworks, policy tasks, and evidence collection from your
              answers.
            </p>
          </div>

          <Field
            label="Company website"
            value="https://trycomp.ai"
            hint="We use your website to tailor controls and recommendations."
          />

          <div className="grid grid-cols-2 gap-2">
            <Field label="Industry" value="SaaS" />
            <Field label="Team size" value="11-50" />
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-2xs uppercase tracking-widest text-muted-foreground">
              Suggested frameworks
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-2xs font-medium text-primary">
                SOC 2
              </span>
              <span className="rounded-full bg-card px-2 py-1 text-2xs font-medium text-foreground">
                ISO 27001
              </span>
              <span className="rounded-full bg-card px-2 py-1 text-2xs text-muted-foreground">
                GDPR
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            Back
          </span>
          <span className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
            Continue
          </span>
        </div>
      </div>
    </div>
  );
}

function Investigation() {
  return (
    <div className="w-full max-w-sm rounded-md bg-card p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-5 w-5 rounded-full bg-primary/10" />
        <p className="text-2xs font-medium">Investigation Agent</p>
      </div>
      <div className="rounded-lg bg-muted/50 px-2.5 py-2">
        <p className="text-2xs text-muted-foreground">
          Analyzing error spike in auth service. 3 related incidents found across the last 24h.
        </p>
      </div>
      <div className="self-end rounded-lg bg-primary/10 px-2.5 py-2 max-w-[80%]">
        <p className="text-2xs">Show trace for the auth timeout</p>
      </div>
      <div className="rounded-lg bg-muted/50 px-2.5 py-2">
        <p className="text-2xs text-muted-foreground">
          Trace abc-123: 4.2s response (SLO: 500ms). Root cause — connection pool exhaustion.
        </p>
      </div>
    </div>
  );
}

const bars = [40, 35, 60, 45, 80, 65, 50, 55, 90, 70, 45, 35];

function Monitoring() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-card p-3">
          <p className="text-2xs text-muted-foreground mb-1">Availability</p>
          <p className="text-base font-mono font-medium">99.97%</p>
        </div>
        <div className="rounded-md bg-card p-3">
          <p className="text-2xs text-muted-foreground mb-1">Error Budget</p>
          <p className="text-base font-mono font-medium text-warning">12.3%</p>
        </div>
      </div>
      <div className="rounded-md bg-card p-3">
        <p className="text-2xs text-muted-foreground mb-2">Latency p99</p>
        <div className="flex items-end gap-0.5 h-10">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-primary/20"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-md bg-card p-3">
        <p className="text-2xs text-muted-foreground mb-1.5">Active Alerts</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
            <p className="text-2xs">Auth latency above threshold</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
            <p className="text-2xs">Connection pool at 92%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const mockupRegistry: Record<WorkMockupId, React.FC> = {
  "trust-access": TrustAccess,
  onboarding: Onboarding,
  investigation: Investigation,
  monitoring: Monitoring,
};

export function getMockup(id: WorkMockupId): React.ReactNode {
  const Comp = mockupRegistry[id];
  return Comp ? <Comp /> : null;
}
