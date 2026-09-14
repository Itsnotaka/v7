# Tailwind rules

This repo uses Tailwind CSS v4. Merge classes with `cn`. After you change classes, run `pnpm lint` from the repo root and fix the findings.

## Merge classes

Import `{ cn } from "cn"`. Do not add `clsx` or `tailwind-merge`.

```tsx
className={cn("px-4 py-2", active && "bg-primary", className)}
```

Pass complete class names. Do not concatenate `"p-" + size`.

## Tokens

Use colors from `apps/web/src/styles/theme.css` and `packages/ui/src/styles/tokens.css`.

```tsx
<div className="bg-background text-foreground" />
<Button className="mt-4 w-full" />
```

Kit components under `@v7/ui/components` own padding, type, and shape. Pass layout classes such as `mt-4` and `w-full`. Add a variant in the component file when the appearance is new.

Do not use palette classes such as `bg-red-500` or `text-blue-600`. Experience mockups under `apps/web/src/features/experiences/mockups/` and the CV app are exempt.

## Dark mode

Use the `.dark` class. Put the light class first.

```tsx
<div className="bg-background text-foreground dark:bg-muted" />
```

## Gradients

Use `bg-linear-*`, `bg-radial-*`, and `bg-conic-*`. Do not use `bg-gradient-*`.

## Layout

Use `gap-*` in flex and grid. Do not use `space-x-*` or `space-y-*` there.

Use `min-h-dvh`, not `min-h-screen`.

Use `size-*` when width and height are equal.

Prefer the spacing scale over arbitrary values such as `p-[13px]`.

## Type

Set line height on the text size, such as `text-sm/6`. Do not add a separate `leading-*` class.

This theme defines `text-2xs`.

## CSS

Do not use `@apply`. Use a component or a theme token.

When you need a custom property from the theme, use the CSS variable, such as `var(--color-background)`, or `--spacing(4)` for spacing math.
