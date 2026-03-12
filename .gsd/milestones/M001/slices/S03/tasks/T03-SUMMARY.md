---
id: T03
parent: S03
milestone: M001
provides:
  - Dist-first homepage artifact validation against emitted HTML
  - Base-aware homepage domain-link checks derived from the canonical path
  - Aggregate site validation widened through Phase 3
requires: []
affects:
  - S03
key_files:
  - scripts/validate-phase3.mjs
  - .planning/phases/03-homepage-positioning/03-03-SUMMARY.md
  - package.json
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - .planning/REQUIREMENTS.md
key_decisions:
  - "Validate the homepage from built dist/index.html so the gate matches the artifact GitHub Pages will publish."
  - "Derive expected homepage domain hrefs from the emitted canonical URL so the validator stays base-path aware without importing source helpers."
  - "Extend the existing validate:site chain instead of creating a separate homepage CI path."
patterns_established:
  - "Homepage validation pattern: inspect stable data-home-* markers in emitted HTML and keep external-link checks structural only."
  - "Release-gate pattern: widen the shared validate:site command as new phase validators land."
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T03-PLAN.md
duration: 4 min
verification_result: pass
completed_at: 2026-03-09T00:00:00Z
blocker_discovered: false
---

# T03: Add Dist-First Homepage Validation to the Site Release Gate

**A dist-first homepage validator now audits the built landing page, and the shared `validate:site` release gate blocks deploys on regressions across Phases 1 through 3.**

## What Happened
- Added a Node-based homepage validator that reads `dist/index.html` and checks the built artifact for metadata, hero, domain, contact, and freshness markers.
- Made the homepage domain-link audit base-aware by deriving expected `/domains/<slug>/` hrefs from the emitted canonical URL instead of from source files.
- Extended `validate:site` so the Phase 1, Phase 2, and new Phase 3 validators all run in one release gate.

## Deviations
### Auto-fixed Issues

**1. [Rule 3 - Blocking] Manually synced planning docs after `gsd-tools state advance-plan` failed to parse `STATE.md`**
- **Found during:** Plan wrap-up (metadata/docs update)
- **Issue:** `state advance-plan` returned `{"error":"Cannot parse Current Plan or Total Plans in Phase from STATE.md"}`, and `requirements mark-complete` could not re-mark the already-complete `HOME-*` requirements.
- **Fix:** Used the working helpers (`state update-progress`, `state record-metric`, `roadmap update-plan-progress`, and `state record-session`), then manually patched `STATE.md`, `ROADMAP.md`, and `REQUIREMENTS.md` so Phase 3 closes cleanly and Phase 4 is the next planning target.
- **Files modified:** `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`
- **Verification:** Re-read the planning docs to confirm Phase 3 shows `3/3` plans complete, the next phase is `Phase 4`, and the requirements doc reflects the Phase 3 homepage release gate.
- **Committed in:** Pending final docs commit

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fallback only affected planning bookkeeping. The validator and release-gate work stayed within the planned scope and verified cleanly.

## Files Created/Modified
- `scripts/validate-phase3.mjs`
- `.planning/phases/03-homepage-positioning/03-03-SUMMARY.md`
- `package.json`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
