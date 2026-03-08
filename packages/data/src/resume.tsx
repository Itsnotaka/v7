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
  /** Role context/subtitle for additional narrative (e.g. "first design-engineering hire") */
  context?: string;
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
  email: "daniel.fu90@gmail.com",
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
      degree: "B.S. Business Management",
      time: "2021 — 2025",
    },
  ],
  experience: [
    {
      organization: "Comp AI",
      role: "Founding Engineer",
      time: "2025 — Present",
    },
    {
      organization: "Firetiger",
      role: "System Design Engineer",
      context: "first design-engineering hire",
      time: "May 2025 – Present",
      url: "https://firetiger.com/",
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
      bullets: [
        "Prototyped and built multiple multiplayer demos with different interaction patterns that community could adopt.",
        "Researched and wrote documentation for project fixtures that are now the de-facto standard for multiplayer usage.",
      ],
    },
    {
      organization: "Flowapp",
      role: "Founder & Software Engineer",
      time: "Jan 2021 – Mar 2025",
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
