# T02: CNAME Validator, Domain Registration, and Handoff

**Slice:** S06
**Milestone:** M001

## Goal
Phase 6 CNAME validator added to site gate, is-a-dev domain registration submitted via fork PR at domstepek/is-a-dev-register

## Must-Haves
- [x] Phase 6 CNAME validator catches missing or incorrect CNAME files
- [x] validate:site chain includes Phase 6 validation
- [x] Full site validation passes end-to-end under new domain config
- [x] `scripts/validate-phase6.mjs` exists and provides CNAME file existence and content validation
- [x] `package.json` exists and provides validate:phase6 script and updated validate:site chain

## Steps
1. 1. Create `scripts/validate-phase6.mjs` following the established validator pattern from phases 1-5. The validator checks: - `public/CNAME` file exists and is readable - Content (trimmed) equals exactly `jean-dominique-stepek.is-a.dev` - On success: print "Phase 6 validation passed." and the check details - On failure: print failures and exit with code 1 Use this implementation (from research, verified correct): ```javascript import { readFile } from "node:fs/promises"; import { resolve } from "node:path"; const CNAME_PATH = resolve(process.cwd(), "public", "CNAME"); const EXPECTED_DOMAIN = "jean-dominique-stepek.is-a.dev"; const failures = []; try { const content = (await readFile(CNAME_PATH, "utf8")).trim(); if (!content) { failures.push("public/CNAME exists but is empty."); } else if (content !== EXPECTED_DOMAIN) { failures.push( `public/CNAME should contain "${EXPECTED_DOMAIN}", received "${content}".` ); } } catch { failures.push(`public/CNAME is missing (${CNAME_PATH}).`); } if (failures.length > 0) { console.error("Phase 6 validation failed:"); for (const failure of failures) { console.error(`- ${failure}`); } process.exit(1); } console.log("Phase 6 validation passed."); console.log("- public/CNAME exists and contains the expected custom domain."); ``` 2. In `package.json`, add the `validate:phase6` script and extend the `validate:site` chain: - Add: `"validate:phase6": "node ./scripts/validate-phase6.mjs"` - Update: `"validate:site"` to append `&& pnpm validate:phase6` at the end 3. Run the full validation suite to confirm everything passes end-to-end: `pnpm build && pnpm validate:site`
2. Fork the is-a-dev/register repo to the user's GitHub account using the `gh` CLI: ```bash gh repo fork is-a-dev/register --clone=false ``` Then clone the fork, create the domain JSON file, commit, and push: ```bash gh repo clone jstepek/register -- --depth=1 ``` Create `domains/jean-dominique-stepek.json` in the cloned fork with this exact content: ```json { "owner": { "username": "jstepek" }, "records": { "CNAME": "jstepek.github.io" } } ``` Commit the file with message "Register jean-dominique-stepek.is-a.dev" and push to the fork's main branch. After pushing, clean up the local clone (it is not part of this repo). NOTE: Do NOT create the PR -- the user will submit and manage the PR themselves per the locked decision.
3. Present the completed work and manual handoff checklist to the user for review. All automated work is complete at this point -- this checkpoint confirms the user understands the remaining external steps.

## Context
- Migrated from `.planning/milestones/v1.0-phases/06-set-up-custom-domain-via-is-a-dev-register/06-02-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/06-set-up-custom-domain-via-is-a-dev-register/06-02-SUMMARY.md`
- Related legacy requirements: N/A (infrastructure/deployment phase)
