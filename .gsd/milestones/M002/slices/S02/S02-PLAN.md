# S02: Session Unlock Flow and Gate Messaging

**Goal:** Turn the shipped locked domain shell into a real access gate with request-access messaging and a session-scoped unlock flow that works across protected routes.
**Demo:** A cold visit to `/domains/*` shows clear DM/email request-access messaging plus a passcode form; a wrong passcode stays locked with an explicit error state; a correct passcode unlocks the current protected page and another `/domains/*` route in the same browser session; a fresh browser context starts locked again.

## Must-Haves

- Protected cold loads keep the S01 locked boundary intact while adding clear request-access messaging with canonical email and LinkedIn links in the site’s lowercase tone.
- The gate exposes a real passcode form with stable success/error markers, and an invalid passcode attempt stays locked while surfacing a deterministic failure signal.
- A correct passcode unlocks the current protected route, persists for the current browser session via a versioned session marker, and carries across protected-route navigation without re-entry.
- `validate:site` proves both the cold-load gate contract and the warm-session unlock continuity without regressing the public/protected route boundary.

## Proof Level

- This slice proves: operational
- Real runtime required: yes
- Human/UAT required: no

## Verification

- `pnpm check && pnpm build`
- `node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs tests/route-unlock.browser.test.mjs`
- `pnpm validate:site`

## Observability / Diagnostics

- Runtime signals: stable protected gate markers plus explicit unlock-state markers such as form status, invalid-passcode state, proof mount state, and a versioned session unlock key that can be inspected without exposing the passcode.
- Inspection surfaces: built-artifact assertions for locked-shell messaging, browser unlock regression coverage, `sessionStorage` state on protected routes, and the aggregate `pnpm validate:site` release gate.
- Failure visibility: wrong-passcode attempts expose a deterministic locked/error marker, missing warm-session continuity fails route-specific browser assertions, and release validation names whether copy/links, unlock state, or route carryover regressed.
- Redaction constraints: never log or render the raw passcode; only the public hash/config marker, non-secret state markers, and generic invalid-passcode diagnostics may be exposed.

## Integration Closure

- Upstream surfaces consumed: `src/components/domains/DomainPage.astro`, `src/components/domains/DomainGateShell.astro`, `src/pages/domains/[slug].astro`, `src/data/home.ts`, `src/data/resume.ts`, `tests/helpers/site-boundary-fixtures.mjs`, `package.json`
- New wiring introduced in this slice: the protected gate shell becomes an interactive unlock surface, `DomainPage` gains a shared client-renderable unlocked proof path, browser session state gates protected-route revisits, and `validate:site` adds warm-session unlock coverage alongside the existing boundary checks.
- What remains before the milestone is truly usable end-to-end: S03 still needs to obscure protected visuals before unlock and reveal them cleanly after unlock, and S04 still needs final assembled regression/UAT coverage for the full milestone.

## Tasks

- [x] **T01: Add failing unlock-flow and gate-message regression coverage** `est:45m`
  - Why: S02 changes a stateful browser flow, so the slice needs executable proof for cold-load messaging, invalid-passcode behavior, session persistence, and fresh-session reset before implementation starts.
  - Files: `tests/route-boundary.static.test.mjs`, `tests/route-unlock.browser.test.mjs`, `tests/helpers/site-boundary-fixtures.mjs`, `package.json`
  - Do: Extend the shared boundary fixtures with protected-route gate selectors, request-link expectations, and the non-secret unlock-state marker vocabulary; add or extend static assertions for cold-load request-access messaging while keeping proof withheld; create a new browser regression test that covers wrong-passcode failure, correct-passcode unlock, same-context protected-route carryover, and new-context relock; wire the new test into a stable command and keep the assertions written so they fail against the current locked-only shell.
  - Verify: `pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-unlock.browser.test.mjs`
  - Done when: The new static/browser S02 tests exist in-repo, document the required gate copy/link/state contract explicitly, and fail on the current implementation for missing request-access and unlock continuity behavior rather than harness issues.
- [x] **T02: Ship the interactive gate shell and session-scoped unlock path** `est:1h30m`
  - Why: This is the real user-facing slice behavior — the gate needs actual request-access UI, a passcode form, a reusable unlocked proof render path, and session continuity across protected routes without leaking proof into cold-load HTML.
  - Files: `src/components/domains/DomainGateShell.astro`, `src/components/domains/DomainPage.astro`, `src/components/domains/domain-gate-client.ts`, `src/components/domains/domain-proof-view.ts`, `src/data/domains/domain-view-model.ts`, `src/env.d.ts`, `src/styles/global.css`
  - Do: Extract a normalized domain proof view-model that both Astro and the browser unlock path can consume, upgrade the gate shell with canonical email/LinkedIn request links and stable form/status markers, implement a client controller that checks an entered passcode against a build-time public hash and writes a versioned `sessionStorage` unlock marker, reopen protected routes from that session state on navigation, and mount the unlocked proof view only after a successful or already-present session unlock while preserving the S01 cold-load boundary markers.
  - Verify: `pnpm check && pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs tests/route-unlock.browser.test.mjs`
  - Done when: Cold protected routes still ship only the locked shell plus request-access UI, wrong passcodes stay locked with an explicit error signal, correct passcodes reveal the current route proof, and a second protected route opens in the same browser context without another prompt while a new context stays locked.
- [x] **T03: Wire S02 into release validation and unlock diagnostics** `est:45m`
  - Why: The slice is not durable until the new gate-message and warm-session behavior are enforced in the same validation path that protects deploys.
  - Files: `scripts/validate-m002-s02.mjs`, `package.json`, `.github/workflows/deploy.yml`, `tests/helpers/site-boundary-fixtures.mjs`
  - Do: Add a fast dist validator for S02’s locked-shell messaging and unlock-config markers, expose a stable command chain that runs the S01 boundary checks plus the new browser unlock coverage, keep validator/test failure output route-specific and state-specific, and update the deploy workflow so Pages uploads stay blocked when the request-access or session-unlock contract regresses.
  - Verify: `pnpm check && pnpm build && pnpm validate:site`
  - Done when: One documented validation path proves the protected cold-load shell, request-access messaging, wrong-passcode diagnostics, and same-session unlock continuity locally and in CI before deploy.

## Files Likely Touched

- `tests/route-boundary.static.test.mjs`
- `tests/route-unlock.browser.test.mjs`
- `tests/helpers/site-boundary-fixtures.mjs`
- `package.json`
- `src/components/domains/DomainGateShell.astro`
- `src/components/domains/DomainPage.astro`
- `src/components/domains/domain-gate-client.ts`
- `src/components/domains/domain-proof-view.ts`
- `src/data/domains/domain-view-model.ts`
- `src/env.d.ts`
- `src/styles/global.css`
- `scripts/validate-m002-s02.mjs`
- `.github/workflows/deploy.yml`
