# Usage on Icons

use `@central-icons-react/round-outlined-radius-2-stroke-1.5` for all icon usage, look into node_modules to fund the correct icons, or ask the user their preferences.

- This repo is a monorepo. Run tests, typecheck, lint, and format from the repository root.
- Do not run verification from app subdirectories.
- Prefer targeted root-level checks and avoid repeated full typecheck/lint/format runs unless the change is broad or the user asks.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
<!-- END:nextjs-agent-rules -->
