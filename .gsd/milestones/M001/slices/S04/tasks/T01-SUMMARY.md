---
id: T01
parent: S04
milestone: M001
provides:
  - Typed flagship highlight and optional visual schema layered onto the domain registry
  - Shared flagship rendering with stable `data-flagship-*` markers in the domain page template
  - Two analytics flagship stories that prove the flagship structure above supporting work
requires: []
affects:
  - S04
key_files:
  - .planning/phases/04-flagship-proof-visuals/04-01-SUMMARY.md
  - src/data/domains/types.ts
  - src/data/domains/analytics.ts
  - src/components/domains/DomainPage.astro
key_decisions:
  - "Keep flagship proof inline on the existing shared domain page instead of adding standalone case-study routes."
  - "Reuse `ProofLink` and base-aware `assetPath()` handling so optional visuals fit the current GitHub Pages-safe path model."
  - "Pilot the flagship format in analytics with two deeper stories while keeping lighter evidence in `supportingWork`."
patterns_established:
  - "Content pattern: flagships use short narrative fields plus scannable lists for constraints, decisions, outcomes, and stack."
  - "Validation pattern: flagship markup emits stable `data-flagship-*` markers so later plans can inspect built HTML."
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-PLAN.md
duration: 5 min
verification_result: pass
completed_at: 2026-03-10T00:00:00Z
blocker_discovered: false
---

# T01: Introduce the Shared Flagship Data Model and Analytics Pilot

**A typed flagship highlight model, shared domain-page rendering, and two analytics proof stories now deepen the existing domain-first site without adding new routes or breaking base-aware helpers.**

## What Happened
- Added `FlagshipVisual` and `FlagshipHighlight` to the domain typing layer and wired flagship data into `DomainEntry`.
- Extended `DomainPage.astro` to render a text-forward `flagship highlights` section with stable `data-flagship-*` markers and base-aware visual handling.
- Promoted `web portal` and `superset on stargazer` into analytics flagships while keeping `umami` as lighter supporting evidence.

## Deviations
None - plan executed exactly as written.

## Files Created/Modified
- `.planning/phases/04-flagship-proof-visuals/04-01-SUMMARY.md`
- `src/data/domains/types.ts`
- `src/data/domains/analytics.ts`
- `src/components/domains/DomainPage.astro`
