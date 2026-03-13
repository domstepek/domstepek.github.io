---
id: S02
parent: M005
milestone: M005
provides:
  - Full site shell in root layout (skip-link, header, main, footer, CRT overlay)
  - TerminalPanel shared server component
  - HomePage, PersonalPage, ResumePage server components with data-* marker coverage
  - CopyChip/PrintButton 'use client' components for resume clipboard and print
  - Notes markdown pipeline (gray-matter + unified/remark/rehype) replacing Astro content collections
  - NotesIndexPage and NotePage server components with dynamic [slug] route
  - Custom 404 page with retro terminal aesthetic
  - generateMetadata SEO exports on all public routes
  - Full component CSS migrated from src/styles/global.css to src/app/globals.css
  - Playwright public.spec.ts with 8 passing test cases
requires:
  - slice: S01
    provides: Root layout, Tailwind theme, routing conventions, data modules, Playwright infrastructure
affects:
  - S04
key_files:
  - src/app/layout.tsx
  - src/app/globals.css
  - src/components/layout/TerminalPanel.tsx
  - src/components/home/HomePage.tsx
  - src/components/personal/PersonalPage.tsx
  - src/components/resume/ResumePage.tsx
  - src/components/resume/CopyChip.tsx
  - src/lib/notes.ts
  - src/components/notes/NotesIndexPage.tsx
  - src/components/notes/NotePage.tsx
  - src/app/not-found.tsx
  - tests/e2e/public.spec.ts
key_decisions:
  - Root layout provides site-main shell wrapper — page components must not duplicate it
  - Page components are server components in src/components/{page}/ — route files in src/app/ just import and render with generateMetadata
  - Client interactivity isolated to smallest possible 'use client' component (CopyChip, PrintButton) — parent pages stay server components
  - Notes pipeline uses src/lib/notes.ts as centralized data access layer — gray-matter + unified/remark/rehype replaces Astro content collections
  - Next.js 16 async params — dynamic route params must be awaited (Promise<{slug}>)
patterns_established:
  - TerminalPanel.tsx is the shared React equivalent of TerminalPanel.astro — import from @/components/layout/TerminalPanel
  - Internal navigation uses next/link Link; external uses plain <a> with rel="noreferrer"
  - Markdown content pipeline lives in src/lib/notes.ts — all note queries go through getAllNotes/getNoteBySlug/getAllNoteSlugs
  - Custom 404 uses TerminalPanel wrapper for consistent retro aesthetic
observability_surfaces:
  - "curl -s http://localhost:3000/ | grep data-home-page — confirms home renders"
  - "curl -s http://localhost:3000/about/ | grep data-personal-page — confirms about renders"
  - "curl -s http://localhost:3000/resume/ | grep data-resume-page — confirms resume renders"
  - "curl -s http://localhost:3000/notes/ | grep -c data-note-item — should return ≥1"
  - "curl -s http://localhost:3000/notes/keep-the-path-explicit/ | grep data-note-body — confirms markdown rendering"
  - "Navigate to unknown route → data-not-found-page marker and 'page not found' text"
drill_down_paths:
  - .gsd/milestones/M005/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M005/slices/S02/tasks/T03-SUMMARY.md
  - .gsd/milestones/M005/slices/S02/tasks/T04-SUMMARY.md
duration: ~45min across 4 tasks
verification_result: passed
completed_at: 2026-03-13
---

# S02: Public pages and notes pipeline

**All five public routes (`/`, `/about/`, `/resume/`, `/notes/`, `/notes/[slug]/`) ported to Next.js server components with full site shell, notes markdown pipeline, custom 404, and 8 Playwright tests — alongside the working gate from S01.**

## What Happened

T01 upgraded the root layout from a minimal stub to the full site shell (skip-link, header with site-title link, `<main>` with `site-main shell` classes, footer, CRT overlay). Created `TerminalPanel.tsx` as a shared server component. Updated domain page components to remove their own `site-main shell` wrapper (layout provides it now). Migrated `.crt-overlay` and `.terminal-panel*` CSS. Created the 8-case Playwright public test skeleton.

T02 ported the three main public pages. `HomePage.tsx`, `PersonalPage.tsx`, and `ResumePage.tsx` are all server components matching the original Astro structure with full `data-*` marker coverage. `CopyChip.tsx` isolates the clipboard chip and print button as the only `'use client'` components. All three route files export `generateMetadata` with SEO. Full component CSS migrated for home, about, and resume pages.

T03 built the notes markdown pipeline. Installed `gray-matter`, `unified`, `remark-parse`, `remark-rehype`, and `rehype-stringify`. Created `src/lib/notes.ts` as the centralized data access layer replacing Astro content collections, with typed interfaces and three functions (`getAllNotes`, `getNoteBySlug`, `getAllNoteSlugs`). Built `NotesIndexPage` and `NotePage` server components with all data-* markers. The dynamic `[slug]` route uses `generateStaticParams` with `dynamicParams = false` and the async params pattern required by Next.js 16.

T04 created the custom 404 page inside a TerminalPanel with a home link and `data-not-found-page` marker. Enhanced the 404 test to assert custom content beyond just status code.

## Verification

- `npx playwright test tests/e2e/public.spec.ts --reporter=list` → **8/8 pass**
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → **5/5 pass** (regression clean)
- `npm run build` → **exits 0** (all routes generated: /, /_not-found, /about, /domains/[slug], /notes, /notes/keep-the-path-explicit, /notes/systems-over-abstractions, /resume)
- Observability spot-checks: all `data-*` markers confirmed present via curl on every public route

## Requirements Advanced

- R101 (public pages stay accessible) — all five public routes now render on Next.js with no gate
- R001 (homepage routes visitors into the site) — HomePage server component renders with domain nav, hero, personal teaser, contact links
- R005 (public personal context) — About and resume pages render with full content
- R006 (lightweight notes surface) — Notes index and detail pages render with markdown pipeline
- R007 (retro terminal visual identity) — Full component CSS migrated, TerminalPanel, CRT overlay, retro styling preserved

## Requirements Validated

- None newly validated — these requirements were already validated in prior milestones and are being re-validated through the new stack

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

- Next.js 16 async params: Task plan used synchronous `params.slug` access. Updated to `await params` with `Promise<{slug}>` typing — framework requirement, not architecture change (D046).
- Print styles were already in `globals.css` from T02 work, so T04's print migration step was a no-op.

## Known Limitations

- Visual parity with Astro site is not pixel-verified — Playwright tests assert data-* markers and content presence, not visual layout. Visual spot-check deferred to post-S03 when the shader is also mounted.
- Notes pipeline uses `processSync` (synchronous) — sufficient for the current two notes but would need async processing if note count grows significantly.

## Follow-ups

- S03 will mount the shader background in the root layout and add screenshot gallery + Mermaid client components
- S04 will clean up Astro files, remove `typescript.ignoreBuildErrors`, deploy to Vercel, and wire CI

## Files Created/Modified

- `src/app/layout.tsx` — expanded from stub to full site shell with skip-link, header, main, footer, CRT overlay
- `src/app/globals.css` — extended with all component CSS (crt-overlay, terminal-panel, home, personal, resume, notes, print styles)
- `src/components/layout/TerminalPanel.tsx` — new server component with traffic-light dots and children slot
- `src/components/home/HomePage.tsx` — new server component porting HomePage.astro
- `src/components/personal/PersonalPage.tsx` — new server component porting PersonalPage.astro
- `src/components/resume/ResumePage.tsx` — new server component porting ResumePage.astro
- `src/components/resume/CopyChip.tsx` — new 'use client' component for clipboard chips + PrintButton
- `src/lib/notes.ts` — new notes data access layer (gray-matter + unified/remark/rehype)
- `src/components/notes/NotesIndexPage.tsx` — new server component for /notes/ index
- `src/components/notes/NotePage.tsx` — new server component for /notes/[slug] detail
- `src/app/page.tsx` — replaced placeholder with real HomePage + generateMetadata
- `src/app/about/page.tsx` — new route file with PersonalPage + generateMetadata
- `src/app/resume/page.tsx` — new route file with ResumePage + generateMetadata
- `src/app/notes/page.tsx` — new route file with generateMetadata
- `src/app/notes/[slug]/page.tsx` — new dynamic route with generateStaticParams + async params
- `src/app/not-found.tsx` — custom 404 page with TerminalPanel wrapper
- `src/components/domains/DomainGatePage.tsx` — removed site-main shell className (layout provides it)
- `src/components/domains/DomainProofPage.tsx` — removed site-main shell className (layout provides it)
- `tests/e2e/public.spec.ts` — new test file with 8 public page acceptance test cases

## Forward Intelligence

### What the next slice should know
- The root layout (`src/app/layout.tsx`) has a `<main id="main-content" className="site-main shell">` wrapping `{children}` — the shader canvas must be placed outside this, likely as a direct child of `<body>` before the site shell (matching the Astro pattern from D029)
- The CRT overlay div is already in the layout at the end of `<body>` — the shader canvas z-index must sit below the CRT overlay (z-index 9999)
- All page components are server components — any client interactivity (shader, galleries, Mermaid) must be isolated in `'use client'` wrapper components

### What's fragile
- Component CSS is a bulk migration from `src/styles/global.css` — if any CSS rules were missed, they'll show as visual regressions only visible in a browser, not caught by Playwright data-* marker tests
- The `dangerouslySetInnerHTML` for note body content has no sanitization — safe for now because content is author-controlled markdown files, but would need sanitization if content sources change

### Authoritative diagnostics
- `data-*` markers on every page are the primary machine-inspection surface — curl any route and grep for the page's marker to confirm rendering
- Playwright `public.spec.ts` tests are the definitive acceptance criteria — all 8 tests must pass for the slice to be valid
- `npm run build` route table shows all static/SSG/dynamic routes — missing routes indicate routing errors

### What assumptions changed
- The plan assumed print styles needed migration in T04 — they were already migrated during T02's component CSS work, making T04 simpler
- Next.js 16 params-as-Promise was not in the original plan — discovered and documented as D046 during T03
