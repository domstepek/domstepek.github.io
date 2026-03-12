# T02: Sharpen First-Screen Copy and Text-First Domain Routing

**Slice:** S03
**Milestone:** M001

## Goal
Homepage hero copy, registry-backed domain previews, and shared layout styles now make the landing page read like a quick map into the five work domains instead of a temporary shell.

## Must-Haves
- [x] From the first screen, a visitor can tell that Dom works across analytics, infrastructure, ai / ml, product, and developer experience without having to open the domain pages first.
- [x] The homepage domain links read as the primary next step using short, distinct one-line previews from the shared domain data rather than a generic project grid, repo dump, or flagship section.
- [x] The homepage stays minimal and readable on mobile and desktop while still giving the hero, domain links, contact cluster, and freshness note enough visual hierarchy.
- [x] `src/data/home.ts` exists and provides Tightened homepage framing copy and freshness wording
- [x] `src/data/domains/analytics.ts` exists and provides Homepage-friendly analytics summary line

## Steps
1. Refine the homepage eyebrow, heading, lead paragraph, contact labels, and freshness wording until the first screen clearly frames the site as a domain-first portfolio for systems, products, and tooling. Keep the tone direct and lowercase, keep the copy short enough to scan quickly, and do not let the hero turn into a broad manifesto or resume summary.
2. Review all five domain modules and tighten each `summary` field until the homepage has five intentional one-line previews that sound distinct from one another. Keep those summary lines consistent with the Phase 2 thesis boundaries, short enough to work as homepage navigation copy, and free of project lists or flagship detail. Some modules may only need light edits, but all five summaries should be deliberately checked and left homepage-ready.
3. Add only the markup hooks and CSS needed for the real homepage content: hero spacing, domain-link stacking, contact-cluster rhythm, freshness-note placement, and comfortable mobile and desktop wraps. Keep the presentation text-forward, avoid cards or heavy grids, and preserve the existing site shell and typography baseline instead of inventing a second visual system.

## Context
- Migrated from `.planning/milestones/v1.0-phases/03-homepage-positioning/03-02-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/03-homepage-positioning/03-02-SUMMARY.md`
- Related legacy requirements: HOME-01, HOME-02, HOME-03, HOME-04
