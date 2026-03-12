# S06: Custom Domain via is A Dev — completed 2026 03 10

**Goal:** Transition the site from `jstepek.github.io/website` to `jean-dominique-stepek.is-a.dev` by updating config defaults, adding CNAME, preparing the is-a-dev domain registration, extending the site validation gate, and providing a manual handoff checklist for DNS propagation and HTTPS enforcement.
**Demo:** Site config defaults point to `https://jean-dominique-stepek.is-a.dev` with root base path `/`.

## Must-Haves
- Site config defaults point to `https://jean-dominique-stepek.is-a.dev` with root base path `/`.
- `public/CNAME` file exists with the correct custom domain.
- CI workflow defaults reference the new domain and root base path.
- Site description is visitor-facing in casual lowercase voice.
- Phase 6 CNAME validator is part of the `validate:site` chain.
- is-a-dev domain registration file is ready in the user's fork for PR submission.
- All Phase 1-6 validators pass under the new config.

## Tasks

- [x] **T01: Update Site Config Defaults**
  Site config transitioned from jstepek.github.io/website to jean-dominique-stepek.is-a.dev with root base path, CNAME file, and updated CI defaults

- [x] **T02: CNAME Validator, Domain Registration, and Handoff**
  Phase 6 CNAME validator added to site gate, is-a-dev domain registration submitted via fork PR at domstepek/is-a-dev-register

## Files Likely Touched
- astro.config.mjs
- src/data/site.ts
- .github/workflows/deploy.yml
- public/CNAME
- scripts/validate-phase6.mjs
- package.json
