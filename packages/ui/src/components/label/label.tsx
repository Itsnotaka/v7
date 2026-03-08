import type { ReactNode } from "react";

import { cn } from "../../utils/cn";
import { Tooltip } from "../tooltip";

export const NYTE_LABEL_VARIANTS = {} as const;
export const NYTE_LABEL_DEFAULT_VARIANTS = {} as const;

export interface NyteLabelVariantsProps {}

export function labelVariants(_props: NyteLabelVariantsProps = {}) {
  return cn("text-base font-medium text-foreground");
}

export function labelContentVariants() {
  return cn("inline-flex items-center gap-1");
}

export interface LabelProps extends NyteLabelVariantsProps {
  children: ReactNode;
  showOptional?: boolean;
  tooltip?: ReactNode;
  className?: string;
  htmlFor?: string;
  asContent?: boolean;
}

export function Label({
  children,
  showOptional = false,
  tooltip,
  className,
  htmlFor,
  asContent = false,
}: LabelProps) {
  const content = (
    <>
      {children}
      {showOptional ? <span className="font-normal text-muted-foreground">(optional)</span> : null}
      {tooltip ? (
        <Tooltip content={tooltip}>
          <span
            aria-label="More information"
            className="inline-flex size-4 cursor-help items-center justify-center rounded-full border border-border text-2xs text-muted-foreground"
          >
            i
          </span>
        </Tooltip>
      ) : null}
    </>
  );

  if (asContent) {
    return <span className={cn(labelContentVariants(), className)}>{content}</span>;
  }

  return (
    <label htmlFor={htmlFor} className={cn(labelVariants(), labelContentVariants(), className)}>
      {content}
    </label>
  );
}

Label.displayName = "Label";
