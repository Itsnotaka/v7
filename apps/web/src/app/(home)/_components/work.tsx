import Link from "next/link";

type Item = {
  company: string;
  feature: string;
  href: string;
  mockup: React.ReactNode;
};

function TrustAccess() {
  return (
    <>
      <div className="flex gap-1 mb-3">
        <span className="rounded-md bg-card px-2 py-1 text-2xs font-medium shadow-xs">
          Requests
        </span>
        <span className="rounded-md px-2 py-1 text-2xs text-muted-foreground">Grants</span>
      </div>
      <div className="rounded-md bg-card shadow-xs overflow-hidden text-2xs">
        <div className="flex px-3 py-1.5 border-b text-muted-foreground">
          <span className="flex-1">Identity</span>
          <span className="w-16 text-right">Status</span>
        </div>
        {[
          { name: "A. Chen", email: "alex@acme.co", badge: "Approved", color: "bg-green-50 text-green-700" },
          { name: "S. Koh", email: "sam@globex.io", badge: "Review", color: "bg-amber-50 text-amber-700" },
          { name: "J. Liu", email: "jay@initech.co", badge: "Denied", color: "bg-red-50 text-red-700" },
        ].map((row) => (
          <div key={row.name} className="flex items-center px-3 py-2 border-b last:border-0">
            <div className="flex-1">
              <p className="text-xs font-medium">{row.name}</p>
              <p className="text-muted-foreground">{row.email}</p>
            </div>
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${row.color}`}>
              {row.badge}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Onboarding() {
  return (
    <div className="rounded-md bg-card shadow-xs p-4">
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-4">
        <div className="h-full w-2/3 rounded-full bg-primary" />
      </div>
      <p className="text-xs font-medium mb-0.5">Company website</p>
      <p className="text-2xs text-muted-foreground mb-3">
        Our AI will personalize based on your answers.
      </p>
      <div className="h-8 rounded-md border bg-muted/30 mb-3" />
      <div className="flex justify-end gap-1.5">
        <span className="rounded-md border px-2.5 py-1 text-2xs text-muted-foreground">Back</span>
        <span className="rounded-md bg-primary text-primary-foreground px-2.5 py-1 text-2xs">
          Continue
        </span>
      </div>
    </div>
  );
}

function Investigation() {
  return (
    <div className="rounded-md bg-card shadow-xs p-3 flex flex-col gap-2">
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
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-card shadow-xs p-3">
          <p className="text-2xs text-muted-foreground mb-1">Availability</p>
          <p className="text-base font-mono font-medium">99.97%</p>
        </div>
        <div className="rounded-md bg-card shadow-xs p-3">
          <p className="text-2xs text-muted-foreground mb-1">Error Budget</p>
          <p className="text-base font-mono font-medium text-amber-600">12.3%</p>
        </div>
      </div>
      <div className="rounded-md bg-card shadow-xs p-3">
        <p className="text-2xs text-muted-foreground mb-2">Latency p99</p>
        <div className="flex items-end gap-0.5 h-10">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-primary/20" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="rounded-md bg-card shadow-xs p-3">
        <p className="text-2xs text-muted-foreground mb-1.5">Active Alerts</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            <p className="text-2xs">Auth latency above threshold</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <p className="text-2xs">Connection pool at 92%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const items: Item[] = [
  {
    company: "Comp AI",
    feature: "Trust Access",
    href: "https://github.com/trycompai/comp",
    mockup: <TrustAccess />,
  },
  {
    company: "Comp AI",
    feature: "Onboarding",
    href: "https://github.com/trycompai/comp",
    mockup: <Onboarding />,
  },
  {
    company: "Firetiger",
    feature: "Investigation UI",
    href: "https://firetiger.com",
    mockup: <Investigation />,
  },
  {
    company: "Firetiger",
    feature: "SLO Monitoring",
    href: "https://firetiger.com",
    mockup: <Monitoring />,
  },
];

export function Work() {
  return (
    <section id="work" className="min-h-svh w-full">
      <div className="mx-auto w-full max-w-[1440px] px-4.5 py-24">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">Work</p>
        <div className="columns-1 gap-1 tablet:columns-2">
          {items.map((item) => (
            <Link
              key={item.feature}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.feature} at ${item.company}`}
              className="mb-1 block break-inside-avoid"
            >
              <div className="rounded-xl bg-card shadow-sm border p-2.5 transition-shadow hover:shadow-md">
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="text-2xs uppercase tracking-[0.14em] text-muted-foreground">
                    {item.company}
                  </p>
                  <p className="font-serif text-base mt-0.5 mb-4">{item.feature}</p>
                  <div aria-hidden="true">{item.mockup}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
