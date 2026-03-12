# S04: Verification and Regression Gate — UAT

**Milestone:** M002
**Written:** 2026-03-12

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S04 is a verification-only slice — it adds automated test coverage over behavior already shipped in S01–S03. The tests exercise real browser behavior via Puppeteer against the built site. No new UI, copy, or interaction patterns were introduced, so human-experience UAT is not needed. Visual tone UAT was already accepted during S03.

## Preconditions

- Site is built (`pnpm build` has completed successfully)
- `dist/` directory contains all public and protected route HTML
- Node.js and Puppeteer are available

## Smoke Test

Run `pnpm validate:site` — all 20 tests and 3 dist validators pass in under 60 seconds.

## Test Cases

### 1. Assembled flow end-to-end journey

1. Run `node --test tests/assembled-flow.browser.test.mjs`
2. The test cold-loads a protected domain route and verifies locked state markers
3. Submits a wrong passcode and verifies error state
4. Submits the correct passcode and verifies unlock + visual reveal
5. Navigates to a second protected route and verifies carryover
6. **Expected:** 1/1 test passes covering the full lock→error→unlock→reveal→cross-route journey

### 2. Notes isolation guard

1. Run `node --test tests/notes-isolation.browser.test.mjs`
2. The test reads all `dist/notes/*/index.html` files
3. Asserts none contain protected gate markers
4. **Expected:** All notes routes pass (2/2) with no gate marker contamination

### 3. Full release gate chain

1. Run `pnpm validate:site`
2. **Expected:** S01→S02→S03→S04 chain completes — 20/20 tests pass, 3/3 dist validators pass

### 4. Existing test regression check

1. Run `pnpm validate:m002:s01 && pnpm validate:m002:s02 && pnpm validate:m002:s03`
2. **Expected:** All 17 S01–S03 tests still pass with no changes from S04

## Edge Cases

### Notes route with gate-like content

1. If a notes page happens to use words like "protected" or "gate" in prose, the guard should not false-positive
2. **Expected:** The guard checks specific DOM marker strings (`data-route-visibility`, `data-gate-state`, etc.), not prose keywords — no false positives

### Empty notes directory

1. If `dist/notes/` has no subdirectories, the notes isolation test asserts at least one route exists
2. **Expected:** Test fails with a clear message about missing notes routes rather than silently passing

## Failure Signals

- `pnpm validate:site` exits non-zero — identifies which slice gate failed
- Named test case failures include route path and missing selector for precise diagnosis
- Notes isolation failures identify the specific route and marker that leaked

## Requirements Proved By This UAT

- R102 — The assembled flow test proves the complete cold-lock → wrong-passcode → correct-unlock → visual-reveal → cross-route journey, which is R102's core claim
- R101 — The S01 tests in the release gate chain prove public routes stay ungated (regression coverage)
- R103 — The S02 tests in the release gate chain prove gate messaging with contact links
- R104 — The assembled flow test proves cross-route unlock carryover in one continuous context
- R105 — The assembled flow test proves `data-visual-state` reaches `revealed` after unlock
- R303 (out-of-scope boundary) — The notes isolation guard proves notes routes carry no gate markers

## Not Proven By This UAT

- Visual tone and aesthetic quality of the gate experience — accepted during S03 UAT, not re-tested here
- Mobile/responsive layout of gate or unlocked views — not in M002 scope
- Performance characteristics of the unlock flow — not measured
- Behavior under network failures or slow connections — not simulated

## Notes for Tester

- The assembled flow test runs in headless Puppeteer so there's nothing to watch visually — verify by reading test output
- `pnpm validate:site` is the single command that proves everything; individual slice gates exist for focused debugging
- The passcode used in tests is defined in `tests/helpers/site-boundary-fixtures.mjs` — it matches the build-time hash
