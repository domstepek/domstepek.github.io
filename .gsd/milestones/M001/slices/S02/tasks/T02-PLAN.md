# T02: Refine Thesis Clarity, Supporting-Work Curation, and Domain-Page Polish

**Slice:** S02
**Milestone:** M001

## Goal
Clearer domain boundaries, more convincing supporting evidence, and a minimal style pass that lets the five Phase 2 hubs hold real copy comfortably

## Must-Haves
- [x] Each domain page opens with a distinct first-person thesis, short bullets, and an explicit scope line that makes the boundary obvious without reading the whole page.
- [x] Supporting work reads as curated stacked evidence with one-line context and inline proof links, not as a generic repo dump, dense prose block, or Phase 4-style flagship section.
- [x] Presentation changes stay text-first and incremental: longer headings, supporting lists, related-domain cross-links, and focus states remain readable on mobile and desktop without rewriting the homepage or adding card-heavy UI.
- [x] `src/data/domains/analytics.ts` exists and provides Finalized analytics thesis, scope, and supporting-work curation
- [x] `src/data/domains/infrastructure.ts` exists and provides Finalized infrastructure thesis, scope, and supporting-work curation

## Steps
1. Revisit the five domain modules and tighten the `thesis`, `belongsHere`, `scope`, `summary`, and `seoDescription` fields until the difference between `analytics`, `infrastructure`, `ai / ml`, `product`, and `developer experience` is obvious from the top of each page. Keep the copy in the site's direct lowercase voice, use concrete problem language instead of broad portfolio adjectives, and do not pull homepage framing or flagship-story detail into this plan.
2. Edit the domain modules and shared template so supporting work reads as moderately curated stacked entries rather than a repo dump. Each entry should answer "what was this?" in one compact line before the visitor clicks, keep one primary proof link by default with an optional second link only when it materially helps, and use brief related-domain mentions instead of duplicating full entries across pages. Ensure every page still has at least one outward proof link somewhere, even though some individual supporting items may remain proofless.
3. Add only the CSS and small markup hooks needed for real domain copy: better wrapping for long titles like `developer experience`, section spacing between the thesis opening and supporting work, supporting-entry grouping, and comfortable link and focus rhythm on mobile and desktop. Keep the presentation text-forward, avoid cards or grids, and do not modify `src/pages/index.astro` or invent a second visual system for domain pages.

## Context
- Migrated from `.planning/milestones/v1.0-phases/02-domain-hubs-supporting-work/02-02-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/02-domain-hubs-supporting-work/02-02-SUMMARY.md`
- Related legacy requirements: DOMN-01, DOMN-02, DOMN-03, DOMN-04
