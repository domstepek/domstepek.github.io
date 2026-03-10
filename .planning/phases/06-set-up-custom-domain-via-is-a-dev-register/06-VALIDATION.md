---
phase: 6
slug: set-up-custom-domain-via-is-a-dev-register
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-09
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in fs/promises (custom validators) |
| **Config file** | None — scripts run directly via package.json |
| **Quick run command** | `pnpm validate:phase6` |
| **Full suite command** | `pnpm validate:site` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm validate:phase6`
- **After every plan wave:** Run `pnpm validate:site`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 01 | 1 | N/A (infra) | unit | `pnpm validate:phase6` | No — W0 | pending |
| 6-01-02 | 01 | 1 | N/A (infra) | integration | `pnpm validate:site` | Yes (phases 1-5) | pending |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

- [ ] `scripts/validate-phase6.mjs` — CNAME file existence and content check
- [ ] `package.json` — add `validate:phase6` script and extend `validate:site` chain

*Existing Phase 1-5 validator infrastructure covers build-under-new-base-path verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| is-a-dev PR submitted and merged | N/A (external) | External repo, human review process | Submit PR to is-a-dev/register, wait for merge |
| Domain resolves to site | N/A (DNS) | DNS propagation is async | Visit https://jean-dominique-stepek.is-a.dev after merge |
| HTTPS enforced | N/A (hosting) | GitHub Pages setting, not code | Enable "Enforce HTTPS" in repo Pages settings |
| Old URL redirects | N/A (hosting) | GitHub Pages native behavior | Visit https://jstepek.github.io/website, confirm redirect |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
