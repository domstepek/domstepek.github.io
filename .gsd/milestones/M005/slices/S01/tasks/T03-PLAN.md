---
estimated_steps: 5
estimated_files: 5
---

# T03: Implement proxy.ts, server action, and gate page (gate tests pass)

**Slice:** S01 — Server-side portfolio gate on Next.js
**Milestone:** M005

## Description

Core gate implementation. Builds four things that together make the unauthenticated gate tests pass: `proxy.ts` (defense-in-depth intercept), `app/domains/actions.ts` (server action that validates passcode and sets cookie), `DomainGatePage.tsx` (server component with correct DOM marker contract), and `GateForm.tsx` (client component with `useActionState` for error display). The domain page route (`app/domains/[slug]/page.tsx`) is created here, rendering the gate view for unauthenticated requests and a temporary stub for authenticated ones (full proof is wired in T04).

At the end of this task, tests 1–3 from `gate.spec.ts` pass. Tests 4–5 still fail (expected — proof page is a stub).

**Critical constraint: `redirect()` must be called outside any try/catch.** Next.js `redirect()` works by throwing a `NEXT_REDIRECT` error. If caught, the redirect silently fails. The server action must be structured so `redirect()` is the last statement after all validation and cookie logic.

## Steps

1. **Create `proxy.ts`**: Export `proxy` function (Next.js 16 convention). Match `/domains/:path*` using the `matcher` config export. Read the `portfolio-gate` cookie from `request.cookies`. Return `NextResponse.next({ headers: { 'x-gate-status': cookie ? 'authenticated' : 'locked' } })`. No redirects — the page component is the enforcement point. Export `const config = { matcher: ['/domains/:path*'] }`.

2. **Create `app/domains/actions.ts`**: Mark file `'use server'`. Import `cookies` from `next/headers`, `redirect` from `next/navigation`, `createHash` from `node:crypto`. Define `submitPasscode(prevState: { error: string | null }, formData: FormData): Promise<{ error: string | null }>`. Body: (a) extract `passcode` and `slug` from formData; (b) hash passcode with `createHash('sha256').update(passcode).digest('hex')`; (c) if hash !== `process.env.GATE_HASH`, log `[gate] invalid passcode attempt` (no hash/passcode values), return `{ error: 'Incorrect passcode. Please try again.' }`; (d) outside try/catch: `(await cookies()).set('portfolio-gate', 'authenticated', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/domains' })`; (e) `redirect(\`/domains/${slug}/\`)`.

3. **Create `src/components/domains/GateForm.tsx`** (`'use client'`): Import `useActionState` from `react`. Import `submitPasscode` from `@/app/domains/actions` (or relative path). `const [state, action, pending] = useActionState(submitPasscode, { error: null })`. Render: `<form action={action}>` containing hidden `<input name="slug" value={slug} type="hidden" />`, password `<input name="passcode" data-passcode-input ... />`, submit `<button data-passcode-submit type="submit" disabled={pending}>`, and if `state.error` → `<span data-gate-error>{state.error}</span>`. Prop: `slug: string`.

4. **Create `src/components/domains/DomainGatePage.tsx`** (server component, no `'use client'`): Props: `{ slug: string; domain: DomainEntry }`. Render outer wrapper with `data-route-visibility="protected"`, `data-gate-state="locked"`. Inside: a `<section data-protected-gate data-protected-proof-state="withheld">` with domain title, thesis, scope description, contact/request-access links (email + LinkedIn from site data), and `<GateForm slug={slug} />`. Use Tailwind utility classes for styling. All bracket-link styles (`font-mono`, `before:content-['[']`, `after:content-[']']`) applied via Tailwind or the CSS class defined in `globals.css`.

5. **Create `app/domains/[slug]/page.tsx`** (RSC): Import `cookies` from `next/headers`, `notFound` from `next/navigation`, `getDomainBySlug` from `src/data/domains/index`, `DomainGatePage`, `DomainProofPage` (import will be added in T04 — add the import but render a `<p>Authenticated — proof coming in T04</p>` stub for now). Read `const domain = getDomainBySlug(slug)`, call `notFound()` if null. Read `const cookieStore = await cookies()`, `const isAuthenticated = cookieStore.has('portfolio-gate')`. Render `<DomainGatePage>` if not authenticated, stub if authenticated. Export `generateStaticParams` returning all domain slugs (required for `trailingSlash: true` with static generation — or set `dynamic = 'force-dynamic'` to skip static generation for now since auth state is dynamic).

## Must-Haves

- [ ] `proxy.ts` exports `proxy` function and `config.matcher` matching `/domains/:path*`
- [ ] `proxy.ts` returns `NextResponse.next()` with `x-gate-status` header — no redirect
- [ ] `app/domains/actions.ts` uses `'use server'`, hashes with `node:crypto`, returns error state on mismatch
- [ ] `redirect()` in server action is NOT inside any try/catch block
- [ ] Cookie set with `httpOnly: true`, `secure: NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/domains'`, no `maxAge`/`expires`
- [ ] `GateForm.tsx` has `data-passcode-input`, `data-passcode-submit`, `data-gate-error` (only rendered when error exists)
- [ ] `DomainGatePage.tsx` has `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, `data-protected-proof-state="withheld"` — ALL four required markers
- [ ] `app/domains/[slug]/page.tsx` reads cookie via `await cookies()` — never synchronous
- [ ] Playwright tests 1–3 pass; tests 4–5 fail on proof selectors (expected)

## Verification

- `curl -s http://localhost:3000/domains/product/ | grep -c "data-protected-gate"` → returns `1`
- `curl -s http://localhost:3000/domains/product/ | grep -c "data-flagship-highlights"` → returns `0` (zero leakage)
- `curl -I http://localhost:3000/domains/product/ | grep x-gate-status` → `x-gate-status: locked`
- `npx playwright test tests/e2e/gate.spec.ts -g "cold load|HTML leakage|wrong passcode"` → 3 passing
- `next build` still exits 0

## Observability Impact

- Signals added/changed: `x-gate-status: locked|authenticated` response header on all `/domains/*` requests (inspectable via `curl -I`); `[gate] invalid passcode attempt` log in `next dev` console on wrong passcode (no sensitive values)
- How a future agent inspects this: `curl -I http://localhost:3000/domains/product/` for `x-gate-status`; `curl -s http://localhost:3000/domains/product/ | grep "data-"` for DOM marker presence; Playwright test output for structured assertions
- Failure state exposed: Wrong passcode → `{ error: '...' }` returned from server action → `data-gate-error` in DOM; missing `GATE_HASH` env var → server action always returns error (fail-secure behavior, not a crash)

## Inputs

- `package.json` with Next.js 16, `next.config.ts` with `trailingSlash: true` (from T01)
- `playwright.config.ts`, `tests/e2e/gate.spec.ts`, `.env.local` with `GATE_HASH` (from T02)
- `src/data/domains/index.ts` — `getDomainBySlug`, `domainSlugs`
- `src/data/domains/types.ts` — `DomainEntry` type for component props
- `src/data/site.ts` — site config (contact links) for gate page

## Expected Output

- `proxy.ts` — Node.js runtime proxy with `x-gate-status` header, no redirect
- `app/domains/actions.ts` — `submitPasscode` server action: hash + compare + cookie + redirect
- `src/components/domains/GateForm.tsx` — `'use client'` form with `useActionState`, all required `data-*` attributes
- `src/components/domains/DomainGatePage.tsx` — server component with full DOM marker contract, no proof content
- `app/domains/[slug]/page.tsx` — RSC route: gate for unauthenticated, stub for authenticated (T04 replaces stub)
