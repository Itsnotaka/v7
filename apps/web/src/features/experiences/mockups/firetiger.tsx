/**
 * Faithful recreations of Firetiger's console, specced from real console
 * screenshots (blog.firetiger.com) — a light GitHub-meets-Linear ops
 * console: white surfaces, gray-200 hairlines, Geist-style type, mono
 * identifiers, near-black actions, flame-orange for calibrating/AI.
 */

const ink = "#101828";
const sub = "#6a7282";
const micro = "#99a1af";
const line = "#e5e7eb";
const font = { fontFamily: "'Geist', 'Inter', system-ui, sans-serif" };
const mono = "'Geist Mono', ui-monospace, monospace";

function Flame() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="ft-flame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6900" />
          <stop offset="1" stopColor="#e7000b" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c1 3.5-1.5 5-1.5 8 0 1.7 1.2 3 3 3 2.5 0 3.5-2.2 3-4.5C19 10.5 20 13 20 15a8 8 0 1 1-16 0c0-5 5-7.5 8-13Z"
        fill="url(#ft-flame)"
      />
    </svg>
  );
}

function Sidebar({ active }: { active: string }) {
  const items = ["Home", "Change Monitor", "Agents", "Investigate", "Services", "Issues"];
  return (
    <div className="w-[88px] shrink-0 border-r bg-white p-1.5" style={{ borderColor: line }}>
      <div className="flex items-center gap-1 px-1 pb-1.5">
        <Flame />
        <span className="text-[9px] font-semibold" style={{ color: ink }}>
          Firetiger
        </span>
      </div>
      <div className="grid gap-px">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-[5px] px-1.5 py-1 text-[8px] font-medium"
            style={
              item === active ? { backgroundColor: "#f3f4f6", color: ink } : { color: "#364153" }
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CodeChip({ children }: { children: string }) {
  return (
    <span
      className="rounded-[3px] px-1 text-[7.5px]"
      style={{ backgroundColor: "#f5f5f5", fontFamily: mono, color: ink }}
    >
      {children}
    </span>
  );
}

export function Investigation() {
  return (
    <div
      className="flex w-full overflow-hidden rounded-md border bg-white"
      style={{ ...font, borderColor: line }}
    >
      <Sidebar active="Investigate" />
      <div className="min-w-0 flex-1 p-2.5">
        <p className="truncate text-[8px]" style={{ color: sub }}>
          Issues › <span style={{ color: ink, fontFamily: mono }}>FT-591</span>: getShellEnvironment
          SLO breach…
        </p>
        <div className="mt-1.5 rounded-[10px] border p-2.5" style={{ borderColor: line }}>
          <span
            className="float-right rounded-[5px] border px-1.5 py-0.5 text-[7.5px] font-semibold"
            style={{ borderColor: "#00a63e", color: "#00a63e", backgroundColor: "#f1fdf4" }}
          >
            ACTIONABLE
          </span>
          <p
            className="max-w-[36ch] text-[11px] leading-[1.25] font-extrabold tracking-tight"
            style={{ color: ink }}
          >
            getShellEnvironment SLO breach from 26 serial BatchCreate ops per call
          </p>
          <p className="mt-1.5 text-[8px] leading-[1.5]" style={{ color: "#364153" }}>
            Each <CodeChip>getShellEnvironment</CodeChip> call issues 26 serial{" "}
            <CodeChip>AllowedDomain.BatchCreate</CodeChip> operations during agent session polling —
            no pool saturation.
          </p>
          <div className="mt-2 grid gap-1">
            {[
              ["SOURCE", "API Server › API Request Latency (p99)"],
              ["SERVICE", "API Server"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="w-12 text-[6.5px] font-medium tracking-wider uppercase"
                  style={{ color: micro }}
                >
                  {label}
                </span>
                <span
                  className="rounded-[5px] border px-1.5 py-0.5 text-[7.5px] font-semibold"
                  style={{ borderColor: line, color: ink }}
                >
                  {value}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <span
                className="w-12 text-[6.5px] font-medium tracking-wider uppercase"
                style={{ color: micro }}
              >
                Tags
              </span>
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[7px] font-medium text-white"
                style={{ backgroundColor: "#4b5563" }}
              >
                backend
              </span>
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[7px] font-medium text-white"
                style={{ backgroundColor: "#7c3aed" }}
              >
                database
              </span>
            </div>
          </div>
          <div className="mt-2 flex gap-1.5">
            <span
              className="rounded-[5px] px-2 py-1 text-[8px] font-medium text-white"
              style={{ backgroundColor: "#171717" }}
            >
              Fix ⌄
            </span>
            <span
              className="rounded-[5px] border px-2 py-1 text-[8px] font-medium"
              style={{ borderColor: line, color: ink }}
            >
              Close ⌄
            </span>
          </div>
        </div>
      </div>
      <div className="w-[108px] shrink-0 border-l p-2" style={{ borderColor: line }}>
        <p className="text-[8px] font-semibold" style={{ color: ink }}>
          System Expert
        </p>
        <p className="mt-0.5 text-[7px]" style={{ color: sub }}>
          Current session
        </p>
        <div className="mt-1.5 grid gap-1 text-[7.5px] leading-[1.4]">
          <span style={{ color: sub }}>Executed 2 tools</span>
          <span style={{ color: "#364153" }}>
            Latency spike traces to serial domain writes in session polling.
          </span>
          <span style={{ color: sub }}>Executed getIssueContext</span>
          <span style={{ color: "#364153" }}>Recommending batched writes with a single flush.</span>
        </div>
        <div
          className="mt-2 flex items-center justify-between rounded-[8px] border px-1.5 py-1"
          style={{ borderColor: line }}
        >
          <span className="text-[7px]" style={{ color: micro }}>
            Ask anything…
          </span>
          <span
            className="flex size-3.5 items-center justify-center rounded-full text-[7px] text-white"
            style={{ backgroundColor: "#171717" }}
          >
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}

export function Monitoring() {
  const services = [
    { name: "Datafile Optimizer", slug: "services/datafile-optimizer", cal: "4 calibrating" },
    { name: "Superagent", slug: "services/superagent", cal: "2 calibrating" },
    { name: "API Server", slug: "services/api-server", bad: "2 of 13 unhealthy" },
  ];
  return (
    <div
      className="flex w-full overflow-hidden rounded-md border bg-white"
      style={{ ...font, borderColor: line }}
    >
      <Sidebar active="Services" />
      <div className="min-w-0 flex-1 p-2.5">
        <p className="text-[12px] font-bold tracking-tight" style={{ color: ink }}>
          Services
        </p>
        <p className="text-[8px]" style={{ color: sub }}>
          13 services in your catalog ·{" "}
          <span style={{ color: "#a15013" }}>43 objectives calibrating.</span>
        </p>
        <div
          className="mt-2 flex items-center gap-1.5 rounded-[8px] px-2 py-1.5"
          style={{ backgroundColor: "#fff3e5" }}
        >
          <span className="flex size-4 items-center justify-center rounded-[4px] bg-white text-[8px]">
            ✦
          </span>
          <span className="min-w-0 flex-1 truncate text-[8px]" style={{ color: ink }}>
            <span className="font-bold">31 Recommended Services</span>{" "}
            <span style={{ color: sub }}>Iceberg Gateway +30 more · click to review</span>
          </span>
          <span style={{ color: sub }}>›</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[9px] font-semibold" style={{ color: ink }}>
            Your services
          </p>
          <span
            className="rounded-[5px] border px-1.5 py-0.5 text-[7px]"
            style={{ borderColor: line, color: micro }}
          >
            Search by name, id, or description…
          </span>
        </div>
        <div className="mt-1 overflow-hidden rounded-[6px] border" style={{ borderColor: line }}>
          <div
            className="grid grid-cols-[1.3fr_1fr] px-2 py-1 text-[6.5px] font-medium tracking-wider uppercase"
            style={{ backgroundColor: "#fbfbfb", color: micro }}
          >
            <span>Service</span>
            <span>Objectives</span>
          </div>
          {services.map((service) => (
            <div
              key={service.slug}
              className="grid grid-cols-[1.3fr_1fr] items-center border-t px-2 py-1.5"
              style={{ borderColor: line }}
            >
              <span className="grid">
                <span className="text-[8.5px] font-bold" style={{ color: ink }}>
                  {service.name}
                </span>
                <span className="text-[7px]" style={{ fontFamily: mono, color: sub }}>
                  {service.slug}
                </span>
              </span>
              <span className="flex items-center justify-between">
                {"cal" in service && service.cal ? (
                  <span
                    className="flex items-center gap-1 text-[7.5px]"
                    style={{ color: "#9c4804" }}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: "#ea7f00" }}
                    />
                    {service.cal}
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 text-[7.5px]"
                    style={{ color: "#a80000" }}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: "#e7000b" }}
                    />
                    {"bad" in service ? service.bad : ""}
                  </span>
                )}
                <span style={{ color: micro }}>›</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          {[
            ["Unhealthy", "2"],
            ["Healthy", "11"],
          ].map(([label, n]) => (
            <div
              key={label}
              className="flex-1 rounded-[6px] border px-2 py-1"
              style={{ borderColor: line }}
            >
              <p className="text-[6.5px]" style={{ color: sub }}>
                {label}
              </p>
              <p className="text-[11px] font-semibold" style={{ fontFamily: mono, color: ink }}>
                {n}
              </p>
            </div>
          ))}
          <div className="flex-[2] rounded-[6px] border px-2 py-1" style={{ borderColor: line }}>
            <p className="text-[6.5px]" style={{ color: sub }}>
              API Request Latency (p99) <span style={{ fontFamily: mono }}>≤ 1,000 ms</span>
            </p>
            <svg viewBox="0 0 120 22" className="mt-0.5 h-4 w-full" aria-hidden>
              <line
                x1="0"
                y1="6"
                x2="120"
                y2="6"
                stroke="#ff8904"
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <polyline
                points="0,16 15,14 30,15 45,12 60,14 75,10 90,13 105,11 120,12"
                fill="none"
                stroke="#00a6f4"
                strokeWidth="1.2"
                strokeDasharray="1.5 2"
              />
              {[0, 30, 60, 90, 120].map((x, i) => (
                <circle key={x} cx={x} cy={[16, 15, 14, 13, 12][i]} r="1.4" fill="#00a6f4" />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
