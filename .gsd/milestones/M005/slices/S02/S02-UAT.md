# S02: Public pages and notes pipeline — UAT

**Milestone:** M005
**Written:** 2026-03-13

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: Playwright tests run against `next dev` and exercise real DOM rendering, route resolution, data-* marker presence, content assertions, and HTTP status codes. Combined with `npm run build` success, this proves integration without requiring human visual verification (visual spot-check deferred to post-S03).

## Preconditions

- `next dev` is running on localhost:3000
- `.env.local` has `GATE_HASH` set (for gate regression tests)
- Playwright browsers installed (`npx playwright install chromium`)
- Note markdown files exist in `src/content/notes/` (at least `keep-the-path-explicit.md`)

## Smoke Test

`curl -s http://localhost:3000/ | grep "data-home-page"` returns a match — confirms the home page renders with expected markers.

## Test Cases

### 1. Home page renders with public markers

1. Navigate to `http://localhost:3000/`
2. **Expected:** `[data-home-page]` marker present, `data-route-visibility="public"`, `data-gate-state="open"`, hero section, domain nav, personal teaser, and contact links visible

### 2. About page renders with public markers

1. Navigate to `http://localhost:3000/about/`
2. **Expected:** `[data-personal-page]` marker present, `data-route-visibility="public"`, `data-gate-state="open"`, personal content visible

### 3. Resume page renders with public markers

1. Navigate to `http://localhost:3000/resume/`
2. **Expected:** `[data-resume-page]` marker present, `data-route-visibility="public"`, `data-gate-state="open"`, resume content visible, clipboard chip buttons functional

### 4. Public pages contain no gate markers

1. Navigate to `/`, `/about/`, `/resume/` in sequence
2. **Expected:** None of these pages contain `data-protected-gate`, `data-gate-state="locked"`, or `data-protected-proof-state` attributes

### 5. Notes index renders with note listing

1. Navigate to `http://localhost:3000/notes/`
2. **Expected:** `[data-notes-index]` marker present, at least one `[data-note-item]` element, each with title, date, and link

### 6. Note detail renders with markdown body

1. Navigate to `http://localhost:3000/notes/keep-the-path-explicit/`
2. **Expected:** `[data-note-page]` marker present, `[data-note-body]` contains rendered HTML (not raw markdown), title and date visible

### 7. Custom 404 page for unknown routes

1. Navigate to `http://localhost:3000/this-route-does-not-exist/`
2. **Expected:** `[data-not-found-page]` marker present, "page not found" text visible, "return home" link present

### 8. Notes routes have no gate markers

1. Navigate to `/notes/` and `/notes/keep-the-path-explicit/`
2. **Expected:** Neither page contains `data-protected-gate`, `data-gate-state="locked"`, or `data-protected-proof-state`

## Edge Cases

### Unknown note slug returns 404

1. Navigate to `http://localhost:3000/notes/nonexistent-slug/`
2. **Expected:** 404 response — `dynamicParams = false` prevents rendering unknown slugs

### Gate regression — existing 5 gate tests still pass

1. Run `npx playwright test tests/e2e/gate.spec.ts`
2. **Expected:** All 5 tests pass — layout changes did not break gate enforcement, auth flow, or session persistence

## Failure Signals

- Missing `data-*` markers on any page → component not rendering or marker attribute dropped
- Gate markers (`data-protected-gate`, `data-gate-state="locked"`) appearing on public routes → route boundary leak
- `npm run build` failure → routing error, TypeScript issue, or missing module
- Notes index showing 0 items → `getAllNotes()` failing to read markdown files
- Note body showing raw markdown → unified pipeline not processing correctly
- 404 showing blank page → `not-found.tsx` not rendering

## Requirements Proved By This UAT

- R101 (public pages stay accessible) — tests 1-4 prove all public routes render without gate interference on the new Next.js stack
- R001 (homepage routes visitors into site) — test 1 proves home renders with domain nav, hero, contact links
- R005 (public personal context) — tests 2-3 prove about and resume render with full content
- R006 (lightweight notes surface) — tests 5-6 prove notes index and detail render with markdown pipeline
- R007 (retro terminal visual identity) — component CSS migration is verified by successful rendering; full visual parity deferred to post-S03

## Not Proven By This UAT

- Visual pixel-parity with the original Astro site — data-* markers confirm content presence but not visual layout fidelity; deferred to post-S03 visual spot-check
- Shader rendering on public pages — S03 scope
- Screenshot gallery and Mermaid diagram rendering — S03 scope
- Production deployment behavior — S04 scope
- Print stylesheet correctness — would require print-specific testing (CSS is migrated but not exercised)

## Notes for Tester

- The Playwright test suite (`tests/e2e/public.spec.ts`) automates all 8 test cases above — run `npx playwright test tests/e2e/public.spec.ts --reporter=list` for the full pass
- Gate regression is automated separately: `npx playwright test tests/e2e/gate.spec.ts --reporter=list`
- The retro terminal styling is present but the shader background won't render until S03 — pages will have a solid dark background, which is expected
