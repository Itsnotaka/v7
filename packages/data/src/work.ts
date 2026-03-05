export type WorkMockupId = "trust-access" | "onboarding" | "investigation" | "monitoring";

export interface WorkItem {
  slug: string;
  company: string;
  title: string;
  href: string;
  featured: boolean;
  order: number;
  mockup: WorkMockupId;
  description: string;
  tags: string[];
}

export const workItems: WorkItem[] = [
  {
    slug: "trust-access",
    company: "Comp AI",
    title: "Trust Access",
    href: "https://github.com/trycompai/comp",
    featured: true,
    order: 0,
    mockup: "trust-access",
    description: "Designing and building a compliance trust portal with role-based access controls and audit-ready security workflows.",
    tags: ["COMPLIANCE", "SECURITY", "RBAC"],
  },
  {
    slug: "onboarding",
    company: "Comp AI",
    title: "Onboarding",
    href: "https://github.com/trycompai/comp",
    featured: true,
    order: 1,
    mockup: "onboarding",
    description: "End-to-end onboarding experience for compliance teams — from initial setup through framework selection and evidence collection.",
    tags: ["ONBOARDING", "DESIGN SYSTEMS", "UX"],
  },
  {
    slug: "investigation",
    company: "Firetiger",
    title: "Investigation UI",
    href: "https://firetiger.com",
    featured: true,
    order: 2,
    mockup: "investigation",
    description: "Interactive investigation interface for security analysts to trace, correlate, and resolve incidents in real-time.",
    tags: ["SECURITY", "DATA VIZ", "REAL-TIME"],
  },
  {
    slug: "slo-monitoring",
    company: "Firetiger",
    title: "SLO Monitoring",
    href: "https://firetiger.com",
    featured: false,
    order: 3,
    mockup: "monitoring",
    description: "SLO monitoring dashboard with burn-rate alerts, error budget tracking, and service dependency mapping.",
    tags: ["OBSERVABILITY", "MONITORING", "SRE"],
  },
];

export function getWorkItems(): WorkItem[] {
  return [...workItems].sort((a, b) => a.order - b.order);
}

export function getFeaturedWorkItems(): WorkItem[] {
  return getWorkItems().filter((item) => item.featured);
}
