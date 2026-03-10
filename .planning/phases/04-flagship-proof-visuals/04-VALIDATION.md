---
phase: 4
slug: flagship-proof-visuals
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-10
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | other - Astro compiler checks, production build validation, Node artifact assertions, and `/agent-browser --native` smoke checks against the built or deployed site |
| **Config file** | `package.json`, `astro.config.mjs`, `scripts/validate-phase1.mjs`, `scripts/validate-phase2.mjs`, `scripts/validate-phase3.mjs`, and `scripts/validate-phase4.mjs` (to be introduced in this phase) |
| **Quick run command** | `pnpm astro check && pnpm astro build` |
| **Full suite command** | `pnpm astro check && pnpm astro build && pnpm validate:site` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every completed task until `validate:phase4` exists:** Run `pnpm astro check && pnpm astro build`
- **After the task that introduces `validate:phase4` and after each later task:** Run `pnpm astro check && pnpm astro build && pnpm validate:site`
- **After every plan wave:** Run the full suite command available at that point in the phase
- **Before `$gsd-verify-work`:** Full suite must be green, then use `/agent-browser --native` for domain-page smoke checks before reserving any remaining subjective checks to the manual checklist below
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

This map is aligned to the finalized `04-01` through `04-03` plan breakdown.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 4-01-01 | 01 | 1 | HIGH-01, HIGH-02, HIGH-03 | static | `pnpm astro check` | `src/data/domains/types.ts` | ⬜ pending |
| 4-01-02 | 01 | 1 | HIGH-01, HIGH-02, HIGH-03 | build | `pnpm astro check && pnpm astro build` | `src/components/domains/DomainPage.astro` | ⬜ pending |
| 4-01-03 | 01 | 1 | HIGH-01, HIGH-02, HIGH-03 | build | `pnpm astro check && pnpm astro build` | `src/data/domains/analytics.ts` | ⬜ pending |
| 4-02-01 | 02 | 2 | HIGH-01, HIGH-02, HIGH-03, HIGH-04 | build | `pnpm astro check && pnpm astro build` | `src/data/domains/analytics.ts` plus the other 4 domain modules | ⬜ pending |
| 4-02-02 | 02 | 2 | HIGH-01, HIGH-02, HIGH-03, HIGH-04 | build | `pnpm astro build` | the five domain modules plus any new `public/highlights/**/*` assets | ⬜ pending |
| 4-02-03 | 02 | 2 | HIGH-01, HIGH-02, HIGH-03, HIGH-04 | build | `pnpm astro check && pnpm astro build` | `src/components/domains/DomainPage.astro` and `src/styles/global.css` | ⬜ pending |
| 4-03-01 | 03 | 3 | HIGH-01, HIGH-02, HIGH-03, HIGH-04 | artifact | `pnpm astro check && pnpm astro build && pnpm validate:phase4` | `scripts/validate-phase4.mjs` | ⬜ pending |
| 4-03-02 | 03 | 3 | HIGH-01, HIGH-02, HIGH-03, HIGH-04 | artifact | `pnpm astro check && pnpm astro build && pnpm validate:site` | `package.json` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure already covers the baseline checks for this phase:

- `pnpm astro check`
- `pnpm astro build`
- `scripts/validate-phase1.mjs`
- `scripts/validate-phase2.mjs`
- `scripts/validate-phase3.mjs`
- `.github/workflows/deploy.yml` already runs the aggregate site validator after build

Phase 4 should add `scripts/validate-phase4.mjs` and extend `validate:site` during normal execution rather than through a separate setup wave.

---

## Manual-Only Verifications

These are the subjective and browser-level checks that should happen after the automated artifact gates are green.

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Each domain page clearly presents one to two flagship highlights that feel meaningfully deeper than supporting work | HIGH-01, HIGH-02 | Automation can count sections and markers, but it cannot judge whether the flagship stories actually read as flagship proof | Open each domain page and confirm the flagship section is visibly distinct from supporting work and contains one to two real highlights |
| Each flagship reads as a scannable story with problem, role, constraints, decisions, outcomes, and stack | HIGH-02, HIGH-03 | Structural assertions can prove fields exist, but not whether the content is convincing and easy to scan | Read one flagship per domain on mobile and desktop widths and confirm the narrative is legible without turning into a long prose wall |
| Any visual included genuinely improves comprehension and does not overpower the page | HIGH-04 | Whether a screenshot or diagram materially helps is a judgment call, not a structural one | Review every flagship visual in context and confirm it explains the work better than text alone while keeping the page text-first |
| Focus states, reading order, alt text, and proof-link accessibility remain solid across the new flagship sections | HIGH-02, HIGH-03, HIGH-04 | Built HTML checks cannot fully replace browser-level accessibility review | Tab through each domain page, inspect images and proof links, and confirm keyboard flow, visible focus, and accessible image descriptions remain clear |

Use `/agent-browser --native` first when browser-accessible smoke checks are available.

---

## Validation Sign-Off

- [x] All tasks have `<verify>` coverage aligned to the finalized `04-01` through `04-03` plan set
- [x] Sampling continuity: no 3 consecutive tasks without automated verification
- [x] Wave 0 dependencies are not required
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter after the final plan/task mapping is filled in

**Approval:** planned 2026-03-10
