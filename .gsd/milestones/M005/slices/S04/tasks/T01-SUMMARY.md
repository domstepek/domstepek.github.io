---
id: T01
parent: S04
milestone: M005
provides:
  - Clean codebase with zero Astro remnants
  - Full-tree TypeScript strict checking (no ignoreBuildErrors)
  - tsconfig.json covers all src/**/*.ts(x)
key_files:
  - tsconfig.json
  - next.config.ts
  - package.json
key_decisions:
  - Removed dotenv devDependency; project uses Node process.loadEnvFile() instead
patterns_established:
  - tsc --noEmit is now the authoritative type-safety gate for the full src/ tree
observability_surfaces:
  - "tsc --noEmit" catches all type errors across entire src/ tree (previously suppressed)
  - "next build" route table confirms routing correctness (8 routes)
duration: ~5min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Delete Astro files, tighten TypeScript, and verify production build

**Removed all 38 Astro-era files/directories, enabled strict TypeScript across the full src/ tree, and verified production build + all 18 Playwright tests pass.**

## What Happened

1. **Deleted 38 Astro-era artifacts:**
   - 8 Astro page files (`src/pages/*.astro`) and the `src/pages/` directory tree
   - 12 Astro component files (`src/components/**/*.astro`)
   - 2 Astro-only TS files (`domain-gate-client.ts`, `domain-proof-view.ts`)
   - 4 Astro config/shims (`astro.config.mjs.bak`, `content.config.ts`, `env.d.ts`, `astro-env-compat.d.ts`)
   - `.astro/` cache directory
   - `src/styles/global.css` and `src/styles/` directory
   - 7 old Puppeteer test files + `tests/helpers/` directory
   - 3 old dist validators (`scripts/validate-m002-s0*.mjs`)
   - `public/CNAME` (GitHub Pages artifact)
   - Preserved keep-files: `screenshot-gallery-init.ts`, `domain-view-model.ts`, `generate-resume-pdf.mjs`, `resume.html`

2. **Updated `tsconfig.json`** — replaced narrow Astro-coexistence include/exclude with broad `src/**/*.ts`, `src/**/*.tsx` coverage. Only `node_modules` excluded.

3. **Removed `typescript.ignoreBuildErrors`** from `next.config.ts` — config now only has `trailingSlash: true`.

4. **Removed `dotenv` devDependency** via `pnpm remove dotenv`.

5. **Verified** — `tsc --noEmit` exits 0 with zero type errors across the full tree, `npm run build` succeeds with all 8 routes, all 18 Playwright tests pass.

## Verification

| Check | Result |
|---|---|
| `find src -name '*.astro' \| wc -l` → 0 | ✅ |
| `ls tests/*.test.mjs 2>/dev/null \| wc -l` → 0 | ✅ |
| `grep -c ignoreBuildErrors next.config.ts` → 0 | ✅ |
| `grep dotenv package.json \| wc -l` → 0 | ✅ |
| `tsc --noEmit` → exit 0 | ✅ |
| `npm run build` → exit 0 (8 routes) | ✅ |
| `npx playwright test --reporter=list` → 18/18 passed | ✅ |

### Slice-level checks (this task)

| Slice check | Status |
|---|---|
| `tsc --noEmit` exits 0 | ✅ PASS |
| `npm run build` exits 0 | ✅ PASS |
| Playwright 18/18 pass | ✅ PASS |
| `.github/workflows/ci.yml` exists | ⏳ T02 |
| AGENTS.md updated | ⏳ T03 |
| No `.astro` files remain | ✅ PASS |
| No old test files remain | ✅ PASS |

## Diagnostics

- `tsc --noEmit` — type health gate, errors include file:line:column
- `npm run build` — route table in stdout shows all generated routes
- `npx playwright test --reporter=list` — per-test pass/fail

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `tsconfig.json` — broadened include to all src/**/*.ts(x), removed Astro exclusions
- `next.config.ts` — removed typescript.ignoreBuildErrors block
- `package.json` / `pnpm-lock.yaml` — removed dotenv devDependency
- Deleted 20 `.astro` files (8 pages + 12 components)
- Deleted 2 Astro-only TS files, 4 config/shims, `.astro/` cache
- Deleted `src/styles/global.css` and `src/styles/` directory
- Deleted 7 old Puppeteer tests + `tests/helpers/` directory
- Deleted 3 old dist validators from `scripts/`
- Deleted `public/CNAME`
