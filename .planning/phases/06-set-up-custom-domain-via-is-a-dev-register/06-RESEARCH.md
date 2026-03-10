# Phase 6: Set up custom domain via is-a-dev/register - Research

**Researched:** 2026-03-09
**Domain:** DNS registration, GitHub Pages custom domain, Astro static site config
**Confidence:** HIGH

## Summary

Phase 6 transitions the site from `jstepek.github.io/website` to `jean-dominique-stepek.is-a.dev`. The work splits into three clean segments: (1) preparing the is-a-dev domain registration file in a fork, (2) updating this repo's config defaults and adding a CNAME file, and (3) adding a validation check and manual handoff checklist.

The existing architecture was designed for this exact transition. `DEFAULT_SITE_URL` and `DEFAULT_BASE_PATH` in two files (`astro.config.mjs` and `src/data/site.ts`) are the only values that change. All route helpers, canonical URLs, OG tags, and CI env vars derive from these defaults. The `public/CNAME` file gets copied to `dist/` automatically by Astro's static build.

**Primary recommendation:** Change the two default constants, add `public/CNAME`, refresh the site description, update CI env var defaults, create the is-a-dev domain JSON, and add a Phase 6 CNAME validator to the site gate.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Register `jean-dominique-stepek.is-a.dev` as the custom domain.
- Keep the site's internal identity as "dom" everywhere -- page titles, nav, copy, and site name stay unchanged.
- The subdomain is the address; the brand voice remains casual and lowercase.
- Fork the is-a-dev/register repo to the user's GitHub account as part of this phase.
- Create the domain JSON file (`jean-dominique-stepek.json`) with the correct CNAME record pointing to `jstepek.github.io`.
- Prepare the PR for submission -- user will submit and manage the PR themselves.
- GitHub Pages auto-redirects `jstepek.github.io/website` to the custom domain once CNAME is configured -- no extra redirect logic needed.
- Keep the GitHub repo named "website".
- Enforce HTTPS on the custom domain via GitHub Pages settings after DNS propagates.
- Update `DEFAULT_SITE_URL` in both `astro.config.mjs` and `src/data/site.ts` from `https://jstepek.github.io` to `https://jean-dominique-stepek.is-a.dev`.
- Update `DEFAULT_BASE_PATH` from `/website` to `/` in both files.
- Update CI workflow env var defaults to match the new domain and root base path.
- Refresh `defaultDescription` in `src/data/site.ts` to a visitor-facing description in the site's casual lowercase voice.
- Add a CNAME file check to the site validation gate -- verify `public/CNAME` exists and contains the correct domain.
- Existing Phase 1-5 validators confirm the site builds correctly under the new root base path.
- No new live-domain smoke test in CI.
- Phase includes a post-deploy verification checklist.

### Claude's Discretion
- Exact wording of the refreshed site description, as long as it matches the casual lowercase voice.
- Structure of the is-a-dev domain JSON file, following the is-a-dev/register repo's current format requirements.
- Order of operations for the config updates and CNAME addition.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.18.0 | Static site generator | Already in use; `public/` directory auto-copies to `dist/` |
| GitHub Pages | N/A | Hosting with custom domain support | Already deployed; has native CNAME + HTTPS support |
| is-a-dev/register | N/A | Free `.is-a.dev` subdomain DNS | Community DNS service via GitHub PR workflow |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Node.js fs/promises | built-in | Phase 6 validator script | CNAME file validation in site gate |

### Alternatives Considered
None -- all tools are already in use or are the only option for the is-a-dev registration.

## Architecture Patterns

### Config Change Map

Two files hold the defaults that need updating:

```
astro.config.mjs          # DEFAULT_SITE_URL, DEFAULT_BASE_PATH
src/data/site.ts           # DEFAULT_SITE_URL, DEFAULT_BASE_PATH, defaultDescription
```

Everything else derives from these:
- `src/lib/paths.ts` helpers (`routePath`, `domainPath`, `canonicalUrl`, etc.) read from `siteConfig`
- CI workflow env vars (`PUBLIC_SITE_URL`, `PUBLIC_BASE_PATH`) have fallback expressions that should be updated
- All canonical URLs, OG tags, and internal routes propagate automatically

### CNAME File Pattern

GitHub Pages requires a `CNAME` file at the root of the published directory containing only the custom domain:

```
jean-dominique-stepek.is-a.dev
```

Astro copies everything in `public/` to `dist/` at build time. Place the file at `public/CNAME` (no extension).

### is-a-dev Domain JSON File Format

**Confidence: HIGH** (verified from official docs at docs.is-a.dev)

File: `domains/jean-dominique-stepek.json` in the forked is-a-dev/register repo.

```json
{
  "owner": {
    "username": "jstepek"
  },
  "records": {
    "CNAME": "jstepek.github.io"
  }
}
```

**Filename rules:**
- Lowercase alphanumeric with hyphens
- Max 244 characters total; each label max 63 characters
- Must end with `.json`
- Cannot contain "is-a.dev" or start with a dot

### CI Workflow Update Pattern

Current defaults in `.github/workflows/deploy.yml`:
```yaml
env:
  PUBLIC_SITE_URL: ${{ vars.PUBLIC_SITE_URL || format('https://{0}.github.io', github.repository_owner) }}
  PUBLIC_BASE_PATH: ${{ vars.PUBLIC_BASE_PATH || format('/{0}', github.event.repository.name) }}
```

Updated defaults:
```yaml
env:
  PUBLIC_SITE_URL: ${{ vars.PUBLIC_SITE_URL || 'https://jean-dominique-stepek.is-a.dev' }}
  PUBLIC_BASE_PATH: ${{ vars.PUBLIC_BASE_PATH || '/' }}
```

The `vars.*` override mechanism stays intact for any future domain changes.

### Validator Pattern

Follow the established pattern from Phase 1-5 validators. Phase 6 validator checks:
1. `public/CNAME` file exists and is non-empty
2. `public/CNAME` contains exactly `jean-dominique-stepek.is-a.dev`

```javascript
// scripts/validate-phase6.mjs
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const CNAME_PATH = resolve(process.cwd(), "public", "CNAME");
const EXPECTED_DOMAIN = "jean-dominique-stepek.is-a.dev";
const failures = [];

try {
  const content = (await readFile(CNAME_PATH, "utf8")).trim();
  if (!content) {
    failures.push("public/CNAME exists but is empty.");
  } else if (content !== EXPECTED_DOMAIN) {
    failures.push(
      `public/CNAME should contain "${EXPECTED_DOMAIN}", received "${content}".`
    );
  }
} catch {
  failures.push(`public/CNAME is missing (${CNAME_PATH}).`);
}

if (failures.length > 0) {
  console.error("Phase 6 validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Phase 6 validation passed.");
console.log("- public/CNAME exists and contains the expected custom domain.");
```

The `validate:site` script in `package.json` gets extended:
```
"validate:site": "pnpm validate:phase1 && ... && pnpm validate:phase6"
```

### Anti-Patterns to Avoid
- **Hardcoding the domain in multiple places:** Only change the two default constants and the CNAME file. Everything else derives.
- **Building redirect logic:** GitHub Pages handles old-URL redirects natively once the custom domain is set.
- **Testing DNS in CI:** DNS propagation is async and outside the build gate. The validator checks the CNAME file, not live resolution.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Old URL redirects | Custom redirect middleware | GitHub Pages native redirect | Automatic once CNAME is configured |
| HTTPS enforcement | SSL config | GitHub Pages "Enforce HTTPS" checkbox | Managed by GitHub after DNS propagation |
| DNS record management | Manual DNS config | is-a-dev/register PR workflow | They manage the Cloudflare DNS zone |

## Common Pitfalls

### Pitfall 1: Forgetting to update BOTH default locations
**What goes wrong:** Changing `astro.config.mjs` but not `src/data/site.ts` (or vice versa) causes canonical URLs to disagree with the Astro site/base config.
**Why it happens:** The defaults are duplicated across two files by design (one for Astro config, one for runtime site data).
**How to avoid:** Update both files in the same task. The Phase 6 validator and existing Phase 1-5 validators will catch mismatches.
**Warning signs:** Canonical URLs in built HTML don't match the expected domain.

### Pitfall 2: CNAME file has trailing newline or whitespace issues
**What goes wrong:** GitHub Pages may not recognize the domain if the CNAME file has unexpected whitespace.
**Why it happens:** Editors and file-writing tools may add trailing newlines.
**How to avoid:** Validate the trimmed content matches exactly. The validator should trim before comparing.
**Warning signs:** Domain shows 404 after DNS propagation.

### Pitfall 3: Base path `/` vs empty string confusion
**What goes wrong:** Astro treats `base: "/"` and `base: ""` differently. Empty string can cause broken asset paths.
**Why it happens:** The normalizeBasePath helper already handles this correctly, converting empty/`"/"` to `"/"`.
**How to avoid:** Set `DEFAULT_BASE_PATH = "/"` (not empty string). The existing normalizer handles it.
**Warning signs:** Asset URLs in built HTML are malformed.

### Pitfall 4: CI env var fallback still computing old values
**What goes wrong:** If the CI workflow fallback expressions are not updated, builds without repository variables will still use `jstepek.github.io/website`.
**Why it happens:** The `format()` expressions dynamically compute from repo context.
**How to avoid:** Replace the dynamic `format()` fallbacks with static strings for the new domain and `/` base path.
**Warning signs:** CI builds produce HTML with old domain in canonical URLs.

### Pitfall 5: is-a-dev PR rejected for missing info
**What goes wrong:** The PR template requires a preview link and screenshot. Incomplete submissions get rejected.
**Why it happens:** The is-a-dev maintainers enforce their PR template strictly.
**How to avoid:** Include in the manual handoff checklist: fill out the PR template completely, include the current live site URL as preview, and attach a screenshot.
**Warning signs:** PR receives "changes requested" comment.

## Code Examples

### Current defaults (before)
```typescript
// src/data/site.ts
const DEFAULT_SITE_URL = "https://jstepek.github.io";
const DEFAULT_BASE_PATH = "/website";
```

### Updated defaults (after)
```typescript
// src/data/site.ts
const DEFAULT_SITE_URL = "https://jean-dominique-stepek.is-a.dev";
const DEFAULT_BASE_PATH = "/";
```

### Refreshed description (Claude's discretion -- casual lowercase voice)
```typescript
defaultDescription:
  "dom builds analytics platforms, infrastructure, ai/ml tooling, product systems, and developer experience tooling.",
```

### CNAME file content
```
jean-dominique-stepek.is-a.dev
```

### is-a-dev domain JSON
```json
{
  "owner": {
    "username": "jstepek"
  },
  "records": {
    "CNAME": "jstepek.github.io"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| is-a-dev required email in owner | email is now optional | 2024 | Simpler JSON, only `username` required |
| Manual DNS for GitHub Pages | CNAME file in repo root | Long established | No DNS panel access needed |

## Open Questions

1. **is-a-dev PR review timeline**
   - What we know: PRs are reviewed by community maintainers; merge timeline varies.
   - What's unclear: Exact turnaround time (could be hours to days).
   - Recommendation: Prepare everything, submit PR, and treat DNS propagation as an async manual step in the handoff checklist.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in fs/promises (custom validators) |
| Config file | None -- scripts run directly via package.json |
| Quick run command | `pnpm validate:phase6` |
| Full suite command | `pnpm validate:site` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| N/A (infra) | CNAME file exists with correct domain | unit | `pnpm validate:phase6` | No -- Wave 0 |
| N/A (infra) | Site builds under new base path `/` | integration | `pnpm validate:site` | Yes (phases 1-5) |

### Sampling Rate
- **Per task commit:** `pnpm validate:phase6`
- **Per wave merge:** `pnpm validate:site`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `scripts/validate-phase6.mjs` -- CNAME file check
- [ ] `package.json` -- add `validate:phase6` script and extend `validate:site` chain

## Sources

### Primary (HIGH confidence)
- Official is-a-dev docs (docs.is-a.dev/domain-structure/) -- JSON file structure, field requirements, filename rules
- Official is-a-dev docs (docs.is-a.dev/guides/github-pages/) -- GitHub Pages CNAME record setup, post-merge steps
- Project source code -- `astro.config.mjs`, `src/data/site.ts`, `.github/workflows/deploy.yml`, `scripts/validate-phase5.mjs`

### Secondary (MEDIUM confidence)
- is-a-dev/register README (github.com/is-a-dev/register) -- PR submission workflow, review process

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tools already in use or verified from official docs
- Architecture: HIGH -- existing config architecture was designed for this transition
- Pitfalls: HIGH -- derived from direct code inspection and official documentation
- is-a-dev JSON format: HIGH -- verified from official docs.is-a.dev

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable infrastructure, unlikely to change)
