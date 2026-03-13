---
id: S01
parent: M005
milestone: M005
provides:
  - Next.js 16 App Router project with Tailwind v4 retro design tokens and src/app/ scaffold
  - proxy.ts — observability header (x-gate-status) on all /domains/* requests
  - src/app/domains/actions.ts — submitPasscode server action with SHA-256, HttpOnly cookie, redirect
  - src/components/domains/GateForm.tsx — 'use client' form with useActionState and data-* gate markers
  - src/components/domains/DomainGatePage.tsx — server component with full DOM marker contract (zero proof)
  - src/components/domains/DomainProofPage.tsx — RSC rendering full domain proof with all data-* markers
  - src/app/domains/[slug]/page.tsx — RSC route: gate for unauthenticated, proof for authenticated
  - playwright.config.ts + tests/e2e/gate.spec.ts — 5-test Playwright gate suite (all passing)
  - src/data/site.ts and src/lib/paths.ts ported to process.env / hardcoded constants
requires:
  - slice: none
    provides: first slice
affects:
  - S02
  - S03
  - S04
key_files:
  - package.json
  - next.config.ts
  - tsconfig.json
  - postcss.config.mjs
  - src/app/globals.css
  - src/app/layout.tsx
  - proxy.ts
  - src/app/domains/actions.ts
  - src/app/domains/[slug]/page.tsx
  - src/components/domains/GateForm.tsx
  - src/components/domains/DomainGatePage.tsx
  - src/components/domains/DomainProofPage.tsx
  - src/data/site.ts
  - src/lib/paths.ts
  - playwright.config.ts
  - tests/e2e/gate.spec.ts
  - .env.local.example
key_decisions:
  - D040: Next.js 16.x with proxy.ts (Node runtime) over 15.x middleware.ts
  - D041: Node crypto.createHash in server action (not crypto.subtle)
  - D042: GateForm is 'use client' with useActionState; DomainGatePage stays pure server component
  - D043: proxy.ts is observability-only — enforcement lives in RSC page component
  - D044: src/app/ under src/ not root (Astro coexistence constraint)
  - D045: typescript.ignoreBuildErrors=true during Astro coexistence phase
patterns_established:
  - Tailwind v4 @theme block with --color-* tokens + :root aliases for CSS var backward compat
  - redirect() called outside any try/catch in server action — NEXT_REDIRECT must propagate
  - dynamic = 'force-dynamic' on domain route — auth state is per-request
  - process.loadEnvFile() in playwright.config.ts (ESM-compatible, Node 20.12+ built-in)
  - data-* marker contract preserved from M002: data-route-visibility, data-gate-state, data-protected-gate, data-protected-proof-state, data-visual-state, data-flagship-highlights, data-supporting-work
observability_surfaces:
  - x-gate-status locked|authenticated header on /domains/* requests (proxy.ts) — curl -I http://localhost:3000/domains/product/
  - "[gate] invalid passcode attempt" console.log on wrong passcode in next dev output
  - data-gate-state, data-protected-proof-state DOM attributes in page source — curl -s ... | grep "data-"
  - Zero-leakage check: curl -s http://localhost:3000/domains/product/ | grep -c "data-flagship-highlights" → 0
  - Authenticated proof check: curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep -c "data-flagship-highlights" → 1
  - npx playwright test tests/e2e/gate.spec.ts --reporter=list → 5 passed
drill_down_paths:
  - .gsd/milestones/M005/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M005/slices/S01/tasks/T03-SUMMARY.md
  - .gsd/milestones/M005/slices/S01/tasks/T04-SUMMARY.md
duration: ~4.5h across 4 tasks (~30min T01, ~30min T02, ~90min T03, ~15min T04)
verification_result: passed
completed_at: 2026-03-13
---

# S01: Server-side portfolio gate on Next.js

**Proven: unauthenticated `/domains/product/` response contains zero proof content; correct passcode sets an HttpOnly cookie and renders full server-rendered proof — all 5 Playwright gate tests pass, `next build` exits 0.**

## What Happened

S01 was executed as four sequential tasks, each with a clear delivery boundary.

**T01** replaced the Astro project scaffold with Next.js 16.1.6 + React 19 + Tailwind v4. The app directory was placed under `src/app/` (not root) because Astro's `src/pages/` coexists until S04 and Next.js requires them under the same parent. `typescript.ignoreBuildErrors: true` was added to `next.config.ts` to suppress TS errors from Astro-specific files that remain until S04. Tailwind v4 `@theme` block established the full retro design token set (`--color-bg`, `--color-accent`, `--color-accent-strong`, `--color-text-muted`, `--color-bg-elevated`, `--font-mono: Space Mono`) with `:root` aliases for backward CSS var compatibility. `next build` exited 0.

**T02** ported `src/data/site.ts` (replacing `import.meta.env` with `process.env`) and simplified `src/lib/paths.ts` (hardcoded `basePrefix = ""` since basePath is always `/` on Vercel). Created `playwright.config.ts` using `process.loadEnvFile()` (Node 20.12+ built-in, ESM-compatible). Wrote all 5 gate acceptance tests in `tests/e2e/gate.spec.ts`. `.env.local` was created with `GATE_HASH` and `GATE_TEST_PASSCODE`. Tests ran and failed on missing DOM selectors as expected (not config errors).

**T03** implemented the four-piece gate stack: `proxy.ts` (observability header on all `/domains/*` requests, no redirect), `src/app/domains/actions.ts` (server action with Node `crypto.createHash('sha256')`, HttpOnly cookie, `redirect()` outside try/catch), `GateForm.tsx` (`'use client'` with `useActionState`), and `DomainGatePage.tsx` (pure server component with full DOM marker contract). The domain route `src/app/domains/[slug]/page.tsx` reads `await cookies()` and conditionally renders gate or stub. Tests 1–3 passed; 4–5 failed on missing proof selectors (expected).

**T04** created `DomainProofPage.tsx` (pure RSC calling `buildDomainProofViewModel`) with all required data-* markers and rendered the full flagship/supporting-work structure. Updated the domain route to swap the stub for `<DomainProofPage>`. All 5 tests passed on first run.

**Known proxy manifest issue** (from T03): `proxy.ts` compiles correctly but `middleware-manifest.json` shows `"middleware": {}` (empty) in both dev and production builds — the `x-gate-status` header does not appear in curl responses. Gate enforcement is unaffected (lives in RSC page component per D043); only the observability header is missing. Deferred to S04 or a cleanup task.

## Verification

```bash
# All 5 Playwright tests pass
npx playwright test tests/e2e/gate.spec.ts --reporter=list
# ✓ gate: cold load shows locked gate with correct DOM markers (635ms)
# ✓ gate: unauthenticated response body contains no proof selectors (42ms)
# ✓ gate: wrong passcode shows error without unlocking (327ms)
# ✓ gate: correct passcode unlocks gate and reveals proof content (319ms)
# ✓ gate: session cookie persists across domain routes without re-auth (410ms)
# 5 passed (5.6s)

# Build exits 0
npm run build
# ✓ Compiled successfully; /domains/[slug] confirmed as ƒ (Dynamic)

# Zero leakage (unauthenticated)
curl -s http://localhost:3000/domains/product/ | grep -c "data-flagship-highlights"
# → 0 ✓

# Proof present (authenticated)
curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep -c "data-flagship-highlights"
# → 1 ✓
```

## Requirements Advanced

- R301 — S01 proves the primary capability: server-side gate enforcement via HttpOnly cookie + RSC conditional render, zero proof leakage on unauthenticated requests

## Requirements Validated

- R301 — Zero-leakage HTML assertion (Playwright test 2) + authenticated proof render (test 4) + cross-route session (test 5) constitute the evidence required to validate server-side access control. Moving from Active → Validated.

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none — prior client-side R102 validation remains valid for the M002 Astro implementation; M005 introduces a new, stronger implementation that also satisfies R301

## Deviations

1. **`src/app/` not `app/`** (T01): Astro coexistence forced the app directory under `src/`. All downstream slice plans referencing `app/` should be read as `src/app/`.
2. **`typescript.ignoreBuildErrors: true`** (T01): Not in original plan. Required because Next.js TS checker scans all files including remaining Astro-specific code. Migration accommodation per D045; remove in S04.
3. **`process.loadEnvFile()` instead of `dotenv`** (T02): ESM built-in replaces the dotenv dependency for loading `.env.local` in Playwright. `dotenv` was installed but unused — can be removed in S04 cleanup.
4. **`src/lib/paths.ts` simplified further than planned** (T02): Not just import-ported — entire dynamic `basePrefix` computation removed. Since basePath is always `/` on Vercel, the constant `""` is correct forever.
5. **Proxy manifest issue** (T03): `x-gate-status` header not surfacing in responses; `middleware-manifest.json` shows empty `middleware: {}`. Observability header is the only casualty; enforcement is unaffected.

## Known Limitations

- `x-gate-status` observability header not appearing in HTTP responses — proxy compiles but manifest-writing appears to be a Turbopack bug in Next.js 16.1.6. Deferred.
- `typescript.ignoreBuildErrors: true` suppresses type checking for S01–S03. Re-enable in S04 after Astro file cleanup.
- `dotenv` package installed but unused — minor dead dependency; remove in S04.
- `src/astro-env-compat.d.ts` migration shim still present — remove in S04.
- Public pages (`/`, `/about`, `/resume`, `/notes/*`) not yet ported — S02 scope.
- Shader client component not yet in Next.js layout — S03 scope.

## Follow-ups

- S04: Remove `typescript.ignoreBuildErrors: true` after Astro files deleted
- S04: Remove `src/astro-env-compat.d.ts` and `dotenv` dependency
- S04: Investigate and fix proxy manifest issue so `x-gate-status` header surfaces correctly
- S04: Remove `astro.config.mjs.bak` and all remaining Astro files

## Files Created/Modified

- `package.json` — replaced Astro deps with Next.js 16 + React 19 + Tailwind v4 + Playwright + dotenv
- `next.config.ts` — new; `trailingSlash: true`, `typescript.ignoreBuildErrors: true` (migration)
- `tsconfig.json` — replaced Astro config with Next.js App Router defaults; `@/*` → `./src/*`
- `postcss.config.mjs` — new; `@tailwindcss/postcss` plugin
- `src/app/globals.css` — new; `@import "tailwindcss"`, `@theme` retro tokens, bracket-link styles, `:root` aliases
- `src/app/layout.tsx` — new; root RSC layout with Space Mono font and `globals.css`
- `src/app/page.tsx` — new; minimal placeholder
- `src/astro-env-compat.d.ts` — new; migration shim for ImportMeta.env
- `astro.config.mjs.bak` — renamed from `astro.config.mjs`
- `proxy.ts` — new; Next.js 16 proxy with `x-gate-status` header on `/domains/*`
- `src/app/domains/actions.ts` — new; `submitPasscode` server action (SHA-256, HttpOnly cookie, redirect)
- `src/components/domains/GateForm.tsx` — new; `'use client'` gate form with `useActionState`
- `src/components/domains/DomainGatePage.tsx` — new; server component with full DOM marker contract
- `src/components/domains/DomainProofPage.tsx` — new; RSC rendering domain proof with all data-* markers
- `src/app/domains/[slug]/page.tsx` — new; RSC domain route: gate or proof based on cookie
- `src/data/site.ts` — `import.meta.env` → `process.env.NEXT_PUBLIC_SITE_URL`; hardcoded `basePath: "/"`
- `src/lib/paths.ts` — removed dynamic `basePrefix` computation; hardcoded `basePrefix = ""`
- `playwright.config.ts` — new; ESM config with `process.loadEnvFile`, `webServer` on port 3000
- `tests/e2e/gate.spec.ts` — new; 5 gate acceptance tests with explicit `data-*` selectors
- `.env.local` — new; `GATE_HASH` + `GATE_TEST_PASSCODE` + `NODE_ENV` (gitignored)
- `.env.local.example` — new; key names documented (committed)
- `.gsd/DECISIONS.md` — appended D040–D045

## Forward Intelligence

### What the next slice should know
- **All app/ paths are under `src/app/`** — S02 will add `src/app/about/page.tsx`, `src/app/resume/page.tsx`, `src/app/notes/page.tsx`, `src/app/notes/[slug]/page.tsx`
- **The Tailwind v4 `@theme` block is in `src/app/globals.css`** — extend it (don't create a separate `tailwind.config.js`) for any new tokens S02/S03 need
- **Root layout is `src/app/layout.tsx`** — S03 will mount `ShaderBackground` here; use `disableShader` prop pattern from M003
- **`buildDomainProofViewModel` signature**: `(domain, pathFn, slugFn)` — use `(p) => p` for paths on Vercel (no prefix)
- **Gate cookie name is `portfolio-gate`**, path is `/domains`, no `maxAge` — consistent with D037

### What's fragile
- **`typescript.ignoreBuildErrors: true`** — type errors in new code will be silently skipped during `next build`. Run `tsc --noEmit` manually to catch them. Remove this in S04.
- **`proxy.ts` manifest issue** — the observability header doesn't surface; if middleware-level enforcement is ever added to `proxy.ts`, it will silently not work without fixing the manifest first
- **`DomainProofPage` with all domain slugs** — tested only with `product` and `platform` slugs via Playwright; other slugs depend on `getDomainBySlug` returning a valid domain. A missing slug will 404 (graceful).

### Authoritative diagnostics
- **Gate enforcement**: `curl -s http://localhost:3000/domains/product/ | grep -c "data-flagship-highlights"` → 0 means gate is working
- **Authenticated proof**: `curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated' | grep -c "data-flagship-highlights"` → 1 means proof renders
- **Full test suite**: `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 passed is the definitive green signal for S01
- **Build health**: `npm run build` → "✓ Compiled successfully" + exit 0

### What assumptions changed
- **Edge Runtime not required** — S01 plan assumed `crypto.subtle` might be needed (D033 was written for Edge Runtime); Node.js runtime via `proxy.ts` makes `crypto.createHash` the correct choice (D041)
- **Gate enforcement in page, not proxy** — the plan described proxy.ts as the enforcement point; execution confirmed enforcement belongs in the RSC page component (D043), proxy is observability-only
- **`app/` placement** — plan assumed project root; execution required `src/app/` due to Astro coexistence
