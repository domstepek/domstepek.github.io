# T01: Bootstrap Typed Domain Data and Shared `/domains/[slug]/` Routes

**Slice:** S02
**Milestone:** M001

## Goal
A typed five-domain registry, one shared Astro domain template, and real supporting-work pages with inline proof links for analytics, infrastructure, ai / ml, product, and developer experience

## Must-Haves
- [x] The five v1 domains are locked to `/domains/[slug]/` using the slugs `analytics`, `infrastructure`, `ai-ml`, `product`, and `developer-experience`, and they are generated from one typed registry instead of five hand-written pages.
- [x] The route for each domain page reuses `BaseLayout`, passes the domain-specific `title` and `seoDescription` into the layout, and wires `canonicalPath` through `domainPath(slug)` rather than duplicating head tags or assuming root-relative URLs.
- [x] The shared domain page template renders an explicit top-of-page `back home` link, a short first-person thesis, short belonging bullets, an explicit scope line, a supporting-work section with rendered entries, and inline proof links without introducing flagship sections or a `/domains/` index page.
- [x] `src/data/domains/types.ts` exists and provides Typed Phase 2 content model for domain pages
- [x] `src/data/domains/index.ts` exists and provides Ordered domain registry and slug lookup helpers

## Steps
1. Create a small typed data layer under `src/data/domains/` that locks the five visitor-facing domains and the exact route slugs up front. Model fields for `title`, `summary`, `seoDescription`, `thesis`, `scope`, `belongsHere`, `supportingWork`, and optional `relatedDomains`, and define the supporting data shape explicitly: supporting items need `title`, `context`, and optional `proofLinks`, while proof links need `label` and `href`. Keep the source in TypeScript modules rather than Astro frontmatter or content collections. Seed each domain module with minimal valid structure so the route can consume it immediately in the next task, but do not pull homepage positioning or flagship-story schema into this plan.
2. Add one shared `DomainPage.astro` component and one dynamic route file that uses `getStaticPaths`, `getDomainBySlug`, `BaseLayout`, `domainPath(slug)`, and `homePath`. The route must pass each domain entry's `title`, `seoDescription`, and canonical path into `BaseLayout`. The template must include the explicit top `back home` link, domain title, thesis block, short bullets, scope line, supporting-work section, rendered supporting entries, inline proof links, and stable `data-*` markers for later dist validation. Do not add a `/domains/` overview route, client-side interactivity, or a second layout shell.
3. Fill each domain module with baseline copy good enough to make the routes real: one short first-person thesis sentence, 2 to 4 belonging bullets, one explicit scope line, and roughly 3 to 6 curated supporting-work items. Assign each project to one canonical home domain based on the primary problem solved, keep proof links inline with the supporting entry, allow zero proof links on some entries, but ensure every page has at least one outward proof link somewhere. Leave flagship sections, visuals, screenshots, and homepage navigation work for later phases.

## Context
- Migrated from `.planning/milestones/v1.0-phases/02-domain-hubs-supporting-work/02-01-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/02-domain-hubs-supporting-work/02-01-SUMMARY.md`
- Related legacy requirements: DOMN-01, DOMN-02, DOMN-03, DOMN-04
