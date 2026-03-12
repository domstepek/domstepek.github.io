---
id: S01
parent: M002
milestone: M002
provides:
  - Public routes stay explicitly open while cold-load `/domains/*` routes render a locked shell that withholds protected proof from initial HTML.
requires: []
affects:
  - S02
  - S04
key_files:
  - src/components/domains/DomainGateShell.astro
  - src/components/domains/DomainPage.astro
  - src/pages/domains/[slug].astro
  - tests/helpers/site-boundary-fixtures.mjs
  - tests/route-boundary.static.test.mjs
  - tests/route-boundary.browser.test.mjs
  - scripts/validate-m002-s01.mjs
  - package.json
  - .github/workflows/deploy.yml
  - .gsd/REQUIREMENTS.md
key_decisions:
  - D014 proves the route boundary with both built-artifact assertions and a real browser cold-load test before deploy.
  - D015 locks the protected cold-load marker contract to `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, and `data-protected-proof-state="withheld"`.
  - D016 keeps `/domains/[slug]` routed through `DomainPage` with an explicit `gateState` seam so later unlock work can reuse the same render path.
patterns_established:
  - Public and protected route renders expose explicit DOM markers so dist validators, browser tests, and later unlock-state checks share one contract.
  - Dist validators and tests reuse the same shared boundary fixtures so release-gate logic cannot drift from regression coverage.
  - Protected domain entrypoints render through one gate-aware component seam instead of duplicating locked-shell markup per route.
observability_surfaces:
  - pnpm validate:route-boundary
  - node --test tests/route-boundary.static.test.mjs
  - node --test tests/route-boundary.browser.test.mjs
  - pnpm validate:site
  - GitHub Actions `Validate site release gate` step in `.github/workflows/deploy.yml`
drill_down_paths:
  - .gsd/milestones/M002/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S01/tasks/T03-SUMMARY.md
duration: 2h30m
verification_result: passed
completed_at: 2026-03-12T09:15:00-04:00
---

# S01: Public vs Protected Route Boundary

**Shipped a real protected-route boundary: `/`, `/about/`, and `/resume/` stay openly accessible, while cold-load `/domains/*` routes now render a retro locked shell and withhold portfolio proof from initial HTML.**

## What Happened

S01 started by defining the route-boundary contract in failing tests before touching the site. The slice added one shared fixture module with the public/protected route inventory, built-HTML helpers, and a tiny static server so both artifact checks and browser smoke tests use the same expectations.

With the contract in place, the domain route family was moved behind a shared gate-aware render seam. `/domains/[slug]` now enters through `DomainPage` with `gateState="locked"`, which renders the new `DomainGateShell` instead of shipping flagship and supporting proof into the cold-load HTML. The locked shell matches the existing retro terminal feel and exposes stable protected markers for downstream verification and future unlock work.

On the public side, the actual page roots for `/`, `/about/`, and `/resume/` now declare `data-route-visibility="public"` and `data-gate-state="open"`. That makes the public/protected split explicit rather than inferred from copy or layout.

The slice closed by wiring the boundary into the same release path that protects deploys. A fast dist validator now checks public openness and protected proof withholding from `dist/`, `pnpm validate:site` runs both the artifact validator and real browser cold-load smoke test, and the Pages workflow blocks artifact upload if that aggregate gate fails.

## Verification

Passed all slice-level verification from the plan:

- `pnpm check && pnpm build`
- `node --test tests/route-boundary.static.test.mjs`
- `node --test tests/route-boundary.browser.test.mjs`
- `pnpm validate:site`

Additional confirmation gathered during execution:

- Built protected artifacts in `dist/domains/*/index.html` contain the locked markers and omit proof-section markers.
- Real browser cold-load checks proved public routes do not show the protected gate shell and protected routes do show the locked shell with no leaked proof nodes.
- The release validator reports route-specific failures, so regressions are externally visible in local runs and CI logs instead of hiding behind a generic build failure.

## Requirements Advanced

- R102 — Cold-load `/domains/*` routes now render a real gate state and withhold protected proof from shipped HTML, establishing the protected boundary that S02 will connect to passcode entry.

## Requirements Validated

- R101 — Proven by dist checks, browser cold-load verification, and deploy-gated validation that `/`, `/about/`, and `/resume/` remain directly accessible without the protected shell.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

None.

## Known Limitations

- The locked shell does not yet include the passcode entry flow or request-access messaging; that belongs to S02.
- Unlock persistence across protected routes is not implemented yet.
- Protected visuals are withheld entirely on cold load in this slice; the blurred/obscured reveal behavior is still deferred to S03.

## Follow-ups

- Implement the passcode form, request-access copy, and session-scoped unlock state on top of the existing `DomainPage` gate seam in S02.
- Add locked visual obscuring and unlocked reveal behavior in S03 using the existing boundary markers as stable verification hooks.
- Reuse `pnpm validate:site` in later milestone slices rather than creating a parallel release gate path.

## Files Created/Modified

- `tests/helpers/site-boundary-fixtures.mjs` — centralized route inventories, built-site helpers, and shared boundary issue collection.
- `tests/route-boundary.static.test.mjs` — added built-artifact assertions for public openness and protected proof withholding.
- `tests/route-boundary.browser.test.mjs` — added real-browser cold-load regression coverage for public and protected routes.
- `src/components/domains/DomainGateShell.astro` — added the shipped locked-shell UI for protected domain routes.
- `src/components/domains/DomainPage.astro` — introduced the explicit gate-state seam shared by locked and future unlocked renders.
- `src/pages/domains/[slug].astro` — switched protected route entrypoints to cold-render the locked shell path.
- `src/components/home/HomePage.astro` — marked the homepage root as explicitly public/open.
- `src/components/personal/PersonalPage.astro` — marked the about page root as explicitly public/open.
- `src/components/resume/ResumePage.astro` — marked the resume page root as explicitly public/open.
- `src/styles/global.css` — styled the locked shell to match the site’s retro terminal visual system.
- `scripts/validate-m002-s01.mjs` — added the fast dist-first validator for the route-boundary contract.
- `package.json` — exposed the stable route-boundary and aggregate release-gate commands.
- `.github/workflows/deploy.yml` — enforced `pnpm validate:site` before Pages artifact upload.
- `.gsd/REQUIREMENTS.md` — moved R101 to validated based on the executed S01 proof.

## Forward Intelligence

### What the next slice should know
- `DomainPage` already has the correct seam for S02: keep the route entrypoint stable and swap the locked shell to an unlocked render based on session state rather than creating a second route path.
- The browser and dist validators already know how to distinguish public vs protected cold loads; extend those existing checks instead of inventing new route-boundary fixtures.
- Avoid reusing forbidden proof-label text like `flagship highlights` or `supporting proof` inside locked-state copy because the current proof-leak tests treat those phrases as evidence that protected content escaped.

### What's fragile
- Protected-route copy that repeats proof-section labels — it can trip the proof-leak contract even if no actual proof data is rendered.
- Any future change to the boundary marker vocabulary — tests, validators, and CI all rely on the current marker contract staying aligned.

### Authoritative diagnostics
- `pnpm validate:site` — this is the authoritative local release gate because it runs both the fast dist validator and the real browser cold-load check.
- `node --test tests/route-boundary.browser.test.mjs` — use this first when a regression looks runtime-specific because it names the exact route and whether the failure is a missing gate marker or leaked proof nodes.
- `scripts/validate-m002-s01.mjs` — use this first when a regression looks like shipped HTML drift because it inspects the built artifacts directly.

### What assumptions changed
- "A static validator alone is enough for the route split" — actually the slice needed both built-HTML assertions and a real browser cold-load test to prove the public/protected boundary safely.
- "Locked-shell copy is harmless if it mentions proof sections abstractly" — actually those phrases can look like proof leakage to the contract and need to stay out of locked cold-load markup.
