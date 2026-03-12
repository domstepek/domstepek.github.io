# S06 UAT

Use this checklist to sanity-check the migrated completed slice:

- [ ] Site config defaults point to `https://jean-dominique-stepek.is-a.dev` with root base path `/`.
- [ ] `public/CNAME` file exists with the correct custom domain.
- [ ] CI workflow defaults reference the new domain and root base path.
- [ ] Site description is visitor-facing in casual lowercase voice.
- [ ] Phase 6 CNAME validator is part of the `validate:site` chain.
- [ ] is-a-dev domain registration file is ready in the user's fork for PR submission.
