# M006: UI Polish — Domain Pages & Typography — Context

**Gathered:** 2026-03-13
**Status:** Queued — pending auto-mode execution.

## Project Description

A focused visual polish pass on the domain proof pages and site-wide typography. Three concrete issues identified from a full-site audit: flagship project titles use sentence case instead of title case, stack tags are buried at the bottom of each flagship card instead of surfaced under the title, and the body text inside flagship cards reads as a wall of undifferentiated prose due to missing list markers and tight section spacing.

## Why This Milestone

The domain proof pages are the core portfolio artifact — the thing a recruiter or collaborator reads after unlocking. As-is, the flagship cards are hard to scan: titles like "Sample tracking" instead of "Sample Tracking" look unpolished, and the constraints/decisions/outcomes sections blend together with no visual rhythm. These are quick targeted fixes with no architectural risk.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Open any domain proof page and see flagship project titles in proper title case ("Sample Tracking", "Supply Chain Forecasting", "Collection Curator", etc.)
- Immediately see the tech stack tags directly under each project title — no need to scroll to the bottom of a long card to find them
- Scan the constraints, decisions, and outcomes sections as distinct readable lists with bullet markers (›), clear section labels with an accent left-border, and enough vertical breathing room between sections
- See a visual separator between the card header (title + stack + role) and the content body (summary, problem, constraints, decisions, outcomes)

### Entry point / environment

- Entry point: `/domains/product`, `/domains/analytics-ai`, `/domains/developer-experience` (authenticated)
- Environment: Browser, local dev and production
- Live dependencies involved: None

## Completion Class

- Contract complete means: All flagship and supporting work titles are title-cased in data files; stack tags render under the h3; flagship lists have `›` bullet markers; section labels have accent left-border; card header separated from body by a border-top divider
- Integration complete means: Changes coexist with existing Playwright tests (DOM marker contract unchanged); `next build` passes
- Operational complete means: None — static visual changes only

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- A visitor landing on `/domains/product` (authenticated) sees "Sample Tracking", "Supply Chain Forecasting", "Charla.cc" as h3 titles — no sentence-case titles remain
- Stack tags (React, Express, etc.) appear directly under the project title, before the role line
- Constraints, decisions, and outcomes list items each have a `›` prefix and are visually separated from adjacent sections
- All 18 Playwright tests continue to pass (`npx playwright test`)
- `next build` succeeds

## Risks and Unknowns

- Playwright test string matching — some tests may assert on exact text content of page elements; title case changes are safe since existing tests use data-attribute selectors not text matching
- `flagship-list` CSS class — needs to be added to `globals.css`; straightforward but must not collide with `.site-main ul` default styles

## Existing Codebase / Prior Art

- `src/components/domains/DomainProofPage.tsx` — the RSC that renders all flagship cards; primary target for stack tag reorder and section readability changes
- `src/data/domains/product.ts` — flagship titles: "Sample tracking", "Supply chain forecasting"; supporting: "Pricing app"
- `src/data/domains/analytics-ai.ts` — flagship titles: "Collection curator", "MCP tools & agent demo", "Bedrock utilities in Datalabs API"
- `src/data/domains/developer-experience.ts` — domain title: "Developer experience"; flagship titles: "Monorepo template", "Global design system", "Product team CLI", "Product migration scripts", "CDK-EKS contributions", "Stargazer applications", "SSO reverse proxy"
- `src/app/globals.css` — where `.flagship-list` CSS should be added
- `tests/e2e/` — 18 Playwright tests; DOM marker contract must be preserved

> See `.gsd/DECISIONS.md` for all architectural and pattern decisions — it is an append-only register; read it during planning, append to it during execution.

## Relevant Requirements

No existing requirements directly govern visual polish. This milestone improves the quality of the R102-validated portfolio proof surface without changing the gate contract.

## Scope

### In Scope

- Title-casing all flagship and supporting work titles across all three domain data files
- Moving stack tags from the bottom of the flagship card to directly under the h3 title (above the role line)
- Adding `›` bullet markers to constraints, decisions, and outcomes list items via `.flagship-list` CSS class
- Adding a `border-l-2 border-[var(--accent)] pl-2` accent left-border to section labels (Problem, Constraints, Decisions, Outcomes)
- Adding a `border-t border-[var(--border)]` separator between the card header block and the content body
- Increasing intra-section gap from `gap-1` to `gap-2` and overall card gap from `gap-4` to `gap-6`
- Increasing card padding from `p-6` to `p-8`
- Making role text slightly dimmer (`opacity-60`) to visually distinguish it from the section label text

### Out of Scope / Non-Goals

- Changing copy, adding new content, or restructuring the domain data model
- Changes to the gate page (DomainGatePage.tsx)
- Changes to other pages (homepage, about, resume, notes)
- Any new features or capabilities

## Technical Constraints

- All changes are purely presentational — no data model changes, no new components, no routing changes
- Must not break the DOM marker contract (`data-flagship`, `data-flagship-highlights`, `data-supporting-work`, `data-supporting-item`)
- Must pass `next build` and all 18 Playwright tests unchanged

## Integration Points

- `src/app/globals.css` — add `.flagship-list` styles
- `src/components/domains/DomainProofPage.tsx` — reorder card internals, apply new CSS classes
- `src/data/domains/*.ts` — title case fixes only

## Open Questions

- None — scope is fully defined from the audit.
