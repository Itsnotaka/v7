export const NYTE_LOADER_VARIANTS = {
  size: {
    sm: {
      value: 16,
      description: "Small loader for inline use",
    },
    base: {
      value: 24,
      description: "Default loader size",
    },
    lg: {
      value: 32,
      description: "Large loader for prominent loading states",
    },
  },
} as const;

export const NYTE_LOADER_DEFAULT_VARIANTS = {
  size: "base",
} as const;

export type NyteLoaderSize = keyof typeof NYTE_LOADER_VARIANTS.size;

export interface NyteLoaderVariantsProps {
  size?: NyteLoaderSize | number;
}

export function loaderVariants({
  size = NYTE_LOADER_DEFAULT_VARIANTS.size,
}: NyteLoaderVariantsProps = {}): number {
  if (typeof size === "number") return size;
  return NYTE_LOADER_VARIANTS.size[size].value;
}

export interface LoaderProps {
  className?: string;
  size?: NyteLoaderSize | number;
}

export function Loader({ className, size = NYTE_LOADER_DEFAULT_VARIANTS.size }: LoaderProps) {
  const value = loaderVariants({ size });

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      className={className}
      style={{ width: value, height: value }}
    >
      <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="2" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dasharray"
          values="0 150;42 150;42 150"
          keyTimes="0;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="0;-16;-59"
          keyTimes="0;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        opacity={0.1}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
