---
estimated_steps: 4
estimated_files: 2
---

# T04: Implement domain proof page and verify full Playwright suite

**Slice:** S01 — Server-side portfolio gate on Next.js
**Milestone:** M005

## Description

Final task for S01. Builds `DomainProofPage.tsx` — the server component that renders full domain proof content (flagship highlights, supporting work) when the `portfolio-gate` cookie is valid. Wires it into the domain page route, replacing the T03 stub. Runs the full Playwright suite to confirm all 5 tests pass. Runs `next build` for final verification.

The proof page is a React Server Component that calls `buildDomainProofViewModel()` from the ported data module and renders the domain data directly — no client-side JS required. The `data-*` markers from the M002 contract (`data-flagship-highlights`, `data-flagship`, `data-supporting-work`, `data-supporting-item`) must all be present in the server-rendered HTML.

`data-visual-state` is set to `"revealed"` on the proof container — preserving the attribute for backward compatibility with test contracts even though the M005 server-render model has no client-side blur animation (D020 described the M002 animation, which is superseded by D033/D035).

## Steps

1. **Create `src/components/domains/DomainProofPage.tsx`** (server component, no `'use client'`): Props: `{ domain: DomainEntry }`. Call `buildDomainProofViewModel(domain, (p) => p, (slug) => \`/domains/${slug}/\`)`. Render outer wrapper with `data-route-visibility="protected"` and `data-protected-proof-state="revealed"`. Inside: domain title and thesis (heading, paragraph). Flagship section: `<section data-flagship-highlights>` containing each flagship as `<article data-flagship>` with title, role, outcomes, stack tags. Supporting work section: `<ul data-supporting-work>` with each item as `<li data-supporting-item>` with title and description. Include `data-visual-state="revealed"` on the proof container. Use Tailwind utility classes consistent with the retro theme from T01's `globals.css`.

2. **Update `app/domains/[slug]/page.tsx`**: Import `DomainProofPage`. Replace the T03 stub (`<p>Authenticated — proof coming in T04</p>`) with `<DomainProofPage domain={domain} />`. No other changes to the cookie-reading logic or `DomainGatePage` branch.

3. **Run full Playwright suite and fix any failures**: `npx playwright test tests/e2e/gate.spec.ts`. If test 4 (correct passcode → proof markers) fails, inspect the actual rendered HTML with `page.content()` or check selector spelling. If test 5 (cross-route session) fails, verify `path: '/domains'` cookie attribute is not too restrictive (all domain slugs are under `/domains/` so this is fine). Fix any failures.

4. **Run `next build` and verify clean exit**: `npm run build`. Fix any TypeScript errors or missing imports. Confirm zero errors. The build output should include `app/domains/[slug]` as a dynamic route.

## Must-Haves

- [ ] `DomainProofPage.tsx` renders `data-flagship-highlights` section with at least one `data-flagship` child
- [ ] `DomainProofPage.tsx` renders `data-supporting-work` section with `data-supporting-item` children
- [ ] `DomainProofPage.tsx` has `data-route-visibility="protected"` and `data-protected-proof-state="revealed"` on the wrapper
- [ ] `data-visual-state="revealed"` present on the proof container (backward compatibility)
- [ ] `app/domains/[slug]/page.tsx` proof branch renders `<DomainProofPage>` — stub is fully replaced
- [ ] All 5 Playwright tests pass: `npx playwright test tests/e2e/gate.spec.ts` exits 0
- [ ] `next build` exits 0 with no TypeScript errors
- [ ] Authenticated HTTP response body contains `data-flagship-highlights`; unauthenticated body does NOT

## Verification

- `npx playwright test tests/e2e/gate.spec.ts` → all 5 tests pass, exit code 0
- `npm run build` → exits 0
- `curl -s http://localhost:3000/domains/product/ | grep -c "data-flagship-highlights"` → `0` (unauthenticated, no cookie)
- `curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep -c "data-flagship-highlights"` → `1` (authenticated)
- `npx playwright test tests/e2e/gate.spec.ts --reporter=line` → output shows 5 passed

## Observability Impact

- Signals added/changed: `data-protected-proof-state="revealed"` in authenticated response HTML confirms proof is being server-rendered (not client-injected); `data-visual-state="revealed"` preserves existing test contract signal
- How a future agent inspects this: `curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep data-flagship` to verify proof content is server-rendered; Playwright test output for full contract assertion
- Failure state exposed: If `buildDomainProofViewModel` throws (e.g. malformed domain data), Next.js surfaces a 500 error page in dev with full stack trace; in production, error boundary shows generic error

## Inputs

- `src/components/domains/DomainGatePage.tsx`, `proxy.ts`, `app/domains/actions.ts`, `app/domains/[slug]/page.tsx` (T03 outputs — proof branch is a stub, needs replacement)
- `src/data/domains/domain-view-model.ts` — `buildDomainProofViewModel(domain, assetPath, domainPath)` signature
- `src/data/domains/types.ts` — `DomainEntry`, `DomainProofViewModel`, `ResolvedFlagship`, `ResolvedSupportingItem` types
- `tests/e2e/gate.spec.ts` — tests 4 and 5 define the exact selectors proof page must render

## Expected Output

- `src/components/domains/DomainProofPage.tsx` — RSC with full domain proof rendering; all `data-*` markers correct
- `app/domains/[slug]/page.tsx` — final version: gate branch → `<DomainGatePage>`, authenticated branch → `<DomainProofPage>`
- All 5 Playwright tests passing against `next dev`
- `next build` succeeds with no errors
