# S02: Public pages and notes pipeline

**Goal:** All public routes (`/`, `/about`, `/resume`, `/notes`, `/notes/[slug]`) render correctly on Next.js with the retro terminal aesthetic, full site shell (header, main, footer, CRT overlay), notes markdown pipeline, and custom 404 — alongside the working gate from S01.
**Demo:** A visitor can browse `/`, `/about/`, `/resume/`, `/notes/`, and `/notes/keep-the-path-explicit/` with correct content, retro styling, terminal panels, and no gate markers — all passing Playwright tests.

## Must-Haves

- Root layout upgraded to full site shell: skip-link, header with site title, `<main>` with `site-main shell` classes, footer, CRT overlay div
- S01 domain page components (`DomainGatePage`, `DomainProofPage`) updated to remove their own `site-main shell` wrapper (layout provides it) — all 5 existing gate tests still pass
- `TerminalPanel` React server component with traffic-light dots and `{children}` slot
- Home page (`/`) server component with all `data-*` markers and data from `src/data/home.ts`
- About page (`/about/`) server component with data from `src/data/personal.ts`
- Resume page (`/resume/`) server component with data from `src/data/resume.ts`, including `'use client'` clipboard chip buttons and print button
- Notes pipeline: `gray-matter` + `unified`/`remark-parse`/`remark-rehype`/`rehype-stringify` reading `src/content/notes/*.md`
- Notes index page (`/notes/`) listing notes sorted by published date
- Note detail page (`/notes/[slug]/`) with `generateStaticParams` and rendered markdown via `dangerouslySetInnerHTML`
- Custom 404 page (`src/app/not-found.tsx`)
- Per-page SEO metadata via `generateMetadata` or static `metadata` exports
- All component CSS migrated from `src/styles/global.css` to `src/app/globals.css`
- DOM marker contract: `data-home-page`, `data-personal-page`, `data-resume-page`, `data-notes-index`, `data-note-page` with `data-route-visibility="public"` and `data-gate-state="open"` on home/about/resume
- Playwright test suite `tests/e2e/public.spec.ts` covering public route rendering, notes pipeline, gate marker isolation, and 404

## Proof Level

- This slice proves: integration
- Real runtime required: yes — Playwright tests run against `next dev`
- Human/UAT required: no — Playwright assertions plus `next build` success are sufficient; visual spot-check deferred to post-S03

## Verification

- `npx playwright test tests/e2e/public.spec.ts --reporter=list` → all tests pass
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → existing 5 gate tests still pass (regression)
- `npm run build` → exits 0

Test file: `tests/e2e/public.spec.ts` — created in T01, exercised throughout, all passing after T04:
1. Home page renders with `[data-home-page]` marker and public boundary markers
2. About page renders with `[data-personal-page]` marker and public boundary markers
3. Resume page renders with `[data-resume-page]` marker and public boundary markers
4. Public pages contain no gate markers (`data-protected-gate`, `data-gate-state="locked"`, etc.)
5. Notes index renders with `[data-notes-index]` and lists at least one note with `[data-note-item]`
6. Note detail page renders with `[data-note-page]` and `[data-note-body]` containing rendered HTML
7. Unknown route renders 404 page
8. Notes routes have no gate markers

## Observability / Diagnostics

- Runtime signals: `data-*` DOM attributes on every page for machine inspection; `generateMetadata` produces correct `<title>` and `<meta>` tags inspectable via `curl -s ... | grep "<title>"`
- Inspection surfaces: `curl -s http://localhost:3000/ | grep "data-home-page"` for quick smoke check on any route; `curl -s http://localhost:3000/notes/ | grep "data-note-item"` for notes pipeline
- Failure visibility: Missing `data-*` markers cause Playwright test failures with descriptive selector names; missing CSS classes produce visual regressions catchable by screenshot comparison
- Redaction constraints: none — all public content

## Integration Closure

- Upstream surfaces consumed: root layout (`src/app/layout.tsx`), Tailwind theme (`src/app/globals.css` `@theme` block), routing conventions and data modules from S01
- New wiring introduced in this slice: full site shell in root layout (header/footer/main), `TerminalPanel` shared component, notes file-based pipeline (`src/lib/notes.ts`), per-page `generateMetadata` exports, `next/link` for internal navigation
- What remains before the milestone is truly usable end-to-end: S03 (shader background, screenshot gallery, Mermaid diagrams), S04 (Vercel deployment, CI, cleanup)

## Tasks

- [x] **T01: Upgrade root layout and create Playwright public test skeleton** `est:45m`
  - Why: The root layout is a minimal stub — every page needs the full site shell (skip-link, header, main, footer, CRT overlay). The public test file defines the acceptance criteria upfront so subsequent tasks can run tests incrementally. Domain page components must drop their `site-main shell` wrapper to avoid double-nesting.
  - Files: `src/app/layout.tsx`, `src/app/globals.css`, `src/components/layout/TerminalPanel.tsx`, `src/components/domains/DomainGatePage.tsx`, `src/components/domains/DomainProofPage.tsx`, `tests/e2e/public.spec.ts`
  - Do: (1) Expand `layout.tsx` to match `BaseLayout.astro`: add skip-link, `<header>` with site-title `<Link>`, `<main id="main-content" className="site-main shell">`, footer, CRT overlay. Use `next/link` for site-title. (2) Create `TerminalPanel.tsx` server component. (3) Remove `className="site-main shell"` from `DomainGatePage.tsx` and `DomainProofPage.tsx` outer divs (layout provides it now). (4) Migrate `.crt-overlay` and `.terminal-panel*` CSS from `src/styles/global.css` into `src/app/globals.css`. (5) Create `tests/e2e/public.spec.ts` with all 8 test cases — they will fail until pages are built. (6) Run gate tests to confirm no regression.
  - Verify: `npx playwright test tests/e2e/gate.spec.ts` → 5 passed; `npm run build` → exits 0
  - Done when: gate tests pass with the new layout, TerminalPanel component exists, public test file is committed (tests expected to fail)

- [x] **T02: Port home, about, and resume pages with component CSS** `est:60m`
  - Why: Three of the five public routes need page components, route files, and their component CSS migrated. This is the bulk of the visual porting work.
  - Files: `src/app/page.tsx`, `src/components/home/HomePage.tsx`, `src/app/about/page.tsx`, `src/components/personal/PersonalPage.tsx`, `src/app/resume/page.tsx`, `src/components/resume/ResumePage.tsx`, `src/components/resume/CopyChip.tsx`, `src/app/globals.css`
  - Do: (1) Create `HomePage.tsx` server component from `HomePage.astro` with all `data-*` markers, using `next/link` for internal links and plain `<a>` for external. Replace `src/app/page.tsx` placeholder with the real home page importing `HomePage`. Export `generateMetadata` with SEO from `homePage.seo`. (2) Create `PersonalPage.tsx` server component and `src/app/about/page.tsx` route. (3) Create `ResumePage.tsx` server component with a `CopyChip.tsx` `'use client'` component for clipboard buttons, plus a client-side print button. Create `src/app/resume/page.tsx` route. (4) Migrate all `.home-page*`, `.personal-page*`, `.resume-page*`, `.home-avatar*` CSS from `src/styles/global.css` into `src/app/globals.css`. (5) Run public tests — home/about/resume tests should pass.
  - Verify: `npx playwright test tests/e2e/public.spec.ts --grep "home|about|resume|gate markers"` → relevant tests pass; `npx playwright test tests/e2e/gate.spec.ts` → 5 passed
  - Done when: `/`, `/about/`, `/resume/` render with correct data-* markers, public boundary markers, no gate markers, and all component CSS present

- [x] **T03: Notes markdown pipeline and notes pages** `est:45m`
  - Why: The notes index and detail pages need a file-based markdown pipeline replacing Astro content collections, plus route files and CSS.
  - Files: `src/lib/notes.ts`, `src/app/notes/page.tsx`, `src/components/notes/NotesIndexPage.tsx`, `src/app/notes/[slug]/page.tsx`, `src/components/notes/NotePage.tsx`, `src/app/globals.css`
  - Do: (1) Install `gray-matter`, `unified`, `remark-parse`, `remark-rehype`, `rehype-stringify`. (2) Create `src/lib/notes.ts` with `getAllNotes()` (reads + parses all `.md` files, sorts by published desc) and `getNoteBySlug(slug)` (returns note metadata + rendered HTML). Use `fs.readFileSync` + `path.join(process.cwd(), 'src/content/notes')`. TypeScript type: `{ slug, title, summary, published: Date, updated?: Date }`. (3) Create `NotesIndexPage.tsx` server component with `data-notes-index`, `data-note-item` markers, `formatDate` helper with `timeZone: 'UTC'`, `next/link` for note links. Create `src/app/notes/page.tsx` route with `generateMetadata`. (4) Create `NotePage.tsx` server component with `data-note-page`, `data-note-body` markers, rendered HTML via `dangerouslySetInnerHTML`. Create `src/app/notes/[slug]/page.tsx` with `generateStaticParams` listing all slugs and `dynamicParams = false`. (5) Migrate `.notes-index*` and `.note-page*` CSS into `src/app/globals.css`. (6) Run notes tests.
  - Verify: `npx playwright test tests/e2e/public.spec.ts --grep "notes|Notes"` → notes tests pass; `npm run build` → exits 0
  - Done when: `/notes/` lists both notes with dates; `/notes/keep-the-path-explicit/` renders markdown body; unknown note slug returns 404

- [x] **T04: Custom 404 page, print styles, and full verification** `est:30m`
  - Why: The 404 page and print styles complete the slice. Full regression across all test suites proves nothing broke.
  - Files: `src/app/not-found.tsx`, `src/app/globals.css`, `tests/e2e/public.spec.ts`
  - Do: (1) Create `src/app/not-found.tsx` with a "Page not found" message inside a TerminalPanel, linking back to home. (2) Migrate print styles and `.print-hide` from `src/styles/global.css` into `src/app/globals.css`. (3) Verify the 404 test case works (navigate to `/this-route-does-not-exist/`, expect 404 content). (4) Run full test suite: all public tests + all gate tests. (5) Run `npm run build` for build health.
  - Verify: `npx playwright test tests/e2e/public.spec.ts --reporter=list` → all 8 pass; `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 passed; `npm run build` → exits 0
  - Done when: All 13 tests pass (8 public + 5 gate), build succeeds, custom 404 renders for unknown routes

## Files Likely Touched

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/resume/page.tsx`
- `src/app/notes/page.tsx`
- `src/app/notes/[slug]/page.tsx`
- `src/app/not-found.tsx`
- `src/components/layout/TerminalPanel.tsx`
- `src/components/home/HomePage.tsx`
- `src/components/personal/PersonalPage.tsx`
- `src/components/resume/ResumePage.tsx`
- `src/components/resume/CopyChip.tsx`
- `src/components/notes/NotesIndexPage.tsx`
- `src/components/notes/NotePage.tsx`
- `src/lib/notes.ts`
- `src/components/domains/DomainGatePage.tsx`
- `src/components/domains/DomainProofPage.tsx`
- `tests/e2e/public.spec.ts`
