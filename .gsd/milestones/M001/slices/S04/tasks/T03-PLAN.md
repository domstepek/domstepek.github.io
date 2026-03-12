# T03: Dist-First Flagship Validation

**Slice:** S04
**Milestone:** M001

## Goal
Dist-first flagship artifact validation plus a widened `validate:site` gate that now covers Phase 4 without changing the deploy workflow shape

## Must-Haves
- [x] `pnpm validate:phase4` inspects built `dist/domains/<slug>/index.html` artifacts and fails if a domain page is missing the flagship section, has fewer than 1 or more than 2 flagship entries, or is missing the required per-flagship structural markers for title, problem, role, constraints, decisions, outcomes, or stack.
- [x] The Phase 4 validator treats visuals as optional but strict when present: any `data-flagship-visual` must emit an `img` with non-empty `src` and `alt`, and local highlight assets must resolve through base-aware site paths.
- [x] `pnpm validate:site` expands through Phase 4 without changing the existing GitHub Pages workflow file because CI already runs the aggregate site gate after build.
- [x] `scripts/validate-phase4.mjs` exists and provides Dist-first validator for flagship structure across all five domain pages
- [x] `scripts/validate-phase4.mjs` exists and provides Flagship-section presence and count assertions

## Steps
1. Create a Node-based validator that runs after `astro build` and inspects each built domain artifact in `dist/domains/ /index.html`. Assert that every domain page still exists, exposes one `data-flagship-highlights` section, renders at least 1 and at most 2 `data-flagship` entries, and gives each flagship non-empty title, problem, role, and outcomes text plus at least one constraint item, one decision item, and one stack item. Validate any `data-flagship-proof-link` structurally as absolute `http(s)` URLs. If a `data-flagship-visual` exists, require an `img` with non-empty `src` and `alt`, and confirm local highlight asset paths are base-aware. Do not read source TS modules and do not fail when a flagship intentionally has no visual.
2. Add `validate:phase4` and extend `validate:site` so the existing Phase 1 through Phase 3 validators still run and the new Phase 4 validator is included in the same aggregate command. Keep the script chain simple so the already-wired GitHub Pages workflow automatically inherits the stronger gate without a separate CI path or workflow rewrite.

## Context
- Migrated from `.planning/milestones/v1.0-phases/04-flagship-proof-visuals/04-03-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/04-flagship-proof-visuals/04-03-SUMMARY.md`
- Related legacy requirements: HIGH-01, HIGH-02, HIGH-03, HIGH-04
