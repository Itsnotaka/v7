import type { ReactNode } from "react";

/**
 * Faithful recreations of Comp AI (trycomp.ai) screens, specced from the
 * open-source repo + @trycompai/design-system: Lausanne-style grotesk,
 * #004F3A forest green on near-monochrome neutrals, gray desktop frame
 * holding a floating white rounded-xl workspace card.
 */

const ink = "#0A0A0A";
const muted = "#555555";
const line = "#EBEBEB";
const green = "#004F3A";
const greenFg = "#ECFDF5";
const frame = "#F3F3F3";

const font = { fontFamily: "'TWK Lausanne', 'Inter', system-ui, sans-serif" };

function Badge({ children, tone }: { children: string; tone: "green" | "amber" | "red" | "gray" }) {
  const styles = {
    green: { backgroundColor: green, color: greenFg },
    amber: { backgroundColor: "#D9A5141A", color: "#A87F0B" },
    red: { backgroundColor: "#DF22251A", color: "#DF2225" },
    gray: { backgroundColor: frame, color: muted },
  }[tone];
  return (
    <span
      className="rounded-[3px] px-1.5 py-0.5 text-[8px] font-semibold tracking-wider uppercase"
      style={styles}
    >
      {children}
    </span>
  );
}

function Navbar() {
  return (
    <div
      className="relative flex h-9 items-center justify-between px-3"
      style={{ backgroundColor: "#FFFFFF80" }}
    >
      <div className="flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2 3 6.5v6c0 5 4 8.5 9 9.5 5-1 9-4.5 9-9.5v-6L12 2Z" fill="#16171B" />
          <path d="M12 6.5 7.5 8.75v3.5c0 2.6 2 4.6 4.5 5.25" fill="#fff" opacity="0.9" />
        </svg>
        <span className="text-[11px] font-bold" style={{ color: "#16171B" }}>
          Comp AI
        </span>
        <span className="text-[10px]" style={{ color: line }}>
          /
        </span>
        <span className="text-[10px]" style={{ color: ink }}>
          Acme Inc
        </span>
        <svg width="8" height="8" viewBox="0 0 16 16" aria-hidden>
          <path d="M4 6l4 4 4-4" stroke={muted} strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div
        className="absolute left-1/2 flex h-5.5 w-40 -translate-x-1/2 items-center gap-1.5 rounded-[5px] border bg-white px-2"
        style={{ borderColor: line }}
      >
        <svg width="9" height="9" viewBox="0 0 16 16" aria-hidden>
          <circle cx="7" cy="7" r="4.5" stroke={muted} strokeWidth="1.5" fill="none" />
          <path d="M10.5 10.5 14 14" stroke={muted} strokeWidth="1.5" />
        </svg>
        <span className="flex-1 text-[9px]" style={{ color: muted }}>
          Search...
        </span>
        <span
          className="rounded-[3px] border px-1 font-mono text-[8px]"
          style={{ borderColor: line, color: muted }}
        >
          ⌘K
        </span>
      </div>
      <div className="flex items-center gap-2">
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 3a6 6 0 0 0-6 6v3.5L4.5 15v1h15v-1L18 12.5V9a6 6 0 0 0-6-6Z"
            stroke={muted}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <span
          className="flex size-5 items-center justify-center rounded-full text-[8px] font-medium text-white"
          style={{ backgroundColor: green }}
        >
          D
        </span>
      </div>
    </div>
  );
}

function Rail({ active }: { active: number }) {
  const icons = [
    // Badge (Compliance)
    <path
      key="c"
      d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm-2 9 1.8 1.8L15.5 10"
      strokeWidth="1.5"
      fill="none"
    />,
    // Globe (Trust)
    <g key="t" strokeWidth="1.5" fill="none">
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.3 3.5 5 3.5 8S14.5 17.7 12 20c-2.5-2.3-3.5-5-3.5-8S9.5 6.3 12 4Z" />
    </g>,
    // ManageProtection (Security)
    <path
      key="s"
      d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm0 5v8"
      strokeWidth="1.5"
      fill="none"
    />,
    // Settings
    <g key="g" strokeWidth="1.5" fill="none">
      <circle cx="12" cy="12" r="2.8" />
      <path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20M6.3 6.3l1.7 1.7M16 16l1.7 1.7M17.7 6.3 16 8M8 16l-1.7 1.7" />
    </g>,
  ];
  return (
    <div className="relative flex w-9 flex-col items-center gap-1.5 py-2">
      {icons.map((icon, i) => (
        <span
          key={i}
          className="flex size-6.5 items-center justify-center rounded-[6px]"
          style={
            i === active
              ? { backgroundColor: green, color: greenFg, boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }
              : { color: muted }
          }
        >
          <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor">
            {icon}
          </svg>
        </span>
      ))}
      <span
        className="absolute right-0 w-[3px] rounded-full"
        style={{ backgroundColor: green, height: 16, top: 8 + active * 32 + 5 }}
      />
    </div>
  );
}

function Shell({
  active,
  module,
  items,
  activeItem,
  children,
}: {
  active: number;
  module: string;
  items: string[];
  activeItem: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full overflow-hidden rounded-sm" style={{ ...font, backgroundColor: frame }}>
      <Navbar />
      <div className="flex">
        <Rail active={active} />
        <div
          className="mr-1.5 mb-1.5 flex min-w-0 flex-1 overflow-hidden rounded-[9px] border bg-white"
          style={{ borderColor: line }}
        >
          <div className="w-[104px] shrink-0 p-1.5">
            <div
              className="border-b px-1.5 py-2 text-[10px] font-medium"
              style={{ borderColor: line, color: ink }}
            >
              {module}
            </div>
            <div className="mt-1 grid gap-0.5">
              {items.map((item) => (
                <span
                  key={item}
                  className="rounded-[6px] px-2 py-1 text-[9px]"
                  style={
                    item === activeItem
                      ? { backgroundColor: frame, color: ink, fontWeight: 500 }
                      : { color: muted }
                  }
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="min-w-0 flex-1 border-l p-3" style={{ borderColor: line }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustAccess() {
  const rows = [
    {
      name: "Alex Chen",
      email: "alex@acme.co",
      org: "Acme",
      purpose: "SOC 2 procurement review",
      dur: "30d",
      status: ["APPROVED", "green"],
      nda: ["SIGNED", "green"],
    },
    {
      name: "Sam Koh",
      email: "sam@globex.io",
      org: "Globex",
      purpose: "Vendor security assessment",
      dur: "7d",
      status: ["UNDER REVIEW", "gray"],
      nda: ["PENDING", "amber"],
    },
    {
      name: "Jay Liu",
      email: "jay@initech.co",
      org: "Initech",
      purpose: "Enterprise pilot review",
      dur: "90d",
      status: ["DENIED", "red"],
      nda: ["—", "gray"],
    },
  ] as const;

  return (
    <Shell
      active={1}
      module="Trust"
      items={["Overview", "Access Requests", "Settings"]}
      activeItem="Access Requests"
    >
      <p className="text-[13px] font-semibold tracking-tight" style={{ color: ink }}>
        Access Requests
      </p>
      <div
        className="mt-2 inline-flex h-6 items-center gap-0.5 rounded-[6px] p-0.5"
        style={{ backgroundColor: frame }}
      >
        <span
          className="rounded-[5px] bg-white px-2 py-0.5 text-[9px] font-medium shadow-sm"
          style={{ color: ink }}
        >
          Access Requests
        </span>
        <span className="px-2 py-0.5 text-[9px]" style={{ color: muted }}>
          Granted Access
        </span>
      </div>
      <div className="mt-2 flex gap-1.5">
        <div
          className="flex h-6 flex-1 items-center rounded-[5px] border bg-white px-2 text-[8.5px]"
          style={{ borderColor: "#E5E5E5", color: muted }}
        >
          Search by name, email, or company
        </div>
        <div
          className="flex h-6 w-20 items-center justify-between rounded-[5px] border bg-white px-2 text-[8.5px]"
          style={{ borderColor: "#E5E5E5", color: ink }}
        >
          All statuses
          <svg width="7" height="7" viewBox="0 0 16 16" aria-hidden>
            <path d="M4 6l4 4 4-4" stroke={muted} strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>
      <div className="mt-2 overflow-hidden rounded-[5px] border" style={{ borderColor: line }}>
        <div
          className="grid grid-cols-[1.5fr_1.4fr_0.5fr_0.9fr_0.8fr] items-center gap-1 px-2 py-1 text-[7.5px] font-medium tracking-wide uppercase"
          style={{ backgroundColor: frame, color: muted }}
        >
          <span>Identity</span>
          <span>Purpose</span>
          <span>Duration</span>
          <span>Status</span>
          <span>NDA Status</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.email}
            className="grid grid-cols-[1.5fr_1.4fr_0.5fr_0.9fr_0.8fr] items-center gap-1 border-t px-2 py-1.5"
            style={{ borderColor: line }}
          >
            <span className="grid">
              <span className="text-[9px] font-medium" style={{ color: ink }}>
                {row.name}
              </span>
              <span className="text-[8px]" style={{ color: muted }}>
                {row.email} · {row.org}
              </span>
            </span>
            <span className="text-[8.5px]" style={{ color: muted }}>
              {row.purpose}
            </span>
            <span className="text-[8.5px]" style={{ color: muted }}>
              {row.dur}
            </span>
            <span>
              <Badge tone={row.status[1]}>{row.status[0]}</Badge>
            </span>
            <span>
              <Badge tone={row.nda[1]}>{row.nda[0]}</Badge>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end gap-1.5">
        <span
          className="rounded-[5px] border bg-white px-2 py-1 text-[9px] font-medium"
          style={{ borderColor: line, color: ink }}
        >
          Deny
        </span>
        <span
          className="rounded-[5px] px-2 py-1 text-[9px] font-medium"
          style={{ backgroundColor: green, color: greenFg }}
        >
          Approve
        </span>
      </div>
    </Shell>
  );
}

export function Onboarding() {
  const chips = ["SOC 2", "ISO 27001", "GDPR", "HIPAA"];
  return (
    <div className="flex w-full overflow-hidden rounded-sm bg-white" style={font}>
      <div className="flex-1 p-5">
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2 3 6.5v6c0 5 4 8.5 9 9.5 5-1 9-4.5 9-9.5v-6L12 2Z" fill="#16171B" />
        </svg>
        <div className="mt-4 h-1 w-28 rounded-full" style={{ backgroundColor: frame }}>
          <div className="h-1 rounded-full" style={{ backgroundColor: green, width: "31%" }} />
        </div>
        <p className="mt-5 max-w-[24ch] text-[17px] leading-[1.2] font-bold" style={{ color: ink }}>
          Which compliance frameworks do you need?
        </p>
        <p className="mt-2 text-[10px]" style={{ color: muted }}>
          Our AI will personalize the platform based on your answers.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {chips.map((chip, i) => (
            <span
              key={chip}
              className="rounded-[5px] border px-2.5 py-1.5 text-[10px] font-medium"
              style={
                i < 2
                  ? { borderColor: green, color: green, backgroundColor: "#004F3A0D" }
                  : { borderColor: line, color: muted }
              }
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-1.5">
          <span
            className="rounded-[5px] border px-3 py-1.5 text-[10px] font-medium"
            style={{ borderColor: line, color: ink }}
          >
            Previous
          </span>
          <span
            className="rounded-[5px] px-3 py-1.5 text-[10px] font-medium"
            style={{ backgroundColor: green, color: greenFg }}
          >
            Continue
          </span>
        </div>
      </div>
      <div
        className="flex w-[38%] items-end justify-center px-4 pt-10 pb-6"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <svg width="120" height="130" viewBox="0 0 120 130" aria-hidden>
          <g stroke="#09090B" strokeOpacity="0.5" fill="#fff" strokeWidth="1">
            <path d="M35 70 60 56l25 14-25 14-25-14Z" />
            <path d="M35 70v22l25 14V84L35 70ZM85 70v22l-25 14V84l25-14Z" />
            <path d="M22 38l16-9 16 9-16 9-16-9Z" />
            <path d="M22 38v14l16 9V47l-16-9ZM54 38v14l-16 9V47l16-9Z" />
            <path d="M78 20 92 13l14 7v10c0 8-6 13-14 16-8-3-14-8-14-16V20Z" />
          </g>
          <g stroke="#068D49" strokeWidth="1.5" fill="none">
            <circle cx="92" cy="27" r="7" />
            <path d="M88.5 27l2.5 2.5 4.5-5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function AiPolicyEditor() {
  return (
    <Shell
      active={0}
      module="Compliance"
      items={["Overview", "Frameworks", "Policies", "Evidence", "People"]}
      activeItem="Policies"
    >
      <p className="text-[8px]" style={{ color: muted }}>
        Policies ›
      </p>
      <div className="mt-0.5 flex items-center gap-1.5">
        <p className="text-[12px] font-semibold tracking-tight" style={{ color: ink }}>
          Information Security Policy
        </p>
        <Badge tone="amber">Draft</Badge>
      </div>
      <div className="mt-1.5 flex gap-3 border-b text-[8.5px]" style={{ borderColor: line }}>
        {["Overview", "Content", "Mappings", "Versions"].map((tab) => (
          <span
            key={tab}
            className="relative pb-1"
            style={tab === "Content" ? { color: ink, fontWeight: 500 } : { color: muted }}
          >
            {tab}
            {tab === "Content" ? (
              <span
                className="absolute inset-x-0 bottom-0 h-[2px]"
                style={{ backgroundColor: green }}
              />
            ) : null}
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <div className="min-w-0 flex-[7]">
          <div className="relative rounded-[5px] border p-2" style={{ borderColor: line }}>
            <span
              className="absolute top-1.5 right-1.5 rounded-[3px] px-1 py-0.5 text-[7px]"
              style={{ backgroundColor: "#E8E8E899", color: muted }}
            >
              Saved
            </span>
            <p className="text-[9.5px] font-semibold" style={{ color: ink }}>
              Access Control
            </p>
            <p className="mt-1 text-[8.5px] leading-[1.5]" style={{ color: muted }}>
              Access to production systems is granted on the principle of least privilege.{" "}
              <span
                className="rounded-[2px] px-0.5 line-through"
                style={{
                  backgroundColor: "hsl(0 84% 60% / 0.15)",
                  color: "#BC1010",
                  textDecorationColor: "#EF4444B3",
                }}
              >
                Access reviews are conducted periodically.
              </span>{" "}
              <span
                className="rounded-[2px] px-0.5 underline"
                style={{
                  backgroundColor: "hsl(142 71% 45% / 0.2)",
                  color: "#126D4C",
                  textDecorationColor: "#22C55E80",
                }}
              >
                Access reviews are conducted quarterly for employees and before each engagement for
                contractors.
              </span>
            </p>
            <div
              className="mt-1.5 py-1 pl-2 text-[8.5px]"
              style={{
                borderLeft: "3px solid #22C55E99",
                backgroundColor: "#22C55E14",
                color: "#126D4C",
              }}
            >
              Contractor access must be time-bound, approved by a manager, and removed at the end of
              the engagement.
            </div>
          </div>
          <div
            className="mt-1.5 flex items-center justify-between rounded-[6px] border bg-white p-1.5"
            style={{ borderColor: line, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          >
            <span className="font-mono text-[8px]" style={{ color: muted }}>
              1/5
            </span>
            <span className="flex gap-1">
              <span
                className="rounded-[4px] px-1.5 py-0.5 text-[8px] font-medium"
                style={{ backgroundColor: green, color: greenFg }}
              >
                Accept all
              </span>
              <span
                className="rounded-[4px] border px-1.5 py-0.5 text-[8px] font-medium"
                style={{ borderColor: line, color: ink }}
              >
                Reject all
              </span>
            </span>
          </div>
        </div>
        <div
          className="flex w-[38%] shrink-0 flex-col overflow-hidden rounded-[6px] border"
          style={{ borderColor: line }}
        >
          <div
            className="flex items-center justify-between px-2 py-1"
            style={{ backgroundColor: green }}
          >
            <span className="text-[8.5px] font-semibold text-white">AI Assistant</span>
            <span className="text-[9px] text-white/70">✕</span>
          </div>
          <div className="grid flex-1 gap-1.5 p-2">
            <span
              className="justify-self-end rounded-xl rounded-br-[3px] px-2 py-1 text-[8px]"
              style={{ backgroundColor: green, color: greenFg }}
            >
              Add contractor access requirements and align this policy to SOC 2.
            </span>
            <span className="flex items-center gap-1 text-[7.5px]" style={{ color: muted }}>
              <svg width="7" height="7" viewBox="0 0 16 16" aria-hidden>
                <path d="M3 8.5l3 3 7-7" stroke="#068D49" strokeWidth="2" fill="none" />
              </svg>
              Policy updated
            </span>
            <span className="text-[8px] leading-[1.5]" style={{ color: ink }}>
              I added quarterly review cadence and time-bound contractor access. Review the proposed
              changes in the editor.
            </span>
          </div>
          <div className="border-t p-1.5" style={{ borderColor: line }}>
            <span className="text-[8px]" style={{ color: muted }}>
              Let me know what to edit...
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
}
