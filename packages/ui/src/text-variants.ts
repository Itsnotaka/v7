export const textVariants = {
  display:
    "max-w-[24ch] text-[clamp(1.75rem,1.3rem+2.25vw,3.5rem)]/[1.04] font-medium tracking-[-0.04em] text-balance",
  heading:
    "max-w-[40ch] text-[clamp(1.25rem,1.1rem+0.75vw,1.75rem)]/[1.2] font-medium tracking-[-0.025em] text-balance",
  brand: "text-[clamp(1rem,0.91rem+0.45vw,1.25rem)]/[1.25] font-medium tracking-[-0.02em]",
  nav: "text-[clamp(1rem,0.88rem+0.6vw,1.375rem)]/[1.2] font-medium tracking-[-0.025em]",
  lead: "max-w-[48ch] text-[clamp(1.0625rem,0.98rem+0.4vw,1.25rem)]/[1.5] tracking-[-0.012em] text-pretty",
  body: "max-w-[56ch] text-[clamp(1rem,0.96rem+0.2vw,1.125rem)]/[1.55] tracking-[-0.008em] text-pretty",
  label:
    "text-[clamp(0.8125rem,0.78rem+0.16vw,0.875rem)]/[1.35] tracking-[0.08em] uppercase",
  meta: "text-[clamp(0.8125rem,0.78rem+0.16vw,0.875rem)]/[1.45] tracking-[0.005em]",
  control: "text-[1rem]/5 tracking-[0.01em] sm:text-[0.875rem]/5",
} as const;

export type TextVariant = keyof typeof textVariants;
