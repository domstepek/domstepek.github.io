---
phase: 5
slug: personal-context-notes
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-10
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other - Astro compiler checks, production build validation, Node artifact assertions, and `/agent-browser --native` smoke checks against built or deployed pages |
| **Config file** | `package.json`, `src/content.config.ts`, `scripts/validate-phase1.mjs`, `scripts/validate-phase2.mjs`, `scripts/validate-phase3.mjs`, `scripts/validate-phase4.mjs`, and `scripts/validate-phase5.mjs` (to be introduced in this phase) |
| **Quick run command** | `pnpm check && pnpm build` |
| **Full suite command** | `pnpm check && pnpm build && pnpm validate:site` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every completed task until `05-03` Task 1 creates `scripts/validate-phase5.mjs`:** Run `pnpm check && pnpm build`
- **After `05-03` Task 1 and until `05-03` Task 2 adds `validate:phase5` to `package.json`:** Run `pnpm check && pnpm build && node ./scripts/validate-phase5.mjs`
- **After `05-03` Task 2 and after each later task:** Run `pnpm check && pnpm build && pnpm validate:site`
- **After every plan wave:** Run the full suite command available at that point in the phase
- **Before `$gsd-verify-work`:** Full suite must be green, then use `/agent-browser --native` for homepage, about, and notes smoke checks before reserving any remaining tone or readability judgment to the manual checklist below
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

This map is aligned to the finalized `05-01` through `05-03` plan breakdown.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 5-01-01 | 01 | 1 | PROF-01, PROF-02, PROF-03 | static | `pnpm check` | `src/data/personal.ts` | ⬜ pending |
| 5-01-02 | 01 | 1 | PROF-01, PROF-02, PROF-03 | build | `pnpm check && pnpm build` | `src/pages/about.astro` | ⬜ pending |
| 5-01-03 | 01 | 1 | PROF-02, PROF-03 | build | `pnpm check && pnpm build` | `src/components/home/HomePage.astro` | ⬜ pending |
| 5-02-01 | 02 | 2 | NOTE-01, NOTE-02 | static | `pnpm check` | `src/content.config.ts` plus `src/content/notes/systems-over-abstractions.md` and `src/content/notes/keep-the-path-explicit.md` | ⬜ pending |
| 5-02-02 | 02 | 2 | NOTE-01, NOTE-02 | build | `pnpm check && pnpm build` | `src/pages/notes/index.astro` and `src/pages/notes/[slug].astro` | ⬜ pending |
| 5-02-03 | 02 | 2 | NOTE-01, NOTE-02 | build | `pnpm check && pnpm build` | `src/styles/global.css` | ⬜ pending |
| 5-03-01 | 03 | 3 | PROF-01, PROF-02, PROF-03, NOTE-01, NOTE-02 | artifact | `pnpm check && pnpm build && node ./scripts/validate-phase5.mjs` | `scripts/validate-phase5.mjs` | ⬜ pending |
| 5-03-02 | 03 | 3 | PROF-01, PROF-02, PROF-03, NOTE-01, NOTE-02 | artifact | `pnpm check && pnpm build && pnpm validate:site` | `package.json` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

- `pnpm check`
- `pnpm build`
- `scripts/validate-phase1.mjs`
- `scripts/validate-phase2.mjs`
- `scripts/validate-phase3.mjs`
- `scripts/validate-phase4.mjs`
- `.github/workflows/deploy.yml` already runs the aggregate site validator after build

Phase 5 should add `scripts/validate-phase5.mjs` and extend `validate:site` during normal execution rather than through a separate setup wave.

---

## Manual-Only Verifications

These are the subjective and browser-level checks that should happen after the automated artifact gates are green.

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The homepage still reads as a domain map first, with the personal teaser clearly secondary | PROF-03 | Automation can prove structure and ordering, but not whether the teaser visually or tonally overpowers the domain navigation | Open the homepage and confirm the five domain links remain the primary next step while the personal teaser reads as a smaller secondary section |
| The about page is scannable and reads like a working profile rather than a biography dump | PROF-01, PROF-03 | Automated checks can confirm section markers, but not whether the copy density and section rhythm stay easy to scan | Review `/about/` on mobile and desktop widths and confirm `how i work`, `open to`, and `resume` stay segmented and readable |
| Resume access feels unambiguous and works in one click from the chosen Phase 5 entry point | PROF-02 | Structural validation can prove link shape or anchor presence, but the user experience of "one click" still needs browser confirmation | Click the homepage resume entry point and confirm it lands on the intended about-page resume section without confusion or broken navigation |
| The notes area is easy to find from the personal layer without turning the homepage into a navigation-heavy surface | NOTE-01 | Automation can prove the about-page notes link exists, but not whether the path feels obvious and appropriately lightweight | Open `/about/`, locate the notes entry point quickly, and confirm it feels easy to discover without competing with the homepage domain map |
| The notes index is easy to skim and the summaries do real work | NOTE-01 | Automation can check presence of title, summary, and date, but not whether the summaries actually help scanning | Read the notes index and confirm each summary adds useful context instead of repeating the title |
| Each note page stays plain, readable, and text-forward on mobile and desktop widths | NOTE-02 | Built HTML assertions cannot judge typography density, rhythm, or whether the note pages accidentally feel like a blog theme | Open each starter note and confirm the layout stays simple, readable, and comfortably spaced across widths |
| Focus states, reading order, and keyboard navigation remain solid across the new personal and notes links | PROF-01, PROF-02, PROF-03, NOTE-01, NOTE-02 | Accessibility structure needs browser-level interaction to verify tab order and visible focus in context | Tab through the homepage teaser, about page, notes index, and note pages, confirming visible focus, sensible reading order, and reliable link targets |

Use `/agent-browser --native` first when browser-accessible smoke checks are available.

---

## Validation Sign-Off

- [x] All implementation tasks have `<automated>` verify coverage aligned to the finalized `05-01` through `05-03` plan set
- [x] Sampling continuity: no 3 consecutive tasks without automated verification
- [x] Wave 0 dependencies are not required
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter after the final plan/task mapping is filled in

**Approval:** planned 2026-03-10
