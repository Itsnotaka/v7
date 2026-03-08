export type MockupId =
  | "trust-access"
  | "onboarding"
  | "ai-policy-editor"
  | "investigation"
  | "monitoring"
  | "flow-writing"
  | "cursor-browser"
  | "open-paradigm"
  | "openpoke"
  | "partykit-demo";

export type ExperienceKind = "Work" | "Internship" | "Design System" | "Side Project" | "Concept";

export interface ExperienceWork {
  title: string;
  mockup: MockupId;
  description: string;
  body: string;
  tags: string[];
}

export type ExperiencePreview =
  | {
      kind: "image";
      src: string;
      alt?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
    };

export interface ExperienceItem {
  slug: string;
  kind: ExperienceKind;
  owner: string;
  title: string;
  href: string;
  image: string;
  preview?: ExperiencePreview;
  order: number;
  description: string;
  works: ExperienceWork[];
}

const experienceItems: ExperienceItem[] = [
  {
    slug: "comp-ai",
    kind: "Work",
    owner: "Comp AI",
    title: "Comp AI",
    href: "https://github.com/trycompai/comp",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwRXkZR8KlN5dmtQeHvYup4acDA86UbCxMBXrk",
    order: 0,
    description:
      "Designing and building a compliance automation platform — from trust portals and onboarding flows to AI-powered policy editing.",
    works: [
      {
        title: "Trust Access",
        mockup: "trust-access",
        description:
          "Designing and building a compliance trust portal with role-based access controls and audit-ready security workflows.",
        body: "As a founding engineer at Comp AI, I designed and built the Trust Access portal — a public-facing compliance trust center that lets customers verify an organization's security posture. The system features role-based access controls, framework-specific evidence views, and audit-ready workflows that streamline SOC 2, ISO 27001, and GDPR compliance verification.",
        tags: ["Compliance", "Security", "RBAC"],
      },
      {
        title: "Onboarding",
        mockup: "onboarding",
        description:
          "End-to-end onboarding experience for compliance teams — from initial setup through framework selection and evidence collection.",
        body: "Designed and built the complete onboarding experience for Comp AI — guiding compliance teams from initial account setup through framework selection, team invitations, and evidence collection. The flow is powered by AI that personalizes recommendations based on company context, reducing time-to-first-audit from weeks to hours.",
        tags: ["Onboarding", "Design Systems", "UX"],
      },
      {
        title: "AI Policy Editor",
        mockup: "ai-policy-editor",
        description:
          "AI-assisted policy editing with compliance-aware suggestions, diff review, and a safe apply-or-dismiss workflow.",
        body: "Designed and built the AI Policy Editor at Comp AI — an assistant-driven editing workflow for organizational policies. The experience combines a rich policy editor, a side-panel AI assistant, and a visual diff review step so teams can safely draft, inspect, and apply compliance-aware policy changes aligned with frameworks like SOC 2, ISO 27001, and GDPR.",
        tags: ["AI", "Editor", "Compliance"],
      },
    ],
  },
  {
    slug: "firetiger",
    kind: "Work",
    owner: "Firetiger",
    title: "Firetiger",
    href: "https://firetiger.com",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwPqSK5HD5A7SIaJfyXjozVE1TUvLQrxMBe0gY",
    order: 1,
    description:
      "Designing investigation interfaces and monitoring dashboards for security analysts to trace, correlate, and resolve incidents.",
    works: [
      {
        title: "Investigation UI",
        mockup: "investigation",
        description:
          "Interactive investigation interface for security analysts to trace, correlate, and resolve incidents in real-time.",
        body: "Designed the agent-investigation UI and chat flow at Firetiger, defining information architecture, interaction patterns, and design system components. The interface enables security analysts to converse with AI agents that correlate production data, codebase understanding, and business context to trace and resolve incidents in real-time.",
        tags: ["Security", "Data Viz", "Real-time"],
      },
      {
        title: "SLO Monitoring",
        mockup: "monitoring",
        description:
          "SLO monitoring dashboard with burn-rate alerts, error budget tracking, and service dependency mapping.",
        body: "Built the SLO monitoring and observer dashboard views over Firetiger's data lake — spanning logs, traces, and metrics — to support agentic investigations. The dashboard features burn-rate alerts, error budget tracking, and service dependency mapping that gives engineering teams a comprehensive view of system health.",
        tags: ["Observability", "Monitoring", "SRE"],
      },
    ],
  },
  {
    slug: "partykit",
    kind: "Work",
    owner: "PartyKit (Acquired by Cloudflare)",
    title: "PartyKit",
    href: "https://blog.partykit.io/posts/flow-and-partykit-collaboration",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwZrff2Fhf6QMwxWIC2TO8ryuHY4DtoSPUj3El",
    order: 2,
    description:
      "Demo engineer and community advocate building real-time collaborative experiences on the edge.",
    works: [
      {
        title: "Flow Collaboration",
        mockup: "partykit-demo",
        description:
          "Real-time collaborative writing demo integrating PartyKit with Flow for live cursor presence and synchronized editing.",
        body: "Worked closely with Sunil Pai, creator of PartyKit, as a demo and community engineer. Built a real-time collaboration integration between Flow and PartyKit, showcasing live cursor presence, synchronized document editing, and edge-distributed state. The collaboration was featured on the PartyKit blog as a case study in building collaborative experiences on the edge.",
        tags: ["Real-time", "Edge Computing", "Collaboration"],
      },
    ],
  },
  {
    slug: "flow",
    kind: "Side Project",
    owner: "Personal",
    title: "Flow",
    href: "https://app.flowapp.so",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwFiVgavP4hHdNezftZq6ICgxiEAyS8Qor3J1D",
    order: 3,
    description:
      "AI-native writing application with instant prompts, copilot autocomplete, and contextual document chat—like Cursor for prose.",
    works: [
      {
        title: "AI Writing Studio",
        mockup: "flow-writing",
        description:
          "True WYSIWYG editor powered by Plate.js with AI copilot, document chat, and PDF-aware generation.",
        body: "Built Flow as a 'Cursor for writing' — an AI-native document editor featuring instant writing prompts, copilot-style autocomplete, and a contextual chat panel that can ingest PDFs and generate or insert text directly into documents. Partnered with Supermemory and Dhravya Shah to deliver personalized suggestions that improve the more you write. Built on Plate.js for uncompromising WYSIWYG editing.",
        tags: ["AI", "Editor", "WYSIWYG", "Plate.js"],
      },
    ],
  },
  {
    slug: "openpoke",
    kind: "Side Project",
    owner: "Personal",
    title: "OpenPoke",
    href: "https://github.com/Itsnotaka/interaction",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMweadwJRkD6W8J0wGYe9ovIcVXgZLs7djf4xpM",
    preview: {
      kind: "video",
      src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMweadwJRkD6W8J0wGYe9ovIcVXgZLs7djf4xpM",
    },
    order: 4,
    description:
      "Open-source recreation of Poke—agentic messaging, webhook loops, and multi-account email orchestration.",
    works: [
      {
        title: "Agentic Messaging",
        mockup: "openpoke",
        description:
          "Full-stack recreation of Poke's web UI, backend agent logic, and automatic feedback loops with multi-email support.",
        body: "Rebuilt Poke from the ground up as an open-source project, replicating the web interface, backend agentic messaging system, and automatic webhook feedback loops. The system supports connecting multiple email accounts, orchestrating AI-driven conversations, and managing stateful interaction flows—demonstrating deep understanding of conversational AI architecture.",
        tags: ["Open Source", "AI Agents", "Messaging", "Webhooks"],
      },
    ],
  },
  {
    slug: "open-paradigm",
    kind: "Side Project",
    owner: "Personal",
    title: "Open Paradigm",
    href: "https://github.com/Itsnotaka/open-paradigm",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwUXrES39zl04DOiSP5VAsKh8JNa6YIyXZbrF3",
    preview: {
      kind: "video",
      src: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwUXrES39zl04DOiSP5VAsKh8JNa6YIyXZbrF3",
    },
    order: 5,
    description:
      "Open-source recreation of Paradigm AI's spreadsheet interface with AI-powered grid generation using AG Grid.",
    works: [
      {
        title: "AI Grid Interface",
        mockup: "open-paradigm",
        description:
          "Faithful recreation of Paradigm's spreadsheet UI with AG Grid, exploring AI-assisted data generation and manipulation.",
        body: "A deep-dive recreation of paradigmai.com's interface, building a fully functional spreadsheet experience with AG Grid. Explored AI-powered grid generation, complex cell interactions, and programmatic data manipulation. The project served as a learning ground for advanced grid architectures and AI-assisted data workflows.",
        tags: ["Open Source", "AG Grid", "AI", "Data"],
      },
    ],
  },
  {
    slug: "cursor-browser",
    kind: "Side Project",
    owner: "Personal",
    title: "Cursor Browser",
    href: "#",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwnDqxhMr4J8bmsHBhyNfIVk6WMp1cEratO0ow",
    order: 6,
    description:
      "A faithful recreation of Cursor's element picker and style selection interface, reverse-engineered from bundled Chromium.",
    works: [
      {
        title: "Element Inspector",
        mockup: "cursor-browser",
        description:
          "Browser DevTools-style element picker with computed styles, cascade inspection, and seamless selection workflow.",
        body: "Replicated Cursor's browser and style selection interface by reverse-engineering their bundled Chromium binary. The tool provides a DevTools-grade element picker with computed style inspection, cascade analysis, and a fluid selection workflow—mirroring the UX that makes Cursor's browser integration feel native and immediate.",
        tags: ["Reverse Engineering", "DevTools", "Chromium"],
      },
    ],
  },
];

export function getExperienceItems(): ExperienceItem[] {
  return [...experienceItems].sort((a, b) => a.order - b.order);
}

export function getExperienceItem(slug: string): ExperienceItem | undefined {
  return experienceItems.find((item) => item.slug === slug);
}
