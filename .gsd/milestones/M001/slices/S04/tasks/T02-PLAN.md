# T02: Expand Flagship Proof Across All Domains

**Slice:** S04
**Milestone:** M001

## Goal
All five domain pages now carry structured flagship proof, three local SVG explainers, and a shared layout pass that keeps the deeper stories readable without flattening the site into a gallery.

## Must-Haves
- [x] Every domain page ends up with 1 to 2 real flagship highlights, and the flagship section stays clearly distinct from the lighter `supporting work` section instead of flattening the site into a generic project gallery.
- [x] Each flagship tells the same scannable story shape: summary, problem, role, constraints, decisions, outcomes, stack, proof links, and an optional visual only when a screenshot or diagram materially improves understanding.
- [x] Visual assets, when used, live under `public/highlights/<domain>/<flagship>/...` and resolve through the existing base-aware asset flow instead of remote fetches, `src/assets`, or a JS gallery system.
- [x] `src/data/domains/analytics.ts` exists and provides Final analytics flagship content aligned with the shared Phase 4 schema
- [x] `src/data/domains/infrastructure.ts` exists and provides Real flagship content for the infrastructure domain

## Steps
1. Revisit the pilot analytics module and fill the remaining four domain modules with 1 to 2 flagship highlights each, promoting from the current supporting-work shortlist before inventing new domain ownership. Every flagship must include summary, problem, role, constraints, decisions, outcomes, stack, and proof links. Keep the content compact and concrete, trim or reposition any supporting-work entries that would otherwise duplicate a flagship verbatim, and preserve the Phase 2 domain boundaries instead of reopening cross-domain ownership from scratch.
2. Add local visuals only for the subset of flagships where a screenshot or diagram genuinely helps the visitor understand the work faster. Store every local asset under `public/highlights/ / /...`, wire the corresponding `visual` objects in the domain modules, require real alt text and short explanatory captions, and prefer truthful screenshots or simple static diagrams from public, demo, or reproducible artifacts. If no trustworthy visual is available for a flagship, leave `visual` unset rather than adding decorative media.
3. Adjust the shared template and global styles so flagship highlights stay easy to scan with real content: clear section separation from supporting work, comfortable list rhythm for constraints, decisions, outcomes, and stack, figure spacing that keeps text primary, and mobile or desktop behavior that handles the longest title and deepest section gracefully. Keep the presentation text-forward, preserve the existing site shell and focus states, and do not add cards, tabs, carousels, or bespoke per-domain layouts.

## Context
- Migrated from `.planning/milestones/v1.0-phases/04-flagship-proof-visuals/04-02-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/04-flagship-proof-visuals/04-02-SUMMARY.md`
- Related legacy requirements: HIGH-01, HIGH-02, HIGH-03, HIGH-04
