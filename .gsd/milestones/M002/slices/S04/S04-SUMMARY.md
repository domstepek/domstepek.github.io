---
id: S04
parent: M002
milestone: M002
provides:
  - End-to-end assembled flow browser test covering cold-lock → wrong-passcode → correct-unlock → visual-reveal → cross-route carryover
  - Notes-route isolation guard proving /notes/* carries no gate markers (R303 boundary)
  - S04 tests wired into validate:site release gate chain (20 tests + 3 dist validators)
  - R102 moved from active to validated with comprehensive proof references
  - Zero active requirements remaining in M002
requires:
  - slice: S01
    provides: public/protected route split invariants and DOM marker contracts
  - slice: S02
    provides: session unlock contract and gate messaging
  - slice: S03
    provides: protected-visual blur/reveal behavior and data-visual-state markers
affects: []
key_files:
  - tests/assembled-flow.browser.test.mjs
  - tests/notes-isolation.browser.test.mjs
  - tests/helpers/site-boundary-fixtures.mjs
  - package.json
  - .gsd/REQUIREMENTS.md
key_decisions:
  - "D022: S04 verification strategy — assembled flow test + notes isolation guard wired into validate:site"
patterns_established:
  - "Single assembled flow browser test pattern covering the full visitor journey end-to-end in one continuous Puppeteer context"
  - "Dist-file glob guard pattern for scope boundary regression (notes isolation)"
observability_surfaces:
  - "`pnpm validate:site` is the single authoritative release gate covering all M002 slices (S01→S02→S03→S04, 20 tests + 3 dist validators)"
  - "`pnpm validate:m002:s04` is the focused S04-only gate for the assembled flow and notes isolation tests"
drill_down_paths:
  - .gsd/milestones/M002/slices/S04/tasks/T02-SUMMARY.md
duration: 30m
verification_result: passed
completed_at: 2026-03-12
---

# S04: Verification and Regression Gate

**Browser and validation coverage proves the full locked→unlocked flow end-to-end and protects the public-route boundary from regressions, completing M002.**

## What Happened

Created two new test files to close the remaining coverage gaps identified in slice planning.

The **assembled flow browser test** (`tests/assembled-flow.browser.test.mjs`) exercises the complete visitor journey in one continuous Puppeteer context: cold-load a protected domain route → verify locked state with gate markers → submit a wrong passcode → verify error state persists → submit the correct passcode → verify unlock and visual reveal (`data-visual-state="revealed"`) → navigate to a second protected route → verify unlock and revealed state carry across routes. This single test proves all five milestone success criteria in one assembled journey.

The **notes isolation guard** (`tests/notes-isolation.browser.test.mjs`) globs `dist/notes/*/index.html` and asserts none contain protected gate markers (`data-route-visibility`, `data-gate-state`, `data-protected-gate`, etc.), providing regression coverage for the R303 scope boundary that notes remain outside the protected-route scope.

Both tests were wired into `package.json` as `test:assembled-flow:browser` and `test:notes-isolation:browser`, chained into `validate:m002:s04`, and the `validate:site` release gate was extended to include S04 after S03.

R102 was moved from Active to Validated in `REQUIREMENTS.md` with proof references citing the assembled flow test, 17 S01–S03 browser tests, 3 dist validators, and the full `validate:site` gate. All 12 tracked requirements are now validated; zero remain active.

## Verification

- `pnpm validate:site` — full S01→S02→S03→S04 chain passed (20/20 tests, 3/3 dist validators)
- `node --test tests/assembled-flow.browser.test.mjs` — assembled flow journey passed
- `node --test tests/notes-isolation.browser.test.mjs` — 2 notes routes confirmed gate-free
- All 17 existing S01–S03 browser tests still pass (no regressions)

## Requirements Advanced

- None — all requirements that S04 supports were already at validated status from S01–S03 work; S04 adds regression coverage depth.

## Requirements Validated

- R102 — Moved from active to validated. The assembled flow browser test proves the full cold-lock → wrong-passcode → correct-unlock → visual-reveal → cross-route journey. Combined with 17 S01–S03 tests, 3 dist validators, and the `validate:site` gate, R102 has comprehensive regression coverage.

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

None.

## Known Limitations

- The assembled flow test exercises 2 of 3 protected domain routes for cross-route carryover; a third route is covered by S01–S02 individual tests but not by the assembled journey.
- Notes isolation guard checks built HTML only — it does not verify notes routes in a live browser (sufficient since notes have no client-side gate logic to test).

## Follow-ups

- None — S04 is the final slice of M002. All milestone success criteria have explicit regression coverage.

## Files Created/Modified

- `tests/assembled-flow.browser.test.mjs` — end-to-end assembled flow browser test
- `tests/notes-isolation.browser.test.mjs` — notes-route isolation guard
- `tests/helpers/site-boundary-fixtures.mjs` — extended with `getNotesRoutes` and `publicGateHtmlSnippets`
- `package.json` — added S04 test scripts, extended `validate:site` chain
- `.gsd/REQUIREMENTS.md` — R102 moved to validated; traceability and coverage summary updated

## Forward Intelligence

### What the next slice should know
- M002 is complete. The full `validate:site` gate (20 tests + 3 dist validators) covers public/protected route split, unlock flow, visual reveal, session persistence, and scope isolation. Any future milestone touching domain routes or adding new protected surfaces should run `pnpm validate:site` as a regression check.

### What's fragile
- The assembled flow test depends on the specific DOM marker contracts (`data-route-visibility`, `data-gate-state`, `data-gate-status`, `data-protected-proof-state`, `data-visual-state`). Changing marker names requires updating both the rendering components and the test fixtures in `tests/helpers/site-boundary-fixtures.mjs`.

### Authoritative diagnostics
- `pnpm validate:site` — the single release gate; if it passes, the full M002 contract holds. If it fails, the named test case identifies the exact route and missing selector.

### What assumptions changed
- No assumptions changed during S04 — the slice executed as planned with no blockers or surprises.
