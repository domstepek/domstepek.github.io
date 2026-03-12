---
id: T05
parent: S03
milestone: M001
provides:
  - Visitor-facing copy across all 5 domain hub pages
requires: []
affects:
  - S03
key_files:
  - src/data/domains/analytics.ts
  - src/data/domains/infrastructure.ts
  - src/data/domains/ai-ml.ts
  - src/data/domains/product.ts
  - src/data/domains/developer-experience.ts
  - src/components/domains/DomainPage.astro
key_decisions:
  - "Rewrote scope fields from sorting-rule pattern to natural domain descriptions"
  - "Changed section heading from 'what belongs here' to 'the kind of work i do here'"
  - "Kept thesis lines unchanged as they already read naturally in first person"
patterns_established:
  - "Domain scope fields describe the domain conversationally, not as internal taxonomy"
  - "BelongsHere items start with action verbs (building, designing, wiring, setting up, creating)"
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T05-PLAN.md
duration: 5min
verification_result: pass
completed_at: 2026-03-10T00:00:00Z
blocker_discovered: false
---

# T05: Domain Hub Copy Audit

**Rewrote all 5 domain hub pages from internal taxonomy notes to visitor-facing descriptions with action-oriented bullet items**

## What Happened
- Replaced "belongs here / belongs somewhere else" sorting-rule framing with natural domain descriptions across all 5 data files
- Updated DomainPage section heading from "what belongs here" to "the kind of work i do here"
- Rewrote belongsHere bullet items from abstract categories to concrete action-oriented descriptions
- Human-verified that copy reads naturally on all domain pages

## Deviations
None - plan executed exactly as written.

## Files Created/Modified
- `src/data/domains/analytics.ts`
- `src/data/domains/infrastructure.ts`
- `src/data/domains/ai-ml.ts`
- `src/data/domains/product.ts`
- `src/data/domains/developer-experience.ts`
- `src/components/domains/DomainPage.astro`
