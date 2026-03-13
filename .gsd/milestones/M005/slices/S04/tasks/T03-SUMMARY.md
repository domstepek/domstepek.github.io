---
id: T03
parent: S04
milestone: M005
provides:
  - AGENTS.md fully updated to reflect Next.js + Tailwind v4 + Vercel + Playwright stack
  - Final integration verification — all slice-level checks pass
key_files:
  - AGENTS.md
key_decisions: []
patterns_established:
  - AGENTS.md is the single source of truth for project orientation — commands listed there are executable and current
observability_surfaces:
  - none — documentation-only task
duration: 10m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T03: Update AGENTS.md and final integration verification

**Rewrote AGENTS.md to describe the current Next.js App Router + Tailwind v4 + Vercel stack and ran full integration verification (tsc + build + 18 Playwright tests).**

## What Happened

Replaced all Astro-era content in AGENTS.md with accurate descriptions of the current stack:
- **Stack**: Next.js App Router + TypeScript + Tailwind v4 + Vercel + Playwright
- **Commands**: `pnpm dev`, `pnpm build`, `pnpm test`, `tsc --noEmit`, plus CI reproduction command
- **Key Concepts**: Updated gate description to server-side auth (middleware + HttpOnly cookie), notes to gray-matter + unified pipeline, shader to client component pattern
- **Conventions**: Tailwind v4 utility classes, RSC page components, minimal `'use client'` isolation
- **Deployment**: Added section documenting Vercel env var (`GATE_HASH`) and DNS prerequisites

Confirmed `CLAUDE.md` symlink still points to `AGENTS.md`. Ran the complete verification suite as the final integration check for the slice.

## Verification

All task must-haves and all slice-level verification checks passed:

- `tsc --noEmit` → exit 0
- `npm run build` → exit 0, 8 routes generated
- `npx playwright test --reporter=list` → 18/18 passed
- `grep -c "Next.js" AGENTS.md` → 1 (≥1 ✓)
- `grep -c "Astro" AGENTS.md` → 0 ✓
- `grep -c "Tailwind" AGENTS.md` → 2 ✓
- `grep -c "Vercel" AGENTS.md` → 4 ✓
- `grep -c "Playwright" AGENTS.md` → 2 ✓
- `readlink CLAUDE.md` → `AGENTS.md` ✓
- `.github/workflows/ci.yml` exists ✓
- `grep -c ignoreBuildErrors next.config.ts` → 0 ✓
- `find src -name '*.astro' | wc -l` → 0 ✓
- `ls tests/*.test.mjs 2>/dev/null | wc -l` → 0 ✓

## Diagnostics

None — this task updates documentation, not runtime. Future agents read `AGENTS.md` for project orientation; all commands listed there are executable and current.

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `AGENTS.md` — fully rewritten to reflect Next.js + Tailwind v4 + Vercel + Playwright stack with accurate commands, conventions, key concepts, and deployment prerequisites
