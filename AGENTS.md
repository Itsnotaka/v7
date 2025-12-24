# AGENTS.md

## Commands

- `pnpm dev` - Start development server
- `pnpm build` - Production build (also runs type checking)
- `pnpm lint` - Run oxlint with type-aware checking
- `pnpm fmt` - Format code with oxfmt

## Architecture

- **Next.js 16** app with React 19 and App Router (RSC enabled)
- **Tailwind CSS 4** for styling, **shadcn/ui** components (base-mira style, @base-ui/react primitives)
- **Redis** (upstash/redis) for caching, **TanStack Query** for data fetching
- Path alias: `~/*` maps to project root

## Structure

- `app/` - Next.js routes and API handlers
- `components/ui/` - Reusable UI components (shadcn)
- `components/` - Feature components
- `lib/` - Utilities (`cn()` in utils.ts), Redis client, API integrations

## Code Style

### General

- `const` by default, arrow functions for callbacks
- `for...of` over `.forEach()`
- Explicit types for params/returns; prefer `unknown` over `any`
- No `console.log`/`debugger` in production
- Throw `Error` objects, not strings
- No code comments unless complex logic requires context

### TypeScript

- Use `type` not `interface` (enforced by oxlint)
- Don't cast to `any`
- Don't add unnecessary `try/catch`

### React

- Function components only
- Hooks at top level
- Proper `key` props
- Semantic HTML
- Compose smaller components, avoid massive JSX blocks
- Avoid `useEffect` unless absolutely needed

### Tailwind v4

- Use `bg-linear-*` not `bg-gradient-*`
- Use `gap-*` not `space-*`
- Theme tokens defined in `tooling/tailwind/theme.css`
- Must refer to /rules/tailwind.md

### Naming Conventions

- Files: `kebab-case`
- Components: `PascalCase`
- Functions/Variables: `camelCase`
- Constants/Enums: `UPPER_SNAKE_CASE`

### Imports

- Motion: import from `motion` not `framer-motion`
- Icons: `@central-icons-react/round-filled-radius-2-stroke-1.5` (e.g., `import { IconsCircle } from ...`)
- Use `@ruri/ui/components/*` for shared UI components
- Use `@ruri/*` for api/auth/db package imports

### Additional rules

- Check `/rules` folder for tailwind/motion docs

## Git Commit Messages

Follow the conventional commits format:
Prefer no description when the change does not require more explanation.

```
<type>(<scope>): <short description>
```

**Examples:**

```
fix: resolve vite type conflicts with isolated node-linker
feat(auth): add OAuth2 login flow
chore: update dependencies
docs: add IPC pattern examples
refactor(ui): extract button variants to separate file
```
