/**
 * Index of everything — featured work references an experience slug so its
 * row and sheet derive from `@workspace/data/experiences`; everything else
 * carries its own copy. Ordered newest first.
 */
export interface IndexEntry {
  /** Lowercase index tag, category_domain (wrk / int / lab / web / oss). */
  tag: string;
  year: string;
  /** Slug into experiences — title, kind, and sheet come from the item. */
  experience?: string;
  title?: string;
  /** Sheet header line, e.g. "experiment — shader". */
  kind?: string;
  href?: string;
  description?: string;
  stack?: string[];
}

export const indexEntries: IndexEntry[] = [
  { tag: "int_ai", year: "2026", experience: "honk" },
  {
    tag: "int_mac",
    year: "2026",
    title: "Clicky",
    kind: "side project — macos",
    href: "https://github.com/Itsnotaka/clicky",
    description:
      "A macOS menu bar app that lives next to your cursor — push-to-talk voice through Codex realtime, fresh screen captures, and an orange pointer overlay for pointing at UI.",
    stack: ["Swift", "AppKit", "Codex"],
  },
  {
    tag: "lab_hci",
    year: "2026",
    title: "UnGesture",
    kind: "experiment — interaction",
    href: "https://un-gestures.vercel.app",
    description:
      "Interface research lab — exploring how software can participate in human interaction rather than merely facilitate it.",
    stack: ["Next.js", "React", "Tailwind"],
  },
  {
    tag: "lab_shdr",
    year: "2026",
    title: "Light studies",
    kind: "experiment — shader",
    href: "/archive",
    description: "Twenty-two night-mist light studies from one fragment shader, revealed by touch.",
    stack: ["WebGL", "GLSL"],
  },
  {
    tag: "int_app",
    year: "2026",
    title: "iMessage Stats",
    kind: "side project — desktop",
    href: "https://github.com/Itsnotaka/imessage-stats",
    description:
      "A Tauri desktop app that reads your local iMessage database and turns years of conversations into stats.",
    stack: ["Tauri", "React", "Rust"],
  },
  {
    tag: "web_pf",
    year: "2026",
    title: "nameisdaniel.com",
    kind: "website — personal",
    href: "https://github.com/Itsnotaka/v7",
    description:
      "This website — the seventh iteration. A modular-grid index of work with per-project color plates and case-study sheets.",
    stack: ["Next.js", "React", "Tailwind"],
  },
  { tag: "wrk_ai", year: "2025", experience: "comp-ai" },
  { tag: "wrk_obs", year: "2025", experience: "firetiger" },
  { tag: "int_ai", year: "2025", experience: "openpoke" },
  { tag: "int_ai", year: "2025", experience: "open-paradigm" },
  { tag: "int_ai", year: "2025", experience: "interface-projects" },
  {
    tag: "lab_rt",
    year: "2025",
    title: "Contrast",
    kind: "experiment — real-time",
    href: "https://contrast-chat-nextjs.vercel.app",
    description:
      "Git for chat — a proof of concept where conversations branch like commits, packaged as a one-hook useChat SDK with real-time sync.",
    stack: ["Next.js", "Durable Objects"],
  },
  {
    tag: "wrk_fe",
    year: "2024",
    title: "Aiplux",
    kind: "work — lead frontend engineer",
    href: "https://aiplux.com",
    description:
      "Consolidated a legacy codebase into a monorepo, aligning teams and compressing the delivery timeline from twelve months to two.",
  },
  {
    tag: "web_cv",
    year: "2024",
    title: "CV",
    kind: "website — print",
    href: "https://cv.nameisdaniel.com",
    description:
      "A print-faithful CV rendered from the same data files as this site — one source of truth for both surfaces.",
    stack: ["Next.js", "React"],
  },
  { tag: "wrk_rt", year: "2023", experience: "partykit" },
  {
    tag: "web_pf",
    year: "2022",
    title: "nameisdaniel.com v2",
    kind: "website — personal",
    href: "https://github.com/Itsnotaka/v2",
    description: "Second iteration of the personal site.",
    stack: ["Next.js"],
  },
  {
    tag: "oss_tpl",
    year: "2022",
    title: "isnt",
    kind: "open source — template",
    href: "https://github.com/Itsnotaka/isnt",
    description: "A minimal Iron-Session + Next.js + Tailwind boilerplate for local cookie auth.",
  },
  {
    tag: "oss_tpl",
    year: "2022",
    title: "revt",
    kind: "open source — template",
    href: "https://github.com/Itsnotaka/revt",
    description: "Everything you need to start a React + Electron + Vite + TypeScript project.",
  },
  {
    tag: "oss_cli",
    year: "2022",
    title: "create-tsconfig-app",
    kind: "open source — cli",
    href: "https://github.com/Itsnotaka/create-tsconfig-app",
    description: "One command to scaffold a complete TypeScript project.",
  },
  {
    tag: "web_pf",
    year: "2021",
    title: "nameisdaniel.com v1",
    kind: "website — personal",
    href: "https://github.com/Itsnotaka/v1",
    description: "First personal website.",
  },
  {
    tag: "oss_bot",
    year: "2021",
    title: "ts-discord-bot-template",
    kind: "open source — template",
    href: "https://github.com/Itsnotaka/ts-discord-bot-template",
    description: "A TypeScript Discord bot template.",
  },
  {
    tag: "oss_api",
    year: "2021",
    title: "capmonster-api",
    kind: "open source — client",
    href: "https://github.com/Itsnotaka/capmonster-api",
    description: "A Node.js client for the CapMonster captcha-solving API. Now deprecated.",
  },
  {
    tag: "oss_bot",
    year: "2021",
    title: "ACO Companion",
    kind: "open source — bot",
    href: "https://github.com/Itsnotaka/aco-companion",
    description:
      "A Discord bot for ACO runners — collect entries without spinning up a Google Form.",
  },
];
