# S01: Server-side portfolio gate on Next.js

**Goal:** Prove the highest-risk capability: server-side portfolio gate auth on Next.js App Router. An unauthenticated visitor to `/domains/[slug]` receives a server-rendered gate page with zero proof content in the response HTML. After submitting the correct passcode via a server action, they receive an HttpOnly cookie and land on the full server-rendered proof page.
**Demo:** Run `npx playwright test tests/e2e/gate.spec.ts` against `next dev` — all tests pass. Unauthenticated response HTML inspection confirms no proof selectors. Correct passcode sets cookie and renders full proof page. Cross-route session persists without re-auth.

## Must-Haves

- Next.js 16 App Router project builds (`next build` exits 0)
- Tailwind v4 with retro design tokens (`--bg`, `--accent`, `--accent-strong`, `--text-muted`, `--bg-elevated`, Space Mono) in `@theme` block
- `proxy.ts` intercepts `/domains/*` requests, adds `x-gate-status` observability header, passes through without redirect
- `app/domains/[slug]/page.tsx` — RSC that reads `portfolio-gate` cookie via `await cookies()` and conditionally renders gate or proof
- `app/domains/actions.ts` — `'use server'` action: hashes submitted passcode with Node `crypto`, compares to `GATE_HASH` env var, sets HttpOnly session cookie, calls `redirect()` outside any try/catch
- `DomainGatePage.tsx` — server component with all `data-*` markers: `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, `data-protected-proof-state="withheld"`; zero proof selectors
- `GateForm.tsx` — `'use client'` component with `useActionState`, `data-passcode-input`, `data-passcode-submit`, `data-gate-error` (on error)
- `DomainProofPage.tsx` — server component with `data-route-visibility="protected"`, `data-protected-proof-state="revealed"`, `data-flagship-highlights`, `data-supporting-work`, `data-flagship`, `data-supporting-item`
- Playwright test suite (`tests/e2e/gate.spec.ts`) covers: gate markers on cold load, zero-leakage HTML assertion, wrong-passcode error, correct-passcode auth + proof, cross-route session
- `src/data/site.ts` updated: `import.meta.env` → `process.env`; all other `src/data/domains/*.ts` port unchanged
- Cookie attributes: `httpOnly: true`, `secure: NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/domains'`, no `maxAge`/`expires` (session-scoped per D037)

## Proof Level

- This slice proves: integration
- Real runtime required: yes (`next dev` + Playwright)
- Human/UAT required: no (fully automated Playwright assertions)

## Verification

```bash
# All tests pass against next dev
GATE_TEST_PASSCODE=<test-passcode> npx playwright test tests/e2e/gate.spec.ts

# Build succeeds cleanly
next build
```

Test file: `tests/e2e/gate.spec.ts`

Assertions covered:
1. Cold-load gate: `data-protected-gate`, `data-gate-state="locked"`, `data-protected-proof-state="withheld"` present; `data-flagship-highlights`, `data-supporting-work` absent from DOM
2. Zero-leakage HTML: HTTP response body contains no `data-flagship-highlights`, `data-supporting-work`, `data-flagship`, `data-supporting-item` strings
3. Wrong passcode: `data-gate-error` visible after submit
4. Correct passcode: `data-protected-proof-state="revealed"`, `data-flagship-highlights` visible; `portfolio-gate` cookie set
5. Cross-route session: navigate to second domain after auth — proof page renders without re-auth

## Observability / Diagnostics

- Runtime signals: `x-gate-status: locked|authenticated` response header on all `/domains/*` requests (set by `proxy.ts`); `data-gate-state`, `data-protected-proof-state` DOM attributes visible in page source; server action logs `[gate] invalid passcode attempt` on mismatch (no hash value logged)
- Inspection surfaces: `next dev` console for server action logs; `curl -I http://localhost:3000/domains/product/` to inspect `x-gate-status` header; Playwright test output for DOM assertion failures
- Failure visibility: `useActionState` returns `{ error: string }` on wrong passcode — visible as `data-gate-error` in DOM; `redirect()` throws `NEXT_REDIRECT` which propagates to Next.js (not caught); missing `GATE_HASH` env var causes server action to always return error (fail-secure)
- Redaction constraints: `GATE_HASH` and `GATE_TEST_PASSCODE` never logged or included in responses; submitted passcode never logged

## Integration Closure

- Upstream surfaces consumed: `src/data/domains/index.ts` (`getDomainBySlug`), `src/data/domains/types.ts` (`DomainEntry`), `src/data/domains/domain-view-model.ts` (`buildDomainProofViewModel`), `src/data/site.ts` (site config), `src/lib/paths.ts` (path helpers)
- New wiring introduced: `proxy.ts` (Node.js runtime intercept) → `app/domains/[slug]/page.tsx` (RSC cookie check + conditional render) → `app/domains/actions.ts` (server action validates passcode + sets cookie) — complete request cycle for gate enforcement
- What remains: S02 (public pages: `/`, `/about`, `/resume`, `/notes/*`), S03 (shader client component), S04 (Vercel deployment + CI/CD)

## Tasks

- [x] **T01: Scaffold Next.js 16 project with Tailwind v4 and retro design tokens** `est:1.5h`
  - Why: All other tasks depend on a buildable Next.js project. This task establishes the app structure, Tailwind config with retro tokens, root layout, and proves `next build` succeeds on an empty app.
  - Files: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`
  - Do: Replace `package.json` with Next.js 16, React 19, Tailwind v4 (`@tailwindcss/postcss`), shadcn/ui, `@playwright/test` deps. Create `next.config.ts` with `trailingSlash: true`. Create `postcss.config.mjs` for Tailwind v4. Create `app/globals.css` with `@import "tailwindcss"`, `@theme` block with all retro tokens. Create `app/layout.tsx` root layout. Create `app/page.tsx` minimal placeholder. Run `npm install` + `next build`.
  - Verify: `next build` exits 0; `app/layout.tsx` imports `globals.css` and uses Space Mono font; CSS custom properties present in `app/globals.css`
  - Done when: `next build` succeeds cleanly with zero errors or warnings about missing modules

- [x] **T02: Port data modules and write failing Playwright tests** `est:1.5h`
  - Why: Tests define the acceptance criteria before implementation. Failing tests first is the objective stopping condition for the slice. Data modules must be ported before the domain page can use them.
  - Files: `src/data/site.ts`, `playwright.config.ts`, `tests/e2e/gate.spec.ts`, `.env.local`
  - Do: Update `src/data/site.ts` replacing `import.meta.env` with `process.env`. Create `playwright.config.ts` with `webServer: { command: 'next dev', port: 3000 }`, `baseURL: 'http://localhost:3000'`, `testDir: 'tests/e2e'`. Write `tests/e2e/gate.spec.ts` with all 5 assertions (cold-load gate markers, HTML zero-leakage, wrong passcode, correct passcode auth, cross-route session). Create `.env.local` with `GATE_HASH` and `GATE_TEST_PASSCODE` (generate test passcode + compute its SHA-256).
  - Verify: `npx playwright test tests/e2e/gate.spec.ts` runs and fails (expected — route `/domains/product/` returns 404 or no gate markers yet)
  - Done when: Test file has all 5 test cases with explicit selectors; `playwright.config.ts` references the correct webServer config; tests run to failure (not a config error)

- [x] **T03: Implement proxy.ts, server action, and gate page (gate tests pass)** `est:2h`
  - Why: Core gate implementation. Proves zero-leakage — unauthenticated responses contain no proof content. Proves form behavior — wrong passcode shows error.
  - Files: `proxy.ts`, `app/domains/actions.ts`, `app/domains/[slug]/page.tsx`, `src/components/domains/DomainGatePage.tsx`, `src/components/domains/GateForm.tsx`
  - Do: Create `proxy.ts` exporting `proxy` function: match `/domains/:path*`, read `portfolio-gate` cookie, return `NextResponse.next()` with `x-gate-status: locked|authenticated` header. Create `app/domains/actions.ts` with `'use server'` `submitPasscode(prevState, formData)`: hash submitted passcode with `crypto.createHash('sha256')`, compare to `process.env.GATE_HASH`, return `{ error }` on mismatch; on match set HttpOnly cookie then call `redirect()` outside try/catch. Create `GateForm.tsx` (`'use client'`): `useActionState(submitPasscode, null)`, `data-passcode-input` input, `data-passcode-submit` button, `data-gate-error` span. Create `DomainGatePage.tsx` server component with all required `data-*` markers and `<GateForm />`. Create `app/domains/[slug]/page.tsx`: `await cookies()`, `getDomainBySlug(slug)`, if no cookie → `<DomainGatePage>`, else → stub paragraph (will be replaced in T04).
  - Verify: `npx playwright test tests/e2e/gate.spec.ts` — tests 1 (gate markers), 2 (HTML zero-leakage), 3 (wrong passcode) pass; test 4 (correct passcode → proof) still fails (expected)
  - Done when: Unauthenticated load shows gate with correct markers; `curl http://localhost:3000/domains/product/` response body contains no proof selectors; wrong passcode shows `data-gate-error`

- [x] **T04: Implement domain proof page and verify full Playwright suite** `est:1.5h`
  - Why: Completes the auth flow. Proves that after cookie is set, the full proof page renders server-side with all content. Proves session persistence across routes.
  - Files: `src/components/domains/DomainProofPage.tsx`, `app/domains/[slug]/page.tsx`
  - Do: Create `DomainProofPage.tsx` server component: calls `buildDomainProofViewModel(domain, (p) => p, (slug) => `/domains/${slug}/`)`, renders domain title/thesis/scope, flagship highlights (`data-flagship-highlights`, each with `data-flagship`), supporting work (`data-supporting-work`, each with `data-supporting-item`), all wrapped with `data-route-visibility="protected"` and `data-protected-proof-state="revealed"`. Update `app/domains/[slug]/page.tsx` to render `<DomainProofPage>` when cookie is valid (replace T03 stub). Run `npx playwright test` — fix any remaining failures. Run `next build`.
  - Verify: `npx playwright test tests/e2e/gate.spec.ts` — all 5 tests pass; `next build` succeeds; `curl http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated'` response contains `data-flagship-highlights`
  - Done when: All Playwright tests pass; `next build` exits 0; authenticated response HTML contains proof markers; unauthenticated response HTML contains zero proof markers

## Files Likely Touched

- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `proxy.ts`
- `app/domains/actions.ts`
- `app/domains/[slug]/page.tsx`
- `src/components/domains/DomainGatePage.tsx`
- `src/components/domains/GateForm.tsx`
- `src/components/domains/DomainProofPage.tsx`
- `src/data/site.ts`
- `playwright.config.ts`
- `tests/e2e/gate.spec.ts`
- `.env.local`
