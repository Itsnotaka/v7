import type { MockupId } from "@workspace/data/experiences";

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
        "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-1 text-2xs font-medium tracking-wide transition-colors",
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
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-2xs font-medium ${props.tone}`}
    >
      {props.children}
    </span>
  );
}

function TrustAccess() {
  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-medium text-foreground">Trust Access</p>
            <p className="text-2xs text-muted-foreground">Manage external documentation access</p>
          </div>
          <span className="rounded-full border border-border bg-muted px-2 py-1 text-2xs text-muted-foreground whitespace-nowrap">
            Live
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-1">
            <Pill active>Requests</Pill>
            <Pill>Grants</Pill>
          </div>
          <span className="text-2xs text-muted-foreground whitespace-nowrap">12 open</span>
        </div>

        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <div className="flex-1 rounded-sm bg-background px-2.5 py-2 text-2xs text-muted-foreground ring ring-border">
            Search name, email, or company
          </div>
          <div className="rounded-sm bg-background px-2.5 py-2 text-2xs text-muted-foreground whitespace-nowrap ring ring-border">
            All
          </div>
        </div>

        <div className="border-b border-border px-3 py-1.5">
          <div className="flex items-center gap-2 text-2xs tracking-wide text-muted-foreground">
            <span className="flex-1 whitespace-nowrap">Identity</span>
            <span className="w-20 whitespace-nowrap text-right">Status</span>
            <span className="w-14 whitespace-nowrap text-right">Window</span>
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
                  <p className="truncate whitespace-nowrap text-xs font-medium text-foreground">
                    {row.name}
                  </p>
                  <span className="truncate whitespace-nowrap text-2xs text-muted-foreground">
                    {row.company}
                  </span>
                </div>
                <p className="truncate whitespace-nowrap text-2xs text-muted-foreground">
                  {row.email}
                </p>
                <p className="truncate whitespace-nowrap pt-1 text-2xs text-foreground/70">
                  {row.purpose}
                </p>
              </div>
              <div className="flex w-20 justify-end">
                <Status tone={row.tone}>{row.status}</Status>
              </div>
              <div className="w-14 whitespace-nowrap pt-0.5 text-right text-2xs text-muted-foreground">
                {row.expiry}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-3 text-2xs text-muted-foreground">
            <span className="whitespace-nowrap">2 pending review</span>
            <span className="whitespace-nowrap">1 signed today</span>
          </div>
          <span className="rounded-md bg-background px-2 py-1 text-2xs text-foreground whitespace-nowrap">
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
      <label className="text-2xs tracking-wide text-muted-foreground whitespace-nowrap">
        {props.label}
      </label>
      <div className="rounded-sm bg-background px-3 py-3 ring ring-border">
        <p className="text-xs text-foreground">{props.value}</p>
        {props.hint ? <p className="pt-1 text-2xs text-muted-foreground">{props.hint}</p> : null}
      </div>
    </div>
  );
}

function Onboarding() {
  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-2xs font-medium text-primary whitespace-nowrap">
              Step 3
            </span>
            <span className="text-2xs text-muted-foreground whitespace-nowrap">of 8</span>
          </div>
          <span className="text-2xs text-muted-foreground whitespace-nowrap">
            Personalized by AI
          </span>
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

          <div className="rounded-sm bg-muted/50 p-3 ring ring-border">
            <p className="text-2xs tracking-wide text-muted-foreground whitespace-nowrap">
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
          <span className="rounded-sm bg-background px-3 py-2 text-xs text-muted-foreground whitespace-nowrap ring ring-border">
            Back
          </span>
          <span className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground whitespace-nowrap">
            Continue
          </span>
        </div>
      </div>
    </div>
  );
}

function AiPolicyEditor() {
  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-muted px-2 py-1 text-2xs text-muted-foreground ring ring-border">
              Saved
            </span>
            <p className="text-xs font-medium text-foreground">Access Control Policy</p>
          </div>
          <span className="rounded-sm bg-primary/10 px-2 py-1 text-2xs font-medium text-primary whitespace-nowrap">
            AI Assistant
          </span>
        </div>

        <div className="grid grid-cols-[1.35fr_0.85fr] gap-0">
          <div className="border-r border-border">
            <div className="flex items-center gap-1 border-b border-border px-3 py-2">
              <Pill active>Editor view</Pill>
              <Pill>PDF view</Pill>
            </div>

            <div className="flex flex-col gap-3 px-3 py-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-foreground">Access Control</p>
                <p className="text-2xs text-muted-foreground">
                  Define how employee and contractor access is granted, reviewed, and revoked.
                </p>
              </div>

              <div className="rounded-sm bg-background px-3 py-2 ring ring-border">
                <p className="text-2xs text-muted-foreground">Prompt</p>
                <p className="pt-1 text-xs text-foreground">
                  Add contractor access requirements and align this policy to SOC 2.
                </p>
              </div>

              <div className="rounded-sm bg-muted/50 p-3 ring ring-border">
                <div className="flex items-center justify-between">
                  <p className="text-2xs text-muted-foreground whitespace-nowrap">
                    Proposed changes
                  </p>
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-2xs font-medium text-success whitespace-nowrap">
                    Completed
                  </span>
                </div>

                <div className="pt-2">
                  <div className="rounded-sm bg-background px-2.5 py-2 ring ring-border">
                    <p className="text-2xs text-destructive line-through">
                      Access reviews are conducted periodically.
                    </p>
                    <p className="pt-1 text-2xs text-success">
                      Access reviews are conducted quarterly for employees and before each
                      engagement for contractors.
                    </p>
                    <p className="pt-1 text-2xs text-success">
                      Contractor access must be time-bound, approved by a manager, and removed at
                      the end of the engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-full flex-col">
            <div className="border-b border-border px-3 py-2">
              <p className="text-xs font-medium text-foreground">AI Assistant</p>
              <p className="text-2xs text-muted-foreground">
                Edit, adapt, or review this policy for compliance.
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-2 px-3 py-3">
              <div className="rounded-sm bg-muted/50 px-2.5 py-2 ring ring-border">
                <p className="text-2xs text-muted-foreground">
                  I can help you update this policy and show a diff before anything is applied.
                </p>
              </div>

              <div className="ml-auto max-w-[88%] rounded-sm bg-muted px-2.5 py-2">
                <p className="text-2xs text-foreground">
                  Modify the access control section to include contractors.
                </p>
              </div>

              <div className="rounded-sm bg-background px-2.5 py-2 ring ring-border">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xs font-medium text-foreground">Policy updates ready</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-2xs text-muted-foreground whitespace-nowrap">
                    Drafting
                  </span>
                </div>
                <p className="pt-1 text-2xs text-muted-foreground">
                  Review the proposed changes below before applying them.
                </p>
              </div>

              <div className="mt-auto rounded-sm bg-background px-2.5 py-2 ring ring-border">
                <p className="text-2xs text-muted-foreground">Ask about this policy...</p>
              </div>
              <div className="flex justify-end">
                <span className="rounded-sm bg-primary px-2.5 py-1.5 text-2xs font-medium text-primary-foreground whitespace-nowrap">
                  Send
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Investigation() {
  const steps = [
    "Reading runbook",
    "Research on service topology",
    "Retrieve relevant traces",
    "Query connection pool metrics",
    "Correlate deploy timeline",
    "Agent: Latency Root Cause",
    "Found 3 related incidents",
  ] as const;

  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-primary/10 px-2 py-1 text-2xs font-medium text-primary whitespace-nowrap">
              Session
            </span>
            <p className="text-xs font-medium text-foreground">Auth Latency Spike</p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-2xs font-medium text-success whitespace-nowrap">
            Done
          </span>
        </div>

        <div className="border-b border-border px-3 py-2.5">
          <div className="flex items-center justify-between">
            <p className="text-2xs font-medium text-foreground">Webhook trigger</p>
            <p className="text-2xs text-muted-foreground whitespace-nowrap">2 min ago</p>
          </div>
          <div className="mt-1.5 rounded-sm bg-muted/50 px-2.5 py-2 ring ring-border">
            <p className="text-2xs text-foreground/80">
              Auth service p99 latency exceeded 500ms SLO. Investigate root cause across traces and
              notify the on-call channel.
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          {steps.map((label) => (
            <div
              key={label}
              className="flex items-center gap-2.5 border-b border-border px-3 py-2 last:border-0"
            >
              <span className="text-xs text-muted-foreground/50">&#x203A;</span>
              <div className="size-4 shrink-0 rounded bg-muted" />
              <p className="flex-1 truncate text-2xs text-foreground">{label}</p>
              <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success whitespace-nowrap">
                Complete
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Monitoring() {
  const agents = [
    { name: "Auth Latency Monitor", schedule: "Every 15m", status: "done", runs: 142 },
    { name: "Connection Pool Watch", schedule: "Every 5m", status: "issue", runs: 89 },
    { name: "Deploy Health Check", schedule: "Post-deploy", status: "done", runs: 24 },
  ] as const;

  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-xs font-medium text-foreground">Monitoring Agents</p>
          <span className="text-2xs text-muted-foreground whitespace-nowrap">3 active</span>
        </div>

        <div className="flex flex-col">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="flex items-center gap-2.5 border-b border-border px-3 py-2.5 last:border-0"
            >
              <span
                className={`size-1.5 shrink-0 rounded-full ${agent.status === "issue" ? "bg-warning" : "bg-success"}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-2xs font-medium text-foreground">{agent.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {agent.schedule} · {agent.runs} sessions
                </p>
              </div>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${
                  agent.status === "issue"
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success"
                }`}
              >
                {agent.status === "issue" ? "Issue" : "Done"}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border bg-muted/40 px-3 py-2.5">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-sm bg-background px-2 py-2 ring ring-border">
              <p className="text-[10px] text-muted-foreground">Availability</p>
              <p className="pt-0.5 text-xs font-mono font-medium text-foreground">99.97%</p>
            </div>
            <div className="rounded-sm bg-background px-2 py-2 ring ring-border">
              <p className="text-[10px] text-muted-foreground">Error Budget</p>
              <p className="pt-0.5 text-xs font-mono font-medium text-warning">12.3%</p>
            </div>
            <div className="rounded-sm bg-background px-2 py-2 ring ring-border">
              <p className="text-[10px] text-muted-foreground">Issues</p>
              <p className="pt-0.5 text-xs font-mono font-medium text-foreground">3 open</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowWriting() {
  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-primary/10 px-2 py-1 text-2xs font-medium text-primary whitespace-nowrap">
              Interface
            </span>
            <p className="text-xs font-medium text-foreground">AI Writing Studio</p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-2xs font-medium text-success whitespace-nowrap">
            Synced
          </span>
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr]">
          <div className="border-r border-border">
            <div className="flex items-center gap-1 border-b border-border px-3 py-2">
              <Pill active>Document</Pill>
              <Pill>Comments</Pill>
              <Pill>Versions</Pill>
            </div>
            <div className="flex flex-col gap-3 px-3 py-3">
              <div className="rounded-sm bg-muted/50 px-2.5 py-2 ring ring-border">
                <p className="text-2xs tracking-wide text-muted-foreground">Prompt</p>
                <p className="pt-1 text-xs text-foreground">
                  Draft a launch memo with a stronger product narrative and clearer CTA.
                </p>
              </div>
              <div className="space-y-2 text-xs text-foreground">
                <p>
                  Introducing Interface — a writing workspace that keeps research, drafting, and
                  revision in one loop.
                </p>
                <p>
                  Teams can move from outline to polished draft
                  <span className="text-foreground/30">
                    {" "}
                    with live feedback, reusable prompts, and document-aware chat.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-3 py-3">
            <div className="flex items-center justify-between">
              <p className="text-2xs font-medium text-foreground">Agent</p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-2xs text-primary whitespace-nowrap">
                Active
              </span>
            </div>
            <div className="rounded-sm bg-muted/50 px-2.5 py-2 ring ring-border">
              <p className="text-2xs text-muted-foreground">
                I tightened the lead, added proof points, and left two optional closing lines.
              </p>
            </div>
            <div className="ml-auto max-w-[88%] rounded-sm bg-muted px-2.5 py-2">
              <p className="text-2xs text-foreground">
                Expand on the collaboration benefits for teams.
              </p>
            </div>
            <div className="rounded-sm bg-background px-2.5 py-2 ring ring-border">
              <p className="text-2xs text-muted-foreground">
                Added a paragraph on real-time co-editing and shared prompt libraries. I can also
                weave in a customer quote if you have one.
              </p>
            </div>
            <div className="mt-auto rounded-sm bg-background px-2.5 py-2 ring ring-border">
              <p className="text-2xs text-muted-foreground">
                Ask Interface to rewrite or expand...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CursorBrowser() {
  const rules = ["display: flex", "gap: 12px", "padding: 16px", "border-radius: 12px"] as const;

  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span className="h-2 w-2 rounded-full bg-success" />
          </div>
          <p className="text-2xs text-muted-foreground">cursor://browser/session</p>
        </div>

        <div className="grid grid-cols-[1.05fr_0.95fr]">
          <div className="border-r border-border px-3 py-3">
            <div className="rounded-sm bg-muted/40 p-3 ring ring-border">
              <div className="rounded-sm border border-dashed border-primary/60 bg-background p-3">
                <div className="rounded-sm bg-card p-3 shadow-xs ring ring-border">
                  <div className="h-2.5 w-16 rounded-full bg-muted" />
                  <div className="mt-2 h-8 rounded-sm bg-primary/10 ring-1 ring-primary/30" />
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="h-12 rounded-sm bg-muted" />
                    <div className="h-12 rounded-sm bg-muted" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 text-2xs text-muted-foreground">
              Selected element: button.primary
            </div>
          </div>

          <div className="flex flex-col">
            <div className="border-b border-border px-3 py-2">
              <p className="text-xs font-medium text-foreground">Computed styles</p>
            </div>
            <div className="flex flex-col gap-1.5 px-3 py-3">
              {rules.map((rule) => (
                <div key={rule} className="rounded-sm bg-background px-2 py-1.5 ring ring-border">
                  <p className="text-2xs text-foreground">{rule}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-3 py-2">
              <p className="text-2xs text-muted-foreground">
                DOM path: body / main / section / button
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenParadigm() {
  const sheets = ["Series A Pipeline", "Founders", "Market Map"] as const;
  const cols = ["Company", "Revenue", "Stage", "Source"] as const;
  const grid = [
    ["Acme Corp", "$4.2M", "Series A", "Referral"],
    ["Globex Ltd", "$12.8M", "Series B", "Outbound"],
    ["Initech", "$890K", "Seed", "Inbound"],
    ["Umbrella Inc", "$21M", "Series C", "Referral"],
    ["Waystar", "$6.1M", "Series A", "Outbound"],
  ] as const;
  const active = 1;

  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="grid grid-cols-[7rem_1fr] rounded-sm bg-card ring ring-border">
        <div className="flex flex-col border-r border-border">
          <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-2">
            <div className="size-4 rounded-sm bg-primary/10" />
            <p className="truncate text-2xs font-medium text-foreground">Sheets</p>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 px-1.5 py-1.5">
            {sheets.map((name, i) => (
              <button
                key={name}
                type="button"
                className={[
                  "truncate rounded-sm px-2 py-1.5 text-left text-2xs transition-colors",
                  i === 0 ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="border-t border-border px-1.5 py-1.5">
            <div className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-2xs text-muted-foreground">
              <span className="text-[10px]">+</span>
              <span>New sheet</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-2.5 py-2">
            <p className="truncate text-2xs font-medium text-foreground">Series A Pipeline</p>
            <span className="rounded-sm bg-primary px-2 py-1 text-2xs font-medium text-primary-foreground whitespace-nowrap">
              Enrich
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-[1.6rem_1fr_0.7fr_0.65fr_0.7fr]">
              <div className="border-b border-border bg-muted/50 px-1 py-1.5 text-center text-[10px] text-muted-foreground">
                #
              </div>
              {cols.map((col, i) => (
                <div
                  key={col}
                  className={[
                    "border-b border-l border-border px-2 py-1.5 text-2xs font-medium",
                    i === active
                      ? "bg-primary/5 text-primary"
                      : "bg-muted/50 text-muted-foreground",
                  ].join(" ")}
                >
                  {col}
                </div>
              ))}

              {grid.map((row, r) => (
                <div key={row[0]} className="contents">
                  <div className="border-b border-border bg-background px-1 py-1.5 text-center text-[10px] text-muted-foreground tabular-nums">
                    {r + 1}
                  </div>
                  {row.map((cell, c) => (
                    <div
                      key={cell}
                      className={[
                        "truncate border-b border-l border-border px-2 py-1.5 text-2xs",
                        c === active
                          ? "bg-primary/[0.03] text-foreground"
                          : "bg-background text-foreground",
                      ].join(" ")}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border px-2.5 py-2">
            <span className="size-3.5 rounded-full bg-primary/10 text-center text-[9px] text-primary">
              &#10023;
            </span>
            <p className="text-2xs text-muted-foreground">
              Ask AI to enrich or generate columns...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenpokeHome() {
  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-primary/10" />
            <p className="text-2xs text-muted-foreground whitespace-nowrap">Friday, Mar 13</p>
          </div>
          <div className="size-7 rounded-full bg-muted ring ring-border" />
        </div>

        <div className="flex flex-col gap-4 px-4 py-5">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium tracking-tight text-foreground">Good morning</p>
            <p className="text-2xs text-muted-foreground">San Francisco — 58°F, partly cloudy</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="rounded-sm bg-muted/50 px-3 py-2.5 ring ring-border">
              <div className="flex items-center justify-between">
                <p className="text-2xs text-muted-foreground whitespace-nowrap">Unread</p>
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  4
                </span>
              </div>
              <p className="pt-1 text-xs text-foreground">2 flagged by agent, 1 needs reply</p>
            </div>
            <div className="rounded-sm bg-muted/50 px-3 py-2.5 ring ring-border">
              <div className="flex items-center justify-between">
                <p className="text-2xs text-muted-foreground whitespace-nowrap">Reminders</p>
                <span className="rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                  2
                </span>
              </div>
              <p className="pt-1 text-xs text-foreground">Follow up with Jamie at 2pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-center rounded-lg bg-primary px-4 py-3">
            <p className="text-sm font-medium text-primary-foreground">Text Poke</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenpokeChat() {
  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">‹</span>
            <p className="text-xs font-medium text-foreground">Poke</p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-2xs font-medium text-success whitespace-nowrap">
            Online
          </span>
        </div>

        <div className="flex flex-col gap-2.5 px-3 py-3">
          <div className="max-w-[85%] rounded-lg bg-muted/50 px-2.5 py-2 ring ring-border">
            <p className="text-2xs text-muted-foreground">
              You have 4 unread emails. Jamie from Acme replied about the enterprise plan — sounds
              positive. Want me to draft a follow-up?
            </p>
          </div>

          <div className="ml-auto max-w-[80%] rounded-lg bg-primary px-2.5 py-2">
            <p className="text-2xs text-primary-foreground">
              Yes, send pricing and two demo times.
            </p>
          </div>

          <div className="max-w-[85%]">
            <div className="rounded-lg bg-muted/50 px-2.5 py-2 ring ring-border">
              <p className="text-2xs text-muted-foreground">
                Done. I sent the enterprise overview with Tuesday 2pm and Thursday 10am as options.
                I will pause if Jamie asks for procurement or legal review.
              </p>
            </div>
            <div className="flex gap-1 pt-1">
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">&#9829;</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-1">
            <span className="size-1 rounded-full bg-muted-foreground/40" />
            <span className="size-1 rounded-full bg-muted-foreground/30" />
            <span className="size-1 rounded-full bg-muted-foreground/20" />
          </div>
        </div>

        <div className="border-t border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-full bg-muted" />
            <div className="flex-1 rounded-full bg-background px-3 py-2 text-2xs text-muted-foreground ring ring-border">
              Message Poke&#x2026;
            </div>
            <div className="size-5 rounded-full bg-muted" />
            <div className="rounded-full bg-primary px-2.5 py-1.5">
              <span className="text-2xs font-medium text-primary-foreground">Send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenpokeConnections() {
  const accounts = [
    { name: "daniel@gmail.com", primary: true, permissions: ["Email", "Calendar", "Contacts"] },
    { name: "work@company.io", primary: false, permissions: ["Email"] },
  ] as const;

  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">‹</span>
            <p className="text-xs font-medium text-foreground">Connections</p>
          </div>
          <span className="text-2xs text-muted-foreground whitespace-nowrap">2 accounts</span>
        </div>

        <div className="flex flex-col">
          {accounts.map((account) => (
            <div
              key={account.name}
              className="flex items-center gap-3 border-b border-border px-3 py-3 last:border-0"
            >
              <div className="size-8 shrink-0 rounded-full bg-primary/10" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-medium text-foreground">{account.name}</p>
                  {account.primary ? (
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary whitespace-nowrap">
                      Primary
                    </span>
                  ) : null}
                </div>
                <p className="pt-0.5 text-2xs text-muted-foreground">
                  {account.permissions.join(" · ")}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">&#x203A;</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-3 py-2.5">
          <div className="flex items-center justify-center rounded-sm bg-background px-3 py-2.5 ring ring-border">
            <p className="text-2xs font-medium text-foreground">Add Account</p>
          </div>
        </div>

        <div className="border-t border-border bg-muted/40 px-3 py-2.5">
          <p className="text-2xs text-muted-foreground whitespace-nowrap">Account permissions</p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-2xs text-success">
              Email
            </span>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-2xs text-success">
              Calendar
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-2xs text-muted-foreground">
              Contacts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartykitDemo() {
  const peers = ["Sunil", "Aka", "Interface Bot"] as const;

  return (
    <div className="w-full rounded-sm bg-background p-2 shadow-sm ring ring-border">
      <div className="rounded-sm bg-card ring ring-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-foreground">Collaborative draft</p>
            <span className="rounded-sm bg-secondary px-2 py-1 text-2xs text-muted-foreground">
              PartyKit
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {peers.map((peer) => (
              <span
                key={peer}
                className="rounded-full bg-primary/10 px-2 py-1 text-2xs font-medium text-primary whitespace-nowrap"
              >
                {peer}
              </span>
            ))}
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="rounded-sm bg-background p-3 ring ring-border">
            <p className="text-xs text-foreground">Realtime collaboration on the edge</p>
            <p className="pt-2 text-2xs text-muted-foreground">
              Live cursors, conflict-free text updates, and synced presence across every
              participant.
            </p>
            <div className="mt-3 flex items-start gap-2">
              <span className="rounded-sm bg-warning/10 px-2 py-1 text-2xs text-warning">
                Sunil is editing
              </span>
              <div className="flex-1 rounded-sm border border-dashed border-primary/50 px-2.5 py-2 text-2xs text-foreground">
                Add a shared comments rail and show room presence in the header.
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="rounded-sm bg-muted/50 px-2.5 py-2 ring ring-border">
              <p className="text-2xs text-muted-foreground">Peers</p>
              <p className="pt-1 text-xs text-foreground">3 connected</p>
            </div>
            <div className="rounded-sm bg-muted/50 px-2.5 py-2 ring ring-border">
              <p className="text-2xs text-muted-foreground">Latency</p>
              <p className="pt-1 text-xs text-foreground">38ms</p>
            </div>
            <div className="rounded-sm bg-muted/50 px-2.5 py-2 ring ring-border">
              <p className="text-2xs text-muted-foreground">Rooms</p>
              <p className="pt-1 text-xs text-foreground">edge/us-west</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mockupRegistry = {
  "trust-access": TrustAccess,
  onboarding: Onboarding,
  "ai-policy-editor": AiPolicyEditor,
  investigation: Investigation,
  monitoring: Monitoring,
  "flow-writing": FlowWriting,
  "cursor-browser": CursorBrowser,
  "open-paradigm": OpenParadigm,
  "openpoke-home": OpenpokeHome,
  "openpoke-chat": OpenpokeChat,
  "openpoke-connections": OpenpokeConnections,
  "partykit-demo": PartykitDemo,
} satisfies Record<MockupId, React.FC>;

export function getMockup(id: MockupId): React.ReactNode {
  const Comp = mockupRegistry[id];
  return Comp ? <Comp /> : null;
}
