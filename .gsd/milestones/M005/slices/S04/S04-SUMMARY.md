---
id: S04
parent: M005
milestone: M005
provides:
  - Clean codebase with zero Astro remnants (38 files deleted)
  - Full-tree TypeScript strict checking (ignoreBuildErrors removed)
  - Production Playwright config (CI uses next start, local uses next dev)
  - GitHub Actions CI workflow as the release gate for main
  - AGENTS.md fully updated to reflect Next.js + Tailwind v4 + Vercel + Playwright stack
requires:
  - slice: S01
    provides: Next.js App Router project with gate auth, Playwright infrastructure
  - slice: S02
    provides: Public pages, notes pipeline, custom 404
  - slice: S03
    provides: ShaderBackground, ScreenshotGallery, MermaidDiagram client components
affects: []
key_files:
  - tsconfig.json
  - next.config.ts
  - package.json
  - playwright.config.ts
  - .github/workflows/ci.yml
  - AGENTS.md
key_decisions:
  - "D051: Playwright webServer uses npm run start (not build && start) in CI — Playwright leaks NODE_ENV that breaks next build; CI builds separately"
patterns_established:
  - "tsc --noEmit is the authoritative type-safety gate for the full src/ tree"
  - "CI workflow is the release gate: push/PR to main triggers build + full Playwright suite"
  - "AGENTS.md is the single source of truth for project orientation"
observability_surfaces:
  - "GitHub Actions CI status on push/PR to main"
  - "Playwright HTML report uploaded as artifact on test failure (retention: 14 days)"
  - "tsc --noEmit catches all type errors across entire src/ tree"
  - "next build route table confirms routing correctness (8 routes)"
drill_down_paths:
  - .gsd/milestones/M005/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S04/tasks/T02-SUMMARY.md
  - .gsd/milestones/M005/slices/S04/tasks/T03-SUMMARY.md
duration: ~15m
verification_result: passed
completed_at: 2026-03-13
---

# S04: Vercel deployment, CI, and final integration

**Removed all Astro remnants, restored TypeScript strictness, created GitHub Actions CI workflow gating on build + Playwright, and updated AGENTS.md — the full Next.js stack is production-ready with 18/18 Playwright tests passing against `next start`.**

## What Happened

1. **Astro cleanup (T01):** Deleted 38 Astro-era files/directories — 20 `.astro` files, old Puppeteer tests, dist validators, config shims, `public/CNAME`, and the `.astro/` cache. Broadened `tsconfig.json` to cover all `src/**/*.ts(x)`. Removed `typescript.ignoreBuildErrors` from `next.config.ts`. Removed `dotenv` devDependency.

2. **CI workflow (T02):** Updated `playwright.config.ts` webServer to be CI-conditional (`npm run start` when `CI` is set, `npm run dev` otherwise). Deleted old GitHub Pages deploy workflow. Created `.github/workflows/ci.yml` with pnpm + Node 22, frozen lockfile install, Playwright browser install, `.next/cache` caching, gate secrets forwarding, `npm run build` + `npx playwright test`, and HTML report artifact upload on failure.

3. **AGENTS.md (T03):** Fully rewrote AGENTS.md to describe Next.js App Router + Tailwind v4 + Vercel + Playwright stack with accurate commands, key concepts, conventions, and deployment prerequisites. Confirmed `CLAUDE.md` symlink intact.

4. **Final verification:** `tsc --noEmit` exits 0, `npm run build` exits 0 (8 routes), all 18 Playwright tests pass against `next start`.

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` → exit 0 | ✅ |
| `npm run build` → exit 0 (8 routes) | ✅ |
| `npx playwright test --reporter=list` → 18/18 pass | ✅ |
| `.github/workflows/ci.yml` exists with correct structure | ✅ |
| `AGENTS.md` contains Next.js, Tailwind, Vercel, Playwright | ✅ |
| `AGENTS.md` contains zero Astro references | ✅ |
| `CLAUDE.md` → `AGENTS.md` symlink intact | ✅ |
| `find src -name '*.astro' \| wc -l` → 0 | ✅ |
| `ls tests/*.test.mjs 2>/dev/null \| wc -l` → 0 | ✅ |
| `grep -c ignoreBuildErrors next.config.ts` → 0 | ✅ |

## Requirements Advanced

- None — all requirements were already validated in S01–S03.

## Requirements Validated

- None newly validated — all 20 requirements were already in validated status. This slice provides operational infrastructure (CI, cleanup, documentation) that supports ongoing validation.

## New Requirements Surfaced

- None.

## Requirements Invalidated or Re-scoped

- None.

## Deviations

- Playwright webServer uses `npm run start` instead of the planned `npm run build && npm run start` in CI (D051). Playwright leaks a non-standard `NODE_ENV` that breaks `next build` during prerender. The CI workflow runs `npm run build` as a separate step instead. This is cleaner and avoids redundant rebuilds.

## Known Limitations

- Vercel deployment requires `GATE_HASH` env var to be set in the Vercel project dashboard (manual, outside agent scope).
- DNS for custom domain must be updated from GitHub Pages to Vercel (manual, outside agent scope).
- React "key" prop warnings appear in server render output (cosmetic, from Next.js internals — does not affect tests or production behavior).

## Follow-ups

- Set `GATE_HASH` in Vercel environment variables before first deploy.
- Update DNS records from GitHub Pages to Vercel for custom domain.
- Consider adding `pnpm test` as the `package.json` test script for convenience.

## Files Created/Modified

- `tsconfig.json` — broadened include to all `src/**/*.ts(x)`, removed Astro exclusions
- `next.config.ts` — removed `typescript.ignoreBuildErrors` block
- `package.json` / `pnpm-lock.yaml` — removed `dotenv` devDependency
- `playwright.config.ts` — CI-conditional webServer command
- `.github/workflows/ci.yml` — new CI workflow (build + Playwright + caching + artifact upload)
- `.github/workflows/deploy.yml` — deleted (old GitHub Pages workflow)
- `AGENTS.md` — fully rewritten for Next.js stack
- 38 Astro-era files deleted (see T01-SUMMARY for full inventory)

## Forward Intelligence

### What the next slice should know
- All 20 requirements are validated. M005 milestone completion requires only the final milestone-level ceremony (audit, summary, archive).
- The Vercel deployment is not yet live — requires manual env var setup and DNS change.

### What's fragile
- Playwright's `NODE_ENV` leak (D051) — if Playwright fixes this, the CI separation of build/start can be simplified back to a single webServer command.
- `.next/cache` in CI — caching keyed on `pnpm-lock.yaml` hash works well but can produce stale caches if build config changes without lockfile changes.

### Authoritative diagnostics
- `npx playwright test --reporter=list` against `next start` — the definitive integration health check (18 tests covering gate, public, shader, gallery).
- `tsc --noEmit` — the type-safety gate covering the full `src/` tree.
- GitHub Actions CI tab — the release gate for any push/PR to main.

### What assumptions changed
- D051: The plan assumed Playwright could run `next build && next start` as the webServer command. In practice, Playwright's subprocess environment conflicts with `next build`. Separating them into distinct CI steps is the correct approach.
