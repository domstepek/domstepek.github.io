---
estimated_steps: 3
estimated_files: 1
---

# T03: Update AGENTS.md and final integration verification

**Slice:** S04 — Vercel deployment, CI, and final integration
**Milestone:** M005

## Description

Rewrite `AGENTS.md` to reflect the current Next.js + Tailwind v4 + Vercel stack, replacing all Astro-era references. This is the project's entry point for any future agent or contributor. Run the full verification suite one final time to confirm the complete integrated system works.

## Steps

1. **Rewrite `AGENTS.md`.** Update all sections:
   - **Stack:** Next.js App Router + TypeScript + Tailwind v4 + Vercel (remove Astro, plain CSS, GitHub Pages references)
   - **Commands:** `pnpm dev` (local dev), `pnpm build` (production build), `pnpm test` (Playwright test suite — the release gate), `tsc --noEmit` (type checking)
   - **Key Concepts:** Keep domain pages, public pages, shader, DOM marker contract. Update gate description from "passcode-gated" to "server-side auth (middleware + HttpOnly cookie)". Update notes description from "Astro content collections" to "gray-matter + unified markdown pipeline".
   - **Conventions:** Replace "Plain CSS only" with "Tailwind v4 utility classes + globals.css for component styles". Replace "Astro content collections" with "gray-matter + unified markdown pipeline in `src/lib/notes.ts`". Keep casual tone, retro aesthetic, data-in-TypeScript conventions.
   - Confirm `CLAUDE.md` symlink still points to `AGENTS.md` (do not recreate).

2. **Run full verification.** Execute `tsc --noEmit`, `npm run build`, and `npx playwright test --reporter=list` as a final integration check. All must pass.

3. **Flag Vercel deployment prerequisites.** Add a brief note (in the AGENTS.md or as terminal output) about manual steps outside agent scope: set `GATE_HASH` in Vercel project environment variables, and update DNS from GitHub Pages to Vercel if custom domain is desired.

## Must-Haves

- [ ] `AGENTS.md` describes Next.js + Tailwind + Vercel + Playwright stack
- [ ] `AGENTS.md` does not mention Astro, Puppeteer, or GitHub Pages as current stack
- [ ] `CLAUDE.md` symlink intact
- [ ] `tsc --noEmit` exits 0
- [ ] `npm run build` exits 0
- [ ] All 18 Playwright tests pass

## Verification

- `grep -c "Next.js" AGENTS.md` → ≥1
- `grep -c "Astro" AGENTS.md` → 0 (or only in historical context like "migrated from Astro")
- `readlink CLAUDE.md` → `AGENTS.md`
- `tsc --noEmit` → exit 0
- `npm run build` → exit 0
- `npx playwright test --reporter=list` → 18 passed

## Observability Impact

- Signals added/changed: None — this task updates documentation, not runtime
- How a future agent inspects this: Read `AGENTS.md` for project orientation; all commands listed there are executable and current
- Failure state exposed: None

## Inputs

- Current `AGENTS.md` with Astro-era content
- T01 output: clean TypeScript and build
- T02 output: production Playwright config and CI workflow
- S01–S03 summaries for accurate stack description
- `.gsd/DECISIONS.md` for decision references (D032–D050)

## Expected Output

- `AGENTS.md` — fully updated to reflect the Next.js + Tailwind v4 + Vercel stack with accurate commands, conventions, and key concepts
- Final green verification: `tsc --noEmit` + `npm run build` + `npx playwright test` all passing
