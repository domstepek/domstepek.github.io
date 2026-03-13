# GSD State

**Active Milestone:** M005 — Next.js Migration
**Last Completed Slice:** S01 — Server-side portfolio gate on Next.js ✅ COMPLETE (artifacts written)
**Phase:** S01 done — ready for S02 (and S03 in parallel)

## S01 Verification (Final)
- ✅ `npx playwright test tests/e2e/gate.spec.ts` → 5 passed (0 failed)
- ✅ `next build` → exits 0, /domains/[slug] is dynamic (ƒ)
- ✅ Unauthenticated HTML: `curl http://localhost:3000/domains/product/ | grep -c data-flagship-highlights` → 0
- ✅ Authenticated HTML: `curl ... -H 'Cookie: portfolio-gate=authenticated' | grep -c data-flagship-highlights` → 1
- ✅ R301 validated and moved from Active → Validated in REQUIREMENTS.md
- ✅ S01-SUMMARY.md and S01-UAT.md written
- ✅ S01 marked [x] in M005-ROADMAP.md

## Slice Progress
- [x] S01 — Server-side portfolio gate on Next.js (COMPLETE)
- [ ] S02 — Public pages and notes pipeline (ready to start)
- [ ] S03 — Shader and interactive client components (ready to start, parallel with S02)
- [ ] S04 — Vercel deployment, CI, and final integration (depends on S01+S02+S03)

## Key Notes for S02+
- App directory is `src/app/` (not `app/`) — all plan references to `app/X` mean `src/app/X`
- `typescript.ignoreBuildErrors: true` is set in next.config.ts; revert in S04 after Astro files removed
- `src/astro-env-compat.d.ts` is a migration shim — remove in S04
- Tailwind v4 tokens are in `src/app/globals.css` `@theme` block — extend there, not a separate tailwind.config.js
- proxy.ts middleware manifest issue: `x-gate-status` header not appearing in curl (middleware-manifest.json empty). Gate enforcement works via RSC cookie check. Investigate in S04.
- Gate cookie name: `portfolio-gate`, path: `/domains`, no maxAge (session-scoped per D037)
- dotenv installed but unused — remove in S04 cleanup

## Blockers
- None

## Next Action
Begin S02 — public pages (/, /about, /resume, /notes/*)
