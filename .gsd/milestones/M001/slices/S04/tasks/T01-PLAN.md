# T01: Introduce the Shared Flagship Data Model and Analytics Pilot

**Slice:** S04
**Milestone:** M001

## Goal
A typed flagship highlight model, shared domain-page rendering, and two analytics proof stories now deepen the existing domain-first site without adding new routes or breaking base-aware helpers.

## Must-Haves
- [x] The repo keeps the existing typed domain-data modules and shared `DomainPage.astro` pattern, adding flagship data inline on `DomainEntry` instead of migrating to content collections, a CMS, or standalone case-study routes.
- [x] The shared domain page renders a new `flagship highlights` section between the Phase 2 boundary content and `supporting work`, using one repeated scannable structure for title, summary, problem, role, constraints, decisions, outcomes, stack, proof links, and optional visual support.
- [x] One real pilot domain proves the flagship pattern end to end before the rest of the domains are expanded, so later plans can multiply a working structure instead of guessing on five pages at once.
- [x] `src/data/domains/types.ts` exists and provides Structured flagship schema layered onto the existing domain registry
- [x] `src/data/domains/types.ts` exists and provides Optional per-flagship visual support without requiring a visual on every story

## Steps
1. Add explicit `FlagshipVisual` and `FlagshipHighlight` types to the existing domain model, then add a `flagships` array to `DomainEntry`. Keep the field shape scannable and validator-friendly: `slug`, `title`, `summary`, `problem`, `role`, `constraints`, `decisions`, `outcomes`, `stack`, optional `proofLinks`, and optional `visual`. Reuse the existing `ProofLink` type, keep the current `summary` and `supportingWork` contract intact for the homepage and domain routes, and do not migrate content into a new authoring system.
2. Extend `DomainPage.astro` so it renders `flagship highlights` after `what belongs here` and before `supporting work`. Use semantic section, article, list, and optional figure markup, and emit stable `data-*` markers for the flagship section, each flagship entry, title, problem, role, constraints, decisions, outcomes, stack, proof links, and optional visual. Use the existing `assetPath()` helper for any local visual `src` values, but do not introduce a gallery, lightbox, tabs, or any new routes.
3. Promote 1 to 2 analytics stories from the current supporting-work shortlist into real flagships, starting with the strongest candidates such as `web portal` and one of `superset on stargazer` or `umami`. Write concise, grounded content for summary, problem, role, constraints, decisions, outcomes, stack, and proof links so the pilot proves real depth without turning into a long case-study essay. Keep the remaining `supportingWork` entries as lighter evidence, and only add a visual here if a truthful local asset already exists or is trivial to produce later without blocking the pilot.

## Context
- Migrated from `.planning/milestones/v1.0-phases/04-flagship-proof-visuals/04-01-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/04-flagship-proof-visuals/04-01-SUMMARY.md`
- Related legacy requirements: HIGH-01, HIGH-02, HIGH-03, HIGH-04
