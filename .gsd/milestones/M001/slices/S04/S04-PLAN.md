# S04: Flagship Proof & Visuals — completed 2026 03 10

**Goal:** Add one to two flagship stories per domain with role, decisions, outcomes, stack, and visuals where helpful.
**Demo:** Every domain page contains one to two real flagship highlights rather than placeholders.

## Must-Haves
- Every domain page contains one to two real flagship highlights rather than placeholders.
- Each flagship clearly explains the problem, Dom's role, constraints, decisions, and outcome in a scannable structure.
- Each flagship includes the relevant stack or tools used.
- Wherever a visual materially improves comprehension, a screenshot or diagram is included and presented clearly.

## Tasks

- [x] **T01: Introduce the Shared Flagship Data Model and Analytics Pilot**
  A typed flagship highlight model, shared domain-page rendering, and two analytics proof stories now deepen the existing domain-first site without adding new routes or breaking base-aware helpers.

- [x] **T02: Expand Flagship Proof Across All Domains**
  All five domain pages now carry structured flagship proof, three local SVG explainers, and a shared layout pass that keeps the deeper stories readable without flattening the site into a gallery.

- [x] **T03: Dist-First Flagship Validation**
  Dist-first flagship artifact validation plus a widened `validate:site` gate that now covers Phase 4 without changing the deploy workflow shape

## Files Likely Touched
- src/data/domains/types.ts
- src/data/domains/analytics.ts
- src/components/domains/DomainPage.astro
- src/data/domains/infrastructure.ts
- src/data/domains/ai-ml.ts
- src/data/domains/product.ts
- src/data/domains/developer-experience.ts
- src/styles/global.css
- public/highlights/**/*
- scripts/validate-phase4.mjs
- package.json
