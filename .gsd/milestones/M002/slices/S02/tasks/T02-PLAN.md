---
estimated_steps: 5
estimated_files: 7
---

# T02: Ship the interactive gate shell and session-scoped unlock path

**Slice:** S02 — Session Unlock Flow and Gate Messaging
**Milestone:** M002

## Description

Implement the real S02 product behavior. Protected domain routes keep their cold-load locked shell, but that shell now tells legitimate viewers how to request access, accepts a passcode, validates it against a build-time public hash, persists the unlock for the current browser session, and mounts the unlocked proof view through the existing `DomainPage` seam.

## Steps

1. Extract a reusable normalized domain proof view-model in `src/data/domains/domain-view-model.ts` and a shared browser render helper in `src/components/domains/domain-proof-view.ts` so the unlocked proof path can render from one data shape instead of duplicating domain markup logic.
2. Update `src/components/domains/DomainPage.astro` to preserve the S01 locked cold-load contract while exposing the minimum config and proof payload hooks the browser unlock path needs after the page loads.
3. Upgrade `src/components/domains/DomainGateShell.astro` into the real retro gate UI: canonical email and LinkedIn request-access links, passcode form controls, stable status/error markers, and an empty proof mount region that remains withheld until unlock.
4. Implement `src/components/domains/domain-gate-client.ts` to hash entered passcodes in the browser, compare them to the build-time public hash, write a versioned `sessionStorage` unlock marker, auto-open protected routes in the same session, and keep wrong-passcode attempts visibly locked without exposing the raw passcode.
5. Extend `src/env.d.ts` and `src/styles/global.css` so the new public hash env is typed and the interactive gate/unlocked states look native to the shipped retro-terminal design while the T01 tests are brought to passing.

## Must-Haves

- [ ] Protected cold loads still expose the required locked markers and do not ship flagship/supporting proof markup in initial HTML.
- [ ] The gate shell reuses canonical contact data for request access and exposes deterministic success/error markers for passcode attempts.
- [ ] Correct unlocks persist only for the current browser session across protected routes, and wrong unlocks stay locked with a visible diagnostic state.
- [ ] No raw passcode is embedded in the shipped UI or diagnostics; only the public hash/config and non-secret state markers are surfaced.

## Verification

- `pnpm check && pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs tests/route-unlock.browser.test.mjs`
- Manually inspect one protected route in a browser context during the test run or local smoke check to confirm `sessionStorage` continuity unlocks a second `/domains/*` route without re-entry and a fresh context is locked again.

## Observability Impact

- Signals added/changed: explicit gate-form state markers, invalid-passcode diagnostics, unlocked proof mount state, and a versioned session unlock key
- How a future agent inspects this: inspect protected-route DOM markers in the browser tests or read `sessionStorage` from a protected route while debugging
- Failure state exposed: whether the flow failed due to missing request links, invalid-hash comparison, absent session carryover, or proof mount failure after unlock

## Inputs

- `src/components/domains/DomainPage.astro` — existing locked/open seam from S01 that this task must preserve
- `src/data/home.ts` and `src/data/resume.ts` — canonical contact/outbound values that the gate messaging must reuse instead of inventing new ones

## Expected Output

- `src/components/domains/DomainGateShell.astro` — real request-access and passcode gate UI with stable unlock-state markers
- `src/components/domains/domain-gate-client.ts` — session-scoped unlock controller that mounts protected proof only after successful unlock
