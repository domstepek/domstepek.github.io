---
estimated_steps: 4
estimated_files: 3
---

# T02: Production Playwright config and GitHub Actions CI workflow

**Slice:** S04 — Vercel deployment, CI, and final integration
**Milestone:** M005

## Description

Update the Playwright config so CI runs tests against a production build (`next build && next start`) instead of `next dev`. Replace the old GitHub Pages deploy workflow with a new CI workflow that installs dependencies, builds, runs the full Playwright suite, and uploads the report on failure. This is the release gate for the new stack.

## Steps

1. **Update `playwright.config.ts` webServer command.** Make the `command` conditional on `process.env.CI`: use `npm run build && npm run start` when CI is set, `npm run dev` otherwise. Keep `reuseExistingServer: !process.env.CI` (already correct). Keep the `env` block forwarding `GATE_HASH` and `GATE_TEST_PASSCODE`. Keep the `timeout: 60_000` (build+start takes longer than dev).

2. **Delete `.github/workflows/deploy.yml`.** The old GitHub Pages workflow is replaced entirely.

3. **Create `.github/workflows/ci.yml`.** The new workflow should:
   - Trigger on `push` to `main` and on `pull_request` to `main`
   - Use `ubuntu-latest`
   - Set env: `GATE_HASH: ${{ secrets.GATE_HASH }}`, `GATE_TEST_PASSCODE: ${{ secrets.GATE_TEST_PASSCODE }}`
   - Steps: checkout, `pnpm/action-setup@v4`, `actions/setup-node@v4` with `node-version: 22` and `cache: pnpm`, `pnpm install --frozen-lockfile`, `npx playwright install --with-deps`, cache `.next/cache` with `actions/cache@v4` (key on `pnpm-lock.yaml` hash), `npm run build`, `npx playwright test`
   - On failure: upload `playwright-report/` as artifact via `actions/upload-artifact@v4` with `if: ${{ !cancelled() }}`

4. **Verify locally.** Run `CI=true npx playwright test --reporter=list` to confirm all 18 tests pass against the production build (`next start`). This exercises the same code path CI will use.

## Must-Haves

- [ ] Playwright webServer uses `npm run build && npm run start` when `CI` is set
- [ ] Old `deploy.yml` deleted
- [ ] New `ci.yml` exists with correct trigger, env, steps, caching, and artifact upload
- [ ] All 18 Playwright tests pass with `CI=true` (against `next start`)

## Verification

- `CI=true npx playwright test --reporter=list` → 18 passed
- `cat .github/workflows/ci.yml` shows: `on: push/pull_request to main`, `secrets.GATE_HASH`, `playwright install --with-deps`, `npm run build`, `npx playwright test`, artifact upload
- `ls .github/workflows/deploy.yml 2>/dev/null` → file not found

## Observability Impact

- Signals added/changed: CI workflow is the new release gate — failure blocks merges to `main`; Playwright HTML report uploaded as artifact on failure provides full test-by-test diagnostics
- How a future agent inspects this: Check GitHub Actions tab for CI status; download `playwright-report` artifact for detailed failure info; locally run `CI=true npx playwright test` to reproduce
- Failure state exposed: Per-test pass/fail in `--reporter=list` output; trace files captured on first retry (`trace: "on-first-retry"` in Playwright config)

## Inputs

- `playwright.config.ts` — current config using `npm run dev` for webServer
- `.github/workflows/deploy.yml` — old GitHub Pages workflow to be replaced
- All 18 Playwright tests in `tests/e2e/` — must pass against production build
- T01 output: clean `tsc --noEmit` and `npm run build`

## Expected Output

- `playwright.config.ts` — webServer command conditional on CI env var
- `.github/workflows/ci.yml` — new CI workflow with build + Playwright + caching + artifact upload
- `.github/workflows/deploy.yml` — deleted
- `CI=true npx playwright test` → 18/18 pass against `next start`
