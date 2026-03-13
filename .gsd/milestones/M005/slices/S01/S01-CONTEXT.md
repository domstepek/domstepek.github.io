---
id: S01
milestone: M005
status: complete
---

# S01: Server-side portfolio gate on Next.js — Context

**Gathered:** 2026-03-13 (retroactive — discuss phase ran after execution)
**Status:** Complete — all decisions confirmed, context written for downstream reference

## Goal

Prove that a visitor can open `/domains/[slug]` unauthenticated and receive a server-rendered gate page with zero proof content in the response HTML, enter the correct passcode, receive an HttpOnly cookie, and see the full proof page — all proven by Playwright tests against `next dev`.

## Why this Slice

S01 is first because the server-side gate is the only genuinely new capability in M005 (everything else is a port). It retires the highest-risk unknowns early: Edge Runtime constraints, cookie attribute behavior, the middleware/enforcement seam, and the `next build` → `next dev` → Playwright integration. All subsequent slices (S02, S03, S04) build on top of this known-working scaffold.

## Scope

### In Scope

- Next.js App Router scaffold with Tailwind v4 design tokens and retro palette (`src/app/` under `src/` for Astro coexistence)
- `proxy.ts` (Node runtime, not Edge) adding `x-gate-status` observability header on all `/domains/*` requests
- Server action (`src/app/domains/actions.ts`) validating passcode via Node `crypto.createHash`, setting HttpOnly session cookie, and redirecting
- `GateForm.tsx` — `'use client'` component with `useActionState` for inline error display (no page reload on wrong passcode)
- `DomainGatePage.tsx` and `DomainProofPage.tsx` as pure server components — gate is enforced in the RSC page component via `await cookies()`
- `src/app/domains/[slug]/page.tsx` — route renders gate or proof depending on cookie presence
- Playwright test suite (`tests/e2e/gate.spec.ts`) with 5 tests covering: cold-load gate markers, zero-leakage HTML, wrong passcode error, correct passcode auth + redirect, and cross-route session persistence
- DOM marker contract preserved: `data-route-visibility`, `data-gate-state`, `data-protected-gate`, `data-protected-proof-state`, `data-visual-state`, `data-flagship-highlights`, `data-supporting-work`
- `src/data/site.ts` and `src/lib/paths.ts` ported (`import.meta.env` → `process.env`, basePath hardcoded to `""`)

### Out of Scope

- Public routes (`/`, `/about`, `/resume`, `/notes/*`) — deferred to S02
- Shader and client components (gallery, Mermaid) — deferred to S03
- Vercel deployment, CI, final integration — deferred to S04
- Per-domain authentication — explicitly not wanted; one passcode unlocks all `/domains/*` routes for the session
- Time-based cookie expiry — session-scoped only (cleared on browser close), no maxAge
- Contact hint or access-request link on the gate page — gate is minimal form only, no explanation of how to obtain the passcode
- The `/shader-demo/` page — dropped (D038)

## Constraints

- **Single shared passcode model** — one passcode, one cookie, full `/domains/*` access for the session. The cookie is `path: '/domains'`, `httpOnly: true`, `secure: true` (on Vercel), `sameSite: 'lax'`, no `maxAge` or `expires` (D037).
- **Gate at same URL** — the gate view renders at `/domains/[slug]`, not at a separate `/gate?next=...` route. After correct auth the server redirects back to the same slug (D036).
- **Enforcement in RSC, not middleware** — `proxy.ts` is observability-only (adds `x-gate-status` header, returns `NextResponse.next()`). The RSC page component is the sole gate enforcement point. This eliminates redirect loop risk (D043).
- **Gate UX feel** — wrong passcode: inline error message in the form, no redirect, no page reload. Correct passcode: server redirect, full proof page renders. Minimal gate page — no hint text, no contact info, no explanation of how to obtain access.
- **Node runtime throughout** — Next.js 16.x with `proxy.ts` (Node runtime) instead of Edge Runtime `middleware.ts`. Node `crypto.createHash` used in server action instead of `crypto.subtle` (D040, D041).
- **Astro coexistence** — `src/app/` placed under `src/` (not project root) due to Astro `src/pages/` coexistence until S04 (D044). `typescript.ignoreBuildErrors: true` in `next.config.ts` until S04 removes Astro files (D045).
- **Tailwind v4 `@theme` block** — design tokens live in `src/app/globals.css` `@theme` block, not a separate `tailwind.config.js`. CSS var aliases (`:root { --bg: var(--color-bg); ... }`) ensure backward compat with shader's `getComputedStyle` reads.

## Integration Points

### Consumes

- `src/data/domains/*.ts`, `src/data/home.ts`, `src/data/resume.ts`, `src/data/personal.ts` — existing TypeScript data modules; consumed unchanged
- `src/data/site.ts` — ported (replace `import.meta.env` with `process.env`)
- `src/lib/paths.ts` — ported (simplify `basePrefix` to `""` for Vercel)
- `public/` assets — referenced at `/images/...`, `/favicon.svg`, etc. unchanged
- Nothing from upstream slices (first slice)

### Produces

- `src/app/` scaffold — root layout, Tailwind v4 config, globals.css with retro design tokens and CSS var aliases
- `proxy.ts` — observability header on `/domains/*` requests
- `src/app/domains/actions.ts` — passcode validation + cookie set + redirect server action
- `src/components/domains/GateForm.tsx` — `'use client'` passcode form with `useActionState`
- `src/components/domains/DomainGatePage.tsx` — server component, gate view, full DOM marker contract
- `src/components/domains/DomainProofPage.tsx` — server component, full proof with all data-* markers
- `src/app/domains/[slug]/page.tsx` — RSC route (gate or proof based on cookie)
- `playwright.config.ts` + `tests/e2e/gate.spec.ts` — 5-test gate suite, all passing
- `.env.local.example` — documents `GATE_HASH` and `GATE_TEST_PASSCODE` keys

## Open Questions

- **`x-gate-status` header not appearing in curl** — `proxy.ts` sets this header but `middleware-manifest.json` is empty; header is not visible in curl responses. Gate enforcement is unaffected (lives in RSC). Investigate in S04 during CI/Vercel wiring. Current thinking: likely a Next.js 16 dev-server manifest behavior; may resolve on `next start` or Vercel deployment.
- **`dotenv` package installed but unused** — `process.loadEnvFile()` (Node 20.12+ built-in) is used instead. Remove in S04 cleanup.
