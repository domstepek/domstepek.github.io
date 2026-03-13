---
id: T04
parent: S02
milestone: M005
provides:
  - Custom 404 page with retro terminal aesthetic
  - Full slice verification — all 13 tests passing (8 public + 5 gate)
key_files:
  - src/app/not-found.tsx
  - tests/e2e/public.spec.ts
key_decisions:
  - 404 test enhanced to assert custom content (data-not-found-page marker, "page not found" text, home link) beyond just status code
patterns_established:
  - Custom 404 uses TerminalPanel wrapper for consistent retro aesthetic — same pattern as page content
observability_surfaces:
  - Navigate to any unknown route → should see data-not-found-page marker and "page not found" text
duration: 10m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T04: Custom 404 page, print styles, and full verification

**Created custom 404 page inside TerminalPanel, enhanced 404 test with content assertions, and verified full slice — all 13 tests pass, build succeeds.**

## What Happened

Created `src/app/not-found.tsx` as a simple server component that renders "page not found" inside a TerminalPanel with a link back to home. Added `data-not-found-page` marker for machine inspection.

Print styles and `.print-hide` were already present in `globals.css` from prior task work — no migration needed.

Enhanced the 404 Playwright test (test 7) to verify not just the 404 status code but also that the custom content renders: the `data-not-found-page` marker, "page not found" heading, and "return home" link.

Ran full verification: all 8 public tests pass, all 5 gate tests pass, `npm run build` exits 0 with `/_not-found` listed as a static route.

## Verification

- `npx playwright test tests/e2e/public.spec.ts --reporter=list` → **8 passed**
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → **5 passed**
- `npm run build` → exits 0, `/_not-found` listed in route table
- `curl -s http://localhost:3000/this-does-not-exist/ | grep -io "not found"` → confirms 404 renders custom content

## Diagnostics

- Navigate to any unknown route → should see `data-not-found-page` marker and "page not found" text, not a blank page or error
- `curl -s http://localhost:3000/<any-unknown-route>/ | grep "data-not-found-page"` → confirms custom 404

## Deviations

- Print styles were already in `globals.css` from prior work — no migration step was needed

## Known Issues

None.

## Files Created/Modified

- `src/app/not-found.tsx` — Custom 404 page with TerminalPanel wrapper and home link
- `tests/e2e/public.spec.ts` — Enhanced test 7 with content assertions for custom 404
