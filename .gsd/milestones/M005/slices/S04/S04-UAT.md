# S04: Vercel deployment, CI, and final integration — UAT

**Milestone:** M005
**Written:** 2026-03-13

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: This slice is operational infrastructure — file deletion, TypeScript strictness, CI workflow creation, and documentation update. All outcomes are verifiable by command output and file inspection. No user-facing behavior changes; the Playwright suite covering user-visible behavior was established in S01–S03.

## Preconditions

- `pnpm install` completed
- `.env.local` has `GATE_HASH` and `GATE_TEST_PASSCODE` set
- Playwright browsers installed (`npx playwright install`)

## Smoke Test

Run `npx playwright test --reporter=list` against production build — all 18 tests pass, confirming the complete site works end-to-end after Astro cleanup and TypeScript strictness restoration.

## Test Cases

### 1. Astro remnants fully removed

1. `find src -name '*.astro' | wc -l`
2. `ls tests/*.test.mjs 2>/dev/null | wc -l`
3. `ls scripts/validate-m002-s0*.mjs 2>/dev/null | wc -l`
4. **Expected:** All return 0

### 2. TypeScript strict across full tree

1. `grep -c ignoreBuildErrors next.config.ts`
2. `npx tsc --noEmit`
3. **Expected:** grep returns 0; tsc exits 0 with no errors

### 3. Production build succeeds

1. `npm run build`
2. **Expected:** Exits 0, route table shows 8 routes

### 4. Full Playwright suite passes against production build

1. `CI=true npm run build`
2. `CI=true npx playwright test --reporter=list`
3. **Expected:** 18/18 tests pass

### 5. GitHub Actions CI workflow is correct

1. `cat .github/workflows/ci.yml`
2. **Expected:** Contains push/PR triggers on main, pnpm + Node 22 setup, `secrets.GATE_HASH` and `secrets.GATE_TEST_PASSCODE`, frozen lockfile install, Playwright browser install, `.next/cache` caching, `npm run build`, `npx playwright test`, and artifact upload on failure

### 6. AGENTS.md reflects current stack

1. `grep -c "Next.js" AGENTS.md` → ≥1
2. `grep -c "Astro" AGENTS.md` → 0
3. `grep -c "Tailwind" AGENTS.md` → ≥1
4. `grep -c "Vercel" AGENTS.md` → ≥1
5. `grep -c "Playwright" AGENTS.md` → ≥1
6. `readlink CLAUDE.md` → `AGENTS.md`
7. **Expected:** All pass

## Edge Cases

### Old deploy workflow removed

1. `ls .github/workflows/deploy.yml 2>/dev/null`
2. **Expected:** File not found

### dotenv devDependency removed

1. `grep dotenv package.json | wc -l`
2. **Expected:** 0

## Failure Signals

- `tsc --noEmit` exits non-zero → TypeScript errors introduced or tsconfig misconfigured
- `npm run build` fails → build configuration issue or type errors leaking through
- Playwright tests fail against `next start` → production build regression
- `.github/workflows/ci.yml` missing or malformed → CI not gating merges
- AGENTS.md still mentions Astro → documentation not updated

## Requirements Proved By This UAT

- No new requirements are proved by this UAT. All 20 requirements were validated in S01–S03. This slice proves operational readiness: clean codebase, strict types, CI gating, and accurate documentation.

## Not Proven By This UAT

- Vercel deployment is live and functional (requires manual env var setup and DNS change — outside agent scope)
- CI workflow actually runs on GitHub (requires push to main — verifiable after commit)
- Production behavior on Vercel Edge/Serverless runtime (verifiable only after Vercel deployment)

## Notes for Tester

- The CI workflow references `secrets.GATE_HASH` and `secrets.GATE_TEST_PASSCODE` — these must be set as GitHub repository secrets before the workflow will pass on GitHub Actions.
- The Vercel deployment requires `GATE_HASH` to be set in the Vercel project's environment variables.
- DNS migration from GitHub Pages to Vercel for the custom domain is a manual step outside this slice's scope.
