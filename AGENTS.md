# Debugging

NEVER try to restart the app, or the server process, EVER.

## Local Dev

DO NOT try to run pnpm dev, EVER.

## Style Guide

- use top level import
- Keep things in one function unless composable or reusable
- Avoid unnecessary destructuring. Instead of `const { a, b } = obj`, use `obj.a` and `obj.b` to preserve context
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Prefer single word variable names where possible
- Prefer small layout and typography components over exported Tailwind class strings; use `cn` to merge optional `className` props in wrapper components

## Imports

- Motion: `motion` not `framer-motion`
- Icons: `@central-icons-react/round-outlined-radius-2-stroke-1.5`

## Avoid let statements

We don't like `let` statements, especially combined with if/else statements.
Prefer `const`.

Good:

```ts
const foo = condition ? 1 : 2;
```

Bad:

```ts
let foo;

if (condition) foo = 1;
else foo = 2;
```

## Avoid else statements

Prefer early returns or using an `iife` to avoid else statements.

Good:

```ts
function foo() {
  if (condition) return 1;
  return 2;
}
```

Bad:

```ts
function foo() {
  if (condition) return 1;
  else return 2;
}
```

## Prefer single word naming

Try your best to find a single word name for your variables, functions, etc.
Only use multiple words if you cannot.

Good:

```ts
const foo = 1;
const bar = 2;
const baz = 3;
```

Bad:

```ts
const fooBar = 1;
const barBaz = 2;
const bazFoo = 3;
```

## Naming Conventions

kebab-case for files
camelCase for variables/functions
PascalCase for classes/namespaces/types
UPPER_SNAKE_CASE for constants

## Learned User Preferences

- Use inline classNames in JSX, not extracted constants outside component
- Avoid `@layer` for fundamental styles like `::selection`; use top-level rules
- Use Tailwind v4 gradient utilities (`bg-linear-*`) instead of inline style gradients
- No `uppercase` unless user specifically asks; use `whitespace-nowrap` for fixed labels
- Prefer grid and subgrid over flex for layout
- next-themes: use `attribute="class"` with `.dark` selector; adjust provider not CSS
- Motion children must be wrapped in an element (e.g. `<p>`), not a bare string
- Don't default to card layouts; only change what user explicitly asked
- Base UI Tooltip: use `asChild` when wrapping a button to avoid nested buttons
- Prefer minimalistic design; mostly background and text color, avoid extra decorative styling
- Keep related components in the same file; don't extract to separate files unless reusable
- No versioned naming (e.g. v2) for unreleased features; keep code canonical

## Learned Workspace Facts

- Page shell uses `--container-content` token (108rem = 1728px)
- Shared layout components: PageMain, PageFrame, PageGrid, Section with `grid-cols-subgrid`
- Tailwind rules in @rules/tailwind.md for gradients and dark mode
- WebGL, Three.js, and Rive are acceptable for 3D and interactive graphics
- Use `invalidateQueries` for TanStack Query cache updates, not `router.refresh`
- Don't add extra CSS custom properties to globals.css; use existing design tokens
- Support `prefers-reduced-motion` in animations and WebGL viewers
