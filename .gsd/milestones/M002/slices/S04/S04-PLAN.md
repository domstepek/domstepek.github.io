# S04: Verification and Regression Gate

**Goal:** Browser and validation coverage proves the full locked→unlocked flow end-to-end and protects the public-route boundary from regressions, completing M002.
**Demo:** `pnpm validate:site` passes with the assembled flow test and notes isolation guard included, R102 moves to validated, and all five milestone success criteria have explicit regression coverage.

## Must-Haves

- One end-to-end assembled flow browser test exercising: cold lock → wrong passcode → correct unlock → visual reveal → cross-route navigation with revealed state
- A notes-route isolation guard proving `/notes/*` pages carry no gate markers (regression for R303 scope boundary)
- S04 tests wired into `validate:site` release gate chain
- R102 moved to validated with proof references in `REQUIREMENTS.md`

## Proof Level

- This slice proves: final-assembly
- Real runtime required: yes (Puppeteer browser tests against built site)
- Human/UAT required: no (visual tone UAT was accepted during S03)

## Verification

- `node --test tests/assembled-flow.browser.test.mjs` — end-to-end assembled journey passes
- `node --test tests/notes-isolation.browser.test.mjs` — notes routes confirmed gate-free
- `pnpm validate:site` — full S01+S02+S03+S04 chain passes
- All existing tests still pass (17/17 S01–S03 tests unbroken)

## Observability / Diagnostics

- Runtime signals: Test runner names each assertion with the specific route and state marker being checked; failures identify the exact route + missing selector
- Inspection surfaces: `pnpm validate:site` is the single release gate; `pnpm validate:m002:s04` is the focused S04-only gate
- Failure visibility: Node test runner outputs named test case failures with route context and selector detail
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: all S01–S03 DOM marker contracts (`data-route-visibility`, `data-gate-state`, `data-gate-status`, `data-protected-proof-state`, `data-visual-state`), shared fixtures in `tests/helpers/site-boundary-fixtures.mjs`, existing `validate:site` chain, built `dist/` artifacts
- New wiring introduced in this slice: `validate:m002:s04` script, updated `validate:site` chain to include S04
- What remains before the milestone is truly usable end-to-end: nothing — S04 is the final assembly slice

## Tasks

- [x] **T01: Add assembled flow browser test and notes isolation guard** `est:25m`
  - Why: No single test exercises the full visitor journey, and no test guards notes routes against accidental gating. These are the two coverage gaps identified in research.
  - Files: `tests/assembled-flow.browser.test.mjs`, `tests/notes-isolation.browser.test.mjs`, `tests/helpers/site-boundary-fixtures.mjs`
  - Do: Create the assembled flow test covering cold-lock → wrong-passcode error → correct unlock → visual reveal → cross-route sweep (at least 2 protected routes) in one continuous browser context. Create the notes isolation test that globs `dist/notes/*/index.html` and asserts no gate markers. Extend shared fixtures with `notesRoutes` inventory if needed. All tests use existing Puppeteer + `node:test` patterns from S01–S03.
  - Verify: `pnpm build && node --test tests/assembled-flow.browser.test.mjs && node --test tests/notes-isolation.browser.test.mjs`
  - Done when: Both test files pass against the built site and all existing S01–S03 tests still pass

- [x] **T02: Wire S04 into release gate and validate R102** `est:15m`
  - Why: S04 tests must run as part of the deploy gate, and R102 must move to validated to close the milestone.
  - Files: `package.json`, `.gsd/REQUIREMENTS.md`
  - Do: Add `test:assembled-flow:browser`, `test:notes-isolation:browser`, and `validate:m002:s04` scripts to `package.json`. Update `validate:site` to chain S04 after S03. Move R102 from active to validated in `REQUIREMENTS.md` with proof references to the assembled flow test, existing S01–S03 coverage, and the full `validate:site` gate.
  - Verify: `pnpm validate:site` passes end-to-end including all S04 tests
  - Done when: `pnpm validate:site` includes S04 in its chain, R102 is validated in `REQUIREMENTS.md`, and the full test suite passes

## Files Likely Touched

- `tests/assembled-flow.browser.test.mjs`
- `tests/notes-isolation.browser.test.mjs`
- `tests/helpers/site-boundary-fixtures.mjs`
- `package.json`
- `.gsd/REQUIREMENTS.md`
