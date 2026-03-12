# S01: Public vs Protected Route Boundary

**Goal:** Split the site cleanly between always-public top-level pages and cold-load-protected domain pages without leaking protected proof in initial static HTML.
**Demo:** `/`, `/about/`, and `/resume/` open normally, while a cold visit to any `/domains/*` route shows a real locked gate shell instead of the full portfolio proof.

## Must-Haves

- `/`, `/about/`, and `/resume/` remain directly accessible and do not render the protected gate shell.
- Every `/domains/*` page cold-renders a locked protected boundary with stable verification markers and without shipping flagship/supporting proof content in initial HTML.
- The boundary contract is regression-tested in both built artifacts and a real browser cold-load flow.

## Proof Level

- This slice proves: integration
- Real runtime required: yes
- Human/UAT required: no

## Verification

- `pnpm check && pnpm build`
- `node --test tests/route-boundary.static.test.mjs`
- `node --test tests/route-boundary.browser.test.mjs`
- `pnpm validate:site`

## Observability / Diagnostics

- Runtime signals: stable DOM markers on page roots and gate shells (`data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`)
- Inspection surfaces: built-artifact node tests, browser cold-load smoke test, and the aggregate `pnpm validate:site` release gate
- Failure visibility: assertion messages identify whether the regression came from public-route over-gating, missing locked-shell markers, or protected proof leaking into initial HTML
- Redaction constraints: no passcode values or secret-like strings are logged; this slice only exposes locked-state structure

## Integration Closure

- Upstream surfaces consumed: `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/resume.astro`, `src/pages/domains/[slug].astro`, `src/components/domains/DomainPage.astro`, `src/lib/paths.ts`, `.github/workflows/deploy.yml`
- New wiring introduced in this slice: a shared locked-shell render path for `/domains/*`, explicit public/protected boundary markers, and release-gate coverage for the route split
- What remains before the milestone is truly usable end-to-end: passcode entry UI, session unlock persistence, request-access messaging, protected-visual reveal behavior, and final milestone browser/UAT regression coverage

## Tasks

- [x] **T01: Add boundary tests that fail against the current ungated site** `est:45m`
  - Why: The slice changes a high-risk route boundary; the stop condition needs real assertions before implementation so public-route regressions and protected-proof leaks are caught immediately.
  - Files: `package.json`, `tests/route-boundary.static.test.mjs`, `tests/route-boundary.browser.test.mjs`, `tests/helpers/site-boundary-fixtures.mjs`
  - Do: Set up a lightweight Node test harness using the built-in runner, add a static-artifact test that inspects built HTML for public-vs-protected markers and withheld-proof expectations, add a browser cold-load test that opens public and protected routes from a built site, and make the assertions fail on the current implementation for the right reasons.
  - Verify: `pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`
  - Done when: The boundary test files exist in-repo, document the required markers and locked-shell contract explicitly, and fail against the current full-proof `/domains/*` render.
- [x] **T02: Render a locked shell for protected domain routes while keeping public pages open** `est:1h`
  - Why: This is the real slice behavior — the protected route family must stop shipping proof on cold load without broad shell logic accidentally gating the public site.
  - Files: `src/pages/domains/[slug].astro`, `src/components/domains/DomainPage.astro`, `src/components/domains/DomainGateShell.astro`, `src/components/home/HomePage.astro`, `src/components/personal/PersonalPage.astro`, `src/components/resume/ResumePage.astro`, `src/styles/global.css`
  - Do: Introduce a shared locked-shell component for `/domains/*`, move the protected proof render behind the boundary seam so initial static HTML only includes the gate shell, add explicit public/protected data markers to the relevant page roots, and style the locked state so it fits the shipped retro terminal aesthetic without adding the S02 passcode flow yet.
  - Verify: `pnpm check && pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`
  - Done when: Public pages still render as public, protected domain routes render the real locked shell, initial domain HTML no longer contains flagship/supporting proof blocks, and the T01 boundary tests pass.
- [x] **T03: Wire the boundary into the release gate and CI diagnostics** `est:45m`
  - Why: The slice is not durable until the public/protected split is enforced in the same validation path that protects shipped site behavior.
  - Files: `package.json`, `scripts/validate-m002-s01.mjs`, `.github/workflows/deploy.yml`, `tests/helpers/site-boundary-fixtures.mjs`
  - Do: Add a fast dist-first validator for the route boundary markers and protected-proof withholding contract, expose a stable `pnpm validate:site` chain that includes the new boundary checks alongside the browser test command, and update the Pages workflow so deploys are blocked when the public/protected split regresses.
  - Verify: `pnpm check && pnpm build && pnpm validate:site`
  - Done when: One documented validation path proves the built boundary contract and cold-load browser behavior locally and in CI before any Pages upload.

## Files Likely Touched

- `package.json`
- `tests/route-boundary.static.test.mjs`
- `tests/route-boundary.browser.test.mjs`
- `tests/helpers/site-boundary-fixtures.mjs`
- `src/pages/domains/[slug].astro`
- `src/components/domains/DomainPage.astro`
- `src/components/domains/DomainGateShell.astro`
- `src/components/home/HomePage.astro`
- `src/components/personal/PersonalPage.astro`
- `src/components/resume/ResumePage.astro`
- `src/styles/global.css`
- `scripts/validate-m002-s01.mjs`
- `.github/workflows/deploy.yml`
