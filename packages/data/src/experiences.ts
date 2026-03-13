export type MockupId =
  | "trust-access"
  | "onboarding"
  | "ai-policy-editor"
  | "investigation"
  | "monitoring"
  | "flow-writing"
  | "cursor-browser"
  | "open-paradigm"
  | "openpoke-home"
  | "openpoke-chat"
  | "openpoke-connections"
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
          "Agent session trace interface for following execution steps, inspecting tool uses, and reviewing investigation outcomes.",
        body: "Designed the agent session UI at Firetiger — the primary surface for viewing how autonomous agents investigate production incidents. Each session renders the trigger message followed by a step-by-step execution trace with research actions, queries, tool uses, and a final outcome status. The interface lets engineers follow the agent's reasoning, inspect individual actions, and understand how production data, codebase context, and business logic were correlated to reach a resolution.",
        tags: ["Agents", "Traces", "Real-time"],
      },
      {
        title: "SLO Monitoring",
        mockup: "monitoring",
        description:
          "Agent-powered monitoring dashboard with scheduled triggers, session outcomes, and SLO tracking.",
        body: "Built the monitoring and observer views at Firetiger — combining autonomous agent management with SLO dashboards over the data lake. Engineers configure monitoring agents with scheduled, webhook, or post-deploy triggers, then track session outcomes alongside key observability metrics like availability, error budget, and open issues across logs, traces, and metrics.",
        tags: ["Observability", "Agents", "SRE"],
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
    href: "https://nameisdaniel.com/experiences/flow",
    image: "https://om32oh4l85.ufs.sh/f/ZSTWlVhf6QMwFiVgavP4hHdNezftZq6ICgxiEAyS8Qor3J1D",
    order: 3,
    description:
      "AI-native writing application with instant prompts, sidebar agent, and contextual document chat—like Cursor for prose.",
    works: [
      {
        title: "AI Writing Studio",
        mockup: "flow-writing",
        description:
          "True WYSIWYG editor powered by Plate.js with AI sidebar agent, document chat, and PDF-aware generation.",
        body: "Built Flow as a 'Cursor for writing' — an AI-native document editor featuring instant writing prompts, a contextual sidebar agent for chat and assistance, and PDF-aware generation that can ingest documents and insert text directly. The demo highlights the sidebar agent with [auto complete] capabilities for seamless writing assistance. Partnered with Supermemory and Dhravya Shah to deliver personalized suggestions that improve the more you write. Built on Plate.js for uncompromising WYSIWYG editing.",
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
      "Multi-agent email assistant — orchestrating triage, reminders, and task delegation through a mobile-style AI shell with Gmail integration.",
    works: [
      {
        title: "Home Hub",
        mockup: "openpoke-home",
        description:
          "Personalized home screen with contextual greeting, weather, and a single 'Text Poke' CTA that anchors the assistant experience.",
        body: "Designed the home hub as the entry point to OpenPoke — a personalized screen showing the date, a context-aware greeting, current weather, and a prominent [Text Poke] button. The screen establishes the product's identity as a proactive assistant rather than a passive inbox, drawing users into conversation with a single clear action. Summary cards surface unread counts and upcoming reminders so users can triage at a glance.",
        tags: ["Home", "CTA", "Personalization"],
      },
      {
        title: "Agent Chat",
        mockup: "openpoke-chat",
        description:
          "Two-tier agent messaging with grouped bubbles, typing indicators, message reactions, and a full-featured composer.",
        body: "Built the core chat experience powered by a two-tier agent system — an InteractionAgent that understands intent and an ExecutionAgent that handles email, reminders, and tasks. The interface features grouped message bubbles, a typing indicator with staggered dot animation, message reactions, and a composer with attachment and voice controls. Messages animate in with a custom [bubble-in] transition that respects [prefers-reduced-motion].",
        tags: ["Chat", "AI Agents", "Messaging"],
      },
      {
        title: "Gmail Connections",
        mockup: "openpoke-connections",
        description:
          "Multi-account Gmail integration with OAuth, per-account permissions, and primary account designation.",
        body: "Designed the connections surface for managing Gmail accounts — the backbone of OpenPoke's email triage and orchestration. Users can link multiple Gmail accounts via Composio OAuth, designate a primary account, and control granular permissions for email, calendar, and contacts access. The interface uses a list-item pattern with avatars, status badges, and chevron navigation into per-account detail screens.",
        tags: ["Gmail", "OAuth", "Permissions"],
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
      "Open-source spreadsheet workspace recreating Paradigm AI — featuring an app shell with collapsible sidebar, AG Grid Enterprise, AI-driven cell enrichment, and real-time collaboration via Cloudflare Durable Objects.",
    works: [
      {
        title: "AI Grid Interface",
        mockup: "open-paradigm",
        description:
          "Full spreadsheet workspace with sidebar navigation, AG Grid v34 theming, column-level AI enrichment, and a Zustand + Jotai state architecture.",
        body: "Reverse-engineered paradigmai.com into a fully functional spreadsheet workspace. The interface features a collapsible sidebar for managing multiple sheets, a toolbar with an [Enrich] action that runs AI over selected cells, and an AG Grid Enterprise grid with custom theming, row selectors, column popovers, and drag-and-drop reordering. State flows through Zustand for sheet operations and Jotai for shell-level UI, with real-time sync powered by Cloudflare Workers and Durable Objects. Built on Next.js 16, React 19, tRPC, and Vercel AI SDK for streaming tool calls.",
        tags: ["AG Grid", "AI Enrichment", "Cloudflare", "tRPC"],
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
