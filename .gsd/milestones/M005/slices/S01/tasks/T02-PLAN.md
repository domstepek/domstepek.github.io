---
estimated_steps: 5
estimated_files: 5
---

# T02: Port data modules and write failing Playwright tests

**Slice:** S01 — Server-side portfolio gate on Next.js
**Milestone:** M005

## Description

Two jobs in one context window: (1) port the `src/data/` modules that S01 needs server-side, converting `import.meta.env` to `process.env`; (2) write the Playwright test file and config that defines the slice's acceptance criteria. Tests are written *first* and expected to *fail* at the end of this task — failing tests are the proof that the test infrastructure is wired correctly and that implementation work in T03/T04 has a clear target.

`src/data/domains/types.ts`, `src/data/domains/index.ts`, `src/data/domains/domain-view-model.ts`, and the three domain data files (`product.ts`, `analytics-ai.ts`, `developer-experience.ts`) are all pure TypeScript with no Astro/browser dependencies — they port unchanged (except for any stray `import.meta.env` usages verified below). Only `src/data/site.ts` needs changes.

## Steps

1. **Update `src/data/site.ts`**: Replace `import.meta.env.PUBLIC_SITE_URL` → `process.env.NEXT_PUBLIC_SITE_URL ?? ''` and `import.meta.env.PUBLIC_BASE_PATH` → `''` (hardcode empty string — basePath is always `/` on Vercel). Verify no other `import.meta.env` references remain in `src/data/`.

2. **Simplify `src/lib/paths.ts`**: Remove any `siteConfig` or Astro-specific imports. Keep `domainPath`, `assetPath`, and any path helpers as simple string template functions (e.g. `domainPath = (slug: string) => /domains/${slug}/`). These are used by `buildDomainProofViewModel` in T04.

3. **Create `.env.local`**: Generate a test passcode (e.g. `portfolio2026`). Compute its SHA-256: `echo -n "portfolio2026" | shasum -a 256`. Set:
   ```
   GATE_HASH=<computed-hex>
   GATE_TEST_PASSCODE=portfolio2026
   NODE_ENV=development
   ```
   Add `.env.local` to `.gitignore` if not already present. Create `.env.local.example` with key names but no values.

4. **Create `playwright.config.ts`** at the project root:
   - `testDir: 'tests/e2e'`
   - `webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI }`
   - `use: { baseURL: 'http://localhost:3000' }`
   - `projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]`
   - Load `.env.local` values via `dotenv` or `envFile` config option

5. **Write `tests/e2e/gate.spec.ts`** with five test cases:
   - **Test 1 — Gate markers on cold load**: `GET /domains/product/`, assert `[data-protected-gate]` visible, `[data-gate-state="locked"]` visible, `[data-protected-proof-state="withheld"]` visible, `[data-route-visibility="protected"]` visible
   - **Test 2 — Zero HTML leakage**: `request.get('/domains/product/')`, inspect `response.text()`, assert body does NOT contain `data-flagship-highlights`, `data-supporting-work`, `data-flagship`, `data-supporting-item`
   - **Test 3 — Wrong passcode**: navigate to `/domains/product/`, fill `[data-passcode-input]` with `wrongpasscode`, click `[data-passcode-submit]`, assert `[data-gate-error]` is visible
   - **Test 4 — Correct passcode auth flow**: navigate to `/domains/product/`, fill `[data-passcode-input]` with `process.env.GATE_TEST_PASSCODE`, click submit, wait for URL `/domains/product/`, assert `[data-protected-proof-state="revealed"]` and `[data-flagship-highlights]` are visible
   - **Test 5 — Cross-route session**: extend test 4 — after auth, navigate to `/domains/analytics-ai/`, assert `[data-protected-proof-state="revealed"]` without re-entering passcode

## Must-Haves

- [ ] `src/data/site.ts` has no `import.meta.env` references — only `process.env`
- [ ] `rg "import.meta.env" src/data/` returns no matches
- [ ] `playwright.config.ts` exists at project root with `webServer` pointing to `npm run dev` on port 3000
- [ ] `tests/e2e/gate.spec.ts` exists with all 5 test cases
- [ ] Each test case uses explicit `data-*` attribute selectors — no fragile text or XPath selectors
- [ ] `.env.local` exists with `GATE_HASH` and `GATE_TEST_PASSCODE` set
- [ ] `.env.local.example` created with key names only (committed to git)
- [ ] `.env.local` in `.gitignore` (secrets not committed)

## Verification

- `rg "import.meta.env" src/data/` → no output (zero matches)
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → tests run, fail with "net::ERR_CONNECTION_REFUSED" or 404 errors (not config errors — the test file and config are correct, the routes just don't exist yet)
- `cat playwright.config.ts | grep webServer` → shows `npm run dev` and port 3000
- `wc -l tests/e2e/gate.spec.ts` → at least 60 lines (confirming all 5 tests are present)

## Observability Impact

- Signals added/changed: Playwright test output provides structured pass/fail for all gate contract assertions; `.env.local` establishes `GATE_HASH` which gate implementation reads
- How a future agent inspects this: `npx playwright test --reporter=list` for test status; `cat .env.local.example` for required env var names; `npx playwright show-report` for detailed failure output
- Failure state exposed: If `GATE_TEST_PASSCODE` is missing, test 4 and 5 throw with descriptive error; if webServer fails to start, all tests fail with connection error

## Inputs

- `src/data/site.ts` — needs `import.meta.env` → `process.env` conversion (T01 established buildable project)
- `src/data/domains/index.ts` — exports `getDomainBySlug`; tests use `product` and `analytics-ai` slugs
- `src/styles/global.css` (reference only) — for understanding DOM structure; tests target `data-*` attributes defined in M002 decision D015

## Expected Output

- `src/data/site.ts` — `process.env` throughout; no Astro env references
- `playwright.config.ts` — full Playwright config with webServer, baseURL, chromium project
- `tests/e2e/gate.spec.ts` — all 5 gate test cases with explicit selectors
- `.env.local` — `GATE_HASH` + `GATE_TEST_PASSCODE` set (not committed)
- `.env.local.example` — key names documented (committed)
