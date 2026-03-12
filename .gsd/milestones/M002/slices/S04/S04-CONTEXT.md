---
id: S04
milestone: M002
status: ready
---

# S04: Verification and Regression Gate — Context

<!-- Slice-scoped context. Milestone-only sections (acceptance criteria, completion class,
     milestone sequence) do not belong here — those live in the milestone context. -->

## Goal

Add an end-to-end browser verification test that proves the full locked-to-unlocked journey across public and protected routes, wire it into the existing `validate:site` deploy gate, and close the milestone with all success criteria re-checked against live behavior.

## Why this Slice

S01, S02, and S03 each ship per-slice validators that prove their own contracts in isolation, but no single check walks the complete visitor journey: public pages open → locked gate on `/domains/*` → passcode unlock → cross-route proof with visuals → session continuity. S04 closes that integration gap so the milestone's definition of done is provably met and future edits cannot silently break the assembled flow.

## Scope

### In Scope

- One end-to-end browser test that exercises the full journey: load public routes (confirm no gate), cold-load a protected route (confirm locked gate), enter passcode (confirm unlock and proof mount with visuals), navigate to a second protected route (confirm session carryover and proof already unlocked), and verify public routes still work after unlock.
- Wiring the new end-to-end test into `validate:site` so the deploy workflow blocks on it.
- Re-checking the milestone's five success criteria against live browser behavior as the final acceptance gate.
- Updating `validate:site` in `package.json` to chain the new check alongside existing S01/S02/S03 validators.

### Out of Scope

- Rewriting, consolidating, or auditing the existing per-slice validators — they stay as-is.
- Adding screenshot capture or HTML dump on failure — keep error output consistent with existing validators.
- Adding new per-slice unit tests or dist validators — those belong in S01/S02/S03.
- Performance testing, load testing, or accessibility auditing beyond the gate flow.
- Any new feature work — S04 is verification-only.

## Constraints

- Must extend the existing `validate:site` chain rather than creating a parallel validation path.
- Error output format must stay consistent with the named-error-per-route pattern established by S01 and S02 validators.
- Must use the shared `tests/helpers/site-boundary-fixtures.mjs` for route inventories, selectors, and server helpers — no duplicate fixture definitions.
- Must use the DOM marker contracts from D015 (locked state) and whatever unlocked-state markers S02/S03 establish — no ad-hoc selector guessing.
- The end-to-end test must run in CI (headless Puppeteer) as part of the deploy gate, same as existing browser tests.

## Integration Points

### Consumes

- `tests/helpers/site-boundary-fixtures.mjs` — shared route inventories, boundary selectors, proof selectors, server helpers, and unlock test inputs.
- `scripts/validate-m002-s01.mjs` — S01 dist validator (stays in the chain, not replaced).
- `scripts/validate-m002-s02.mjs` — S02 dist validator (stays in the chain, not replaced).
- `tests/route-boundary.browser.test.mjs` — S01 browser test (stays in the chain, not replaced).
- `tests/route-unlock.browser.test.mjs` — S02 browser test (stays in the chain, not replaced).
- S03 visual-state markers or verification hooks (whatever S03 produces for visual withholding/reveal checks).
- D015 marker contract for locked state; S02/S03 marker contracts for unlocked and visual states.
- `package.json` `validate:site` script — the existing chain to extend.
- `.github/workflows/deploy.yml` — already runs `pnpm validate:site`; no workflow change needed if the chain is extended in `package.json`.

### Produces

- One end-to-end browser test file covering the full public → locked → unlocked → cross-route → visual journey.
- Updated `validate:site` chain in `package.json` that includes the new end-to-end check.
- Milestone-level confidence that all five success criteria pass against live behavior.

## Open Questions

- Whether S03 produces new visual-state markers or relies on existing proof-section presence/absence — S04 needs to know what to assert for visual correctness. Current thinking: consume whatever markers S03 establishes and check for them in the unlocked state.
