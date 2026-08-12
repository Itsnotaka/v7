/**
 * Per-project presentation treatment for grid tiles.
 * - plate: sampled at build time from the hero artwork's edge pixels
 *   where flat; otherwise matched to the project identity.
 * - accent/accentFg: remapped onto the mockup's own primary tokens so
 *   its buttons, badges, and tinted chips carry the project's color.
 * - dot: dotted-paper texture color tuned to the plate's luminance.
 */
export type PlateTreatment = {
  plate: string;
  accent: string;
  accentFg: string;
  dot: string;
};

export const plates: Record<string, PlateTreatment> = {
  "comp-ai": {
    plate: "#05503a",
    accent: "#05503a",
    accentFg: "#f2f7f4",
    dot: "rgba(255,255,255,0.08)",
  },
  firetiger: {
    plate: "#fd6824",
    accent: "#d84a08",
    accentFg: "#fff7f2",
    dot: "rgba(0,0,0,0.10)",
  },
  partykit: {
    plate: "#000000",
    accent: "#e11d48",
    accentFg: "#fff5f7",
    dot: "rgba(255,255,255,0.09)",
  },
  "interface-projects": {
    plate: "#201f1d",
    accent: "#1c1b1a",
    accentFg: "#f5f3f1",
    dot: "rgba(255,255,255,0.08)",
  },
  honk: {
    plate: "#2778c1",
    accent: "#1c5e9c",
    accentFg: "#fcfcfc",
    dot: "rgba(255,255,255,0.10)",
  },
  openpoke: {
    plate: "#45304c",
    accent: "#5b3f66",
    accentFg: "#f7f2fa",
    dot: "rgba(255,255,255,0.09)",
  },
  "open-paradigm": {
    plate: "#2b3245",
    accent: "#2b3245",
    accentFg: "#f0f2f7",
    dot: "rgba(255,255,255,0.08)",
  },
};

export function plateStyle(slug: string): React.CSSProperties {
  const treatment = plates[slug];
  if (!treatment) return {};
  return {
    backgroundColor: treatment.plate,
    backgroundImage: `radial-gradient(circle, ${treatment.dot} 1px, transparent 1px)`,
    backgroundSize: "14px 14px",
    "--primary": treatment.accent,
    "--primary-foreground": treatment.accentFg,
  } as React.CSSProperties;
}

/** Fixed layout width each mockup is designed at before uniform scaling. */
export const mockupDesignWidths: Record<string, number> = {
  "trust-access": 480,
  onboarding: 460,
  "ai-policy-editor": 520,
  investigation: 460,
  monitoring: 460,
  "flow-writing": 500,
  "open-paradigm": 520,
  "honk-session-workbench": 720,
  "honk-home-composer": 720,
  "openpoke-home": 393,
  "openpoke-chat": 393,
  "openpoke-connections": 393,
  "partykit-demo": 480,
};
