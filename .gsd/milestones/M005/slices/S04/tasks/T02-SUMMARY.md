---
id: T02
parent: S04
milestone: M005
provides:
  - Production Playwright config (CI uses `next start`, local uses `next dev`)
  - GitHub Actions CI workflow as the release gate for main
key_files:
  - playwright.config.ts
  - .github/workflows/ci.yml
key_decisions:
  - "Playwright webServer uses `npm run start` (not `npm run build && npm run start`) in CI because Playwright's subprocess environment leaks a non-standard NODE_ENV that breaks `next build`. The CI workflow runs `npm run build` as a separate prior step."
patterns_established:
  - "CI workflow is the release gate: push/PR to main triggers build + full Playwright suite"
  - "Local CI-mode testing: `CI=true npm run build && CI=true npx playwright test`"
observability_surfaces:
  - "GitHub Actions CI status on push/PR to main"
  - "Playwright HTML report uploaded as artifact on test failure (retention: 14 days)"
  - "Local: `CI=true npx playwright test --reporter=list` shows per-test pass/fail against production build"
duration: 1 step
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Production Playwright config and GitHub Actions CI workflow

**Replaced old GitHub Pages deploy workflow with a CI workflow that builds, tests against `next start`, and uploads Playwright reports on failure.**

## What Happened

1. Updated `playwright.config.ts` webServer command to be CI-conditional: uses `npm run start` when `CI` is set (tests against pre-built production output), `npm run dev` otherwise.

2. Deleted `.github/workflows/deploy.yml` — the old Astro/GitHub Pages deploy workflow.

3. Created `.github/workflows/ci.yml` with: push/PR triggers on main, `ubuntu-latest`, gate secrets forwarded via `secrets.GATE_HASH` and `secrets.GATE_TEST_PASSCODE`, pnpm + Node 22 setup, frozen lockfile install, Playwright browser install with deps, `.next/cache` caching keyed on lockfile hash, `npm run build`, `npx playwright test`, and Playwright report upload on failure.

4. Verified all 18 Playwright tests pass with `CI=true` against the production build (`next start`).

## Verification

- `CI=true npm run build` → exits 0, all routes generated
- `CI=true npx playwright test --reporter=list` → 18/18 passed (5.7s)
- `ls .github/workflows/deploy.yml` → file not found
- `cat .github/workflows/ci.yml` → correct triggers, secrets, steps, caching, artifact upload

Slice-level checks (partial — intermediate task):
- ✅ `npm run build` exits 0
- ✅ `npx playwright test --reporter=list` → 18/18 pass against `next start`
- ✅ `.github/workflows/ci.yml` exists with correct structure
- ⬜ `AGENTS.md` update (T03)
- ⬜ No `.astro` files remain (verified in T01)
- ⬜ No old test files remain (verified in T01)

## Diagnostics

- Check GitHub Actions tab for CI pass/fail status on any push/PR to main
- Download `playwright-report` artifact from failed CI runs for test-by-test diagnostics
- Locally reproduce CI: `CI=true npm run build && CI=true npx playwright test --reporter=list`
- Trace files captured on first retry (`trace: "on-first-retry"` in Playwright config)

## Deviations

Playwright webServer uses `npm run start` instead of `npm run build && npm run start` in CI. Running `next build` inside Playwright's subprocess fails because Playwright leaks a non-standard `NODE_ENV` value that Next.js rejects during static page generation (`/_global-error` prerender fails with `useContext` null). The CI workflow already runs `npm run build` as a separate step before Playwright, so the webServer only needs to start the already-built server. This is cleaner (no redundant rebuild) and avoids the environment conflict.

## Known Issues

- React "key" prop warnings in server-side render output (cosmetic, from Next.js internals — does not affect tests or production behavior)
- Next.js warns about non-standard `NODE_ENV` when Playwright runs `next start` — benign, server starts and serves correctly

## Files Created/Modified

- `playwright.config.ts` — webServer command conditional on `CI` env var
- `.github/workflows/ci.yml` — new CI workflow (build + Playwright + caching + artifact upload)
- `.github/workflows/deploy.yml` — deleted (old GitHub Pages workflow)
