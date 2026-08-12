import { createFileTreeIconResolver, getBuiltInSpriteSheet } from "@pierre/trees";

import type { IconSize, IconTone } from "./icon";

import { cn } from "../cn";

const resolver = createFileTreeIconResolver("complete");
const sprite = { __html: getBuiltInSpriteSheet("complete") };

function tokenClass(token: string | undefined) {
  if (["babel", "browserslist", "javascript"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-yellow)]";
  if (["bash", "markdown", "svgo", "vue"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-green)]";
  if (["bootstrap", "css", "eslint", "terraform", "wasm"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-indigo)]";
  if (["bun", "database"].includes(token ?? "")) return "text-[var(--v7-ui-color-file-icon-mauve)]";
  if (["claude", "html", "json", "rust", "svg", "swift", "zip"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-orange)]";
  if (["astro", "vite"].includes(token ?? "")) return "text-[var(--v7-ui-color-file-icon-purple)]";
  if (
    ["biome", "c", "cpp", "docker", "python", "typescript", "vscode", "webpack"].includes(
      token ?? "",
    )
  )
    return "text-[var(--v7-ui-color-file-icon-blue)]";
  if (["go", "oxc", "react", "tailwind"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-cyan)]";
  if (["graphql", "image", "sass"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-pink)]";
  if (["mcp", "prettier", "table"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-teal)]";
  if (["npm", "postcss", "ruby", "svelte", "yml"].includes(token ?? ""))
    return "text-[var(--v7-ui-color-file-icon-red)]";
  if (token === "git") return "text-[var(--v7-ui-color-file-icon-vermilion)]";
  return "text-[var(--v7-ui-color-file-icon-gray)]";
}

interface FileTypeIconProps {
  path: string;
  size?: IconSize;
  tone?: IconTone;
  className?: string;
}

function FileTypeIcon({ className, path, size = "md", tone }: FileTypeIconProps) {
  const icon = resolver.resolveIcon("file-tree-icon-file", path.replaceAll("\\", "/"));
  const width = icon.width ?? 16;
  const height = icon.height ?? 16;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center leading-none",
        size === "xs" && "text-[length:var(--v7-ui-icon-size-xs)]",
        size === "sm" && "text-[length:var(--v7-ui-icon-size-sm)]",
        size === "md" && "text-[length:var(--v7-ui-icon-size-md)]",
        size === "lg" && "text-[length:var(--v7-ui-icon-size-lg)]",
        size === "xl" && "text-[length:var(--v7-ui-icon-size-xl)]",
        tone === undefined && tokenClass(icon.token),
        tone === "muted" && "text-ui-muted",
        tone === "faint" && "text-ui-faint",
        tone === "accent" && "text-ui-accent",
        tone === "ok" && "text-ui-ok",
        tone === "warn" && "text-ui-warn",
        tone === "err" && "text-ui-err",
        tone === "info" && "text-ui-info",
        className,
      )}
    >
      <svg
        data-icon-name={icon.name}
        data-icon-token={icon.token}
        focusable="false"
        height="1em"
        viewBox={icon.viewBox ?? `0 0 ${width} ${height}`}
        width="1em"
      >
        <use href={`#${icon.name}`} />
      </svg>
    </span>
  );
}

function FileTypeIconSprite() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute size-0 overflow-hidden"
      dangerouslySetInnerHTML={sprite}
    />
  );
}

export { FileTypeIcon, FileTypeIconSprite };
export type { FileTypeIconProps };
