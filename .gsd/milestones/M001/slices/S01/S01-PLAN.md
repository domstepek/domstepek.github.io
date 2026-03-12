# S01: Publishing Foundation — completed 2026 03 09

**Goal:** Establish a static, readable, shareable baseline on GitHub Pages.
**Demo:** The site builds and deploys as a static GitHub Pages site without broken asset or route behavior.

## Must-Haves
- The site builds and deploys as a static GitHub Pages site without broken asset or route behavior.
- Shared layout and CSS provide comfortable reading on both mobile and desktop widths.
- Semantic structure, readable typography, obvious link states, and strong contrast are in place across the site shell.
- Core sharing and polish are wired up: page titles, descriptions, Open Graph metadata, favicon, and a working `404` page.

## Tasks

- [x] **T01: Astro Publishing Foundation**
  Static Astro workspace with GitHub Pages-safe base-path configuration and shared URL helpers for future site pages

- [x] **T02: Accessible Shell and Metadata Baseline**
  Shared Astro layout with centralized metadata, readable global CSS, a sparse homepage, a real noindex 404 page, and shared favicon/OG defaults

- [x] **T03: Release Gate and Pages Automation**
  A built-artifact validator and GitHub Pages workflow that gate deployment on Astro checks, production build output, and Phase 1 metadata assertions

## Files Likely Touched
- package.json
- pnpm-lock.yaml
- astro.config.mjs
- tsconfig.json
- src/env.d.ts
- src/data/site.ts
- src/lib/paths.ts
- src/pages/index.astro
- src/components/layout/BaseLayout.astro
- src/styles/global.css
- src/pages/404.astro
- public/favicon.svg
- public/og-default.png
- scripts/validate-phase1.mjs
- .github/workflows/deploy.yml
