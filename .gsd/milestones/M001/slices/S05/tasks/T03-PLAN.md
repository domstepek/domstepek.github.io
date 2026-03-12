# T03: Dist-First Personal and Notes Validation

**Slice:** S05
**Milestone:** M001

## Goal
Phase 5 now has a dist-first validator plus an expanded `validate:site` gate that proves the homepage teaser, about page, notes index, and note detail routes from built output.

## Must-Haves
- [x] The Phase 5 release gate fails if the built site is missing the homepage teaser, about-page profile sections, notes entry point, one-click resume access, notes index, or note detail pages.
- [x] The Phase 5 release gate catches broken note ordering or broken note-detail routes by following rendered note links in built output.
- [x] One shared site-validation command proves the published site through the end of Phase 5 without requiring a separate CI path.
- [x] `scripts/validate-phase5.mjs` exists and provides Dist-first validator for the personal and notes surfaces introduced in Phase 5
- [x] `scripts/validate-phase5.mjs` exists and provides About-page notes-entry checks, note-link traversal, resume-anchor checks, and rendered-date ordering assertions

## Steps
1. Create a Node-based validator that runs after `astro build` and inspects `dist/index.html`, `dist/about/index.html`, and `dist/notes/index.html`. Assert that the homepage exposes exactly one `data-home-personal-teaser` block plus base-aware about and resume-anchor links, that the about page exposes non-empty `data-personal-page`, `data-how-i-work`, `data-how-i-work-systems`, `data-how-i-work-product`, `data-how-i-work-collaboration`, `data-open-to`, `data-resume-section`, and `data-personal-notes-link` markers, and that the about-page notes link resolves to the canonical `/notes/` path while the homepage resume link targets the canonical about-page resume anchor. Parse the rendered note items from the built notes index, require at least 2 starter notes with non-empty title, summary, and date text, validate reverse-chronological ordering from rendered `datetime` attributes, follow each built note link into its `dist` artifact, and assert each note page exposes non-empty `data-note-title`, `data-note-date`, and `data-note-body` markers plus page metadata derived from note content.
2. Add `validate:phase5` and extend `validate:site` so the existing Phase 1 through Phase 4 validators still run before the new Phase 5 validator. Keep the command chain simple and compatible with the existing CI flow so no GitHub Actions rewrite is needed to pick up the stronger gate.

## Context
- Migrated from `.planning/milestones/v1.0-phases/05-personal-context-notes/05-03-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/05-personal-context-notes/05-03-SUMMARY.md`
- Related legacy requirements: PROF-01, PROF-02, PROF-03, NOTE-01, NOTE-02
