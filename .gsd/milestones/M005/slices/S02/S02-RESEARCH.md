# S02: Public pages and notes pipeline — Research

**Date:** 2026-03-13

## Summary

S02 ports the five public page routes (`/`, `/about`, `/resume`, `/notes`, `/notes/[slug]`) and adds a custom 404 page — all as React Server Components on the Next.js scaffold from S01. The work is straightforward because every page is a thin wrapper around pure TypeScript data modules (`src/data/home.ts`, `src/data/personal.ts`, `src/data/resume.ts`) or markdown files (`src/content/notes/*.md`), and the CSS already exists in `src/styles/global.css`. No new runtime behavior is introduced.

The main work is: (1) upgrade the root layout (`src/app/layout.tsx`) from a minimal stub to the full site shell (header, main, footer, skip-link, CRT overlay) matching `BaseLayout.astro`, (2) create a shared `TerminalPanel` React component replacing the Astro version, (3) port each page component from `.astro` to `.tsx` as server components, (4) build a notes pipeline replacing Astro content collections with `gray-matter` + `unified`/`remark`/`rehype`, and (5) migrate the relevant CSS classes from `src/styles/global.css` into `src/app/globals.css`. The resume page's clipboard buttons are the only client-side JS in S02 — a small `'use client'` wrapper.

**Primary recommendation:** Port the layout and TerminalPanel first, then the three data-driven pages (home, about, resume), then the notes pipeline, then 404 and tests. Each page can be visually verified against `next dev` after creation since all data modules and CSS exist.

## Recommendation

1. **Upgrade root layout** — Expand `src/app/layout.tsx` to match `BaseLayout.astro`: add `<head>` metadata via Next.js `generateMetadata`, site header, `<main>` with `site-main shell` classes, site footer, skip-link, and CRT overlay div. Use Next.js `metadata` export for SEO (title template, description, canonical URL, OG tags, favicon). The shader mount point is left as a placeholder for S03.
2. **Create TerminalPanel** — Simple server component: a `<div className="terminal-panel">` with the three traffic-light dots and a body slot. Used on every page.
3. **Port home, about, resume** — Each is a pure server component wrapping data imports in JSX. The only Astro-specific syntax is `{items.map((item) => <li>{item}</li>)}` → identical in JSX. Resume clipboard buttons need a `'use client'` component for the `navigator.clipboard` calls.
4. **Notes pipeline** — `gray-matter` parses frontmatter, `unified` + `remark-parse` + `remark-rehype` + `rehype-stringify` converts markdown body to HTML. Create a `src/lib/notes.ts` utility with `getAllNotes()` and `getNoteBySlug()` using `fs.readFileSync` + `path.join`. Notes index page sorts by published date. Note detail page uses `generateStaticParams` for static generation and renders HTML via `dangerouslySetInnerHTML`.
5. **Custom 404** — `src/app/not-found.tsx` renders a simple "Page not found" message inside the layout (not a global not-found — the root layout already provides the HTML shell).
6. **CSS migration** — Copy the component-specific CSS classes from `src/styles/global.css` into `src/app/globals.css` for the components being ported: `.home-page*`, `.personal-page*`, `.resume-page*`, `.notes-index*`, `.note-page*`, `.terminal-panel*`, `.crt-overlay`, `.home-avatar*`, print styles. The structural/reset/theme styles are already in `globals.css` from S01.
7. **Playwright tests** — `tests/e2e/public.spec.ts` covering: public routes render correct `data-*` markers, no gate markers on public pages, notes index lists notes, note detail renders content, 404 page renders for unknown routes.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Markdown frontmatter parsing | `gray-matter` | Standard YAML frontmatter parser; replaces Astro content collections |
| Markdown → HTML conversion | `unified` + `remark-parse` + `remark-rehype` + `rehype-stringify` | The canonical remark/rehype pipeline; `remark-html` is deprecated in favor of the `remark-rehype` + `rehype-stringify` combo |
| SEO metadata | Next.js `generateMetadata` / `metadata` export | Built into App Router; replaces manual `<head>` tags from `BaseLayout.astro` |
| Static route generation for notes | Next.js `generateStaticParams` | Built into App Router; replaces Astro's `getStaticPaths` |
| Page not found | Next.js `not-found.tsx` convention | Built into App Router; renders 404 with layout intact |

## Existing Code and Patterns

### Data modules — port directly, zero changes
- `src/data/home.ts` — `homePage` export; pure TypeScript, no framework coupling. Types and data are co-located.
- `src/data/personal.ts` — `personalPage` export; same pattern.
- `src/data/resume.ts` — `resumePage` export; same pattern, includes `ResumeRole[]`, `ResumeSkillCategory[]` etc.
- `src/data/domains/index.ts` — `domains` array, `getDomainBySlug()`. Already used in S01's domain route.
- `src/lib/paths.ts` — All route helpers (`homePath`, `aboutPath`, `routePath()`, etc.) already ported in S01. Use directly.

### Astro components — direct mapping to React server components
- `src/components/home/HomePage.astro` → `src/components/home/HomePage.tsx` — Structure is `<div data-home-page data-route-visibility="public" data-gate-state="open">` wrapping sections. JSX is nearly identical to Astro template syntax.
- `src/components/personal/PersonalPage.astro` → `src/components/personal/PersonalPage.tsx` — Same pattern. Uses destructured `personalPage.howIWork.principles`.
- `src/components/resume/ResumePage.astro` → `src/components/resume/ResumePage.tsx` — Includes inline `<script>` for clipboard chip buttons; this becomes a `'use client'` child component.
- `src/components/notes/NotesIndexPage.astro` → `src/components/notes/NotesIndexPage.tsx` — Receives notes array as prop. `formatDate` helper is local.
- `src/components/notes/NotePage.astro` → `src/components/notes/NotePage.tsx` — Receives note + rendered HTML content. Uses `<slot />` which becomes `children` or `dangerouslySetInnerHTML`.
- `src/components/layout/TerminalPanel.astro` → `src/components/layout/TerminalPanel.tsx` — Three traffic-light spans + body `<slot>` → `{children}`.

### Layout — upgrade, not create
- `src/app/layout.tsx` — Currently minimal (body only). Must be expanded to match `BaseLayout.astro`: header with site title link, main with `site-main shell` classes, footer, skip-link, CRT overlay. SEO metadata moves to `generateMetadata` in each page or a shared default in layout.
- `src/app/globals.css` — Has Tailwind `@theme` block, `:root` vars, reset, structural classes (`.site-shell`, `.shell`, `.site-header`, `.site-footer`, `.site-main`, bracket-link styles, cursor styles, responsive). Missing: all component-specific classes.

### Content collection → file-based pipeline
- `src/content.config.ts` — Defines Astro schema: `{ title: string, summary: string, published: date, updated?: date }`. Replace with a TypeScript type in the notes utility.
- `src/content/notes/keep-the-path-explicit.md` — 7 paragraphs, simple prose, no special markdown features.
- `src/content/notes/systems-over-abstractions.md` — List items, no code blocks, no images.

### Test fixtures — reuse vocabulary
- `tests/helpers/site-boundary-fixtures.mjs` — `publicRoutes` array has `{ route, smokeSelector, smokeHtmlSnippet }` for home/about/resume. `publicBoundarySelectors` and `publicGateHtmlSnippets` define the marker vocabulary. Reuse these selector patterns in the new Playwright tests.

### S01 patterns to follow
- `src/app/domains/[slug]/page.tsx` — Established RSC page pattern: async function, `await params`, `await cookies()`, conditional render. Public pages are simpler (no auth check).
- `DomainGatePage.tsx` — Established server component pattern with `data-*` markers and Tailwind utilities mixed with CSS custom property references.
- `src/app/domains/actions.ts` — Server action pattern with `'use server'` directive. Not needed for S02 but shows established conventions.

## Constraints

- **Root layout is the HTML shell** — In Next.js App Router, `layout.tsx` provides the persistent shell. All page-specific content renders as `{children}`. The `<html>`, `<head>`, and `<body>` tags live exclusively in the root layout. Each page exports metadata via `generateMetadata` or a static `metadata` object.
- **`src/app/` not `app/`** (D044) — All new routes go under `src/app/`. Home is `src/app/page.tsx`, about is `src/app/about/page.tsx`, etc.
- **`trailingSlash: true`** — All routes must match trailing-slash URLs (`/about/`, `/notes/`, etc.) to preserve existing URL conventions. `next.config.ts` already has this.
- **No `import.meta.env`** — S01 already migrated `src/data/site.ts` to `process.env`. No other data modules use env vars.
- **`typescript.ignoreBuildErrors: true`** still active (D045) — New code should still be type-correct; run `tsc --noEmit` manually to catch errors. The build won't catch them.
- **Component CSS classes must be present** — The Astro components use BEM-style CSS classes (`.home-page__hero`, `.terminal-panel__bar`, etc.) defined in `src/styles/global.css`. These must be migrated into `src/app/globals.css` so the ported components render correctly.
- **DOM marker contract** — Public pages must render `data-home-page`, `data-personal-page`, `data-resume-page` (smoke selectors), plus `data-route-visibility="public"` and `data-gate-state="open"`. Notes must NOT render any gate markers. These are test dependencies from `site-boundary-fixtures.mjs`.
- **`fs.readFileSync` for notes** — Notes files live in `src/content/notes/` on disk. `fs` is available in server components (Node.js runtime). Use synchronous reads for simplicity in `generateStaticParams` and page data loading.
- **Notes have no `updated` field in existing files** — The Astro schema defines `updated?: date` as optional, but neither existing note file has it. The TypeScript type should mark it optional.
- **Resume clipboard buttons are client-side** — `navigator.clipboard.writeText()` requires a browser context. This is the only `'use client'` component in S02. Isolate it as a `CopyChip` or `ClipboardButton` component.
- **CRT overlay is a static div** — No JS, just CSS. Render it directly in the layout.
- **`next/link` for internal navigation** — Use `next/link` `<Link>` component for all internal links to enable client-side navigation. This replaces plain `<a href>` tags for internal routes. Note: bracket-link CSS (`a::before`, `a::after`) applies to all `<a>` elements — `next/link` renders `<a>` so this works automatically.
- **The skip-link and site-title need `content: none` on `::before`/`::after`** — Already handled in `src/app/globals.css` (`.site-title::before, .site-title::after, .skip-link::before, .skip-link::after { content: none; }`).

## Common Pitfalls

- **Forgetting `data-*` markers on ported components** — Each Astro component has explicit data attributes (`data-home-page`, `data-route-visibility="public"`, `data-gate-state="open"`, `data-home-hero`, etc.). The test fixtures and S01 gate tests depend on these. Missing one breaks the test contract.
- **CSS class mismatch after migration** — The component CSS uses deeply nested BEM selectors (`.home-page__domain-link`, `.resume-page__chip.is-copied .resume-page__chip-done`). If any class name is typo'd or missing in the migrated `globals.css`, the visual regression is silent (no build error). Visual verification against `next dev` is essential for each page.
- **`dangerouslySetInnerHTML` without sanitization** — The notes markdown is our own content, not user-submitted, so `dangerouslySetInnerHTML` is safe. But the HTML should be produced through the remark pipeline, not raw string concatenation.
- **`next/link` bracket artifacts on non-navigation links** — External links (`mailto:`, `https://`) should use plain `<a>` tags, not `next/link`. `next/link` is for internal route navigation only. Both render `<a>` so the bracket CSS applies uniformly — this is correct behavior.
- **Notes `published` date timezone** — The Astro content collection coerces dates with `z.coerce.date()`. `gray-matter` parses YAML dates as JavaScript `Date` objects. The existing `formatDate` function uses `timeZone: 'UTC'` to avoid local-timezone shifts. Preserve this.
- **`generateStaticParams` for notes must list all slugs** — If a note slug is missing, the route won't be statically generated. Use `fs.readdirSync` to discover all `.md` files in `src/content/notes/`.
- **The root layout currently wraps `{children}` directly in `<body>`** — S01's gate pages (`DomainGatePage`, `DomainProofPage`) include their own structural classes (`site-main shell`). When the layout is upgraded to include `<main className="site-main shell">`, the domain page components need to remove their own `site-main shell` wrappers to avoid double-nesting. This is a coordination point with S01's components.
- **Resume `window.print()` in server component** — The print button uses `onclick="window.print()"`. This needs to be in a `'use client'` component. Combine with the clipboard chip into a single `ResumeActions` client component, or handle both in `ResumePage` by extracting the interactive parts.
- **`home-avatar-wrap` CRT inner overlay** — The avatar wrapper has a `::before` and `::after` pseudo-element for CRT scanline effects. These CSS rules must be migrated alongside the `.home-avatar` styles or the avatar will look wrong.

## Open Risks

- **Double `site-main shell` wrapper on domain pages** — When the layout is upgraded to include the site shell structure (header → main → footer), existing S01 domain page components (`DomainGatePage`, `DomainProofPage`) have their own `className="site-main shell"`. These must be updated to remove the outer wrapper, or the layout must delegate structural classes to page components via a different pattern. Either approach is low-risk but must be coordinated.
- **CSS migration completeness** — 177 CSS rules across `.home-page*`, `.personal-page*`, `.resume-page*`, `.notes-index*`, `.note-page*`, `.terminal-panel*`, `.crt-overlay`, `.home-avatar*`, and print styles need to be moved from `src/styles/global.css` to `src/app/globals.css`. Missing a rule is easy; the only safety net is visual verification.
- **`generateMetadata` per-page vs shared** — Each page needs its own title, description, and canonical URL. This is done via `generateMetadata` exports on each `page.tsx` or a static `metadata` object. The pattern needs to be consistent across all pages.
- **Notes markdown features** — The two existing notes are simple prose (no code blocks, images, or tables). But the pipeline should handle at least code blocks and blockquotes since the `note-page__body` CSS already styles them. The remark pipeline handles this natively.

## Candidate Requirements

None. S02 re-validates existing requirements (R001, R005, R006, R007, R101) through the new stack — it does not introduce new capabilities.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Next.js App Router | `wshobson/agents@nextjs-app-router-patterns` | available (8.2K installs) — covers App Router patterns, server/client components, metadata |
| Playwright | `currents-dev/playwright-best-practices-skill@playwright-best-practices` | available (9K installs) — covers test patterns, best practices |
| Frontend design | `frontend-design` | installed — use if visual parity verification is needed |

## Sources

- `gray-matter` API: `matter(string)` returns `{ data, content }`, `matter.read(filepath)` does fs + parse in one call (source: [Context7 /jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter))
- Markdown → HTML: `unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(content)` — canonical pipeline, `remark-html` is deprecated (source: [Context7 /remarkjs/remark](https://github.com/remarkjs/remark))
- Next.js `not-found.tsx`: route-level file renders inside parent layout; does NOT need `<html>`/`<body>` tags (only the global `app/not-found.tsx` outside any route group needs a full document) (source: [Context7 /vercel/next.js](https://github.com/vercel/next.js))
- Next.js `generateStaticParams`: returns array of `{ slug }` objects for static generation of dynamic routes; `dynamicParams = false` returns 404 for unknown slugs (source: Context7)
- Next.js `generateMetadata`: async function or static object export on page files; supports `title`, `description`, `openGraph`, `alternates.canonical`, `robots` (source: Context7)
- Existing codebase analysis: 2 markdown files with `{ title, summary, published }` frontmatter; no images, no code blocks, no complex markdown features
- S01 forward intelligence: all `src/app/` paths under `src/`, Tailwind v4 `@theme` block in `src/app/globals.css`, root layout is minimal stub, `data-*` marker contract preserved
