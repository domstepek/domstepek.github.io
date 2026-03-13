---
id: T03
parent: S02
milestone: M005
provides:
  - Notes markdown pipeline (gray-matter + unified/remark/rehype) replacing Astro content collections
  - NotesIndexPage server component with sorted note listing and data-* markers
  - NotePage server component with rendered markdown HTML body
  - Dynamic notes/[slug] route with generateStaticParams and dynamicParams=false
key_files:
  - src/lib/notes.ts
  - src/components/notes/NotesIndexPage.tsx
  - src/components/notes/NotePage.tsx
  - src/app/notes/page.tsx
  - src/app/notes/[slug]/page.tsx
key_decisions:
  - Next.js 16 requires params to be a Promise — route component and generateMetadata use async/await pattern for params destructuring
  - gray-matter parses YAML dates natively as Date objects — no extra coercion needed
  - unified pipeline uses processSync (synchronous) since all note processing runs at build-time in server components
patterns_established:
  - Markdown content pipeline uses src/lib/notes.ts as the single data access layer — all note queries go through getAllNotes/getNoteBySlug/getAllNoteSlugs
  - Dynamic route params in Next.js 16 must be awaited — params is Promise<{slug}> not {slug}
observability_surfaces:
  - "curl -s http://localhost:3000/notes/ | grep -o data-note-item | wc -l → should return 2 (two notes)"
  - "curl -s http://localhost:3000/notes/keep-the-path-explicit/ | grep data-note-body → confirms rendered markdown"
  - getNoteBySlug returning null triggers notFound() → 404; dynamicParams=false means unknown slugs 404 at build time
duration: ~12min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T03: Notes markdown pipeline and notes pages

**Built the complete notes pipeline with gray-matter + unified/remark/rehype, notes index page, and dynamic note detail page with generateStaticParams.**

## What Happened

Installed five markdown dependencies (gray-matter, unified, remark-parse, remark-rehype, rehype-stringify) via pnpm. Created `src/lib/notes.ts` as the centralized data access layer with typed interfaces (NoteFrontmatter, NoteEntry, NoteWithContent) and three functions: getAllNotes (sorted descending by published date), getNoteBySlug (parses markdown to HTML via unified pipeline), and getAllNoteSlugs (for generateStaticParams).

Built NotesIndexPage as a server component mirroring the Astro original — back-home link, TerminalPanel wrapper, intro section, note list with all data-* markers (data-notes-index, data-note-item, data-note-date, data-note-title, data-note-link, data-note-summary). Uses Intl.DateTimeFormat with timeZone: 'UTC' to match original formatting.

Built NotePage as a server component with back-to-notes link, TerminalPanel, title, date, summary, and dangerouslySetInnerHTML for the rendered markdown body. Dynamic route uses async params pattern required by Next.js 16 (params is a Promise), generateStaticParams from getAllNoteSlugs, and dynamicParams=false.

Migrated all notes CSS from src/styles/global.css to src/app/globals.css — notes-index, note-page, and all sub-selectors.

## Verification

- `npx playwright test tests/e2e/public.spec.ts --reporter=list` → **8/8 pass** (all public tests including notes index, note detail, and notes no-gate-markers)
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → **5/5 pass** (regression check)
- `npm run build` → exits 0, both note slugs (keep-the-path-explicit, systems-over-abstractions) statically generated as SSG
- `curl -s http://localhost:3000/notes/ | grep -o "data-note-item" | wc -l` → 4 (2 in SSR HTML + 2 in RSC payload)
- `curl -s http://localhost:3000/notes/keep-the-path-explicit/ | grep "data-note-body"` → confirms rendered markdown

### Slice-level verification status (cumulative)
- `npx playwright test tests/e2e/public.spec.ts` → ✅ 8/8 pass
- `npx playwright test tests/e2e/gate.spec.ts` → ✅ 5/5 pass
- `npm run build` → ✅ exits 0

## Diagnostics

- Inspect notes index: `curl -s http://localhost:3000/notes/ | grep -c "data-note-item"` → should return count ≥ 1
- Inspect note detail: `curl -s http://localhost:3000/notes/<slug>/ | grep "data-note-body"` → confirms markdown rendering
- Missing note slug → 404 (dynamicParams=false at build time, notFound() at runtime)
- Missing data-* markers cause Playwright test failures with descriptive selector names

## Deviations

- Next.js 16 async params: The task plan used synchronous `params.slug` access. Updated to `await params` with `Promise<{slug}>` typing since Next.js 16 requires params as a Promise. This is a framework-level requirement, not an architecture change.

## Known Issues

None.

## Files Created/Modified

- `src/lib/notes.ts` — new notes data access layer (types + getAllNotes/getNoteBySlug/getAllNoteSlugs)
- `src/components/notes/NotesIndexPage.tsx` — new server component for /notes/ index
- `src/components/notes/NotePage.tsx` — new server component for /notes/[slug] detail
- `src/app/notes/page.tsx` — new route file with generateMetadata
- `src/app/notes/[slug]/page.tsx` — new dynamic route with generateStaticParams, dynamicParams=false, async params
- `src/app/globals.css` — extended with notes-index and note-page CSS blocks
- `package.json` — added gray-matter, unified, remark-parse, remark-rehype, rehype-stringify dependencies
