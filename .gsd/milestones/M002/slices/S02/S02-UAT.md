# S02: Session Unlock Flow and Gate Messaging — UAT

**Milestone:** M002
**Written:** 2026-03-12

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: S02 is a stateful browser flow (passcode entry, session persistence, cross-route carryover) that cannot be validated from static artifacts alone. The automated browser tests exercise the real unlock flow end-to-end including fresh-context relock, which covers the operational proof level required by this slice. No human-experience UAT is needed because the gate copy and tone can be verified from built artifacts and the visual treatment is deferred to S03.

## Preconditions

- `pnpm build` has completed successfully (10 pages built)
- A local preview server is available (the browser tests use Astro's preview server on port 4321)
- `PUBLIC_GATE_HASH` is set in the build environment

## Smoke Test

Run `pnpm validate:site` — all S01 boundary + S02 gate-messaging and unlock checks pass in one command.

## Test Cases

### 1. Cold-load protected route shows request-access messaging

1. Open `/domains/product/` in a fresh browser context (no prior unlock)
2. **Expected:** Page renders in locked state with `data-gate-state="locked"`, shows request-access panel with canonical email link and LinkedIn link, exposes passcode form with input and submit button, and does not render any proof content.

### 2. Invalid passcode stays locked with error

1. From the locked gate on `/domains/product/`, enter an incorrect passcode
2. Click submit
3. **Expected:** Gate stays locked (`data-gate-state="locked"`), status shows `data-gate-status="error"` with "invalid passcode" text, proof remains withheld (`data-protected-proof-state="withheld"`).

### 3. Correct passcode unlocks the current route

1. From the locked gate on `/domains/product/`, enter the correct passcode
2. Click submit
3. **Expected:** Gate transitions to open (`data-gate-state="open"`), status shows `data-gate-status="unlocked"`, proof content is mounted (`data-protected-proof-state="mounted"`), and `sessionStorage`/`localStorage` contain the `portfolio-gate:v1` marker.

### 4. Unlock carries to another protected route in the same browser session

1. After unlocking `/domains/product/` in step 3, navigate to `/domains/analytics-ai/` in the same browser context
2. **Expected:** The second protected route auto-unlocks without another passcode prompt — gate state is open, proof is mounted.

### 5. Fresh browser context starts locked

1. Open a new incognito/browser context (empty storage)
2. Navigate to `/domains/product/`
3. **Expected:** The page is locked — gate state locked, request-access messaging visible, no proof rendered.

## Edge Cases

### Wrong passcode followed by correct passcode

1. Enter an incorrect passcode and see the error state
2. Enter the correct passcode
3. **Expected:** Gate unlocks normally — the previous error does not prevent a successful unlock.

### Public routes unaffected by gate state

1. While in a locked or unlocked session, navigate to `/`, `/about/`, or `/resume/`
2. **Expected:** Public routes render normally with `data-route-visibility="public"`, no gate UI visible.

## Failure Signals

- `pnpm validate:site` fails — indicates a regression in cold-load contract or warm-session unlock
- `data-gate-state` remains `locked` after entering the correct passcode — client controller or hash validation broken
- Request-access links missing from cold-load HTML — gate shell template or contact data wiring broken
- `data-gate-status` does not show `error` after wrong passcode — error path in client controller broken
- Second protected route requires re-entry — sessionStorage/localStorage cross-tab bridge broken

## Requirements Proved By This UAT

- R103 — Protected routes explain how to request access: cold-load request-access messaging with canonical email and LinkedIn links is verified by both static assertions and browser tests
- R104 — Unlock persists for the current browser session across protected routes: cross-route carryover, correct/incorrect passcode behavior, and fresh-context relock are all proven by the browser unlock test suite
- R102 (partially) — Domain portfolio pages require a passcode: the gate form and hash-validated unlock flow are proven; full visual protection is deferred to S03

## Not Proven By This UAT

- R105 — Protected visuals are obscured until unlock: visual blur/reveal behavior is not implemented or tested until S03
- R102 (complete) — The visual protection component of the gate is incomplete until S03 adds image obscuring
- Human-experience tone check — the gate copy uses the site's lowercase voice and is verified for content/links, but whether it "feels right" to a real visitor is a judgment call not covered by automated tests

## Notes for Tester

- The passcode for testing is defined by `PUBLIC_GATE_HASH` in the build environment. The browser tests in `tests/route-unlock.browser.test.mjs` use the expected test passcode from the shared fixture module.
- The gate styling uses the retro terminal aesthetic. Visual polish is present but visual protection (blur/obscure of images) is explicitly not part of this slice.
- The localStorage cross-tab bridge means a standard (non-incognito) browser window that was previously unlocked will auto-unlock on return. Use incognito or clear localStorage to test the locked state.
