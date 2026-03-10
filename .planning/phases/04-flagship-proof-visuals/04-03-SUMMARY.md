---
phase: 04-flagship-proof-visuals
plan: "03"
subsystem: testing
tags: [astro, validation, dist, flagship]

requires:
  - phase: 04-01
    provides: Shared flagship schema, markup, and stable `data-*` markers on domain pages
  - phase: 04-02
    provides: Real flagship content and optional highlight visuals rendered into built domain artifacts
provides:
  - Dist-first Phase 4 validator for flagship structure across all five domain pages
  - Shared `validate:site` coverage that now includes the flagship proof gate
affects: [deployment, validation, release-gate]

tech-stack:
  added: []
  patterns:
    - Dist-first Node validators that inspect emitted HTML instead of source domain modules
    - Aggregate `validate:site` coverage widened phase by phase without changing CI workflow shape

key-files:
  created:
    - scripts/validate-phase4.mjs
  modified:
    - package.json

key-decisions:
  - "Keep Phase 4 validation dist-first by reading built domain artifacts instead of source TypeScript modules."
  - "Extend `validate:site` rather than editing the GitHub Pages workflow so CI inherits the stronger gate automatically."

patterns-established:
  - "Derive base-aware expectations from emitted canonical URLs before validating local highlight asset paths."
  - "Optional visuals stay permissive by default but become strict when rendered: require an `img`, non-empty `src` and `alt`, and a base-aware local `/highlights/` path."

requirements-completed:
  - HIGH-01
  - HIGH-02
  - HIGH-03
  - HIGH-04

duration: 5 min
completed: 2026-03-10
---

# Phase 4 Plan 03: Dist-First Flagship Validation Summary

**Dist-first flagship artifact validation plus a widened `validate:site` gate that now covers Phase 4 without changing the deploy workflow shape**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-10T01:08:30Z
- **Completed:** 2026-03-10T01:13:06Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `scripts/validate-phase4.mjs` to inspect built `dist/domains/<slug>/index.html` artifacts for flagship section presence, count, required story fields, proof-link shape, and conditional visual structure.
- Added `validate:phase4` and widened `validate:site` so the existing Phase 1 through Phase 3 validators still run before the new Phase 4 gate.
- Verified that the current GitHub Pages workflow inherits the stronger validation automatically because it already runs `pnpm validate:site`.

## Task Commits

Git commits were intentionally skipped because this execution explicitly forbade creating commits.

## Files Created/Modified
- `scripts/validate-phase4.mjs` - Dist-first Phase 4 validator for flagship structure, proof links, and optional visuals.
- `package.json` - Adds `validate:phase4` and extends the aggregate `validate:site` chain through Phase 4.
- `.planning/phases/04-flagship-proof-visuals/04-03-SUMMARY.md` - Records the implementation, verification, and execution notes for this plan.

## Decisions Made
- Kept the validator independent from source domain modules so the release gate checks the exact HTML and assets GitHub Pages will publish.
- Reused the existing `validate:site` entrypoint instead of changing `.github/workflows/deploy.yml`, preserving one shared release gate for local and CI validation.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `pnpm validate:site` now covers the site through the end of Phase 4 without introducing a separate CI path.
- Phase 4 is ready for browser-level smoke checks that judge whether the flagship narratives and optional visuals feel convincing and proportionate in context.

---
*Phase: 04-flagship-proof-visuals*
*Completed: 2026-03-10*
