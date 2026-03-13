---
estimated_steps: 5
estimated_files: 7
---

# T01: Scaffold Next.js 16 project with Tailwind v4 and retro design tokens

**Slice:** S01 — Server-side portfolio gate on Next.js
**Milestone:** M005

## Description

Establishes the buildable Next.js 16 foundation. Replaces the Astro `package.json` with Next.js 16 + React 19 + Tailwind v4 + shadcn/ui + Playwright dependencies. Creates `next.config.ts`, Tailwind PostCSS config, root `app/layout.tsx`, and `app/globals.css` with the full retro design token set in a Tailwind v4 `@theme` block. The slice cannot proceed until `next build` exits 0.

The existing Astro source files (`src/pages/`, `src/components/*.astro`, `src/styles/global.css`) remain on disk — they are removed in S04. The new Next.js `app/` directory coexists. This is intentional.

## Steps

1. **Replace `package.json`**: Remove all Astro deps. Add: `next@^16`, `react@^19`, `react-dom@^19`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss@^4`, `@tailwindcss/postcss`, `@playwright/test`, `shadcn/ui` (as needed). Add scripts: `dev: next dev`, `build: next build`, `start: next start`.

2. **Create Next.js config and TypeScript config**: Create `next.config.ts` exporting `{ trailingSlash: true }`. Create `tsconfig.json` with App Router defaults: `"target": "ES2017"`, `"lib": ["dom", "dom.iterable", "esnext"]`, `"paths": { "@/*": ["./src/*"] }`, `"moduleResolution": "bundler"`, Next.js plugin. Delete `astro.config.mjs` (or rename to `.bak`).

3. **Create PostCSS config**: Create `postcss.config.mjs` exporting `{ plugins: { '@tailwindcss/postcss': {} } }`.

4. **Create `app/globals.css`**: Import Tailwind with `@import "tailwindcss"`. Declare `@theme` block with all retro design tokens ported from `src/styles/global.css`: `--color-bg: #0a0a0a`, `--color-accent: #5a9e6f`, `--color-accent-strong: #7bc47f`, `--color-text-muted: #5c6b5e`, `--color-bg-elevated: #111411`, `--font-mono: 'Space Mono', 'Courier New', monospace`. Also include bracket-link styles as utility classes and the site-shell structural CSS.

5. **Create `app/layout.tsx` and `app/page.tsx`**: `layout.tsx` is the root RSC layout — imports `globals.css`, sets `<html lang="en">`, `<body className="site-shell">`. `page.tsx` is a minimal placeholder returning `<main><p>website</p></main>`. Run `npm install` then `next build`.

## Must-Haves

- [ ] `package.json` has `next`, `react`, `react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `@playwright/test`; no Astro deps remain
- [ ] `next.config.ts` exports `trailingSlash: true`
- [ ] `tsconfig.json` has `@/*` path alias pointing to `./src/*`
- [ ] `postcss.config.mjs` uses `@tailwindcss/postcss` plugin
- [ ] `app/globals.css` has `@import "tailwindcss"` and `@theme` block with `--color-bg`, `--color-accent`, `--color-accent-strong`, `--color-text-muted`, `--color-bg-elevated`, `--font-mono`
- [ ] `app/layout.tsx` imports `globals.css`, sets `lang="en"`, wraps body with `site-shell` class
- [ ] `next build` exits 0 with no errors

## Verification

- `npm run build` (i.e. `next build`) exits 0
- `grep "@theme" app/globals.css` returns at least one match
- `grep "trailingSlash" next.config.ts` returns `true`
- `grep "Space Mono" app/globals.css` confirms font token is set

## Observability Impact

- Signals added/changed: None at runtime — this is build infrastructure
- How a future agent inspects this: `next build` output; `grep "@theme" app/globals.css`; `cat next.config.ts`
- Failure state exposed: `next build` stderr shows specific module/config error

## Inputs

- `src/styles/global.css` — source of truth for all retro design tokens to port into `@theme`
- `package.json` (current) — Astro deps to remove; scripts to replace
- `src/data/domains/types.ts`, `src/data/domains/index.ts` — must be importable after tsconfig path alias is set

## Expected Output

- `package.json` — Next.js 16 + Tailwind v4 + Playwright deps; no Astro
- `next.config.ts` — `trailingSlash: true`
- `tsconfig.json` — App Router defaults with `@/*` alias
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin
- `app/globals.css` — `@import "tailwindcss"` + full `@theme` retro design token block
- `app/layout.tsx` — root RSC layout with `globals.css` import
- `app/page.tsx` — minimal placeholder; `next build` succeeds
