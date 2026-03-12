---
id: T03
parent: S02
milestone: M002
provides:
  - Aggregate release-gate validation that proves both S01 boundary contract and S02 gate-messaging/unlock-continuity before deploy
  - Fast dist-first validator for S02 locked-shell contract (request-access links, gate UI markers, proof withheld)
key_files:
  - scripts/validate-m002-s02.mjs
  - package.json
key_decisions:
  - No workflow file changes needed — the existing deploy.yml already runs `pnpm validate:site` before artifact upload, so wiring S02 into `validate:site` in package.json is sufficient
patterns_established:
  - Each slice gets its own validator script (`validate-m002-sNN.mjs`) that reuses shared fixture vocabulary; `validate:site` chains them all
observability_surfaces:
  - `pnpm validate:site` — aggregate release gate with route-specific, state-specific failure output
  - `node scripts/validate-m002-s02.mjs` — fast S02-only dist validator naming which marker/link/copy is missing per route
duration: quick
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T03: Wire S02 into release validation and unlock diagnostics

**Added fast dist validator for S02 gate-messaging contract and wired S02 checks into the aggregate `validate:site` release gate.**

## What Happened

Created `scripts/validate-m002-s02.mjs` that inspects built protected-route HTML for the S02 locked-shell contract: request-access copy and canonical links present, gate-form UI markers present, locked-state boundary markers intact, and proof still withheld. The validator reuses `getProtectedRequestAccessIssues`, `protectedBoundaryHtmlSnippets`, and `protectedGateUiHtmlSnippets` from the shared fixture module.

Updated `package.json` to add `validate:m002:s02` (fast validator + browser unlock regression suite) and chain it into `validate:site` after the existing S01 checks. Since the deploy workflow already runs `pnpm validate:site` before `actions/upload-pages-artifact`, no `.github/workflows/deploy.yml` changes were needed — S02 regressions now block deploy automatically.

## Verification

- `pnpm check` — 0 errors, 0 warnings
- `pnpm build` — 10 pages built successfully
- `pnpm validate:site` — all checks pass:
  - S01 fast validator: 3 public + 3 protected routes pass
  - S01 browser boundary: 9/9 tests pass
  - S02 fast validator: 3 protected routes pass
  - S02 browser unlock: 4/4 tests pass (request-access links, invalid passcode error, correct passcode unlock, cross-route carryover + fresh-context relock)
- Slice-level: `node --test tests/route-boundary.static.test.mjs` — 12/12 pass
- Workflow inspection: `deploy.yml` runs `pnpm validate:site` before `upload-pages-artifact` — confirmed no changes needed

## Diagnostics

- Run `pnpm validate:site` locally to exercise the full release gate
- Run `node scripts/validate-m002-s02.mjs` for fast S02-only validation — failures name the specific route, marker, link, or copy that regressed
- Run `pnpm test:route-unlock:browser` for focused warm-session unlock regression
- CI surfaces per-route, per-marker failures in build logs before blocking deploy

## Deviations

Step 4 (update deploy.yml) was a no-op — the workflow already runs `pnpm validate:site`. Wiring S02 into `validate:site` via package.json was sufficient.

## Known Issues

None.

## Files Created/Modified

- `scripts/validate-m002-s02.mjs` — fast dist-first validator for S02 gate-messaging and locked-shell contract
- `package.json` — added `validate:m002:s02` command and updated `validate:site` to chain S01 + S02 checks
