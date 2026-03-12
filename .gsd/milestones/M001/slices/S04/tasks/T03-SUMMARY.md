---
id: T03
parent: S04
milestone: M001
provides:
  - Dist-first Phase 4 validator for flagship structure across all five domain pages
  - Shared `validate:site` coverage that now includes the flagship proof gate
requires: []
affects:
  - S04
key_files:
  - scripts/validate-phase4.mjs
  - package.json
key_decisions:
  - "Keep Phase 4 validation dist-first by reading built domain artifacts instead of source TypeScript modules."
  - "Extend `validate:site` rather than editing the GitHub Pages workflow so CI inherits the stronger gate automatically."
patterns_established:
  - "Derive base-aware expectations from emitted canonical URLs before validating local highlight asset paths."
  - "Optional visuals stay permissive by default but become strict when rendered: require an `img`, non-empty `src` and `alt`, and a base-aware local `/highlights/` path."
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T03-PLAN.md
duration: 5 min
verification_result: pass
completed_at: 2026-03-10T00:00:00Z
blocker_discovered: false
---

# T03: Dist-First Flagship Validation

**Dist-first flagship artifact validation plus a widened `validate:site` gate that now covers Phase 4 without changing the deploy workflow shape**

## What Happened
- Added `scripts/validate-phase4.mjs` to inspect built `dist/domains/<slug>/index.html` artifacts for flagship section presence, count, required story fields, proof-link shape, and conditional visual structure.
- Added `validate:phase4` and widened `validate:site` so the existing Phase 1 through Phase 3 validators still run before the new Phase 4 gate.
- Verified that the current GitHub Pages workflow inherits the stronger validation automatically because it already runs `pnpm validate:site`.

## Deviations
None - plan executed exactly as written.

## Files Created/Modified
- `scripts/validate-phase4.mjs`
- `package.json`
