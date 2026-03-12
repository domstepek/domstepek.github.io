---
estimated_steps: 4
estimated_files: 4
---

# T03: Wire the boundary into the release gate and CI diagnostics

**Slice:** S01 — Public vs Protected Route Boundary
**Milestone:** M002

## Description

Turn the slice behavior into durable regression coverage. This task adds a fast dist-first validator for the new boundary markers, exposes one stable validation command for local use, and blocks GitHub Pages deploys if the public/protected route split regresses.

## Steps

1. Create `scripts/validate-m002-s01.mjs` to inspect built HTML for the S01 route-boundary contract: public routes stay ungated, protected routes expose locked markers, and protected proof sections are absent from cold-load artifacts.
2. Update `package.json` so the slice has stable commands for the dist validator, browser boundary test, and aggregate `validate:site` release gate.
3. Reuse `tests/helpers/site-boundary-fixtures.mjs` where practical so the validator and tests share the same route inventory and marker expectations instead of drifting.
4. Update `.github/workflows/deploy.yml` so CI runs the aggregate validation path after build and blocks Pages upload when the route boundary fails.

## Must-Haves

- [ ] The route-boundary validator fails clearly when public pages are accidentally gated, protected routes lose locked markers, or protected proof leaks back into initial HTML.
- [ ] `pnpm validate:site` becomes the documented local/CI release gate for this slice and includes the new S01 checks.
- [ ] The Pages workflow runs the same validation path before artifact upload so route-boundary regressions cannot ship silently.

## Verification

- `pnpm check && pnpm build && pnpm validate:site`
- Inspect CI/workflow diff to confirm validation runs before `actions/upload-pages-artifact`.

## Observability Impact

- Signals added/changed: one aggregate validation command plus a dedicated S01 validator with route-specific failure messages
- How a future agent inspects this: run `pnpm validate:site` locally or read the failing validator output in CI logs
- Failure state exposed: the exact route or marker that broke the public/protected contract during release validation

## Inputs

- `tests/helpers/site-boundary-fixtures.mjs` — shared route inventory and marker expectations from T01
- `src/pages/domains/[slug].astro` — protected boundary markup introduced in T02

## Expected Output

- `scripts/validate-m002-s01.mjs` — fast dist-first validator for the S01 route boundary
- `.github/workflows/deploy.yml` — deploy pipeline updated to run the aggregate validation gate before upload
