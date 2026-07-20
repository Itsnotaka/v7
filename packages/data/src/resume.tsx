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
  title: "Product Designer",
  about:
    "Designs systems that help people complete complex, real-time work with less friction. Recent focus on AI agent user interfaces.",
  email: "daniel.fu@nyu.edu",
  phone: "+1 929 513 2767",
  location: "New York",
  x: "@d2ac__",
  links: [
    { name: "GitHub", url: "https://github.com/itsnotaka" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/nameisdaniel/" },
  ],
  cvUrl: "https://cv.nameisdaniel.com",
  education: [
    {
      institution: "New York University",
      degree: "M.S. Computer Engineering · Human-Computer Interaction",
      time: "Graduating 2027",
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
        "Designed and built AI-assisted compliance workflows across policy editing, trust access, and onboarding. Created a policy editor that pairs rich editing with side-panel agent chat and visual diff review, helping teams safely draft and apply framework-aware changes. Shaped permissions, access requests, and agent-guided setup across the wider platform.",
      ],
    },
    {
      organization: "Firetiger",
      role: "System Engineer",
      time: "May 2025 – Sep 2025",
      url: "https://firetiger.com/",
      location: "San Francisco, CA",
      bullets: [
        "Designed the primary interface for following autonomous agents as they investigated production incidents. Defined the information architecture and interaction patterns for step-by-step execution traces—including research actions, queries, tool use, and outcomes—so engineers could inspect how agents reached a resolution.",
      ],
    },
    {
      organization: "PartyKit",
      role: "Community Engineer",
      time: "Aug 2023 – Nov 2024",
      url: "https://www.partykit.io/",
      location: "Remote",
      bullets: [
        "Built real-time multiplayer demos and documented reusable interaction patterns for the developer community. Created Flow’s collaboration integration with live cursor presence and synchronized editing; the work became a PartyKit case study in edge-distributed collaborative experiences.",
      ],
    },
    {
      organization: "Interface projects",
      role: "Side Project",
      time: "Jan 2019 – Present",
      url: "https://nameisdaniel.com/experiences/interface-projects",
      location: "Remote",
      bullets: [
        "Independent practice exploring AI-native interfaces through [OpenPoke](https://github.com/Itsnotaka/interaction), [Honk](https://github.com/interfaces-lab/honk), [Open Paradigm](https://github.com/Itsnotaka/open-paradigm), and [Flow](https://nameisdaniel.com/experiences/interface-projects). Built working products across multi-agent email, coding-agent workspaces, AI spreadsheets, and collaborative writing to test new interaction models directly in code.",
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
