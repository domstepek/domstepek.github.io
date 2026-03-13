---
estimated_steps: 5
estimated_files: 8
---

# T01: Delete Astro files, tighten TypeScript, and verify production build

**Slice:** S04 — Vercel deployment, CI, and final integration
**Milestone:** M005

## Description

Remove all Astro-era files (pages, components, config, type shims, old tests, old validators, GitHub Pages artifacts), update `tsconfig.json` to cover all `src/` code without exclusions, remove `typescript.ignoreBuildErrors` from `next.config.ts`, remove the unused `dotenv` devDependency, and fix any type errors that surface. This is the prerequisite for TypeScript to meaningfully gate builds.

## Steps

1. **Delete Astro files.** Remove the 38 files/directories from the cleanup inventory:
   - 8 Astro page files: `src/pages/404.astro`, `src/pages/about.astro`, `src/pages/index.astro`, `src/pages/resume.astro`, `src/pages/domains/[slug].astro`, `src/pages/notes/index.astro`, `src/pages/notes/[slug].astro`, `src/pages/shader-demo/index.astro`
   - Remove now-empty directories: `src/pages/domains/`, `src/pages/notes/`, `src/pages/shader-demo/`, `src/pages/`
   - 12 Astro component files: all `.astro` files under `src/components/`
   - 2 Astro-only TS files: `src/components/domains/domain-gate-client.ts`, `src/components/domains/domain-proof-view.ts`
   - 4 Astro config/shims: `astro.config.mjs.bak`, `src/content.config.ts`, `src/env.d.ts`, `src/astro-env-compat.d.ts`
   - 1 Astro cache: `.astro/` directory
   - 1 old CSS: `src/styles/global.css` and `src/styles/` directory
   - 7 old Puppeteer test files + `tests/helpers/site-boundary-fixtures.mjs` + `tests/helpers/` directory
   - 3 old dist validators: `scripts/validate-m002-s01.mjs`, `scripts/validate-m002-s02.mjs`, `scripts/validate-m002-s03.mjs`
   - 1 GitHub Pages artifact: `public/CNAME`
   - **Do NOT delete:** `src/components/domains/screenshot-gallery-init.ts`, `src/data/domains/domain-view-model.ts`, `scripts/generate-resume-pdf.mjs`, `scripts/resume.html`

2. **Update `tsconfig.json`.** Replace narrow `include`/`exclude` with:
   - `include`: `["next-env.d.ts", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "src/**/*.ts", "src/**/*.tsx", "next.config.ts", "proxy.ts"]`
   - `exclude`: `["node_modules"]`

3. **Remove `typescript.ignoreBuildErrors` from `next.config.ts`.** Delete the entire `typescript` block so the config only has `trailingSlash: true`.

4. **Remove `dotenv` from devDependencies.** Run `pnpm remove dotenv`. The project uses `process.loadEnvFile()` instead.

5. **Fix type errors and verify.** Run `tsc --noEmit`. If any type errors surface from the newly-included files, fix them. Then run `npm run build` to confirm the production build succeeds. Run `npx playwright test --reporter=list` to confirm no regressions.

## Must-Haves

- [ ] Zero `.astro` files remain in `src/`
- [ ] Zero old Puppeteer test files remain in `tests/`
- [ ] Zero old dist validators remain in `scripts/`
- [ ] `tsconfig.json` includes all `src/**/*.ts(x)` without Astro exclusions
- [ ] `typescript.ignoreBuildErrors` is removed from `next.config.ts`
- [ ] `dotenv` is not in `package.json`
- [ ] `tsc --noEmit` exits 0
- [ ] `npm run build` exits 0
- [ ] All 18 Playwright tests pass (no regressions)

## Verification

- `find src -name '*.astro' | wc -l` → 0
- `ls tests/*.test.mjs 2>/dev/null | wc -l` → 0
- `grep -c ignoreBuildErrors next.config.ts` → 0
- `grep dotenv package.json | wc -l` → 0
- `tsc --noEmit` → exit 0
- `npm run build` → exit 0
- `npx playwright test --reporter=list` → 18 passed

## Observability Impact

- Signals added/changed: `tsc --noEmit` now catches all type errors across the entire `src/` tree (previously suppressed by `ignoreBuildErrors` and narrow tsconfig)
- How a future agent inspects this: `tsc --noEmit` for type health; `npm run build` route table for routing correctness
- Failure state exposed: `tsc` errors include file:line:column; `next build` logs specific compilation failures

## Inputs

- S01–S03 complete Next.js app in `src/app/` and `src/components/`
- Cleanup inventory from S04-RESEARCH.md (files to delete vs keep)
- Current `tsconfig.json` with narrow include/exclude for Astro coexistence
- Current `next.config.ts` with `typescript.ignoreBuildErrors: true`

## Expected Output

- All Astro-era files deleted; `src/pages/`, `src/styles/`, `.astro/`, `tests/helpers/` directories removed
- `tsconfig.json` covers full `src/` tree
- `next.config.ts` has only `trailingSlash: true`
- `package.json` has no `dotenv` dependency
- `tsc --noEmit`, `npm run build`, and all 18 Playwright tests pass cleanly
