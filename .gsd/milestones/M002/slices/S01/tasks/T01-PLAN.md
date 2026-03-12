---
estimated_steps: 4
estimated_files: 4
---

# T01: Add boundary tests that fail against the current ungated site

**Slice:** S01 — Public vs Protected Route Boundary
**Milestone:** M002

## Description

Create the executable stop condition for S01 before changing any route behavior. This task adds a lightweight Node-based test harness that proves the public-route allowlist stays open, proves protected domain routes must cold-render a locked shell, and proves protected proof must not appear in initial built HTML.

## Steps

1. Add a test command in `package.json` that uses Node's built-in test runner so the slice gets real assertions without introducing a heavy framework.
2. Create `tests/helpers/site-boundary-fixtures.mjs` to centralize built-route paths, HTML loading helpers, and expected public/protected route lists for reuse across slice tests and validators.
3. Create `tests/route-boundary.static.test.mjs` to assert built HTML for `/`, `/about/`, and `/resume/` remains ungated, while every `/domains/*` artifact is expected to expose locked markers and omit flagship/supporting proof sections from initial HTML.
4. Create `tests/route-boundary.browser.test.mjs` to open the built site in a real browser session, verify public routes do not show the gate shell, and verify a cold visit to a protected domain route shows the locked shell instead of rendered proof; keep the assertions written so they fail on the current implementation.

## Must-Haves

- [ ] The task introduces named test files for both built-artifact and browser boundary coverage, and both target the real S01 public/protected contract.
- [ ] The new tests fail on the current code because `/domains/*` still ships proof HTML and does not yet expose the required locked-state markers.

## Verification

- `pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`
- Confirm the failing assertions point to missing protected boundary markers and leaked protected proof, not unrelated build or harness errors.

## Observability Impact

- Signals added/changed: named assertion failures for public-route over-gating, missing gate markers, and protected-proof leakage in initial HTML
- How a future agent inspects this: run `node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`
- Failure state exposed: the exact route and contract clause that failed before or after implementation

## Inputs

- `package.json` — current script surface with only build/check commands
- `.gsd/milestones/M002/slices/S01/S01-RESEARCH.md` — locked-shell boundary recommendation and required data-marker contract

## Expected Output

- `tests/route-boundary.static.test.mjs` — failing built-artifact assertions for public vs protected routes
- `tests/route-boundary.browser.test.mjs` — failing cold-load browser assertions for the same boundary contract
