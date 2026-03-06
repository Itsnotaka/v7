export type WorkMockupId = "trust-access" | "onboarding" | "investigation" | "monitoring";

export interface WorkItem {
  slug: string;
  company: string;
  title: string;
  href: string;
  image: string;
  order: number;
  mockup: WorkMockupId;
  description: string;
  body: string;
  tags: string[];
}

export const workItems: WorkItem[] = [
  {
    slug: "trust-access",
    company: "Comp AI",
    title: "Trust Access",
    href: "https://github.com/trycompai/comp",
    image: "/images/work/compai.webp",
    order: 0,
    mockup: "trust-access",
    description:
      "Designing and building a compliance trust portal with role-based access controls and audit-ready security workflows.",
    body: "As a founding engineer at Comp AI, I designed and built the Trust Access portal — a public-facing compliance trust center that lets customers verify an organization's security posture. The system features role-based access controls, framework-specific evidence views, and audit-ready workflows that streamline SOC 2, ISO 27001, and GDPR compliance verification.",
    tags: ["COMPLIANCE", "SECURITY", "RBAC"],
  },
  {
    slug: "onboarding",
    company: "Comp AI",
    title: "Onboarding",
    href: "https://github.com/trycompai/comp",
    image: "/images/work/compai.webp",
    order: 1,
    mockup: "onboarding",
    description:
      "End-to-end onboarding experience for compliance teams — from initial setup through framework selection and evidence collection.",
    body: "Designed and built the complete onboarding experience for Comp AI — guiding compliance teams from initial account setup through framework selection, team invitations, and evidence collection. The flow is powered by AI that personalizes recommendations based on company context, reducing time-to-first-audit from weeks to hours.",
    tags: ["ONBOARDING", "DESIGN SYSTEMS", "UX"],
  },
  {
    slug: "investigation",
    company: "Firetiger",
    title: "Investigation UI",
    href: "https://firetiger.com",
    image: "/images/work/firetiger.jpg",
    order: 2,
    mockup: "investigation",
    description:
      "Interactive investigation interface for security analysts to trace, correlate, and resolve incidents in real-time.",
    body: "Designed the agent-investigation UI and chat flow at Firetiger, defining information architecture, interaction patterns, and design system components. The interface enables security analysts to converse with AI agents that correlate production data, codebase understanding, and business context to trace and resolve incidents in real-time.",
    tags: ["SECURITY", "DATA VIZ", "REAL-TIME"],
  },
  {
    slug: "slo-monitoring",
    company: "Firetiger",
    title: "SLO Monitoring",
    href: "https://firetiger.com",
    image: "/images/work/firetiger.jpg",
    order: 3,
    mockup: "monitoring",
    description:
      "SLO monitoring dashboard with burn-rate alerts, error budget tracking, and service dependency mapping.",
    body: "Built the SLO monitoring and observer dashboard views over Firetiger's data lake — spanning logs, traces, and metrics — to support agentic investigations. The dashboard features burn-rate alerts, error budget tracking, and service dependency mapping that gives engineering teams a comprehensive view of system health.",
    tags: ["OBSERVABILITY", "MONITORING", "SRE"],
  },
];

export function getWorkItems(): WorkItem[] {
  return [...workItems].sort((a, b) => a.order - b.order);
}

export function getWorkItem(slug: string): WorkItem | undefined {
  return workItems.find((item) => item.slug === slug);
}
