# S02: Domain Hubs & Supporting Work — completed 2026 03 09

**Goal:** Create the five domain pages with clear theses, supporting-work curation, and proof-link paths.
**Demo:** All five v1 domains exist as separate routes with a shared page pattern.

## Must-Haves
- All five v1 domains exist as separate routes with a shared page pattern.
- Each domain page opens with a short thesis that makes the boundary of that domain clear.
- Each domain page includes a curated supporting-work list for non-flagship examples, with enough context to scan quickly.
- Each domain page provides obvious navigation back home and outward to relevant proof artifacts.

## Tasks

- [x] **T01: Bootstrap Typed Domain Data and Shared `/domains/[slug]/` Routes**
  A typed five-domain registry, one shared Astro domain template, and real supporting-work pages with inline proof links for analytics, infrastructure, ai / ml, product, and developer experience

- [x] **T02: Refine Thesis Clarity, Supporting-Work Curation, and Domain-Page Polish**
  Clearer domain boundaries, more convincing supporting evidence, and a minimal style pass that lets the five Phase 2 hubs hold real copy comfortably

- [x] **T03: Add Dist-First Domain Validation and CI Release Gates**
  A built-artifact validator for all five domain hubs, a shared `validate:site` gate, and GitHub Pages enforcement that blocks deploys on structural regressions

## Files Likely Touched
- src/data/domains/types.ts
- src/data/domains/index.ts
- src/data/domains/analytics.ts
- src/data/domains/infrastructure.ts
- src/data/domains/ai-ml.ts
- src/data/domains/product.ts
- src/data/domains/developer-experience.ts
- src/components/domains/DomainPage.astro
- src/pages/domains/[slug].astro
- src/styles/global.css
- package.json
- scripts/validate-phase2.mjs
- .github/workflows/deploy.yml
