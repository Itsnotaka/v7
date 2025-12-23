# AGENTS.md

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Production build (also runs type checking)
- `pnpm lint` - Run oxlint with type-aware checking
- `pnpm fmt` - Format code with oxfmt

## Architecture
- **Next.js 16** app with React 19 and App Router (RSC enabled)
- **Tailwind CSS 4** for styling, **shadcn/ui** components (base-mira style, @base-ui/react primitives)
- **Redis** (ioredis) for caching, **TanStack Query** for data fetching
- Path alias: `~/*` maps to project root

## Structure
- `app/` - Next.js routes and API handlers
- `components/ui/` - Reusable UI components (shadcn)
- `components/` - Feature components
- `lib/` - Utilities (`cn()` in utils.ts), Redis client, API integrations

## Code Style
- Use `cn()` from `~/lib/utils` for className merging (clsx + tailwind-merge)
- Icons: `@phosphor-icons/react`
- Component variants via `class-variance-authority` (cva)
- Strict TypeScript, no `any` - use proper types
- Prefer function declarations for components, named exports
