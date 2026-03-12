# T01: Astro Publishing Foundation

**Slice:** S01
**Milestone:** M001

## Goal
Static Astro workspace with GitHub Pages-safe base-path configuration and shared URL helpers for future site pages

## Must-Haves
- [x] The project boots as a pure static Astro site with explicit GitHub Pages-safe site and base configuration instead of root-only assumptions.
- [x] Shared site constants and path helpers exist before page templates so later phases can generate canonical URLs, asset URLs, and internal links from one place.
- [x] `package.json` exists and provides Astro and project scripts for local checks and production build
- [x] `astro.config.mjs` exists and provides Static Astro configuration with explicit site and base handling

## Steps
1. Initialize a plain Astro project with `pnpm`, keep it static by default, and strip any starter-kit demo content back to the smallest possible placeholder page that still proves the toolchain works. Add standard scripts for `dev`, `check`, and `build`, but do not introduce a client framework, content collections, domain routes, or later-phase homepage content in this foundation pass.
2. Configure Astro for static output with explicit `site` and `base` handling suitable for GitHub Pages project-site deployment, and choose one URL strategy up front: directory-style output with trailing slashes. Keep the public URL and base path configurable so a repo rename or custom domain later does not force route rewrites, and avoid any assumptions that the site will live at `/`.
3. Create a single `siteConfig` module for site name, default title and description, site URL, base path, and default social asset values. Add a helper module that exports `homePath`, `assetPath`, `canonicalUrl`, and any minimal future-safe route builders needed for later phases. Avoid raw root-relative strings like `/favicon.svg` or `/domains/...` so every later page inherits base-aware behavior automatically.

## Context
- Migrated from `.planning/milestones/v1.0-phases/01-publishing-foundation/01-01-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/01-publishing-foundation/01-01-SUMMARY.md`
- Related legacy requirements: QUAL-01, QUAL-02, QUAL-03, QUAL-04
