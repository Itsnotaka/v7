import type { ReactNode } from "react";

export interface Education {
  institution: string;
  degree: string;
  time: string;
}

export interface Experience {
  organization: string;
  role: string;
  time: string;
  /** CV only – not shown on personal website */
  bullets?: string[];
  url?: string;
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
  notes: ReactNode;
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
    { institution: "NYU", degree: "MS Computer Engineering (HCI)", time: "2024 — 2026" },
    {
      institution: "Chinese University of Hong Kong",
      degree: "Exchange Student",
      time: "Spring 2024",
    },
    {
      institution: "Penn State",
      degree: "MS Business Management",
      time: "2021 — 2025",
    },
  ],
  experience: [
    {
      organization: "Comp AI",
      role: "Founding Engineer",
      time: "2025",
    },
    {
      organization: "Firetiger",
      role: "Design Engineer",
      time: "2025",
      url: "https://firetiger.com/",
      bullets: [
        "Designed the agent-investigation UI and chat flow, defining information architecture, interaction patterns, and design system components.",
        "Built SLO monitoring and observer dashboard views over the data lake (logs, traces, metrics) to support investigations.",
        "Prototyped multiple user interface components and flows, provided visual examples to validate product decisions.",
      ],
    },
    {
      organization: "PartyKit (acquired by Cloudflare)",
      role: "Community Engineer",
      time: "2023 — 2024",
      url: "https://www.partykit.io/",
      bullets: [
        "Prototyped and built multiple multiplayer demos with different interaction patterns that community could adopt.",
        "Researched and wrote documentation for project fixtures that are now the de-facto standard for multiplayer usage.",
      ],
    },
    {
      organization: "Flowapp",
      role: "Founder & Software Engineer",
      time: "2021 — 2025",
      url: "https://www.flowapp.so/",
      bullets: [
        "Created an AI writing assistant from beta to production with ownership across product, engineering, and support.",
        "Led user interviews and feedback synthesis to prioritize workflows and ship focused iterations.",
      ],
    },
    {
      organization: "Aiplux",
      role: "Lead Frontend Engineer",
      time: "2024",
      url: "https://aiplux.com/",
      bullets: [
        "Consolidated a legacy codebase into a monorepo, aligning teams and compressing the delivery timeline (from 12 months to 2 months).",
      ],
    },
  ],
  notes: (
    <>
      <li key="chess" className="flex items-start gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 mt-0.5"
        >
          <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
          <path d="M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456" />
          <path d="m15 5 1.425-1.425" />
          <path d="m17 8 1.53-1.53" />
          <path d="M9.713 12.185 7 18" />
        </svg>
        <span>Chess — currently 1200 rated on chess.com</span>
      </li>
      <li key="cafe" className="flex items-start gap-2">
        <span className="tablet:hidden">•</span>
        <span>Cafe hopping — hunting for the perfect flat white</span>
      </li>
      <li key="f1" className="flex items-start gap-2">
        <span className="tablet:hidden">•</span>
        <span>Formula 1 — team Ferrari since 2018</span>
      </li>
      <li key="fashion" className="flex items-start gap-2">
        <span className="tablet:hidden">•</span>
        <span>Fashion — streetwear, sneakers, and vintage finds</span>
      </li>
    </>
  ),
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
