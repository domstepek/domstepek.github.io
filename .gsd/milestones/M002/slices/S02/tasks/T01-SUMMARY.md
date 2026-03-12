---
id: T01
parent: S02
milestone: M002
provides:
  - Failing static and real-browser regression coverage for S02 gate messaging, invalid-passcode handling, same-session unlock carryover, and fresh-context relock.
key_files:
  - tests/helpers/site-boundary-fixtures.mjs
  - tests/route-boundary.static.test.mjs
  - tests/route-unlock.browser.test.mjs
  - package.json
key_decisions:
  - Keep S02 regression coverage separate from the existing S01 release validator for now so T01 can define the stop condition without prematurely changing validate:site.
patterns_established:
  - Centralize protected gate selector vocabulary, canonical request-link expectations, unlock test inputs, and route carryover pairs in the shared boundary fixtures.
observability_surfaces:
  - node --test tests/route-boundary.static.test.mjs tests/route-unlock.browser.test.mjs
  - pnpm test:route-unlock:browser
  - route-specific assertion failures for missing request links, missing gate form markers, and missing session continuity
duration: 45m
verification_result: passed
completed_at: 2026-03-12T13:34:49Z
blocker_discovered: false
---

# T01: Add failing unlock-flow and gate-message regression coverage

**Added failing S02 regression tests that pin the missing request-access UI, unlock-form markers, invalid-passcode diagnostics, and same-session carryover behavior against the current locked-only implementation.**

## What Happened

I extended `tests/helpers/site-boundary-fixtures.mjs` with the protected gate vocabulary needed by S02: request-access selectors, canonical email/LinkedIn href expectations, non-secret unlock inputs, the session storage key name, and a deterministic protected-route carryover pair.

I updated `tests/route-boundary.static.test.mjs` so each protected route now has an explicit cold-load test for request-access messaging and gate-form markers while still keeping the existing proof-withheld assertions.

I created `tests/route-unlock.browser.test.mjs` with four named browser regressions for the primary protected route pair:
- cold load shows request-access links while proof stays locked
- wrong passcode stays locked and should expose an error marker
- correct passcode should unlock the current route
- same browser context should carry unlock to a second protected route while a fresh context relocks

I added `pnpm test:route-unlock:browser` in `package.json` as the stable entrypoint for the new browser coverage.

I also kept the existing S01 validator behavior intact after initially noticing that broadening the shared boundary marker helper would accidentally make `validate:site` fail before T03 wires the slice into release validation. The new S02 failures now live in the explicit new tests instead of silently changing the old validator.

## Verification

- `pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-unlock.browser.test.mjs`
  - Passed for build execution.
  - Failed for the intended reasons: protected routes are missing request-access copy/links and gate-form markers, and browser unlock assertions fail on the absent request-access panel / gate form instead of harness problems.
- `pnpm check && pnpm build`
  - Passed.
- `node --test tests/route-boundary.browser.test.mjs tests/route-unlock.browser.test.mjs`
  - Existing S01 cold-load browser coverage passed.
  - New S02 unlock browser coverage failed for the intended missing gate UI markers.
- `pnpm validate:site`
  - Passed unchanged, which is expected at T01 because T03 owns wiring the new S02 checks into the release gate.

## Diagnostics

Run `node --test tests/route-boundary.static.test.mjs tests/route-unlock.browser.test.mjs` to inspect the current S02 stop condition. Failures are route-specific and call out whether the regression is missing request-access copy, missing canonical request links, missing gate-form/status markers, or missing same-session unlock behavior.

Use `pnpm test:route-unlock:browser` when focusing only on the warm-session unlock path.

## Deviations

None.

## Known Issues

- The shipped gate shell still has no request-access panel, passcode form, or unlock flow, so the new S02 tests fail by design until T02 implements the runtime behavior.

## Files Created/Modified

- `tests/helpers/site-boundary-fixtures.mjs` — added S02 gate selectors, canonical request-link expectations, unlock input values, session key metadata, and protected-route carryover helpers.
- `tests/route-boundary.static.test.mjs` — added failing cold-load request-access and gate-form assertions for protected routes.
- `tests/route-unlock.browser.test.mjs` — added four named real-browser S02 unlock/session regression tests.
- `package.json` — added `test:route-unlock:browser`.
