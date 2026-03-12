---
estimated_steps: 4
estimated_files: 4
---

# T03: Wire S02 into release validation and unlock diagnostics

**Slice:** S02 — Session Unlock Flow and Gate Messaging
**Milestone:** M002

## Description

Make the slice durable. This task adds a fast validator for the new cold-load gate-message contract, folds the warm-session unlock browser coverage into the main site validation path, and ensures deploys are blocked if request-access messaging or session continuity regresses.

## Steps

1. Create `scripts/validate-m002-s02.mjs` to inspect built protected-route artifacts for the S02 locked-shell contract: request-access links and form markers are present, locked markers remain intact, and protected proof is still withheld from initial HTML.
2. Update `package.json` so `validate:site` runs the existing S01 boundary checks plus the new S02 validator and browser unlock regression coverage through stable named commands.
3. Reuse `tests/helpers/site-boundary-fixtures.mjs` in the validator where practical so the route inventory, request-link expectations, and marker vocabulary stay aligned across tests and release-gate scripts.
4. Update `.github/workflows/deploy.yml` so CI executes the aggregate validation path before Pages artifact upload and surfaces route-specific/state-specific failures in logs.

## Must-Haves

- [ ] There is one documented validation path that proves both the protected cold-load gate contract and the warm-session unlock continuity before deploy.
- [ ] The fast validator fails clearly when request-access links disappear, gate markers drift, or proof leaks back into initial HTML.
- [ ] CI runs the same aggregate validation command locally and before Pages upload, so S02 regressions cannot ship silently.

## Verification

- `pnpm check && pnpm build && pnpm validate:site`
- Inspect the workflow diff and command surface to confirm the deploy job runs the aggregate validation gate before `actions/upload-pages-artifact`.

## Observability Impact

- Signals added/changed: one aggregate release-gate command plus route-specific validator output for gate messaging and unlock-state prerequisites
- How a future agent inspects this: run `pnpm validate:site` locally or inspect the failing validator/browser test logs in CI
- Failure state exposed: whether the regression came from missing request links, missing unlock markers, leaked proof, or broken same-session carryover

## Inputs

- `tests/helpers/site-boundary-fixtures.mjs` — shared route inventory and S02 selector/link vocabulary from T01
- `src/components/domains/DomainGateShell.astro` — shipped gate shell markup from T02 that the validator must enforce

## Expected Output

- `scripts/validate-m002-s02.mjs` — fast dist-first validator for S02 gate messaging and locked-shell contract
- `package.json` — aggregate validation commands updated so S02 checks run through `validate:site`
