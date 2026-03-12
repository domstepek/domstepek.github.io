# S03: Homepage Positioning — completed 2026 03 10

**Goal:** Make the first screen explain Dom's scope, link into the domains, surface contact, and signal freshness.
**Demo:** From the first screen, a visitor can immediately tell the kinds of systems Dom builds across the five v1 domains.

## Must-Haves
- From the first screen, a visitor can immediately tell the kinds of systems Dom builds across the five v1 domains.
- The homepage exposes all five domain pages as the primary next step, not a generic project dump.
- GitHub, LinkedIn, and email are visible on the homepage and open correctly.
- The homepage includes a freshness signal such as `currently`, `now`, or `last updated`.

## Tasks

- [x] **T01: Replace the Placeholder Homepage with Shared Hero, Route, and Home Data**
  A real text-first homepage now ships through BaseLayout with shared intro, contact, and freshness data plus the five domain-registry routes as the primary next step.

- [x] **T02: Sharpen First-Screen Copy and Text-First Domain Routing**
  Homepage hero copy, registry-backed domain previews, and shared layout styles now make the landing page read like a quick map into the five work domains instead of a temporary shell.

- [x] **T03: Add Dist-First Homepage Validation to the Site Release Gate**
  A dist-first homepage validator now audits the built landing page, and the shared `validate:site` release gate blocks deploys on regressions across Phases 1 through 3.

- [x] **T04: Dark Theme and CRT Effect**
  Dark theme retheme with Space Mono monospace font, CRT scanline overlay, retro pixel cursors, and avatar illustration on homepage

- [x] **T05: Domain Hub Copy Audit**
  Rewrote all 5 domain hub pages from internal taxonomy notes to visitor-facing descriptions with action-oriented bullet items

## Files Likely Touched
- src/data/home.ts
- src/components/home/HomePage.astro
- src/pages/index.astro
- src/data/domains/analytics.ts
- src/data/domains/infrastructure.ts
- src/data/domains/ai-ml.ts
- src/data/domains/product.ts
- src/data/domains/developer-experience.ts
- src/styles/global.css
- scripts/validate-phase3.mjs
- package.json
- src/components/layout/BaseLayout.astro
- public/cursors/default.png
- public/cursors/pointer.png
- public/images/avatar.png
