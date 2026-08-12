import type { ComponentPropsWithoutRef, JSX } from "react";

import { cn } from "../cn";

type ProseElementProps<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;
type ProseRootProps = ProseElementProps<"div">;
type ProseParagraphProps = ProseElementProps<"p">;
type ProseListItemProps = ProseElementProps<"li">;
type ProseLinkProps = ProseElementProps<"a">;
type ProseStrongProps = ProseElementProps<"strong">;
type ProseInlineCodeProps = ProseElementProps<"code">;
type ProseCodeBlockProps = ProseElementProps<"pre">;
type ProseBlockquoteProps = ProseElementProps<"blockquote">;
type ProseRuleProps = ProseElementProps<"hr">;
type ProseTableProps = ProseElementProps<"table">;
type ProseTableHeaderProps = ProseElementProps<"th">;
type ProseTableDataProps = ProseElementProps<"td">;
type ProseImageProps = ProseElementProps<"img">;
type ProseHeadingLevel = 1 | 2 | 3;

interface ProseHeadingProps extends ProseElementProps<"h2"> {
  level?: ProseHeadingLevel;
}

interface ProseListProps extends ProseElementProps<"ul"> {
  ordered?: boolean;
}

function ProseRoot({ className, ...props }: ProseRootProps) {
  return (
    <div
      data-slot="ui-prose"
      className={cn(
        "w-full min-w-0 font-ui-control text-ui-title/[1.6] text-ui-primary wrap-anywhere",
        className,
      )}
      {...props}
    />
  );
}

function Paragraph({ className, ...props }: ProseParagraphProps) {
  return (
    <p
      data-slot="ui-prose-paragraph"
      className={cn(
        "my-ui-gutter w-full max-w-[var(--v7-ui-prose-measure)] text-pretty first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  );
}

function Heading({ className, level = 2, ...props }: ProseHeadingProps) {
  const classes = cn(
    "mb-1 w-full max-w-[var(--v7-ui-prose-measure)] scroll-mt-4 font-semibold text-ui-primary text-balance first:mt-0 last:mb-0",
    level === 1 && "mt-5 text-[1.571em]/[1.42]",
    level === 2 && "mt-4 text-[1.428em]/[1.42]",
    level === 3 && "mt-4 text-[1.214em]/[1.42]",
    className,
  );

  if (level === 1) return <h1 data-slot="ui-prose-heading" className={classes} {...props} />;
  if (level === 3) return <h3 data-slot="ui-prose-heading" className={classes} {...props} />;
  return <h2 data-slot="ui-prose-heading" className={classes} {...props} />;
}

function List({ className, ordered = false, ...props }: ProseListProps) {
  const classes = cn(
    "my-ui-gutter flex w-full max-w-[var(--v7-ui-prose-measure)] flex-col gap-ui-gutter ps-[2em]",
    ordered ? "list-decimal" : "list-disc",
    className,
  );
  return ordered ? (
    <ol data-slot="ui-prose-list" className={classes} {...props} />
  ) : (
    <ul data-slot="ui-prose-list" className={classes} {...props} />
  );
}

function ListItem({ className, ...props }: ProseListItemProps) {
  return (
    <li
      data-slot="ui-prose-list-item"
      className={cn("break-words p-0 [&>p]:m-0", className)}
      {...props}
    />
  );
}

function Link({ className, ...props }: ProseLinkProps) {
  return (
    <a
      className={cn(
        "text-ui-accent underline decoration-1 underline-offset-2 hover:text-ui-primary",
        className,
      )}
      {...props}
    />
  );
}

function Strong({ className, ...props }: ProseStrongProps) {
  return <strong className={cn("font-semibold text-ui-primary", className)} {...props} />;
}

function InlineCode({ className, ...props }: ProseInlineCodeProps) {
  return (
    <code
      className={cn(
        "rounded-ui-control bg-ui-layer-01 px-0.5 py-0.5 font-ui-mono text-[0.9em] text-ui-primary",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlock({ className, ...props }: ProseCodeBlockProps) {
  return (
    <pre
      className={cn(
        "my-ui-gutter max-w-full overflow-x-auto overscroll-x-contain rounded-ui-field border border-ui-edge-muted bg-ui-layer-01 p-ui-panel font-ui-mono text-ui-detail text-ui-primary first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  );
}

function Blockquote({ className, ...props }: ProseBlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "my-ui-gutter w-full max-w-[var(--v7-ui-prose-measure)] border-s-3 border-ui-edge-strong py-ui-gutter ps-4 text-ui-muted first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  );
}

function Rule({ className, ...props }: ProseRuleProps) {
  return (
    <hr
      className={cn(
        "my-4 h-0 w-full max-w-[var(--v7-ui-prose-measure)] border-0 border-t border-ui-edge-muted bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

function Table({ className, ...props }: ProseTableProps) {
  return (
    <div className="my-[1em] w-full max-w-full overflow-x-auto overscroll-x-contain rounded-ui-control border border-ui-edge-muted">
      <table
        className={cn("w-max min-w-full border-collapse tabular-nums", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: ProseTableHeaderProps) {
  return (
    <th
      className={cn(
        "border-e border-b border-ui-edge-muted px-2.25 py-1.25 text-start align-top font-semibold text-ui-primary last:border-e-0",
        className,
      )}
      {...props}
    />
  );
}

function TableData({ className, ...props }: ProseTableDataProps) {
  return (
    <td
      className={cn(
        "border-e border-b border-ui-edge-muted px-2.25 py-1.25 text-start align-top last:border-e-0",
        className,
      )}
      {...props}
    />
  );
}

function Image({ className, alt, ...props }: ProseImageProps) {
  return (
    <img
      alt={alt}
      className={cn("my-2 block h-auto max-w-full rounded-ui-control", className)}
      {...props}
    />
  );
}

const Prose = Object.assign(ProseRoot, {
  Paragraph,
  Heading,
  List,
  ListItem,
  Link,
  Strong,
  InlineCode,
  CodeBlock,
  Blockquote,
  Rule,
  Table,
  TableHeader,
  TableData,
  Image,
});

export { Prose };
export type {
  ProseBlockquoteProps,
  ProseCodeBlockProps,
  ProseHeadingLevel,
  ProseHeadingProps,
  ProseImageProps,
  ProseInlineCodeProps,
  ProseLinkProps,
  ProseListItemProps,
  ProseListProps,
  ProseParagraphProps,
  ProseRootProps,
  ProseRuleProps,
  ProseStrongProps,
  ProseTableDataProps,
  ProseTableHeaderProps,
  ProseTableProps,
};
