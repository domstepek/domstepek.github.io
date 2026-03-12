# T03: Add Dist-First Homepage Validation to the Site Release Gate

**Slice:** S03
**Milestone:** M001

## Goal
A dist-first homepage validator now audits the built landing page, and the shared `validate:site` release gate blocks deploys on regressions across Phases 1 through 3.

## Must-Haves
- [x] `pnpm validate:phase3` fails if the built homepage artifact is missing or if the page lacks the homepage hero, five domain links, contact links, or freshness marker.
- [x] The homepage validator inspects emitted `dist/index.html` and checks structural link shape only: base-aware internal domain hrefs, absolute `https` URLs for GitHub and LinkedIn, and a `mailto:` URL for email.
- [x] The aggregate site validation command covers Phases 1 through 3 through `pnpm validate:site`, so the existing Pages workflow automatically blocks deployment on homepage regressions.
- [x] `scripts/validate-phase3.mjs` exists and provides Dist-first homepage artifact assertions
- [x] `scripts/validate-phase3.mjs` exists and provides Homepage artifact existence checks

## Steps
1. Create a Node-based validation script that runs after `astro build` and inspects `dist/index.html`. Assert that the homepage artifact exists, has a non-empty ` ` and canonical URL, renders the homepage hero marker, exposes exactly five domain links through the stable homepage markers, includes visible contact-link markers for GitHub, LinkedIn, and email, and includes a non-empty freshness marker. Validate internal domain hrefs against the base-aware expected paths and validate external link shape structurally only: `https` for GitHub and LinkedIn, `mailto:` for email. Do not make network requests.
2. Add `validate:phase3` and extend `validate:site` so the existing Phase 1 and Phase 2 validators continue to run and the new homepage validator is included in the same aggregate command. Keep the script chain simple so the current GitHub Pages workflow automatically picks up the new gate without branching into a second CI path.

## Context
- Migrated from `.planning/milestones/v1.0-phases/03-homepage-positioning/03-03-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/03-homepage-positioning/03-03-SUMMARY.md`
- Related legacy requirements: HOME-01, HOME-02, HOME-03, HOME-04
