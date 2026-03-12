---
id: T03
parent: S01
milestone: M002
provides:
  - Added a fast built-HTML boundary validator, a stable `pnpm validate:site` release gate, and pre-upload CI enforcement for the S01 public/protected route split.
key_files:
  - scripts/validate-m002-s01.mjs
  - package.json
  - .github/workflows/deploy.yml
  - tests/helpers/site-boundary-fixtures.mjs
  - tests/route-boundary.static.test.mjs
key_decisions:
  - D014 proves S01 with both built-artifact assertions and a real browser cold-load test, then wires both into `validate:site` before deploy.
patterns_established:
  - Dist validators should reuse shared route inventories and marker expectations from test fixtures so release-gate logic and regression tests cannot drift.
  - The Pages pipeline should run the same local aggregate validation command before `actions/upload-pages-artifact` so deploy behavior matches local release checks.
observability_surfaces:
  - `pnpm validate:route-boundary`
  - `pnpm test:route-boundary:browser`
  - `pnpm validate:site`
  - GitHub Actions `Validate site release gate` step in `.github/workflows/deploy.yml`
duration: 45m
verification_result: passed
completed_at: 2026-03-12T13:12:00Z
blocker_discovered: false
---

# T03: Wire the boundary into the release gate and CI diagnostics

**Added a shared dist validator and wired `pnpm validate:site` into local + CI release gating for the S01 route boundary.**

## What Happened

I created `scripts/validate-m002-s01.mjs` as the fast dist-first validator for the slice. It reads built HTML from `dist/`, checks that `/`, `/about/`, and `/resume/` still expose public markers without protected gate markers, and checks that every `/domains/*` route still ships the locked protected markers without any proof snippets in the cold-load artifact. The validator reports route-specific failure messages so CI logs tell a future agent exactly which route or marker regressed.

To keep the contract from drifting, I extended `tests/helpers/site-boundary-fixtures.mjs` with shared public/protected boundary issue collectors. The new validator and the existing static Node test now both call the same route inventory and marker rules instead of duplicating HTML expectations in two places.

I updated `package.json` to expose one stable command per inspection surface: `pnpm validate:route-boundary` for the fast built-artifact validator, `pnpm test:route-boundary:browser` for the real browser cold-load smoke test, and `pnpm validate:site` as the aggregate release gate for this slice.

I then updated `.github/workflows/deploy.yml` so the Pages job runs `pnpm validate:site` immediately after the production build and before `actions/upload-pages-artifact`. That means a public/protected boundary regression now blocks artifact upload instead of silently shipping broken HTML.

## Verification

- Passed: `pnpm check && pnpm build && node --test tests/route-boundary.static.test.mjs && node --test tests/route-boundary.browser.test.mjs && pnpm validate:site`
- Confirmed `pnpm validate:site` runs the fast dist validator first and then the browser cold-load boundary test.
- Confirmed workflow order in `.github/workflows/deploy.yml`: `Validate site release gate` now runs after build and before `Upload Pages artifact`.
- Slice-level checks now all pass:
  - `pnpm check && pnpm build`
  - `node --test tests/route-boundary.static.test.mjs`
  - `node --test tests/route-boundary.browser.test.mjs`
  - `pnpm validate:site`

## Diagnostics

- Run `pnpm validate:route-boundary` for the fast built-HTML contract check. Failures name the exact route and missing/leaked marker.
- Run `pnpm test:route-boundary:browser` for the cold-load browser smoke test against built output.
- Run `pnpm validate:site` for the full local release gate used by CI.
- In CI, inspect the `Validate site release gate` step in `.github/workflows/deploy.yml`; it fails before Pages artifact upload if the route boundary regresses.

## Deviations

- None.

## Known Issues

- None.

## Files Created/Modified

- `scripts/validate-m002-s01.mjs` — added the fast built-artifact validator for the S01 route-boundary contract.
- `package.json` — added stable validator/browser commands and the aggregate `validate:site` release gate.
- `.github/workflows/deploy.yml` — blocks Pages artifact upload on `pnpm validate:site` failure.
- `tests/helpers/site-boundary-fixtures.mjs` — centralized reusable public/protected boundary issue detection for tests and validators.
- `tests/route-boundary.static.test.mjs` — switched the static regression test to reuse the shared boundary issue helpers.
- `.gsd/milestones/M002/slices/S01/S01-PLAN.md` — marked T03 complete.
