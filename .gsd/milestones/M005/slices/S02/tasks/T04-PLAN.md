---
estimated_steps: 4
estimated_files: 3
---

# T04: Custom 404 page, print styles, and full verification

**Slice:** S02 — Public pages and notes pipeline
**Milestone:** M005

## Description

Complete the slice with the custom 404 page and print styles migration, then run the full test suite to prove the slice is done. This task closes the loop — every public route renders, notes pipeline works, no gate markers on public pages, and existing gate tests are unbroken.

## Steps

1. **Create `src/app/not-found.tsx`** — Custom 404 page inside the root layout (not a global not-found that needs `<html>`/`<body>`). Import `Link` from `next/link` and `TerminalPanel`. Render a simple "Page not found" message with a link back to home. Keep the retro aesthetic — minimal text, no elaborate error graphics.

2. **Migrate print styles** — Copy `@media print` block and `.print-hide` rule from `src/styles/global.css` into `src/app/globals.css`. The resume page uses `.print-hide` for elements that should disappear when printing.

3. **Verify 404 test case** — The 404 test in `public.spec.ts` navigates to an unknown route and expects 404 content. Adjust the test assertion if needed to match the actual rendered content (e.g., check for "not found" text or a specific marker). Ensure the test passes.

4. **Run full verification suite** — Execute all tests and build:
   - `npx playwright test tests/e2e/public.spec.ts --reporter=list` → all 8 tests pass
   - `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 gate tests pass
   - `npm run build` → exits 0
   - Quick curl checks for key markers on each route

## Must-Haves

- [ ] `src/app/not-found.tsx` renders "Page not found" message with home link inside layout
- [ ] Print styles and `.print-hide` present in `globals.css`
- [ ] All 8 public Playwright tests pass
- [ ] All 5 gate Playwright tests pass (regression)
- [ ] `npm run build` exits 0

## Verification

- `npx playwright test tests/e2e/public.spec.ts --reporter=list` → 8 passed
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 passed
- `npm run build` → exits 0
- `curl -s http://localhost:3000/this-does-not-exist/ | grep -i "not found"` → confirms 404 renders

## Observability Impact

- Signals added/changed: None — 404 page is a standard Next.js convention with no custom instrumentation
- How a future agent inspects this: Navigate to any unknown route → should see "not found" content, not a blank page or error
- Failure state exposed: None — this is the failure state itself (404 for unknown routes)

## Inputs

- `src/app/layout.tsx` — T01's layout (404 renders inside it)
- `src/components/layout/TerminalPanel.tsx` — T01's shared component
- `src/styles/global.css` — source CSS for print styles
- `tests/e2e/public.spec.ts` — T01's test file (404 test case)
- All prior T01–T03 work: layout, pages, notes pipeline

## Expected Output

- `src/app/not-found.tsx` — new 404 page component
- `src/app/globals.css` — extended with print styles
- `tests/e2e/public.spec.ts` — possibly adjusted 404 test assertion (if needed)
- Full passing test suite: 13 tests total (8 public + 5 gate)
