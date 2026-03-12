---
estimated_steps: 5
estimated_files: 3
---

# T01: Add assembled flow browser test and notes isolation guard

**Slice:** S04 — Verification and Regression Gate
**Milestone:** M002

## Description

Create two new browser test files that close the two coverage gaps identified in S04 research: (1) an end-to-end assembled flow test exercising the full visitor journey in one continuous browser context, and (2) a notes-route isolation guard proving `/notes/*` pages don't carry gate markers. Both tests use the existing Puppeteer + `node:test` + shared fixture infrastructure.

## Steps

1. Extend `tests/helpers/site-boundary-fixtures.mjs` with a `notesRoutes` array by dynamically globbing `dist/notes/*/index.html` at import time (or providing the known routes as a static inventory with a note to keep in sync). Add any additional helper exports needed for the assembled flow (e.g. a combined gate+visual selector set for the end-to-end journey).

2. Create `tests/notes-isolation.browser.test.mjs` — a static test (no browser needed, reads built HTML) that iterates over all notes routes in `dist/notes/*/index.html` and asserts none contain protected-gate markers (`data-protected-gate`, `data-gate-state="locked"`, `data-route-visibility="protected"`, `data-gate-form`). Use the `publicGateHtmlSnippets` from shared fixtures for the marker list.

3. Create `tests/assembled-flow.browser.test.mjs` — a browser test with one continuous Puppeteer context that exercises:
   - Cold-load a protected domain route → assert locked state markers (`data-gate-state="locked"`, `data-protected-proof-state="withheld"`, no `data-visual-state`)
   - Submit wrong passcode → assert error state (`data-gate-status="error"`)
   - Submit correct passcode (`unlockTestInputs.validPasscode`) → assert unlock (`data-gate-state="open"`, `data-protected-proof-state="mounted"`)
   - Wait for visual reveal → assert `data-visual-state="revealed"`
   - Navigate to a second protected domain route in the same context → assert it auto-unlocks (cross-route carryover) with `data-gate-state="open"` and `data-visual-state="revealed"`
   - Use `waitForSelector` on each state marker rather than timing-based waits

4. Ensure both tests use `--no-sandbox --disable-setuid-sandbox` Puppeteer launch args and start/stop the shared built-site server via `startBuiltSiteServer()` / `server.close()`.

5. Run both new tests and the full existing test suite to confirm no regressions.

## Must-Haves

- [ ] Assembled flow test exercises cold-lock → wrong-passcode → correct-unlock → visual-reveal → cross-route carryover in one continuous browser context
- [ ] Notes isolation test checks all built notes routes for absence of gate markers
- [ ] Both tests follow existing Puppeteer + `node:test` conventions (launch args, shared server, `assert` from `node:assert/strict`)
- [ ] Existing S01–S03 tests still pass

## Verification

- `pnpm build && node --test tests/assembled-flow.browser.test.mjs` — assembled flow passes
- `node --test tests/notes-isolation.browser.test.mjs` — notes isolation passes
- `node --test tests/route-boundary.browser.test.mjs && node --test tests/route-unlock.browser.test.mjs && node --test tests/visual-reveal.browser.test.mjs` — existing tests unbroken

## Observability Impact

- Signals added/changed: Two new named test suites with route-specific assertion messages; failures identify exact route + missing DOM marker
- How a future agent inspects this: Run individual test files to isolate failures; test names describe the exact journey step that failed
- Failure state exposed: Node test runner names the failing test case and includes the assertion message with the expected selector/marker

## Inputs

- `tests/helpers/site-boundary-fixtures.mjs` — all existing route inventories, selectors, unlock inputs, and shared server
- `tests/route-unlock.browser.test.mjs` — reference for Puppeteer unlock flow pattern (type passcode, click submit, wait for state change)
- `tests/visual-reveal.browser.test.mjs` — reference for visual-state waitForSelector pattern
- `dist/notes/*/index.html` — built notes artifacts to check

## Expected Output

- `tests/assembled-flow.browser.test.mjs` — new end-to-end browser test covering the full visitor journey
- `tests/notes-isolation.browser.test.mjs` — new static test guarding notes routes from gate-marker scope creep
- `tests/helpers/site-boundary-fixtures.mjs` — extended with `notesRoutes` (if needed) and any shared helpers for the assembled flow
