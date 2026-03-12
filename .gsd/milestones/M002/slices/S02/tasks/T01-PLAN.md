---
estimated_steps: 4
estimated_files: 4
---

# T01: Add failing unlock-flow and gate-message regression coverage

**Slice:** S02 — Session Unlock Flow and Gate Messaging
**Milestone:** M002

## Description

Define the executable stop condition for S02 before touching the gate behavior. This task extends the shipped boundary coverage so the slice now proves request-access messaging on cold load, proves invalid-passcode attempts stay locked with a visible diagnostic, and proves correct unlocks persist across protected routes for only the current browser session.

## Steps

1. Extend `tests/helpers/site-boundary-fixtures.mjs` with the protected gate selector vocabulary, canonical request-link expectations, test passcode inputs, and route helpers needed for same-context vs fresh-context unlock assertions.
2. Update `tests/route-boundary.static.test.mjs` so protected cold-load artifacts must still withhold proof while also exposing the request-access copy/links and stable gate-form markers required by S02.
3. Create `tests/route-unlock.browser.test.mjs` to cover four real-browser cases: cold locked load with request links visible, wrong passcode stays locked with an explicit error marker, correct passcode unlocks the current route, and a second protected route opens unlocked in the same browser context while a fresh context starts locked again.
4. Update `package.json` with a stable command for the new S02 browser test and keep the assertions written so they fail against the current locked-only implementation for the right reasons.

## Must-Haves

- [ ] The slice gains named regression tests for cold-load gate messaging and warm-session unlock continuity, not just generic browser smoke coverage.
- [ ] The new tests explicitly assert an invalid-passcode failure signal and a fresh-browser-context relock, so R103 and R104 both have executable proof.
- [ ] The tests fail against the current code because the locked shell has no request-access/passcode flow yet and no session unlock behavior.

## Verification

- `pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-unlock.browser.test.mjs`
- Confirm the failures point to missing request links, missing form/status markers, or missing session carryover behavior rather than build or harness setup problems.

## Observability Impact

- Signals added/changed: named assertions for request-access links, invalid-passcode markers, unlocked proof visibility, and new-context relock behavior
- How a future agent inspects this: run `node --test tests/route-boundary.static.test.mjs tests/route-unlock.browser.test.mjs`
- Failure state exposed: the exact protected route and unlock-state clause that regressed

## Inputs

- `tests/helpers/site-boundary-fixtures.mjs` — existing S01 route inventory and cold-load marker contract
- `.gsd/milestones/M002/slices/S02/S02-RESEARCH.md` — required request-access, session continuity, and failure-path behavior for this slice

## Expected Output

- `tests/route-unlock.browser.test.mjs` — failing browser regression coverage for the S02 unlock/session flow
- `tests/route-boundary.static.test.mjs` — failing protected cold-load assertions for request-access messaging and gate-form markers
