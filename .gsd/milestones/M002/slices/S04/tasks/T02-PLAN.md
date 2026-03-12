---
estimated_steps: 4
estimated_files: 2
---

# T02: Wire S04 into release gate and validate R102

**Slice:** S04 — Verification and Regression Gate
**Milestone:** M002

## Description

Wire the new S04 test files into `package.json` scripts and the `validate:site` release gate chain so they run in CI before deploy. Then update `REQUIREMENTS.md` to move R102 from active to validated with proof references, closing the last active requirement in M002.

## Steps

1. Add npm scripts to `package.json`:
   - `"test:assembled-flow:browser": "node --test tests/assembled-flow.browser.test.mjs"`
   - `"test:notes-isolation:browser": "node --test tests/notes-isolation.browser.test.mjs"`
   - `"validate:m002:s04": "pnpm test:notes-isolation:browser && pnpm test:assembled-flow:browser"`

2. Update `validate:site` in `package.json` to chain S04 after S03:
   - `"validate:site": "pnpm validate:m002:s01 && pnpm validate:m002:s02 && pnpm validate:m002:s03 && pnpm validate:m002:s04"`

3. Run `pnpm validate:site` to confirm the full S01→S02→S03→S04 chain passes end-to-end.

4. Update `.gsd/REQUIREMENTS.md`: move R102 from Active to Validated with proof notes referencing the assembled flow browser test, existing S01–S03 coverage (17 browser tests + 3 dist validators), and the full `validate:site` gate. Update the traceability table and coverage summary (active: 0, validated: 12).

## Must-Haves

- [ ] `validate:m002:s04` script exists and runs both S04 test files
- [ ] `validate:site` chains S04 after S03
- [ ] `pnpm validate:site` passes with all S01–S04 checks
- [ ] R102 is validated in `REQUIREMENTS.md` with proof references

## Verification

- `pnpm validate:site` — full chain passes including S04
- `grep -c 'active' .gsd/REQUIREMENTS.md` confirms no Active requirements remain (R102 moved to Validated)

## Observability Impact

- Signals added/changed: `validate:site` now includes S04 in its chain; CI deploy gate covers the full M002 scope
- How a future agent inspects this: `pnpm validate:site` is the single authoritative release gate for all M002 verification
- Failure state exposed: Each validator in the chain reports route-specific failures independently

## Inputs

- `tests/assembled-flow.browser.test.mjs` — from T01
- `tests/notes-isolation.browser.test.mjs` — from T01
- `package.json` — existing `validate:site` chain
- `.gsd/REQUIREMENTS.md` — R102 currently in Active section

## Expected Output

- `package.json` — updated with S04 test scripts and extended `validate:site` chain
- `.gsd/REQUIREMENTS.md` — R102 moved to Validated with proof references; coverage summary updated
