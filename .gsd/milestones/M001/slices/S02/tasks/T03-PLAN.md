# T03: Add Dist-First Domain Validation and CI Release Gates

**Slice:** S02
**Milestone:** M001

## Goal
A built-artifact validator for all five domain hubs, a shared `validate:site` gate, and GitHub Pages enforcement that blocks deploys on structural regressions

## Must-Haves
- [x] `pnpm validate:phase2` fails if any of the five built domain artifacts are missing or if a built page is missing a non-empty `<title>`, canonical URL, explicit back-home marker with the base-aware home `href`, thesis marker, supporting-work marker, at least one rendered supporting-work entry, or any outward proof link.
- [x] Phase 2 validation inspects emitted `dist` HTML and only checks structural proof-link presence plus absolute `http(s)` URL shape; it does not depend on third-party site availability.
- [x] Local and CI release gates run Phase 1 and Phase 2 validation together after `astro build`, preferably through a single aggregate script such as `validate:site`.
- [x] `scripts/validate-phase2.mjs` exists and provides Dist-first artifact assertions for all five domain pages
- [x] `scripts/validate-phase2.mjs` exists and provides Domain artifact existence checks

## Steps
1. Create a Node-based validation script that runs after `astro build` and inspects the emitted domain HTML in `dist/`. Assert that all five route artifacts exist, each page has a non-empty ` ` and canonical URL, the shared template markers for page, thesis, supporting work, rendered supporting entries, proof link, and back-home link are present, the explicit back-home link resolves to the base-aware home path, and each page exposes at least one outward proof link with an absolute `http(s)` URL. Keep the validator fast, fail clearly, and do not make network requests or require every supporting item to have public proof.
2. Add `validate:phase2` for the new dist audit and add an aggregate `validate:site` command that runs both Phase 1 and Phase 2 validators after build. Keep the scripts simple and future-friendly so later phases can extend the same aggregate gate instead of rewriting workflow steps again.
3. Update the existing GitHub Pages workflow so it continues to install dependencies, run `pnpm astro check`, run the production build, and then run the aggregate site validation before uploading `dist` to Pages. Keep the single deploy flow, preserve the official Pages actions, and do not add remote proof-link checks that could make deploys flaky.

## Context
- Migrated from `.planning/milestones/v1.0-phases/02-domain-hubs-supporting-work/02-03-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/02-domain-hubs-supporting-work/02-03-SUMMARY.md`
- Related legacy requirements: DOMN-01, DOMN-02, DOMN-03, DOMN-04
