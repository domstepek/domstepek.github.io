---
id: T03
parent: S02
milestone: M001
provides:
  - Dist-first validation for all five built domain pages
  - Aggregate site validation that runs Phase 1 and Phase 2 checks together
  - GitHub Pages deploy gating that blocks publish on structural domain regressions
requires: []
affects:
  - S02
key_files:
  - scripts/validate-phase2.mjs
  - .planning/phases/02-domain-hubs-supporting-work/02-03-SUMMARY.md
  - package.json
  - .github/workflows/deploy.yml
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - .planning/REQUIREMENTS.md
key_decisions:
  - "Keep Phase 2 validation dependency-free and dist-first by parsing built domain HTML directly in Node."
  - "Derive the expected back-home href from each page's canonical URL so the validator stays base-path aware without importing app helpers."
  - "Expose one aggregate `validate:site` command and reuse it in CI so future phases extend a single site-level release gate."
patterns_established:
  - "Validation pattern: phase-level checks inspect built HTML in `dist` rather than source templates."
  - "Release-gate pattern: `validate:site` aggregates site validators locally and in the Pages workflow."
drill_down_paths:
  - .gsd/milestones/M001/slices/S02/tasks/T03-PLAN.md
duration: 6 min
verification_result: pass
completed_at: 2026-03-09T00:00:00Z
blocker_discovered: false
---

# T03: Add Dist-First Domain Validation and CI Release Gates

**A built-artifact validator for all five domain hubs, a shared `validate:site` gate, and GitHub Pages enforcement that blocks deploys on structural regressions**

## What Happened
- Added a fast Node validator that audits the emitted domain pages in `dist/` for artifact existence, canonical metadata, template markers, back-home wiring, and outward proof links.
- Exposed `validate:phase2` and `validate:site` so the same release gate can be run locally after build and extended in future phases.
- Updated the GitHub Pages workflow to run the aggregate site validation before artifact upload while keeping the official Pages actions intact.

## Deviations
### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fall back to manual planning-doc updates when current `gsd-tools` helpers cannot persist this repo's planning markdown shape cleanly**
- **Found during:** Plan wrap-up (metadata/docs update)
- **Issue:** `state advance-plan` returned `Cannot parse Current Plan or Total Plans in Phase from STATE.md`, `roadmap update-plan-progress` reported success without changing `ROADMAP.md` on disk, and `requirements mark-complete` could not match the already-complete `DOMN-*` items in the current markdown format.
- **Fix:** Updated `.planning/STATE.md`, `.planning/ROADMAP.md`, and `.planning/REQUIREMENTS.md` manually after confirming the helper limitations.
- **Files modified:** `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- **Verification:** Re-read the planning docs to confirm Phase 2 is complete, the next focus is Phase 3 planning, and the requirements file reflects the latest completion date.
- **Committed in:** Pending final docs commit

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fallback only affected planning bookkeeping. Shipped validator, scripts, and CI gate stayed within the approved scope.

## Files Created/Modified
- `scripts/validate-phase2.mjs`
- `.planning/phases/02-domain-hubs-supporting-work/02-03-SUMMARY.md`
- `package.json`
- `.github/workflows/deploy.yml`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
