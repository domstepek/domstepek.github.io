# S04: Vercel deployment, CI, and final integration — Research

**Date:** 2026-03-13

## Summary

S04 is a cleanup-and-deployment slice, not a feature slice. All four workstreams are well-understood: (1) delete Astro-era files and tighten the TypeScript config, (2) update `playwright.config.ts` to run against `next start` (production build) in CI, (3) replace the GitHub Pages deploy workflow with a GitHub Actions CI workflow that builds + runs Playwright and lets Vercel's GitHub integration handle deploys, and (4) update `AGENTS.md` to reflect the new stack.

The primary risk is ordering — the Astro file cleanup touches the TypeScript `include`/`exclude` lists, the `ignoreBuildErrors` flag, and the component directory structure, so cleanup must happen before `tsc --noEmit` can gate the build. The Vercel deployment itself is low-risk: Vercel auto-detects Next.js projects and the only configuration needed is environment variables (`GATE_HASH`) via the Vercel dashboard. No `vercel.json` is needed.

**Primary recommendation:** Execute as three tasks: (T01) Astro cleanup + tsconfig tightening + `ignoreBuildErrors` removal, (T02) GitHub Actions CI workflow with Playwright against production build, (T03) Vercel env vars + deployment verification + AGENTS.md update. All 18 Playwright tests should pass against `next start` before any deployment.

## Recommendation

### Task breakdown

**T01 — Astro cleanup and TypeScript strictness.** Delete all `.astro` files, `src/pages/`, `src/styles/`, `src/content.config.ts`, `src/env.d.ts`, `src/astro-env-compat.d.ts`, `astro.config.mjs.bak`, `.astro/` cache dir, `domain-gate-client.ts`, `domain-proof-view.ts`, old Puppeteer test files (`tests/*.browser.test.mjs`, `tests/*.static.test.mjs`, `tests/helpers/`), old dist validators (`scripts/validate-m002-s*.mjs`), and `public/CNAME`. Remove `dotenv` devDependency (unused — `process.loadEnvFile` is used instead). Update `tsconfig.json`: broaden `include` to cover `src/components/**/*.ts(x)` and `src/data/**/*.ts`, remove the now-empty `exclude` entries, remove `src/astro-env-compat.d.ts` from `include`. Remove `typescript.ignoreBuildErrors: true` from `next.config.ts`. Verify: `tsc --noEmit` exits 0, `next build` exits 0, all 18 Playwright tests pass.

**T02 — GitHub Actions CI workflow.** Replace `.github/workflows/deploy.yml` with a new workflow that: installs pnpm + Node 22 + dependencies, installs Playwright browsers (`npx playwright install --with-deps`), runs `next build`, runs `npx playwright test` against `next start` (not `next dev`). The Playwright config should be updated so `webServer.command` uses `next start` when `process.env.CI` is set — this tests the production build, not dev mode. The workflow should set `GATE_HASH` and `GATE_TEST_PASSCODE` from GitHub secrets. Cache `.next/cache` and pnpm store for speed. Upload `playwright-report/` as an artifact on failure.

**T03 — Vercel deployment and AGENTS.md.** Vercel's GitHub integration auto-deploys on push to `main` — no workflow step needed. Environment variables (`GATE_HASH`, `NEXT_PUBLIC_SITE_URL`) must be set in the Vercel dashboard. Verify the live deployment loads correctly. Update `AGENTS.md` (and its `CLAUDE.md` symlink) to reflect: Next.js + Tailwind + Vercel stack, `pnpm test` as the validation command, Playwright tests (not Puppeteer), `src/app/` routing (not `src/pages/`), notes pipeline via `gray-matter` + `unified`, middleware cookie auth model.

### Why this order

T01 first because TypeScript strictness must be restored before CI can meaningfully gate on it. T02 second because CI should be green before pushing to `main` and triggering Vercel auto-deploy. T03 last because it's the final integration proof and documentation update.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Vercel deployment | Vercel GitHub Integration (auto-deploy on push) | Zero-config for Next.js; no workflow step or `vercel` CLI needed |
| Playwright in CI | `npx playwright install --with-deps` + `npx playwright test` | Standard Playwright CI setup; `--with-deps` installs OS-level browser dependencies |
| pnpm in GitHub Actions | `pnpm/action-setup@v4` | Already used in current deploy.yml; handles pnpm installation and caching |
| Build caching in CI | `actions/cache@v4` for `.next/cache` | Next.js docs recommend caching `.next/cache` for incremental builds |

## Existing Code and Patterns

- `playwright.config.ts` — Currently uses `npm run dev` as `webServer.command`. For CI, switch to `npm run build && npm run start` or make the command conditional on `process.env.CI`. The `reuseExistingServer: !process.env.CI` flag is already correct — CI always starts fresh.
- `.github/workflows/deploy.yml` — Current GitHub Pages workflow. Replace entirely; the structure (pnpm setup, Node 22, install, build, test) is reusable but the deploy job and Astro-specific steps are removed.
- `package.json` scripts — Currently has `dev`, `build`, `start`, `test`. `validate:site` script was removed in S01 when Astro deps were swapped. The `test` script (`npx playwright test`) is the new release gate.
- `tsconfig.json` — Narrow `include` and broad `exclude` were necessary for Astro coexistence. After cleanup: `include` should cover `next-env.d.ts`, `.next/types/**/*.ts`, `src/**/*.ts`, `src/**/*.tsx`, `next.config.ts`, `proxy.ts`; `exclude` should be just `node_modules`.
- `next.config.ts` — Has `typescript.ignoreBuildErrors: true` (D045). Remove the entire `typescript` block.
- `AGENTS.md` / `CLAUDE.md` — `CLAUDE.md` is a symlink to `AGENTS.md`. Update `AGENTS.md` content; symlink stays.
- `src/components/domains/screenshot-gallery-init.ts` — **Keep.** Consumed by `ScreenshotGallery.tsx` via dynamic import in `useEffect`. Not an Astro-only file despite comments referencing Astro.
- `src/data/domains/domain-view-model.ts` — **Keep.** Consumed by `DomainProofPage.tsx`. Contains a comment referencing `domain-gate-client` but the code is framework-agnostic.
- `scripts/generate-resume-pdf.mjs` + `scripts/resume.html` — **Keep.** Utility for generating the resume PDF. Uses Puppeteer but is a standalone script, not part of the test suite. Puppeteer dependency is a dev tool dependency, not a test dependency.

## Constraints

- **Vercel environment variables are set via dashboard, not code.** `GATE_HASH` (server-only) and optionally `NEXT_PUBLIC_SITE_URL` (client-exposed) must be configured in Vercel project settings before first deploy. There's no `vercel.json` env mechanism for secrets.
- **`proxy.ts` manifest issue persists.** S01 documented that `proxy.ts` compiles but `middleware-manifest.json` shows empty `middleware: {}`. The `x-gate-status` observability header doesn't appear. Gate enforcement is unaffected (lives in RSC page). Investigate in S04 but don't block deployment on it.
- **`scripts/generate-resume-pdf.mjs` uses Puppeteer.** This is a standalone utility script for generating the resume PDF from an HTML template, not a test. Puppeteer should remain available for this script. The old Puppeteer *test* files are deleted, but the Puppeteer dependency may still be needed for this script. Check if it's in `dependencies` or `devDependencies` and if the PDF already exists in `public/`.
- **GitHub secrets needed.** `GATE_HASH` and `GATE_TEST_PASSCODE` must be set as GitHub repository secrets for CI Playwright tests to work. The current workflow already uses `secrets.GATE_TEST_PASSCODE` and `vars.PUBLIC_GATE_HASH` — update to use `secrets.GATE_HASH` and `secrets.GATE_TEST_PASSCODE`.
- **Node 20.12+ required.** `process.loadEnvFile()` in `playwright.config.ts` requires Node 20.12+. The CI workflow should use Node 22 (currently used in the old deploy workflow, well above the minimum).
- **`CNAME` file removal.** `public/CNAME` contains `jean-dominique-stepek.is-a.dev` — this is a GitHub Pages artifact. Vercel handles custom domains through its dashboard. Remove the file.
- **Vercel trailing slash behavior.** `next.config.ts` has `trailingSlash: true`. Vercel respects this. Existing Playwright tests use trailing-slash URLs. No issue expected.

## Common Pitfalls

- **Running Playwright against `next dev` in CI** — Dev mode is slower, includes HMR overhead, and doesn't catch build-only issues (static page generation, `generateStaticParams` correctness). CI should run tests against `next start` after `next build` to test the production runtime.
- **Forgetting to install Playwright browsers in CI** — `npx playwright install --with-deps` must run before tests. The `--with-deps` flag installs system-level dependencies (fonts, libraries) that headless Chromium needs on Ubuntu.
- **Deleting `screenshot-gallery-init.ts` by mistake** — This file looks like an Astro relic (comments reference Astro, sits alongside `.astro` files) but is actively imported by `ScreenshotGallery.tsx`. Only delete files that are NOT imported by any `.tsx` component.
- **Breaking `tsc --noEmit` after removing `ignoreBuildErrors`** — The tsconfig `include`/`exclude` must be updated *before* removing `ignoreBuildErrors`, or the build step will fail on type errors from files that should be excluded. Do these atomically.
- **Vercel auto-deploy before CI passes** — Vercel's GitHub integration auto-deploys on push to `main`. If CI isn't green before merge, a broken build could deploy. The CI workflow should run on PRs to `main` so it gates merges. Alternatively, configure Vercel to only deploy when CI passes (Vercel dashboard > Git > Checks).
- **Missing env vars on Vercel** — If `GATE_HASH` isn't set in Vercel environment variables, the server action will fail to validate any passcode (empty hash comparison). The gate will be permanently locked with no way to unlock. Set env vars before first deployment.

## Open Risks

- **`proxy.ts` middleware manifest issue** — S01 documented that the proxy compiles but the manifest is empty. Worth a brief investigation in T01 (check if deleting `.next/` cache and rebuilding fixes it, or if Next.js 16.1.6 has a known issue with `proxy.ts` config export). If unfixable, document as a known limitation — it's observability-only and doesn't affect auth.
- **Custom domain DNS migration** — The site currently uses `jean-dominique-stepek.is-a.dev` via CNAME on GitHub Pages. Switching to Vercel requires DNS changes (CNAME to `cname.vercel-dns.com` or A records). DNS propagation may cause brief downtime. This is a manual step outside the agent's scope but should be flagged.
- **Puppeteer as stale dependency** — `scripts/generate-resume-pdf.mjs` uses Puppeteer for PDF generation. Puppeteer isn't in the current `package.json` dependencies (it was removed when Astro deps were swapped in S01). If this script needs to work, Puppeteer needs to be re-added or the script needs porting to Playwright. Since the PDF already exists in `public/`, this is non-blocking for deployment.
- **Vercel build environment differences** — Vercel's build environment may differ from local (different Node version, different OS). `next build` should be tested in CI (GitHub Actions Ubuntu) before relying on Vercel's build. The CI workflow handles this.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Vercel deployment | `sickn33/antigravity-awesome-skills@vercel-deployment` | available (865 installs) — covers Vercel deployment patterns |
| GitHub Actions CI | `cin12211/orca-q@github-actions-expert` | available (119 installs) — covers GitHub Actions workflow patterns |
| Next.js best practices | `sickn33/antigravity-awesome-skills@nextjs-best-practices` | available (3K installs) — from M005 research |
| Playwright | `currents-dev/playwright-best-practices-skill@playwright-best-practices` | available (9K installs) — from M005 research |

None are critical for this slice — the work is straightforward CI/CD and file cleanup. Install is optional.

## Sources

- Playwright CI GitHub Actions setup (source: [Playwright docs via Context7 /microsoft/playwright](https://github.com/microsoft/playwright/blob/main/docs/src/ci.md))
- Next.js CI build caching with `actions/cache` for `.next/cache` (source: [Next.js docs via Context7 /vercel/next.js](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/ci-build-caching.mdx))
- Next.js environment variables — `process.env` for server, `NEXT_PUBLIC_*` for client (source: [Next.js docs via Context7](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx))
- Existing codebase analysis: 19 `.astro` files, 7 old Puppeteer test files, 3 dist validators, 2 Astro type shims identified for deletion
- S01 forward intelligence: `typescript.ignoreBuildErrors` removal, `dotenv` cleanup, proxy manifest issue, `astro-env-compat.d.ts` removal
- S02 forward intelligence: component CSS fully migrated to `src/app/globals.css`, `src/styles/global.css` safe to delete
- S03 forward intelligence: all 18 Playwright tests pass against `next dev`; need production build verification

## Cleanup Inventory

### Files to delete

**Astro page files (8):**
- `src/pages/404.astro`
- `src/pages/about.astro`
- `src/pages/index.astro`
- `src/pages/resume.astro`
- `src/pages/domains/[slug].astro`
- `src/pages/notes/index.astro`
- `src/pages/notes/[slug].astro`
- `src/pages/shader-demo/index.astro`

**Astro component files (11):**
- `src/components/diagrams/MermaidDiagram.astro`
- `src/components/domains/DomainGateShell.astro`
- `src/components/domains/DomainPage.astro`
- `src/components/domains/ScreenshotGallery.astro`
- `src/components/home/HomePage.astro`
- `src/components/layout/BaseLayout.astro`
- `src/components/layout/TerminalPanel.astro`
- `src/components/notes/NotePage.astro`
- `src/components/notes/NotesIndexPage.astro`
- `src/components/personal/PersonalPage.astro`
- `src/components/resume/ResumePage.astro`
- `src/components/shader/ShaderBackground.astro`

**Astro-only TypeScript files (2):**
- `src/components/domains/domain-gate-client.ts` — replaced by server action + GateForm.tsx
- `src/components/domains/domain-proof-view.ts` — replaced by DomainProofPage.tsx RSC

**Astro config and type shims (4):**
- `astro.config.mjs.bak`
- `src/content.config.ts` — Astro content collection schema; replaced by `src/lib/notes.ts`
- `src/env.d.ts` — Astro env type declarations
- `src/astro-env-compat.d.ts` — migration shim for ImportMeta.env

**Astro cache directory (1):**
- `.astro/` — Astro build cache

**Old CSS (1):**
- `src/styles/global.css` — migrated to `src/app/globals.css`; only imported by Astro `BaseLayout.astro`
- `src/styles/` — directory, remove after global.css

**Old Puppeteer test files (7):**
- `tests/assembled-flow.browser.test.mjs`
- `tests/notes-isolation.browser.test.mjs`
- `tests/route-boundary.browser.test.mjs`
- `tests/route-boundary.static.test.mjs`
- `tests/route-unlock.browser.test.mjs`
- `tests/shader-presence.browser.test.mjs`
- `tests/visual-reveal.browser.test.mjs`
- `tests/helpers/site-boundary-fixtures.mjs`
- `tests/helpers/` — directory, remove after fixtures

**Old dist validators (3):**
- `scripts/validate-m002-s01.mjs`
- `scripts/validate-m002-s02.mjs`
- `scripts/validate-m002-s03.mjs`

**GitHub Pages artifact (1):**
- `public/CNAME`

**Unused dependency (1):**
- `dotenv` — in devDependencies but unused; `process.loadEnvFile()` is used instead

### Files to KEEP (despite looking like Astro relics)

- `src/components/domains/screenshot-gallery-init.ts` — imported by `ScreenshotGallery.tsx`
- `src/data/domains/domain-view-model.ts` — imported by `DomainProofPage.tsx`
- `scripts/generate-resume-pdf.mjs` + `scripts/resume.html` — standalone PDF generation utility
