# S04: Verification and Regression Gate — Research

**Date:** 2026-03-12

## Summary

S04 is the final assembly slice for M002. Its job is to prove the full locked→unlocked flow end-to-end in browser verification, ensure all five milestone success criteria are covered by regression tests, and validate R102 (the last active requirement) so it can move to validated. The existing infrastructure is substantial — 17 browser tests, 3 dist validators, and a deploy-gated `validate:site` chain — so S04's work is primarily gap-filling, not green-field test authoring.

The main gaps are: (1) no single end-to-end test exercises the full visitor journey (cold lock → wrong passcode → correct unlock → visual reveal → cross-route navigation with revealed state) in one continuous flow; (2) the protected route fixture inventory covers only 3 of 3 domain slugs, which is complete, but no test exercises *all* three routes in a single cross-route sweep; (3) notes routes (`/notes/*`) are unprotected but no regression test explicitly asserts they stay gate-free; (4) R102 is still "active" and needs its validation proof completed so it can move to "validated" and close the milestone.

## Recommendation

Build a small number of focused additions rather than rewriting existing coverage:

1. **One end-to-end assembled flow test** that exercises the full visitor journey across the real locked→error→unlock→reveal→cross-route sequence in a single browser context, covering all milestone success criteria in one pass.
2. **A regression guard for notes routes** — a lightweight static or browser assertion that `/notes/*` pages don't carry gate markers, preventing future scope creep from accidentally gating non-domain pages.
3. **A final S04 dist validator** (optional, low-value — existing S01–S03 validators may be sufficient) or simply extend `validate:site` with the new browser tests.
4. **Requirements bookkeeping** — move R102 to validated once the assembled flow test passes.

No new technology or framework is needed. The existing Puppeteer + Node test runner + shared fixture pattern is the right tool for all S04 work.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Browser test infrastructure | `tests/helpers/site-boundary-fixtures.mjs` + Puppeteer | Already has route inventories, server setup, DOM snapshot helpers, unlock helpers, and shared selectors |
| Dist artifact validation | `scripts/validate-m002-s0{1,2,3}.mjs` | Reuse the existing issue-collection + exit-code pattern |
| Release gate chain | `pnpm validate:site` in `package.json` | Already chains S01→S02→S03 and is wired into the deploy workflow |
| DOM contract vocabulary | `protectedBoundarySelectors`, `visualStateSelectors`, `screenshotGallerySelectors` in fixtures | Single source of truth for all marker names |

## Existing Code and Patterns

- `tests/helpers/site-boundary-fixtures.mjs` — Central fixture module with route inventories, DOM selectors, snapshot helpers, and a built-site static server. All S04 tests should import from here.
- `tests/route-boundary.browser.test.mjs` (120 lines) — Cold-load browser tests for public/protected boundary. 9 tests covering 3 public + 3 protected routes.
- `tests/route-unlock.browser.test.mjs` (211 lines) — Warm-session unlock tests. 4 tests: cold-lock, wrong-passcode error, correct-unlock, cross-tab carryover + fresh relock.
- `tests/visual-reveal.browser.test.mjs` (182 lines) — Visual reveal tests. 4 tests: cold-load no markers, post-unlock revealed state, gallery JS init, public route isolation.
- `tests/route-boundary.static.test.mjs` (35 lines) — Built-artifact assertions. 12 tests via shared fixture helpers.
- `scripts/validate-m002-s0{1,2,3}.mjs` — Fast dist validators checking built HTML for contract compliance.
- `package.json` `validate:site` script — Chains all validators and browser tests; already runs in CI before deploy.
- `.github/workflows/deploy.yml` — Runs `pnpm validate:site` before artifact upload. No changes needed for S04.

### Key pattern to follow
Each slice adds: (1) a browser test file, (2) optionally a dist validator script, (3) a `validate:m002:sNN` package.json script, and (4) wires into `validate:site`. S04 should follow this same pattern.

### Key pattern to avoid
Don't duplicate unlock/snapshot logic already in the fixture helpers — extend the existing helpers if needed.

## Constraints

- **All tests use Puppeteer headless** with `--no-sandbox --disable-setuid-sandbox` launch args. S04 tests must match.
- **The test runner is Node's built-in `node:test`** — no Jest, no Vitest. Tests use `test()`, `before()`, `after()` from `node:test` and `assert` from `node:assert/strict`.
- **Browser tests require `pnpm build` first** — they serve from `dist/` via the shared static server.
- **The valid test passcode is `unlockTestInputs.validPasscode`** (`"correct-session-passcode"`) — the build bakes `PUBLIC_GATE_HASH` at build time.
- **Protected route inventory is exactly 3 routes** (product, analytics-ai, developer-experience). All 3 are in the fixture already.
- **Notes routes (`/notes/*`, `/notes/keep-the-path-explicit/`, `/notes/systems-over-abstractions/`) are explicitly out of protection scope** (R303) but have no regression test proving it.

## Common Pitfalls

- **Proof-label text in locked copy trips leak detection** — The S01 proof-leak contract treats phrases like "flagship highlights" and "supporting work" as evidence of leaked proof. Any new locked-state copy must avoid these phrases. (From S01 Forward Intelligence.)
- **`sessionStorage` is per-tab, not per-session** — Cross-route carryover relies on the localStorage bridge. Tests using `browser.createBrowserContext()` get isolated storage, which is correct for relock testing but means cross-tab tests need to stay in the same context. (From S02 Forward Intelligence.)
- **Gallery JS depends on `astro:page-load` dispatch** — If the visual-reveal test checks gallery initialization, it must wait for the revealed state first. The existing `visual-reveal.browser.test.mjs` already does this correctly. (From S03 Forward Intelligence.)
- **Frame separation timing** — The `requestAnimationFrame` + `setTimeout(50)` reveal trick means tests should `waitForSelector` on `data-visual-state="revealed"` rather than checking immediately after unlock.

## Open Risks

- **Assembled flow test could be flaky due to timing** — The end-to-end test chains multiple unlock + navigation + visual-reveal waits. Mitigation: use explicit `waitForSelector` on each state marker rather than `waitForNetworkIdle` alone.
- **Notes route inventory is hardcoded in `dist/`** — If note slugs change, a static notes-isolation test would need updating. Mitigation: glob `dist/notes/*/index.html` dynamically in the test.
- **No test currently checks all 3 protected routes in a single unlocked session sweep** — If one domain route has a rendering bug post-unlock, only the primary route's tests catch it. The assembled flow test should visit at least 2 protected routes after unlock.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `frontend-design` | installed (available skill, covers web UI) |
| Puppeteer | — | none found (not needed — existing test infra is sufficient) |
| Node test runner | — | none found (not needed — pattern is established) |

No external skills are needed for S04. The work is entirely within the existing Node + Puppeteer + shared fixture test infrastructure.

## Sources

- Existing test files and validators in the repository (primary source for all findings)
- S01, S02, S03 summary forward intelligence sections (inlined in context above)
