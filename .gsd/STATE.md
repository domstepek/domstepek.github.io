# GSD State

**Active Milestone:** M005 — Next.js Migration
**Last Completed Slice:** S02 — Public pages and notes pipeline
**Phase:** Ready for S03 — Shader and interactive client components

## Slice Progress
- [x] S01 — Server-side portfolio gate on Next.js (COMPLETE)
- [x] S02 — Public pages and notes pipeline (COMPLETE — 8 public + 5 gate = 13 tests pass)
- [ ] S03 — Shader and interactive client components (ready to start — depends on S01 only)
- [ ] S04 — Vercel deployment, CI, and final integration (depends on S01+S02+S03)

## Verification Status
- ✅ `npx playwright test tests/e2e/public.spec.ts` → 8/8 pass
- ✅ `npx playwright test tests/e2e/gate.spec.ts` → 5/5 pass
- ✅ `npm run build` → exits 0

## Key Notes for S03+
- App directory is `src/app/` (not `app/`) — all plan references to `app/X` mean `src/app/X`
- `typescript.ignoreBuildErrors: true` is set in next.config.ts; revert in S04 after Astro files removed
- Root layout has full site shell: skip-link, header, `<main class="site-main shell">`, footer, CRT overlay
- Shader canvas should go outside `<main>` as direct body child (matching D029 — below CRT overlay z-index)
- TerminalPanel is in `src/components/layout/TerminalPanel.tsx` — used by pages and 404
- Notes pipeline uses `src/lib/notes.ts` — gray-matter + unified/remark/rehype
- All page components are server components — client interactivity must be 'use client' wrappers
