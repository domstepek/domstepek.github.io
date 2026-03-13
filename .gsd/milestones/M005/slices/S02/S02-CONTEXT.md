---
id: S02
milestone: M005
status: ready
---

# S02: Public pages and notes pipeline — Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

## Goal

Port `/`, `/about`, `/resume`, `/notes`, and `/notes/[slug]` as React Server Components using existing data modules, with a custom 404 page and Playwright tests for public route access and notes rendering — all with faithful retro terminal styling and no gate.

## Why this Slice

S01 proved the gate and established the scaffold. S02 completes the public-facing surface so every non-protected route renders correctly on Next.js. S03 (shader + client components) is independent and can run in parallel with S02. Both must finish before S04 can do full integration and deployment.

## Scope

### In Scope

- `/` (homepage) as RSC using `src/data/home.ts`
- `/about` as RSC using `src/data/personal.ts`
- `/resume` as RSC using `src/data/resume.ts`
- `/notes` index page — list of notes sorted by published date, each showing title, summary, and published date
- `/notes/[slug]` detail page — title, published date, and rendered markdown body
- Notes pipeline: `gray-matter` + `remark` + `remark-html` reading `src/content/notes/*.md`; `generateStaticParams` for static slug pre-rendering
- Custom `not-found.tsx` — minimal: heading ("Page not found") and a link back to home; same feel as current Astro 404
- Playwright tests: public route access (200 for `/`, `/about`, `/resume`, `/notes`), notes rendering (title visible on index and detail), and gate isolation guard (notes routes must NOT be gated)
- Styling: write Tailwind utility classes per component, referencing the existing `src/styles/global.css` for visual guidance; extend `src/app/globals.css` `@theme` block if new tokens are needed. Faithful port — same retro terminal feel, minor spacing differences acceptable. The old `src/styles/global.css` stays on disk until S04 cleanup.
- DOM markers: `data-home-page`, `data-personal-page`, `data-resume-page` on the respective pages (from existing test contract)

### Out of Scope

- Shader background — deferred to S03
- Screenshot galleries and Mermaid diagrams — deferred to S03
- Full 1664-line CSS migration — `src/styles/global.css` is NOT imported or fully ported in S02; use Tailwind utility classes for new components only
- Adding new notes or changing note content
- Protecting notes behind the gate (notes are and must remain public)
- Pixel-perfect visual matching — faithful port, not exact replica

## Constraints

- **All app paths under `src/app/`** — S01 established `src/app/` (not `app/`). New routes go under `src/app/about/page.tsx`, `src/app/resume/page.tsx`, `src/app/notes/page.tsx`, `src/app/notes/[slug]/page.tsx`.
- **Tailwind v4 `@theme` block in `src/app/globals.css`** — extend this file for any new tokens; do not create a separate `tailwind.config.js`.
- **DOM marker contract** — `data-home-page`, `data-personal-page`, `data-resume-page` attributes must be present on their respective pages; Playwright tests depend on them.
- **Notes must not be gated** — `proxy.ts` only matches `/domains/*`; notes are naturally outside its scope, but the gate isolation guard Playwright test must explicitly verify this.
- **`typescript.ignoreBuildErrors: true` still active** — type errors in new code will be silently skipped during `next build`. Run `tsc --noEmit` manually during S02. Reverted in S04.
- **Faithful port, not redesign** — content, structure, and retro aesthetic must match the existing Astro site. No new features, no copy changes, no design changes.
- **`remark-html` for notes body rendering** — produces HTML string from markdown; inject with `dangerouslySetInnerHTML` in the note detail RSC (safe: content is local static files, not user input).

## Integration Points

### Consumes

- `src/app/layout.tsx` — root layout from S01; public pages render inside it
- `src/app/globals.css` — Tailwind v4 tokens and base styles from S01; extend `@theme` if needed
- `src/data/home.ts` — homepage data (avatar, eyebrow, title, domains list, contact links, personal teaser)
- `src/data/personal.ts` — about/personal page data
- `src/data/resume.ts` — resume page data (experience, skills, etc.)
- `src/lib/paths.ts` — simplified path helpers from S01 (`basePrefix = ""`)
- `src/content/notes/*.md` — 2 markdown files with `title`, `summary`, `published` frontmatter

### Produces

- `src/app/page.tsx` — homepage RSC (replaces S01 placeholder)
- `src/app/about/page.tsx` — about/personal RSC
- `src/app/resume/page.tsx` — resume RSC
- `src/app/notes/page.tsx` — notes index RSC (sorted by published date)
- `src/app/notes/[slug]/page.tsx` — note detail RSC with `generateStaticParams`
- `src/app/not-found.tsx` — custom 404 page (minimal: heading + home link)
- `tests/e2e/public.spec.ts` — Playwright tests: route access (200s), DOM markers, notes rendering, gate isolation guard

## Open Questions

- None — all behavioral decisions confirmed during discuss phase.
