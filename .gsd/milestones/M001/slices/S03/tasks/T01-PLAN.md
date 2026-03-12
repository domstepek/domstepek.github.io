# T01: Replace the Placeholder Homepage with Shared Hero, Route, and Home Data

**Slice:** S03
**Milestone:** M001

## Goal
A real text-first homepage now ships through BaseLayout with shared intro, contact, and freshness data plus the five domain-registry routes as the primary next step.

## Must-Haves
- [x] The homepage replaces the Phase 1 placeholder with a real first-screen introduction that explains the kinds of systems Dom builds and routes into the five v1 domain pages.
- [x] The homepage renders all five domain pages as the primary internal next step using the shared Phase 2 domain registry instead of a separate project gallery or hand-copied link list.
- [x] GitHub, LinkedIn, and email links are visible on the homepage, and a freshness signal such as `currently` or `last updated` is rendered in homepage content.
- [x] `src/data/home.ts` exists and provides Homepage-specific copy, contact links, and freshness content
- [x] `src/components/home/HomePage.astro` exists and provides Shared homepage markup for hero, domain navigation, contact links, and freshness signal

## Steps
1. Create a dedicated `src/data/home.ts` module that holds the homepage eyebrow or intro copy, lead paragraph, contact links, and freshness content in the site's direct lowercase voice. Keep the contact shape explicit enough to distinguish GitHub, LinkedIn, and email, and keep the freshness value intentional and manually meaningful. Do not duplicate domain summaries or create a second homepage-only domain taxonomy in this file.
2. Add `src/components/home/HomePage.astro` and have it import `homePage`, the ordered `domains` registry, and `domainPath(slug)`. Render a text-first hero, a primary domain-navigation block using the five existing domain entries, a visible contact-link cluster, and a freshness note. Include stable `data-*` markers for the homepage root, hero, domain navigation, contact links, and freshness so Phase 3 can validate built output later. Avoid cards, client-side interaction, or any project-gallery section.
3. Replace the Phase 1 placeholder content in `src/pages/index.astro` with a thin route that passes homepage-specific title, description, and `canonicalPath` into `BaseLayout`, then renders `HomePage`. Remove the placeholder copy entirely. Keep metadata and internal links base-path-aware and do not pull in flagship sections, screenshots, or resume-like content.

## Context
- Migrated from `.planning/milestones/v1.0-phases/03-homepage-positioning/03-01-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/03-homepage-positioning/03-01-SUMMARY.md`
- Related legacy requirements: HOME-01, HOME-02, HOME-03, HOME-04
