import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const targets = [resolve(root, "apps/web/src"), resolve(root, "packages/ui/src")];
const exts = new Set([".ts", ".tsx"]);

const rules = [
  {
    name: "raw-hex-color",
    pattern: /#[0-9A-Fa-f]{3,8}/g,
    message: "Use semantic tokens instead of raw hex colors.",
  },
  {
    name: "arbitrary-px-rem",
    pattern: /\[[0-9.]+(?:px|rem)\]/g,
    message: "Use tokens or scale utilities instead of arbitrary px/rem values.",
  },
  {
    name: "raw-z-index",
    pattern: /\bz-\d+\b|z-\[[^\]]+\]/g,
    message: "Use the shared z-index scale instead of raw z-index utilities.",
  },
  {
    name: "arbitrary-tracking",
    pattern: /tracking-\[[^\]]+\]/g,
    message: "Use the shared tracking scale instead of arbitrary tracking values.",
  },
];

function walk(dir) {
  const out = [];

  for (const entry of readdirSync(dir)) {
    const path = resolve(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      out.push(...walk(path));
      continue;
    }

    if (![...exts].some((ext) => path.endsWith(ext))) continue;
    out.push(path);
  }

  return out;
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function scan(file) {
  const text = readFileSync(file, "utf8");
  const issues = [];

  for (const rule of rules) {
    const matches = text.matchAll(rule.pattern);

    for (const match of matches) {
      const hit = match[0];
      const index = match.index ?? 0;

      issues.push({
        file: relative(root, file),
        line: lineOf(text, index),
        rule: rule.name,
        message: rule.message,
        match: hit,
      });
    }
  }

  return issues;
}

function main() {
  const files = targets.flatMap(walk).sort();
  const issues = files.flatMap(scan);

  if (issues.length === 0) {
    console.log(`token-check: ok (${files.length} files scanned)`);
    return;
  }

  for (const issue of issues) {
    console.error(
      `${issue.file}:${issue.line} [${issue.rule}] ${issue.message} Found: ${issue.match}`,
    );
  }

  console.error(`token-check: failed with ${issues.length} issue(s)`);
  process.exit(1);
}

main();
