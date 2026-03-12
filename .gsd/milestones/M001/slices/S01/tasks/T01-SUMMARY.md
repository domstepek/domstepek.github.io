---
id: T01
parent: S01
milestone: M001
provides:
  - Minimal Astro + TypeScript workspace for the site
  - GitHub Pages-safe static configuration with explicit site and base handling
  - Shared site configuration and base-aware path helpers for future pages
requires: []
affects:
  - S01
key_files:
  - .gitignore
  - package.json
  - pnpm-lock.yaml
  - astro.config.mjs
  - tsconfig.json
  - src/env.d.ts
  - src/data/site.ts
  - src/lib/paths.ts
  - src/pages/index.astro
key_decisions:
  - "Default to the current GitHub Pages project-site shape while keeping site origin and base path overridable through PUBLIC_SITE_URL and PUBLIC_BASE_PATH."
  - "Create shared site metadata and URL helpers before layouts so later plans inherit one source of truth for canonical URLs, assets, and internal routes."
  - "Keep the homepage intentionally minimal and use it as a smoke consumer of the new path helpers instead of pulling later-phase content forward."
patterns_established:
  - "Base-aware URLs: build internal links, canonical URLs, and public asset references through src/lib/paths.ts."
  - "Shared deploy config: keep site identity and deploy path in src/data/site.ts rather than scattering URL constants across pages."
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-PLAN.md
duration: 3 min
verification_result: pass
completed_at: 2026-03-09T00:00:00Z
blocker_discovered: false
---

# T01: Astro Publishing Foundation

**Static Astro workspace with GitHub Pages-safe base-path configuration and shared URL helpers for future site pages**

## What Happened
- Bootstrapped a minimal Astro + TypeScript project with `dev`, `check`, and `build` scripts.
- Locked Astro to static, trailing-slash, directory-style output with explicit GitHub Pages-safe `site` and `base` handling.
- Centralized site metadata and base-aware path helpers, then wired the homepage to smoke-test those helpers.

## Deviations
### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added repository ignore rules for generated artifacts**
- **Found during:** Task 1 (Bootstrap a minimal Astro + TypeScript workspace)
- **Issue:** The repo had no ignore rules, so `node_modules`, `.astro`, and `dist` would pollute task-level status checks and risk accidental commits.
- **Fix:** Added `.gitignore` entries for generated install and build artifacts as part of the workspace bootstrap.
- **Files modified:** `.gitignore`
- **Verification:** `pnpm astro check && pnpm astro build` succeeded with generated directories remaining out of git status noise.
- **Committed in:** `ba8b8de` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** The extra ignore rules kept the scaffold maintainable and made the required atomic commits practical without expanding the plan's product scope.

## Files Created/Modified
- `.gitignore`
- `package.json`
- `pnpm-lock.yaml`
- `astro.config.mjs`
- `tsconfig.json`
- `src/env.d.ts`
- `src/data/site.ts`
- `src/lib/paths.ts`
- `src/pages/index.astro`
