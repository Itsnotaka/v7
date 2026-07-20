/**
 * Interaction and chrome class tokens. Compose these instead of retyping
 * focus/border/link classes so a change here restyles every surface at once.
 * Color and spacing primitives live in CSS (`theme.css` --spacing-bar,
 * --spacing-dot, --border, --ring); these tokens are the class-level pairing.
 */
export const theme = {
  /** Focus ring for standalone links, buttons, and controls. */
  ring: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  /** Focus ring drawn inward — for full-bleed rows where an offset ring would clip. */
  ringInset: "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
  /** The one border color. Pair with border-t/b/l/r; never use another border-* color. */
  hairline: "border-border",
  /** Inline text link affordance. */
  link: "underline-offset-4 hover:underline",
} as const;

export type ThemeToken = keyof typeof theme;
