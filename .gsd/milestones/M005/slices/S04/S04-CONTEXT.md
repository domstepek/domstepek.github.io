---
id: S04
milestone: M005
status: ready
---

# S04: Vercel deployment, CI, and final integration — Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

## Goal

Wire GitHub Actions CI (blocking `next build` + full Playwright suite), deploy the complete Next.js app to Vercel at `jean-dominique-stepek.is-a.dev`, retire the GitHub Pages workflow, remove all Astro migration artifacts, and verify the live deployment end-to-end.

## Why this Slice

S04 is the last slice because it depends on all three prior slices being complete and individually verified. It proves the assembled system works — not just in `next dev` against `localhost`, but in a production-like `next start` build and on the live Vercel deployment. The milestone is not done until a visitor can hit the real URL and the gate, public pages, shader, gallery, and notes all work correctly.

## Scope

### In Scope

- **GitHub Actions CI workflow** — new `.github/workflows/ci.yml` replacing `deploy.yml`; runs `next build` + full Playwright suite (`npx playwright test`) on every push to `main` and on PRs; deployment to Vercel is triggered only after CI passes (blocking on test failure)
- **Vercel project setup and deployment** — Vercel project configured for this repo; deploys from `main` branch; environment variables (`GATE_HASH`, `NEXT_PUBLIC_SITE_URL`) set in Vercel project settings; `GATE_TEST_PASSCODE` set as a GitHub Actions secret for CI use
- **Custom domain** — `jean-dominique-stepek.is-a.dev` pointed to Vercel via DNS CNAME update on is-a.dev; `public/CNAME` file removed (GitHub Pages-specific artifact)
- **GitHub Pages retirement** — old `.github/workflows/deploy.yml` deleted once Vercel deployment is confirmed live and tests pass; GitHub Pages deployment disabled
- **Astro migration cleanup** — remove `astro.config.mjs.bak`, `src/astro-env-compat.d.ts`, `src/pages/` (Astro pages), `src/components/**/*.astro` (Astro components), `src/content.config.ts` (Astro content config), `scripts/validate-m002-s*.mjs`, `tests/helpers/site-boundary-fixtures.mjs`, unused `dotenv` dependency; remove `typescript.ignoreBuildErrors: true` from `next.config.ts`
- **`AGENTS.md` update** — rewrite to reflect Next.js App Router stack, Vercel deployment, Playwright test commands, updated key concepts and environment setup; update `CLAUDE.md` symlink if it exists
- **Integrated Playwright test run** — run the full assembled test suite (gate + public routes + shader + notes) against `next start` (production-like) before calling S04 complete; this is the milestone's final proof
- **`proxy.ts` manifest investigation** — investigate and fix the `x-gate-status` header not appearing (known issue from S01 T03); if unfixable without major rework, document clearly in AGENTS.md and close with a known-limitation note

### Out of Scope

- Adding new pages, content, or features
- Changing the custom domain to anything other than `jean-dominique-stepek.is-a.dev`
- Setting up multiple Vercel environments (preview vs production) — single production deployment only
- Blue-green or staged rollout — deploy directly to production
- Monitoring, analytics, or error tracking beyond what Vercel provides by default
- Preview deployments for PRs (Vercel's default PR preview behavior is acceptable as-is; no custom configuration needed)

## Constraints

- **Full Playwright suite must pass before Vercel deploys** — CI blocks the deploy on test failure; Vercel does not auto-deploy independently of CI passing. The deployment gate is: `next build` exits 0 + all Playwright tests pass → Vercel deploy triggers.
- **Same custom domain** — `jean-dominique-stepek.is-a.dev` must point to Vercel on completion. DNS change requires updating the CNAME record at is-a.dev from GitHub Pages to Vercel's assigned domain.
- **GitHub Pages retired on cutover** — once Vercel is confirmed live (DNS resolves, site works), the GitHub Pages deploy workflow is deleted. No extended parallel period.
- **Remove `typescript.ignoreBuildErrors: true`** — S04 must re-enable TypeScript build checking in `next.config.ts` after Astro files are removed. Type errors in S02/S03 code may surface and must be fixed before S04 is complete.
- **`GATE_HASH` is server-only** — the hashed passcode must be set as a Vercel environment variable (not `NEXT_PUBLIC_*`). `GATE_TEST_PASSCODE` must be set as a GitHub Actions secret (not committed anywhere) for Playwright to authenticate during CI runs.
- **Playwright against `next start`** — final integrated test run uses `next start` (production mode), not `next dev`. `playwright.config.ts` must be updated to support both modes or have a separate production config.
- **Node 20+ in CI** — `process.loadEnvFile()` (used in `playwright.config.ts`) requires Node 20.12+. CI must use `node-version: '20'` or higher.

## Integration Points

### Consumes

- Complete Next.js app from S01+S02+S03: gate, public pages, notes pipeline, shader, gallery, Mermaid
- `.github/workflows/deploy.yml` — existing CI/CD workflow; replaced by new workflow
- `public/CNAME` — GitHub Pages domain file; removed
- `astro.config.mjs.bak`, `src/astro-env-compat.d.ts`, `src/pages/`, Astro component files — migration artifacts; deleted
- `AGENTS.md` — rewritten for Next.js stack
- `.env.local.example` — documents required env var keys for Vercel setup reference

### Produces

- `.github/workflows/ci.yml` — new workflow: `next build` + `npx playwright test` on push to `main` and PRs; triggers Vercel deploy on pass
- Vercel project with `main` branch deployment, `GATE_HASH` + `NEXT_PUBLIC_SITE_URL` env vars set
- DNS: `jean-dominique-stepek.is-a.dev` CNAME → Vercel domain
- `AGENTS.md` — rewritten: Next.js App Router, Vercel hosting, Playwright commands (`npx playwright test`), env var setup, proxy.ts observability
- Clean `next.config.ts` — `typescript.ignoreBuildErrors` removed; type checking re-enabled
- Deleted: `astro.config.mjs.bak`, `src/astro-env-compat.d.ts`, `src/pages/`, Astro `.astro` component files, `scripts/validate-m002-s*.mjs`, `tests/helpers/site-boundary-fixtures.mjs`, `public/CNAME`, `.github/workflows/deploy.yml`
- Verified: live Vercel deployment at `jean-dominique-stepek.is-a.dev` with full Playwright suite passing in CI

## Open Questions

- **`proxy.ts` manifest fix** — the `x-gate-status` observability header doesn't appear in HTTP responses due to a suspected Turbopack manifest bug (S01 T03 known limitation). S04 should investigate this; if fixable, fix it. If not fixable without major framework changes, document it clearly in AGENTS.md as a known limitation. Gate enforcement is unaffected either way.
- **Vercel deploy trigger mechanism** — the exact mechanism for "deploy only after CI passes" needs to be worked out during planning. Options include: Vercel's "ignored build command" returning non-zero to skip non-CI deploys, a GitHub Actions step that calls the Vercel deploy hook after tests pass, or Vercel's native GitHub integration with branch protection rules. The right approach depends on how the Vercel project is configured; resolve during S04 planning.
