export interface Education {
  institution: string;
  degree: string;
  time: string;
  /** Location for the institution – shown in CV center column */
  location?: string;
}

export interface Experience {
  organization: string;
  role: string;
  time: string;
  /** CV only – not shown on personal website */
  bullets?: string[];
  url?: string;
  /** Role context/subtitle for additional narrative (e.g. "first design-engineering hire") */
  context?: string;
  /** Location for the role – shown in CV center column */
  location?: string;
}

export interface Resume {
  name: string;
  preferredName?: string;
  title: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  x?: string;
  links: { name: string; url: string }[];
  cvUrl: string;
  education: Education[];
  experience: Experience[];
  /** Hobbies / interests – used on personal website */
  notes: { icon: string; text: string }[];
}

export const resume: Resume = {
  name: "Min Chun Fu",
  preferredName: "Daniel",
  title: "System Design Engineer",
  about:
    "Designs systems that help people complete complex, real-time work with less friction. Recent focus on AI agent user interfaces.",
  email: "daniel.fu@nyu.edu",
  phone: "+1 929 513 2767",
  location: "HK/SF",
  x: "@d2ac__",
  links: [
    { name: "GitHub", url: "https://github.com/itsnotaka" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/nameisdaniel/" },
  ],
  cvUrl: "https://cv.nameisdaniel.com",
  education: [
    {
      institution: "NYU",
      degree: "MS Computer Engineering (HCI)",
      time: "Jan 2026 – Present",
      location: "New York, NY",
    },
    {
      institution: "Chinese University of Hong Kong",
      degree: "Exchange Student",
      time: "Spring 2024",
      location: "Hong Kong",
    },
    {
      institution: "Penn State",
      degree: "B.S. Business Management",
      time: "2021 — 2025",
      location: "State College, PA",
    },
  ],
  experience: [
    {
      organization: "Comp AI",
      role: "Founding Engineer",
      time: "Nov 2025 – Jan 2026",
      url: "https://trycomp.ai/",
      location: "New York, NY",
      bullets: [
        "Built the AI Policy Editor interface — an AI-assisted workflow for drafting and reviewing compliance policies with side-panel agent chat.",
        "Shipped Trust Access system for managing NDA workflows and access requests with clean request/resend flows.",
        "Refined onboarding with agentic step-skipping and zero-friction setup patterns — all commits public at github.com/trycompai/comp.",
      ],
    },
    {
      organization: "Firetiger",
      role: "System Engineer",
      time: "May 2025 – Sep 2025",
      url: "https://firetiger.com/",
      location: "San Francisco, CA",
      bullets: [
        "Designed the agent-investigation UI and chat flow, defining information architecture, interaction patterns, and design system components.",
        "Built SLO monitoring and observer dashboard views over the data lake (logs, traces, metrics) to support investigations.",
        "Prototyped multiple user interface components and flows, provided visual examples to validate product decisions.",
      ],
    },
    {
      organization: "PartyKit (acquired by Cloudflare)",
      role: "Software Engineer",
      context: "Community",
      time: "Aug 2023 – Nov 2024",
      url: "https://www.partykit.io/",
      location: "Remote",
      bullets: [
        "Prototyped and built multiple multiplayer demos with different interaction patterns that community could adopt.",
        "Researched and wrote documentation for project fixtures that are now the de-facto standard for multiplayer usage.",
      ],
    },
    {
      organization: "Interface projects",
      role: "Side Project",
      time: "Jan 2019 – Jan 2026",
      url: "https://nameisdaniel.com/experiences/interface-projects",
      location: "Remote",
      bullets: [
        "[OpenPoke](https://nameisdaniel.com/experiences/openpoke) — open-source recreation of Poke's agentic messaging system with webhook loops and multi-account email orchestration.",
        "[Flow](https://nameisdaniel.com/experiences/interface-projects) — AI-native writing with instant prompts, copilot autocomplete, and contextual document chat—like Cursor for prose.",
        "[Open Paradigm](https://nameisdaniel.com/experiences/open-paradigm) — recreation of Paradigm AI's spreadsheet interface with AI-powered grid generation using AG Grid.",
      ],
    },
    {
      organization: "Aiplux",
      role: "Lead Frontend Engineer",
      time: "Jan 2024 – Dec 2024",
      url: "https://aiplux.com/",
      location: "Taiwan",
      bullets: [
        "Consolidated a legacy codebase into a monorepo, aligning teams and compressing the delivery timeline (from 12 months to 2 months).",
      ],
    },
  ],
  notes: [
    { icon: "chess", text: "Chess — currently 1200 rated on chess.com" },
    { icon: "cafe", text: "Cafe hopping — hunting for the perfect flat white" },
    { icon: "f1", text: "Formula 1 — team Ferrari since 2018" },
    { icon: "fashion", text: "Fashion — streetwear, sneakers, and vintage finds" },
  ],
};

/** Timeline row for website – title + time only (no bullets) */
export type TimelineRow = { title: string; time: string };

/** Group for website timeline */
export type TimelineGroup = { title: string; rows: TimelineRow[] };

/** Experience/education formatted for website timeline (no descriptions) */
export function getWebsiteTimeline(): TimelineGroup[] {
  const formatExperience = (e: Experience): TimelineRow => ({
    title: `${e.organization} / ${e.role}`,
    time: e.time.toUpperCase(),
  });
  const formatEducation = (e: Education): TimelineRow => ({
    title: `${e.institution} / ${e.degree}`,
    time: e.time,
  });

  return [
    {
      title: "Experience",
      rows: resume.experience.slice(0, 3).map(formatExperience),
    },
    {
      title: "Education",
      rows: resume.education.map(formatEducation),
    },
  ];
}
