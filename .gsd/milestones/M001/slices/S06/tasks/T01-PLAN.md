# T01: Update Site Config Defaults

**Slice:** S06
**Milestone:** M001

## Goal
Site config transitioned from jstepek.github.io/website to jean-dominique-stepek.is-a.dev with root base path, CNAME file, and updated CI defaults

## Must-Haves
- [x] Site builds under root base path `/` with the new domain as canonical origin
- [x] CNAME file exists in public/ with exactly `jean-dominique-stepek.is-a.dev`
- [x] CI workflow defaults reference the new domain and root base path
- [x] `public/CNAME` exists and provides GitHub Pages custom domain declaration
- [x] `astro.config.mjs` exists and provides Updated DEFAULT_SITE_URL and DEFAULT_BASE_PATH

## Steps
1. 1. In `astro.config.mjs`, change `DEFAULT_SITE_URL` from `"https://jstepek.github.io"` to `"https://jean-dominique-stepek.is-a.dev"` and `DEFAULT_BASE_PATH` from `"/website"` to `"/"`. Leave everything else unchanged — the `normalizeBasePath` helper already handles `"/"` correctly. 2. In `src/data/site.ts`, make the same two constant changes: `DEFAULT_SITE_URL` to `"https://jean-dominique-stepek.is-a.dev"` and `DEFAULT_BASE_PATH` to `"/"`. Also update `defaultDescription` from the current repo-style description to a visitor-facing description in the site's casual lowercase voice. Something like: `"dom builds analytics platforms, infrastructure, ai/ml tooling, product systems, and developer experience tooling."` — this matches the site's existing tone. Keep `name`, `defaultTitle`, and all other fields unchanged per the locked decision that the site identity stays "dom" everywhere. 3. Create `public/CNAME` containing exactly one line: `jean-dominique-stepek.is-a.dev` with no trailing newline. This file gets copied to `dist/CNAME` by Astro's static build, which is what GitHub Pages reads for custom domain configuration. IMPORTANT: Both files must have identical `DEFAULT_SITE_URL` and `DEFAULT_BASE_PATH` values. A mismatch between astro.config.mjs and src/data/site.ts will cause canonical URLs to disagree with the Astro site/base config.
2. 1. In `.github/workflows/deploy.yml`, replace the `env` block fallback expressions in the `build` job: - Change `PUBLIC_SITE_URL` fallback from `format('https://{0}.github.io', github.repository_owner)` to the static string `'https://jean-dominique-stepek.is-a.dev'` - Change `PUBLIC_BASE_PATH` fallback from `format('/{0}', github.event.repository.name)` to the static string `'/'` - Keep the `vars.*` override mechanism intact: `${{ vars.PUBLIC_SITE_URL || 'https://jean-dominique-stepek.is-a.dev' }}` The updated env block should be: ```yaml env: PUBLIC_SITE_URL: ${{ vars.PUBLIC_SITE_URL || 'https://jean-dominique-stepek.is-a.dev' }} PUBLIC_BASE_PATH: ${{ vars.PUBLIC_BASE_PATH || '/' }} ``` 2. After updating the workflow, run `pnpm build` locally to verify the site builds successfully under the new root base path. Then run the existing `pnpm validate:site` (phases 1-5) to confirm no regressions — the validators should pass because they derive expected paths from the emitted canonical URL, which now uses the new domain and root base path.

## Context
- Migrated from `.planning/milestones/v1.0-phases/06-set-up-custom-domain-via-is-a-dev-register/06-01-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/06-set-up-custom-domain-via-is-a-dev-register/06-01-SUMMARY.md`
- Related legacy requirements: N/A (infrastructure/deployment phase)
