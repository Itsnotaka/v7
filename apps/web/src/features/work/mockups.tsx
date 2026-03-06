import type { WorkMockupId } from "@workspace/data/work";

function TrustAccess() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex gap-1 mb-3">
        <span className="rounded-md bg-card px-2 py-1 text-2xs font-medium">Requests</span>
        <span className="rounded-md px-2 py-1 text-2xs text-muted-foreground">Grants</span>
      </div>
      <div className="rounded-md bg-card overflow-hidden text-2xs">
        <div className="flex px-3 py-1.5 border-b border-border/50 text-muted-foreground">
          <span className="flex-1">Identity</span>
          <span className="w-16 text-right">Status</span>
        </div>
        {[
          {
            name: "A. Chen",
            email: "alex@acme.co",
            badge: "Approved",
            color: "bg-success/10 text-success",
          },
          {
            name: "S. Koh",
            email: "sam@globex.io",
            badge: "Review",
            color: "bg-warning/10 text-warning",
          },
          {
            name: "J. Liu",
            email: "jay@initech.co",
            badge: "Denied",
            color: "bg-destructive/10 text-destructive",
          },
        ].map((row) => (
          <div
            key={row.name}
            className="flex items-center px-3 py-2 border-b border-border/50 last:border-0"
          >
            <div className="flex-1">
              <p className="text-xs font-medium">{row.name}</p>
              <p className="text-muted-foreground">{row.email}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-2xs font-medium ${row.color}`}
            >
              {row.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Onboarding() {
  return (
    <div className="w-full max-w-sm rounded-md bg-card p-4">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-4">
        <div className="h-full w-2/3 rounded-full bg-primary" />
      </div>
      <p className="text-xs font-medium mb-0.5">Company website</p>
      <p className="text-2xs text-muted-foreground mb-3">
        Our AI will personalize based on your answers.
      </p>
      <div className="h-8 rounded-md bg-muted/50 mb-3" />
      <div className="flex justify-end gap-1.5">
        <span className="rounded-md bg-muted/50 px-2.5 py-1 text-2xs text-muted-foreground">
          Back
        </span>
        <span className="rounded-md bg-primary text-primary-foreground px-2.5 py-1 text-2xs">
          Continue
        </span>
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
