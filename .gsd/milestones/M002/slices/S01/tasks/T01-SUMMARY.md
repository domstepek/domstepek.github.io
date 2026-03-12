---
id: T01
parent: S01
milestone: M002
provides:
  - Failing dist-level and browser-level regression tests that define the S01 public/protected boundary contract before route changes land
key_files:
  - tests/helpers/site-boundary-fixtures.mjs
  - tests/route-boundary.static.test.mjs
  - tests/route-boundary.browser.test.mjs
  - package.json
key_decisions:
  - D015 locked the cold-load protected marker contract to `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, and `data-protected-proof-state="withheld"`
patterns_established:
  - Dist-first boundary checks share one fixture module with route lists, HTML helpers, and a tiny built-site server reused by the browser smoke test
observability_surfaces:
  - `node --test tests/route-boundary.static.test.mjs`
  - `node --test tests/route-boundary.browser.test.mjs`
  - Assertion messages naming the exact protected route plus either missing locked markers or leaked proof markers/nodes
duration: 1h
verification_result: expected_failures_confirmed
completed_at: 2026-03-12T09:00:00-04:00
blocker_discovered: false
---

# T01: Add boundary tests that fail against the current ungated site

**Added the failing S01 route-boundary harness: shared fixtures, built-HTML assertions, and real-browser cold-load checks that prove `/domains/*` still leaks proof and lacks locked markers today.**

## What Happened

I added a lightweight Node test setup without introducing another framework.

- Added `test` in `package.json` so the repo can use Node's built-in test runner.
- Created `tests/helpers/site-boundary-fixtures.mjs` with the public/protected route lists, dist HTML loader, regex escaping helper, and a tiny static server for browser tests.
- Created `tests/route-boundary.static.test.mjs` to verify:
  - `/`, `/about/`, and `/resume/` still cold-render as public pages
  - each `/domains/*` built artifact is expected to include the locked protected markers
  - each `/domains/*` built artifact is expected to omit flagship/supporting proof markers from initial HTML
- Created `tests/route-boundary.browser.test.mjs` to cold-load the built site in Puppeteer and verify:
  - public routes do not show the protected gate shell
  - protected routes are expected to show the locked shell markers
  - protected routes are expected not to render flagship/supporting proof before unlock

The current site fails these protected-route assertions for the intended reasons: the domain pages still ship full proof HTML and do not expose the locked boundary markers yet.

## Verification

Ran slice verification commands and recorded the current status:

- `pnpm check` ✅
- `pnpm build` ✅
- `node --test tests/route-boundary.static.test.mjs` ✅ expected failure shape confirmed
  - protected routes fail on missing `data-route-visibility="protected"`
  - protected routes fail on leaked proof markers such as `data-flagship-highlights`
- `node --test tests/route-boundary.browser.test.mjs` ✅ expected failure shape confirmed
  - public routes pass as ungated
  - protected routes fail on missing `[data-protected-gate]`
  - protected routes fail on rendered proof node counts greater than zero
- `pnpm validate:site` ❌ command not found
  - this is expected at T01 because `validate:site` is planned for T03, not a blocker for this task

Also ran the task-level combined check earlier:

- `pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`

## Diagnostics

Use these commands to inspect the boundary contract later:

- `node --test tests/route-boundary.static.test.mjs`
- `node --test tests/route-boundary.browser.test.mjs`

The static test names the exact protected route and the missing/leaked HTML marker.
The browser test names the exact protected route and whether the failure came from a missing locked shell or proof nodes rendering before unlock.
The shared fixture file centralizes the route lists and marker contract so later validators can reuse the same source of truth.

## Deviations

None.

## Known Issues

- `pnpm validate:site` does not exist yet; T03 is explicitly planned to add it.
- The protected-route browser smoke test launches Chromium via Puppeteer and currently takes about 10-12 seconds end to end.

## Files Created/Modified

- `package.json` — added the Node built-in test runner script surface
- `tests/helpers/site-boundary-fixtures.mjs` — added shared route fixtures, HTML helpers, regex escaping, and a tiny dist server for browser verification
- `tests/route-boundary.static.test.mjs` — added failing built-artifact assertions for the protected boundary contract
- `tests/route-boundary.browser.test.mjs` — added failing cold-load browser assertions for public vs protected routes
- `.gsd/DECISIONS.md` — recorded the exact locked-boundary marker contract used by the new tests
