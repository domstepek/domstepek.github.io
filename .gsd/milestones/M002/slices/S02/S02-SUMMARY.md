---
id: S02
parent: M002
milestone: M002
provides:
  - Interactive gate shell with canonical request-access messaging (email + LinkedIn links)
  - Passcode form with SHA-256 hash validation and deterministic success/error markers
  - Session-scoped unlock state via sessionStorage + localStorage cross-tab bridge
  - Cross-route unlock carryover within the same browser session
  - Browser-rendered proof mount path using a shared domain proof view-model
  - Aggregate release-gate validation covering cold-load contract and warm-session unlock continuity
requires:
  - slice: S01
    provides: protected-route boundary for /domains/*, locked gate shell with cold-load markers, public-route allowlist
affects:
  - S03
  - S04
key_files:
  - src/components/domains/DomainGateShell.astro
  - src/components/domains/DomainPage.astro
  - src/components/domains/domain-gate-client.ts
  - src/components/domains/domain-proof-view.ts
  - src/data/domains/domain-view-model.ts
  - src/env.d.ts
  - src/styles/global.css
  - tests/route-unlock.browser.test.mjs
  - tests/route-boundary.static.test.mjs
  - tests/helpers/site-boundary-fixtures.mjs
  - scripts/validate-m002-s02.mjs
  - package.json
key_decisions:
  - D017 — Extend validate:site with both a fast dist validator for locked-shell messaging and a real browser warm-session unlock test before deploy
  - D018 — Validate passcodes against a build-time public hash, persist a versioned sessionStorage unlock marker, and mount unlocked proof through a shared client-renderable domain view-model
  - D019 — Use localStorage as a cross-tab bridge alongside sessionStorage because sessionStorage is per-tab (per top-level browsing context)
patterns_established:
  - Normalized DomainProofViewModel shape shared between Astro cold-render and browser unlock render paths via buildDomainProofViewModel()
  - Proof payload and gate config serialized as hidden JSON script tags in locked cold-load HTML, consumed by the client gate controller after unlock
  - Gate status markers use data-gate-status (idle/error/unlocked), gate state uses data-gate-state (locked/open), proof state uses data-protected-proof-state (withheld/mounted)
  - Each slice gets its own validator script (validate-m002-sNN.mjs) reusing shared fixture vocabulary; validate:site chains them all
observability_surfaces:
  - Inspect data-gate-state, data-gate-status, and data-protected-proof-state attributes on protected route DOM
  - Read sessionStorage/localStorage key "portfolio-gate:v1" from browser devtools
  - pnpm validate:site — aggregate release gate with route-specific failure output
  - node scripts/validate-m002-s02.mjs — fast S02-only dist validator
  - pnpm test:route-unlock:browser — focused warm-session unlock regression suite
drill_down_paths:
  - .gsd/milestones/M002/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S02/tasks/T03-SUMMARY.md
duration: 3h
verification_result: passed
completed_at: 2026-03-12
---

# S02: Session Unlock Flow and Gate Messaging

**Shipped an interactive gate shell with request-access messaging, passcode form with SHA-256 validation, session-scoped cross-tab unlock, and browser-rendered proof mount for all protected domain routes.**

## What Happened

T01 laid failing regression coverage that pinned the missing S02 behavior: cold-load request-access messaging, gate-form markers, invalid-passcode error state, correct-passcode unlock, same-session cross-route carryover, and fresh-context relock. The shared boundary fixtures were extended with the S02 gate selector vocabulary, canonical request-link expectations, and unlock test inputs.

T02 built the real user-facing gate. A normalized `DomainProofViewModel` was extracted so both Astro server renders and the browser unlock path consume the same shape. The gate shell was upgraded with canonical email and LinkedIn request-access links (sourced from `homePage.contactLinks`), a passcode form with stable markers, and a proof mount region. The client gate controller hashes input with SHA-256, compares against a build-time public hash, and on success writes a versioned unlock marker to both `sessionStorage` and `localStorage`. The localStorage bridge was necessary because `sessionStorage` is per-tab — a new tab in the same browser session starts empty. On page load, the controller auto-unlocks from existing storage, promoting localStorage to sessionStorage for cross-tab carryover. Fresh incognito contexts have empty localStorage, so relock works correctly. Unlocked proof is rendered client-side via `domain-proof-view.ts` from serialized JSON embedded in the locked cold-load HTML.

T03 wired S02 into the release gate. A fast dist validator (`validate-m002-s02.mjs`) checks protected-route HTML for request-access links, gate-form markers, and proof-withheld state. The `validate:site` command was updated to chain S01 and S02 checks. Since the deploy workflow already runs `pnpm validate:site` before artifact upload, no workflow file changes were needed.

## Verification

- `pnpm check` — 0 errors, 0 warnings
- `pnpm build` — 10 pages built successfully
- `node --test tests/route-boundary.static.test.mjs` — 12/12 passed (including S02 request-access and gate-form assertions)
- `node --test tests/route-boundary.browser.test.mjs` — 9/9 passed
- `node --test tests/route-unlock.browser.test.mjs` — 4/4 passed (cold-load locked, wrong passcode error, correct unlock, cross-tab carryover + fresh relock)
- `pnpm validate:site` — all S01 + S02 checks pass

## Requirements Advanced

- R102 — Protected domain routes now expose a real interactive gate with form-based passcode entry instead of just a locked shell
- R103 — Gate state includes canonical email and LinkedIn request-access links in the site's lowercase tone
- R104 — Session-scoped unlock persists across protected route navigation via sessionStorage + localStorage cross-tab bridge

## Requirements Validated

- R103 — Cold-load request-access messaging is proven by static assertions, browser cold-load tests, and the dist validator; canonical links are verified against shared fixture expectations
- R104 — Session unlock carryover is proven by real browser tests covering correct-passcode unlock, cross-route navigation in the same context, and fresh-context relock

## New Requirements Surfaced

- None

## Requirements Invalidated or Re-scoped

- None

## Deviations

- Used `localStorage` as a cross-tab bridge alongside `sessionStorage` (plan mentioned only sessionStorage). This was necessary because `sessionStorage` is per top-level browsing context (per-tab), so a new tab in the same browser session starts empty. The approach preserves the sessionStorage contract while adding localStorage for cross-tab promotion.
- No `.github/workflows/deploy.yml` changes were needed for T03 — the existing workflow already runs `pnpm validate:site`, so wiring S02 into the command chain in `package.json` was sufficient.

## Known Limitations

- The passcode is validated client-side against a public hash — this is a lightweight deterrent, not strong security (consistent with R102 and the static GitHub Pages constraint).
- S03 still needs to add protected-visual blur/obscure before unlock and reveal after unlock.
- S04 still needs final assembled regression and UAT coverage for the full milestone.

## Follow-ups

- None — remaining work is covered by S03 and S04 as planned.

## Files Created/Modified

- `src/data/domains/domain-view-model.ts` — normalized proof view-model builder shared between server and client render paths
- `src/components/domains/domain-proof-view.ts` — browser-side DOM renderer matching Astro cold-render markup for proof content
- `src/components/domains/DomainPage.astro` — locked path serializes proof payload and gate config as JSON, imports gate client
- `src/components/domains/DomainGateShell.astro` — full gate UI with request-access links, passcode form, status markers, proof mount point
- `src/components/domains/domain-gate-client.ts` — session-scoped unlock controller with SHA-256 hash validation and localStorage cross-tab bridge
- `src/env.d.ts` — added PUBLIC_GATE_HASH env type
- `src/styles/global.css` — retro-terminal gate styling for all interactive states
- `tests/helpers/site-boundary-fixtures.mjs` — S02 gate selectors, canonical request-link expectations, unlock inputs, session key metadata
- `tests/route-boundary.static.test.mjs` — cold-load request-access and gate-form assertions for protected routes
- `tests/route-unlock.browser.test.mjs` — four named real-browser S02 unlock/session regression tests
- `scripts/validate-m002-s02.mjs` — fast dist-first validator for S02 gate-messaging and locked-shell contract
- `package.json` — added test:route-unlock:browser, validate:m002:s02, updated validate:site chain

## Forward Intelligence

### What the next slice should know
- The unlocked proof mount path is `domain-proof-view.ts` which renders into `[data-proof-mount]`. S03's visual blur/reveal needs to hook into this same mount region — proof images exist inside the mounted proof DOM, not in the cold-load HTML.
- The gate state markers (`data-gate-state`, `data-gate-status`, `data-protected-proof-state`) are the authoritative DOM hooks for any downstream verification or visual-state work.
- Proof payload is serialized as a hidden JSON script tag in cold-load HTML (`data-proof-payload`). The actual image URLs are in the payload but the images are not rendered until client unlock.

### What's fragile
- The localStorage cross-tab bridge relies on the same origin — if the base path or domain changes, the unlock marker won't carry over. The storage key is versioned (`portfolio-gate:v1`) so a new version can force relock.
- The proof mount DOM is generated client-side by `domain-proof-view.ts` — if S03 needs to blur images, it must target the client-rendered DOM or the serialized payload, not static HTML.

### Authoritative diagnostics
- `pnpm validate:site` is the single release gate — if it passes, cold-load contract and warm-session unlock are proven.
- `node --test tests/route-unlock.browser.test.mjs` is the focused warm-session test — route-specific failures name the exact missing behavior.

### What assumptions changed
- Original assumption was sessionStorage alone would handle cross-route unlock — in practice sessionStorage is per-tab, so localStorage was added as a bridge.
- Original assumption was deploy.yml would need S02-specific changes — the existing workflow already chains through validate:site.
