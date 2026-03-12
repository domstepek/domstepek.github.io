# T03: Release Gate and Pages Automation

**Slice:** S01
**Milestone:** M001

## Goal
A built-artifact validator and GitHub Pages workflow that gate deployment on Astro checks, production build output, and Phase 1 metadata assertions

## Must-Haves
- [x] `pnpm validate:phase1` fails if the built homepage is missing a non-empty `<title>`, `meta name="description"`, `link rel="canonical"`, `meta property="og:title"`, `meta property="og:description"`, `meta property="og:image"`, or favicon link.
- [x] `pnpm validate:phase1` fails if `dist/404.html` is missing, lacks `noindex`, or lacks a route back to the homepage.
- [x] GitHub Actions runs `pnpm astro check`, `pnpm astro build`, and `pnpm validate:phase1` before uploading and deploying the Pages artifact.
- [x] `scripts/validate-phase1.mjs` exists and provides Production artifact and metadata assertions for Phase 1
- [x] `scripts/validate-phase1.mjs` exists and provides Homepage artifact assertion

## Steps
1. Implement a Node-based validation script that runs after `astro build` and asserts the required Phase 1 outputs exist: `dist/index.html`, `dist/404.html`, favicon asset, default OG asset, non-empty title, meta description, canonical URL, Open Graph tags, and `noindex` on the 404 page. Wire it to `pnpm validate:phase1`, keep it fast enough to run after each wave, and fail clearly when a required artifact or tag is missing.
2. Create a GitHub Actions Pages workflow that installs dependencies, runs `pnpm astro check`, runs the production build, runs `pnpm validate:phase1`, uploads the built `dist` artifact, and deploys with the official Pages actions. Configure permissions and branch triggers for a standard default-branch publish, and do not assume a custom domain or root-hosted deployment.

## Context
- Migrated from `.planning/milestones/v1.0-phases/01-publishing-foundation/01-03-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/01-publishing-foundation/01-03-SUMMARY.md`
- Related legacy requirements: QUAL-01, QUAL-02, QUAL-03, QUAL-04
