---
id: T04
parent: S01
milestone: M005
provides:
  - src/components/domains/DomainProofPage.tsx — RSC rendering full domain proof with all data-* markers
  - app/domains/[slug]/page.tsx — final version wiring DomainProofPage into authenticated branch
  - All 5 Playwright gate tests passing (S01 slice verification complete)
  - next build exits 0 with dynamic /domains/[slug] route confirmed
key_files:
  - src/components/domains/DomainProofPage.tsx
  - src/app/domains/[slug]/page.tsx
key_decisions:
  - No new decisions — implementation exactly matched T04 plan; all choices consistent with D033, D035, D036, D042
patterns_established:
  - DomainProofPage is a pure RSC (no 'use client') — calls buildDomainProofViewModel at render time, no client-side JS required for proof rendering
  - data-visual-state="revealed" preserved on outer wrapper for backward compatibility with M002 test contracts, even though no blur animation exists in M005 server-render model
observability_surfaces:
  - "Authenticated HTML inspection: curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep data-flagship — confirms proof is server-rendered"
  - "Unauthenticated zero-leakage check: curl -s http://localhost:3000/domains/product/ | grep -c data-flagship-highlights → 0"
  - "Playwright suite: npx playwright test tests/e2e/gate.spec.ts --reporter=list → 5 passed"
duration: ~15min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T04: Implement domain proof page and verify full Playwright suite

**Built `DomainProofPage.tsx` (RSC) with full data-* marker contract, wired it into the authenticated route branch, and verified all 5 Playwright gate tests pass with `next build` exiting clean.**

## What Happened

Created `src/components/domains/DomainProofPage.tsx` as a pure React Server Component. It calls `buildDomainProofViewModel(domain, (p) => p, (slug) => \`/domains/${slug}/\`)` to resolve the domain data into a normalized view model, then renders:

- Outer wrapper: `data-route-visibility="protected"`, `data-protected-proof-state="revealed"`, `data-visual-state="revealed"` (backward compat)
- Flagship section: `<section data-flagship-highlights>` → each flagship as `<article data-flagship>` with title, role, summary, outcomes list, stack tags, proof links
- Supporting work: `<ul data-supporting-work>` → each item as `<li data-supporting-item>` with title, context, proof links
- Related domains section (links only, no additional markers needed)

Updated `src/app/domains/[slug]/page.tsx` to import `DomainProofPage` and replace the T03 stub (`<p>Authenticated — proof coming in T04</p>`) with `<DomainProofPage domain={domain} />`. No other changes to the cookie-reading logic or gate branch.

## Verification

All 5 Playwright tests passed on first run:
```
✓  1 gate: cold load shows locked gate with correct DOM markers (584ms)
✓  2 gate: unauthenticated response body contains no proof selectors (33ms)
✓  3 gate: wrong passcode shows error without unlocking (339ms)
✓  4 gate: correct passcode unlocks gate and reveals proof content (323ms)
✓  5 gate: session cookie persists across domain routes without re-auth (440ms)
5 passed (3.9s)
```

`npm run build` exited 0 with `app/domains/[slug]` confirmed as a dynamic route (ƒ):
```
Route (app)
├ ○ /
├ ○ /_not-found
└ ƒ /domains/[slug]
```

Curl zero-leakage and authenticated checks:
- `curl -s http://localhost:3000/domains/product/ | grep -c "data-flagship-highlights"` → `0` ✓
- `curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep -c "data-flagship-highlights"` → `1` ✓

## Diagnostics

- Authenticated HTML inspection: `curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep data-flagship` — lists all flagship markers confirming server-render
- Zero-leakage confirmation: `curl -s http://localhost:3000/domains/product/ | grep -c data-flagship-highlights` → `0`
- Full test suite: `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 passed
- If `buildDomainProofViewModel` throws (malformed domain data): Next.js surfaces 500 in dev with full stack trace; error boundary shows generic error in production

## Deviations

None — implementation exactly matched the T04 plan.

## Known Issues

- `next.config.ts` still has `typescript.ignoreBuildErrors: true` (migration comment present); carry-forward from T01. Should be removed once Astro files are cleaned up in S04 (noted in T01 diagnostics).
- `x-gate-status` header from `proxy.ts` not showing in curl headers — known proxy manifest issue from T03; not a T04 concern.

## Files Created/Modified

- `src/components/domains/DomainProofPage.tsx` — new RSC with full domain proof rendering; all data-* markers correct
- `src/app/domains/[slug]/page.tsx` — final version: gate branch → `<DomainGatePage>`, authenticated branch → `<DomainProofPage>`
