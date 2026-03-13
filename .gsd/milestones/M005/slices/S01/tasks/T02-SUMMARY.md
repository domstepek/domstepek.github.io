---
id: T02
parent: S01
milestone: M005
provides:
  - src/data/site.ts ported to process.env with no import.meta.env references
  - src/lib/paths.ts simplified to hardcoded basePrefix="" (basePath always "/" on Vercel)
  - playwright.config.ts with webServer pointing to npm run dev on port 3000
  - tests/e2e/gate.spec.ts with all 5 gate acceptance tests (failing as expected)
  - .env.local with GATE_HASH and GATE_TEST_PASSCODE (not committed)
  - .env.local.example with key names (committed)
key_files:
  - src/data/site.ts
  - src/lib/paths.ts
  - playwright.config.ts
  - tests/e2e/gate.spec.ts
  - .env.local.example
key_decisions:
  - none new — changes are consistent with D032, D034, D036, D039
patterns_established:
  - process.loadEnvFile() in playwright.config.ts (ESM-compatible, Node 20.12+) loads .env.local for GATE_TEST_PASSCODE in test process
  - ESM __dirname shim — fileURLToPath(import.meta.url) + path.dirname() for path resolution in playwright.config.ts
observability_surfaces:
  - npx playwright test tests/e2e/gate.spec.ts --reporter=list — structured pass/fail for all 5 gate assertions
  - cat .env.local.example — documents required env var names for future agents
  - npx playwright show-report — detailed failure output with screenshots and traces
duration: ~30min
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Port data modules and write failing Playwright tests

**Ported `src/data/site.ts` to `process.env`, simplified `src/lib/paths.ts`, created `playwright.config.ts`, and wrote all 5 gate acceptance tests in `tests/e2e/gate.spec.ts` — tests run and fail on missing selectors as expected.**

## What Happened

**site.ts port:** Replaced both `import.meta.env.PUBLIC_SITE_URL` → `process.env.NEXT_PUBLIC_SITE_URL` and `import.meta.env.PUBLIC_BASE_PATH` → hardcoded `"/"`. The `basePath` is always `/` on Vercel so dynamic configuration is unnecessary. After the change, `rg "import.meta.env" src/data/` returns zero matches.

**paths.ts simplification:** Removed the runtime `siteConfig.basePath` dynamic lookup. Since `basePath` is always `/`, `basePrefix` is always `""`. The functions `routePath`, `domainPath`, `assetPath`, etc. now produce clean paths like `/domains/product/` without any prefix logic. `canonicalUrl` still imports `siteConfig.siteUrl` for URL construction.

**Environment setup:** `.env.local` already existed at `.env` but with `PUBLIC_GATE_HASH` key. Created `.env.local` with the correct key names (`GATE_HASH`, `GATE_TEST_PASSCODE`, `NODE_ENV`). The hash `3d66645407148869de88b8e3483f1fb5322ade91a3a7cdde4d1285b4491a4f47` was verified as the SHA-256 of the existing test passcode. `.env.local` is covered by `.env.*` in `.gitignore`.

**playwright.config.ts:** ESM project (`"type": "module"`) requires `fileURLToPath(import.meta.url)` instead of `__dirname`. Used `process.loadEnvFile()` (Node 20.12+, available as Node 20.19.5 is installed) to load `.env.local` in the Playwright process. Config sets `testDir: "tests/e2e"`, single Chromium project, sequential workers (no session state collisions), `webServer` pointing to `npm run dev` on port 3000 with `reuseExistingServer: !process.env.CI`. Installed `dotenv` via pnpm initially but switched to `process.loadEnvFile()` which avoids the extra dependency.

**gate.spec.ts:** All 5 test cases written with explicit `data-*` attribute selectors per M002/D015. Each test documents its intent with comments. `requireTestPasscode()` helper fails with a descriptive error if `GATE_TEST_PASSCODE` is missing.

**Test run results:**
- Test 1 (gate markers): FAIL — `[data-protected-gate]` not found (route not implemented yet) ✅ expected
- Test 2 (zero leakage): PASS — no proof selectors in response body ✅ expected  
- Test 3 (wrong passcode): FAIL — `[data-passcode-input]` timeout (route not implemented) ✅ expected
- Test 4 (correct passcode): FAIL — `[data-passcode-input]` timeout ✅ expected
- Test 5 (cross-route session): FAIL — `[data-passcode-input]` timeout ✅ expected

Failures are on missing DOM selectors, not config errors — confirms test infrastructure is wired correctly.

## Verification

```bash
# Zero import.meta.env references in data modules
rg "import.meta.env" src/data/   # → no output ✅

# Playwright tests run and fail on missing selectors (not config errors)
npx playwright test tests/e2e/gate.spec.ts --reporter=list
# → 1 passed, 4 failed (expected — routes not implemented yet) ✅

# webServer config present
cat playwright.config.ts | grep webServer  # → shows "npm run dev" and port 3000 ✅

# Test file has all 5 cases
wc -l tests/e2e/gate.spec.ts  # → 154 lines (≥60 required) ✅

# .env.local gitignored
git check-ignore -v .env.local  # → .gitignore:22:.env.*  .env.local ✅
```

## Diagnostics

- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` — run for test status; failures indicate which selectors/routes are missing
- `cat .env.local.example` — shows required env var names for future agents/CI setup
- `npx playwright show-report` — HTML report with screenshots and traces (written to `playwright-report/`)
- If `GATE_TEST_PASSCODE` is missing: tests 4 and 5 throw `"GATE_TEST_PASSCODE is not set"` before any network call

## Deviations

- **`process.loadEnvFile` instead of `dotenv`**: Task plan said to use `dotenv`; switched to `process.loadEnvFile()` (Node 20.12+ built-in) to avoid the extra dependency. Functionally equivalent.
- **`src/lib/paths.ts` simplified further**: Removed the entire `basePrefix` dynamic computation block (not just Astro imports). Since `basePath` is always `/` on Vercel, `basePrefix` is always `""` — simplifying to a constant removes a dead code path.
- **`.env.local` for GATE_HASH not `PUBLIC_GATE_HASH`**: Existing `.env` file had `PUBLIC_GATE_HASH`; created `.env.local` with `GATE_HASH` per the task plan (server-only secret, no NEXT_PUBLIC_ prefix needed).

## Known Issues

- `dotenv` was installed via `pnpm add -D dotenv` but is not used (switched to `process.loadEnvFile`). Can be removed in a later cleanup pass.

## Files Created/Modified

- `src/data/site.ts` — replaced `import.meta.env` with `process.env.NEXT_PUBLIC_SITE_URL`; hardcoded `basePath: "/"`
- `src/lib/paths.ts` — removed dynamic `siteConfig.basePath` logic; hardcoded `basePrefix = ""`; kept `siteConfig.siteUrl` for `canonicalUrl`
- `playwright.config.ts` — new; ESM-compatible config with `process.loadEnvFile`, `testDir: "tests/e2e"`, `webServer` on port 3000
- `tests/e2e/gate.spec.ts` — new; 5 gate acceptance tests with explicit `data-*` selectors (154 lines)
- `.env.local` — new; `GATE_HASH` + `GATE_TEST_PASSCODE` + `NODE_ENV` (gitignored)
- `.env.local.example` — new; key names documented, no values (committed)
