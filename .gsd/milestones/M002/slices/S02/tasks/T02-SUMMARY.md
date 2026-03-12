---
id: T02
parent: S02
milestone: M002
provides:
  - Interactive gate shell with request-access messaging, passcode form, session-scoped unlock, cross-tab carryover, and browser-rendered proof mount for all protected domain routes.
key_files:
  - src/components/domains/domain-gate-client.ts
  - src/components/domains/domain-proof-view.ts
  - src/data/domains/domain-view-model.ts
  - src/components/domains/DomainGateShell.astro
  - src/components/domains/DomainPage.astro
  - src/env.d.ts
  - src/styles/global.css
key_decisions:
  - Use localStorage as a cross-tab bridge alongside sessionStorage because sessionStorage is per-tab (per top-level browsing context). On unlock, write to both. On load, check sessionStorage first then localStorage and promote if found. Fresh incognito contexts get empty localStorage so relock works correctly.
patterns_established:
  - Normalized DomainProofViewModel shape shared between Astro cold-render and browser unlock render paths, built via buildDomainProofViewModel().
  - Proof payload and gate config serialized as hidden JSON script tags in locked cold-load HTML, consumed by the client gate controller after unlock.
  - Gate status markers use data-gate-status attribute with idle/error/unlocked values; gate state uses data-gate-state with locked/open values; proof state uses data-protected-proof-state with withheld/mounted values.
observability_surfaces:
  - Inspect data-gate-state, data-gate-status, and data-protected-proof-state attributes on protected route DOM.
  - Read sessionStorage/localStorage key "portfolio-gate:v1" from browser devtools to check unlock state.
  - Run pnpm test:route-unlock:browser for warm-session unlock regression coverage.
duration: 90m
verification_result: passed
completed_at: 2026-03-12T15:44:00Z
blocker_discovered: false
---

# T02: Ship the interactive gate shell and session-scoped unlock path

**Built the full interactive gate UI with canonical request-access links, passcode form, SHA-256 hash validation, cross-tab session unlock via localStorage bridge, and browser-rendered proof mount for all protected domain routes.**

## What Happened

All five plan steps were implemented across prior session work and completed in this session:

1. **domain-view-model.ts** — Extracted `buildDomainProofViewModel()` that normalizes a `DomainEntry` into a `DomainProofViewModel` shape shared between Astro server render and browser client render, resolving asset paths, related domains, and proof links.

2. **DomainPage.astro** — Updated the locked path to serialize the proof payload and gate config as hidden `<script type="application/json">` tags, and import the client gate controller as a module script. The open path (public routes) remains unchanged.

3. **DomainGateShell.astro** — Upgraded to the full retro gate UI: canonical email and LinkedIn request-access links pulled from `homePage.contactLinks`, passcode form with `data-gate-form`/`data-gate-passcode-input`/`data-gate-submit` markers, status display with `data-gate-status`, and an empty `data-proof-mount` region.

4. **domain-gate-client.ts** — Implemented the complete unlock controller:
   - Reads gate config (hash, storageKey) and proof payload from embedded JSON
   - Hashes passcode input with SHA-256 via `crypto.subtle.digest`
   - Compares against build-time `PUBLIC_GATE_HASH`
   - On valid unlock: persists to both `sessionStorage` and `localStorage` (cross-tab bridge), transitions gate state to open, mounts proof DOM
   - On invalid: sets `data-gate-status="error"` with "invalid passcode" text, stays locked
   - On page load: auto-unlocks if sessionStorage or localStorage has the marker (promotes localStorage → sessionStorage for cross-tab carryover)

5. **domain-proof-view.ts** — Browser-side proof renderer that produces DOM matching the Astro cold-render markup, including flagships, supporting work, related domains, proof links, and visuals.

6. **env.d.ts** — Added `PUBLIC_GATE_HASH` typing.

7. **global.css** — Full retro-terminal styling for the gate shell, request-access panel, passcode form, and status indicators.

The key fix in this session was the **localStorage cross-tab bridge**: `sessionStorage` is per-tab (per top-level browsing context), so opening a new tab in the same browser context starts with empty sessionStorage. The solution writes the unlock marker to both `sessionStorage` and `localStorage` on unlock. On load, the client checks sessionStorage first, then localStorage, and promotes if found. A fresh incognito/browser context has empty localStorage, so relocking works correctly.

## Verification

- `pnpm check` — 0 errors, 0 warnings ✓
- `pnpm build` — 10 pages built successfully ✓
- `node --test tests/route-boundary.static.test.mjs` — 12/12 passed ✓ (includes S02 request-access and gate-form marker assertions)
- `node --test tests/route-boundary.browser.test.mjs` — 9/9 passed ✓
- `node --test tests/route-unlock.browser.test.mjs` — 4/4 passed ✓ (cold-load locked, wrong passcode error, correct unlock, cross-tab carryover + fresh relock)
- `pnpm validate:site` — 9/9 passed ✓
- Browser smoke test: visually confirmed locked gate shell with request-access panel, wrong passcode error state, and retro terminal styling.

### Must-haves addressed:
1. ✅ Protected cold loads expose locked markers and do not ship proof markup in initial HTML (static + browser tests pass)
2. ✅ Gate shell reuses canonical contact data and exposes deterministic success/error markers (email/LinkedIn from homePage.contactLinks, data-gate-status with idle/error/unlocked)
3. ✅ Correct unlocks persist for current browser session across protected routes; wrong unlocks stay locked with visible diagnostic (all 4 browser unlock tests pass)
4. ✅ No raw passcode in shipped UI or diagnostics; only public hash and non-secret state markers exposed (gate config contains only the hex hash, status text says "invalid passcode" not the actual input)

## Diagnostics

- Inspect `[data-gate-state]`, `[data-gate-status]`, `[data-protected-proof-state]` attributes on any protected route DOM.
- Check `sessionStorage.getItem("portfolio-gate:v1")` and `localStorage.getItem("portfolio-gate:v1")` in browser devtools.
- Run `pnpm test:route-unlock:browser` for the focused unlock regression suite.
- Run `node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs tests/route-unlock.browser.test.mjs` for full S02 coverage.

## Deviations

- Used `localStorage` as a cross-tab bridge alongside `sessionStorage` (plan specified only sessionStorage). This was necessary because sessionStorage is per-tab and the test/product requirement expects cross-tab unlock carryover within the same browser session. The approach preserves the sessionStorage contract the tests check while adding localStorage for cross-tab promotion.

## Known Issues

- None. All T01 failing tests now pass.

## Files Created/Modified

- `src/data/domains/domain-view-model.ts` — normalized proof view-model builder shared between server and client render paths.
- `src/components/domains/domain-proof-view.ts` — browser-side DOM renderer matching Astro cold-render markup for proof content.
- `src/components/domains/DomainPage.astro` — locked path now serializes proof payload and gate config as JSON, imports gate client.
- `src/components/domains/DomainGateShell.astro` — full gate UI with request-access links, passcode form, status markers, proof mount point.
- `src/components/domains/domain-gate-client.ts` — session-scoped unlock controller with SHA-256 hash validation and localStorage cross-tab bridge.
- `src/env.d.ts` — added PUBLIC_GATE_HASH env type.
- `src/styles/global.css` — retro-terminal gate styling for all interactive states.
