# S01: Server-side portfolio gate on Next.js — UAT

**Milestone:** M005
**Written:** 2026-03-13

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: Gate auth requires a real running server (cookie setting, server action redirect, RSC conditional rendering) — static artifact inspection is insufficient for auth flow validation. All 5 assertions are executed by Playwright against `next dev`, which is the highest-fidelity pre-production proof available without a live Vercel deployment.

## Preconditions

1. `npm install` completed
2. `.env.local` exists with `GATE_HASH` and `GATE_TEST_PASSCODE` (see `.env.local.example` for key names)
3. `npm run dev` is running on port 3000 (or Playwright will auto-start it)
4. No `portfolio-gate` cookie set in the test browser context

## Smoke Test

Run `npx playwright test tests/e2e/gate.spec.ts --reporter=list` — all 5 tests should pass in under 10 seconds. If any fail, gate enforcement is broken.

## Test Cases

### 1. Cold-load gate markers on unauthenticated visit

1. Open `http://localhost:3000/domains/product/` with no cookies set
2. Inspect the response HTML
3. **Expected:** `[data-protected-gate]` present, `data-gate-state="locked"`, `data-protected-proof-state="withheld"`, `data-route-visibility="protected"`. No `data-flagship-highlights`, `data-supporting-work`, `data-flagship`, or `data-supporting-item` in the DOM.

### 2. Zero-leakage HTML assertion

1. Fetch `http://localhost:3000/domains/product/` via `curl -s` (no cookie)
2. Inspect raw response body text
3. **Expected:** The strings `data-flagship-highlights`, `data-supporting-work`, `data-flagship`, `data-supporting-item` do not appear anywhere in the response body. Proof content is never shipped to an unauthenticated client.

### 3. Wrong passcode shows error

1. Open `/domains/product/` unauthenticated
2. Locate `[data-passcode-input]` and type an incorrect passcode
3. Click `[data-passcode-submit]`
4. **Expected:** `[data-gate-error]` becomes visible in the DOM. The gate remains locked — `data-gate-state="locked"` and `data-protected-proof-state="withheld"` still present.

### 4. Correct passcode auth + proof render

1. Open `/domains/product/` unauthenticated
2. Enter the correct passcode (value of `GATE_TEST_PASSCODE`) in `[data-passcode-input]`
3. Click `[data-passcode-submit]`
4. **Expected:** Browser redirects to `/domains/product/`. Page renders with `data-protected-proof-state="revealed"` and `[data-flagship-highlights]` visible. `portfolio-gate` cookie is set (HttpOnly, path `/domains`).

### 5. Cross-route session persistence

1. Authenticate on `/domains/product/` as in test 4
2. Navigate to `/domains/platform/`
3. **Expected:** Proof page renders immediately without re-entering the passcode. `data-protected-proof-state="revealed"` present on the new domain. No gate form shown.

## Edge Cases

### Missing GATE_HASH env var

1. Remove or blank `GATE_HASH` from `.env.local`
2. Restart `next dev`
3. Submit any passcode on `/domains/product/`
4. **Expected:** Server action returns an error state (fail-secure). `[data-gate-error]` appears. Proof content never rendered. `[gate] invalid passcode attempt` logged to server console.

### Non-existent domain slug

1. Navigate to `http://localhost:3000/domains/nonexistent/`
2. **Expected:** Next.js 404 page. No gate form, no proof content.

### Direct authenticated curl with cookie

1. `curl -s http://localhost:3000/domains/product/ -H 'Cookie: portfolio-gate=authenticated'`
2. **Expected:** Response body contains `data-flagship-highlights` (count ≥ 1).

## Failure Signals

- Any Playwright test failure → gate enforcement or auth flow is broken
- `data-flagship-highlights` present in unauthenticated curl response → zero-leakage regression
- `[data-gate-error]` visible after correct passcode → hash mismatch or `GATE_HASH` env var missing
- `data-protected-proof-state` still `"withheld"` after correct passcode → redirect or cookie-setting failure
- `next build` non-zero exit → TypeScript or compilation error introduced

## Requirements Proved By This UAT

- **R301** (Server-side access control for portfolio gate) — Proved by: zero-leakage assertion (test 2) confirms proof content is never in the unauthenticated HTTP response; auth flow (test 4) confirms HttpOnly cookie + server-rendered proof after correct passcode; cross-route persistence (test 5) proves session works across protected routes without leaking proof.
- **R102** (Domain portfolio pages require passcode before protected proof is shown) — Re-validated for the Next.js implementation: cold-load gate (test 1) proves gate state is shown first; tests 2–4 prove the complete gate→auth→proof flow.
- **R104** (Unlock persists for current browser session across protected routes) — Re-validated: test 5 proves the HttpOnly session cookie carries across domain routes without re-authentication.

## Not Proven By This UAT

- **Public pages** (`/`, `/about`, `/resume`, `/notes/*`) not rendered or tested — S02 scope
- **Retro visual aesthetic** — not visually verified; spot-check deferred to S01 UAT human review or S03 completion
- **Shader rendering** — S03 scope; `ShaderBackground` not yet mounted in Next.js layout
- **`x-gate-status` response header** — proxy.ts compiles but header does not appear due to middleware-manifest issue; this observability surface is not verified
- **Vercel production deployment** — S04 scope; tests run against `next dev` only
- **Cookie `secure` flag** — set to `NODE_ENV === 'production'` so it is `false` in dev/test environment; production behavior requires S04 Vercel deployment verification
- **GitHub Actions CI** — S04 scope; tests not yet run in CI pipeline

## Notes for Tester

- The `GATE_TEST_PASSCODE` value is in `.env.local` (gitignored). Ask the project owner if you don't have it; `.env.local.example` lists required key names.
- The `x-gate-status` header will not appear in `curl -I` output due to a known proxy manifest issue — this is a known limitation, not a sign the gate is broken.
- `data-visual-state="revealed"` is present on the proof page outer wrapper for backward compatibility with M002 test contracts, even though no blur animation exists in M005.
- Tests run sequentially (1 worker) to prevent session state collisions between tests.
