# S04: Vercel deployment, CI, and final integration

**Goal:** The complete Next.js site is production-ready with Astro remnants removed, TypeScript strict, CI gating on build + Playwright, and AGENTS.md reflecting the new stack.
**Demo:** `tsc --noEmit` exits 0, `next build` exits 0, all 18 Playwright tests pass against `next start` (production build), GitHub Actions workflow is in place, and AGENTS.md describes the current Next.js + Tailwind + Vercel stack.

## Must-Haves

- All Astro files, old Puppeteer tests, old dist validators, and GitHub Pages artifacts deleted
- `typescript.ignoreBuildErrors` removed from `next.config.ts`; `tsconfig.json` updated so `tsc --noEmit` exits 0
- `dotenv` devDependency removed
- Playwright config uses `next build && next start` in CI (production build, not dev mode)
- GitHub Actions CI workflow: pnpm + Node 22 + install + build + Playwright, with GitHub secrets for `GATE_HASH` and `GATE_TEST_PASSCODE`, caching, and report artifact upload on failure
- All 18 Playwright tests pass against `next start`
- `AGENTS.md` (and `CLAUDE.md` symlink) updated to reflect Next.js + Tailwind + Vercel + Playwright stack

## Proof Level

- This slice proves: operational
- Real runtime required: yes — Playwright against production `next start` build
- Human/UAT required: no — CI workflow structure is verifiable by file inspection; Vercel deployment requires env vars set in dashboard (flagged, not agent-executable)

## Verification

- `tsc --noEmit` exits 0
- `npm run build` exits 0
- `npx playwright test --reporter=list` (against `next start`) → 18/18 pass
- `.github/workflows/ci.yml` exists with correct structure (inspectable via `cat`)
- `AGENTS.md` contains "Next.js", "Tailwind", "Vercel", "Playwright" and no longer mentions "Astro" as current stack
- No `.astro` files remain: `find src -name '*.astro' | wc -l` → 0
- No old test files remain: `ls tests/*.test.mjs 2>/dev/null | wc -l` → 0

## Observability / Diagnostics

- Runtime signals: `tsc --noEmit` exit code is the type-safety signal; `next build` route table shows all generated routes; Playwright `--reporter=list` shows per-test pass/fail
- Inspection surfaces: `cat .github/workflows/ci.yml` to verify CI structure; `grep -c ignoreBuildErrors next.config.ts` → 0 to confirm strictness restored
- Failure visibility: Playwright HTML report uploaded as CI artifact on failure; `tsc --noEmit` errors printed to stdout with file:line:column
- Redaction constraints: `GATE_HASH` and `GATE_TEST_PASSCODE` are GitHub secrets — never echoed in workflow logs

## Integration Closure

- Upstream surfaces consumed: All S01–S03 output: complete Next.js app with gate, public pages, notes, shader, gallery, and 18 Playwright tests
- New wiring introduced in this slice: Playwright webServer command switches to production build in CI; GitHub Actions CI workflow replaces GitHub Pages deploy workflow; `tsconfig.json` broadened to cover all `src/` code after Astro removal
- What remains before the milestone is truly usable end-to-end: Vercel environment variables (`GATE_HASH`) must be set in dashboard before first deploy; DNS for custom domain must be updated from GitHub Pages to Vercel (manual, outside agent scope)

## Tasks

- [x] **T01: Delete Astro files, tighten TypeScript, and verify production build** `est:30m`
  - Why: Removes all Astro-era dead code and restores TypeScript strictness — prerequisite for CI to meaningfully gate on type errors
  - Files: `next.config.ts`, `tsconfig.json`, `package.json`, all `.astro` files, old test/validator files, `public/CNAME`, `src/styles/`, `src/astro-env-compat.d.ts`, `src/env.d.ts`, `src/content.config.ts`, `astro.config.mjs.bak`, `.astro/`
  - Do: Delete all files from the cleanup inventory (38 files across 8 categories). Update `tsconfig.json` include/exclude to cover all `src/` code. Remove `typescript.ignoreBuildErrors` from `next.config.ts`. Remove `dotenv` from devDependencies. Fix any type errors surfaced by `tsc --noEmit`.
  - Verify: `tsc --noEmit` exits 0, `npm run build` exits 0, `find src -name '*.astro' | wc -l` → 0
  - Done when: Zero Astro files on disk, TypeScript strict, production build clean

- [x] **T02: Production Playwright config and GitHub Actions CI workflow** `est:25m`
  - Why: CI must test the production build (not dev mode) and gate merges — the release gate for the new stack
  - Files: `playwright.config.ts`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`
  - Do: Update `playwright.config.ts` webServer command to use `npm run build && npm run start` when `process.env.CI` is set. Delete old `deploy.yml`. Create `ci.yml` with pnpm + Node 22 + Playwright install + build + test, GitHub secrets, `.next/cache` caching, and report artifact upload on failure. Run full Playwright suite locally against `next start` to confirm production-mode passing.
  - Verify: `CI=true npx playwright test --reporter=list` → 18/18 pass (against `next start`); `cat .github/workflows/ci.yml` shows correct structure
  - Done when: All 18 tests pass against production build; CI workflow file is committed and correct

- [x] **T03: Update AGENTS.md and final integration verification** `est:15m`
  - Why: AGENTS.md is the project's entry point for any future agent — must reflect the current stack, commands, and conventions
  - Files: `AGENTS.md`
  - Do: Rewrite AGENTS.md to describe Next.js App Router + Tailwind v4 + Vercel stack, `pnpm test` as release gate, Playwright tests, `src/app/` routing, middleware cookie auth model, notes pipeline via gray-matter + unified. Preserve the CLAUDE.md symlink. Run full verification suite one final time.
  - Verify: `AGENTS.md` contains current stack info; `CLAUDE.md` symlink intact; `tsc --noEmit` + `npm run build` + `npx playwright test` all pass
  - Done when: AGENTS.md accurately describes the live project; all verification passes

## Files Likely Touched

- `next.config.ts`
- `tsconfig.json`
- `package.json`
- `pnpm-lock.yaml`
- `playwright.config.ts`
- `.github/workflows/ci.yml` (new)
- `.github/workflows/deploy.yml` (deleted)
- `AGENTS.md`
- All `.astro` files (deleted — 12 components + 8 pages)
- `src/components/domains/domain-gate-client.ts` (deleted)
- `src/components/domains/domain-proof-view.ts` (deleted)
- `src/content.config.ts`, `src/env.d.ts`, `src/astro-env-compat.d.ts` (deleted)
- `astro.config.mjs.bak` (deleted)
- `.astro/` (deleted)
- `src/styles/global.css` (deleted)
- `tests/*.test.mjs`, `tests/helpers/` (deleted)
- `scripts/validate-m002-s*.mjs` (deleted)
- `public/CNAME` (deleted)
