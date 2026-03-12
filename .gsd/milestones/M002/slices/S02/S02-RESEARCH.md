# M002 / S02 — Research

**Date:** 2026-03-12

## Summary

S02 owns **R103** (clear request-access messaging) and **R104** (session-scoped unlock continuity), and it materially supports **R102** because the existing S01 boundary only proves the locked cold-load shell. The key implementation constraint is that S01 intentionally withholds all protected proof from initial HTML, so S02 cannot "unlock" by simply toggling hidden server-rendered markup. If the site must stay static and the cold-load HTML must stay clean, the unlocked proof has to come from a client-side source after a successful passcode entry.

The cleanest path is to keep the current `DomainPage` locked/open seam, upgrade `DomainGateShell` into an interactive gate shell, and add a small client-side unlock controller that (1) validates the passcode against a **build-time public hash**, (2) writes a **sessionStorage** unlock marker, and (3) loads protected proof for the current domain from a serializable static payload. That keeps the initial HTML compliant with S01, preserves the existing route boundary contract, and gives S02 a real same-session cross-route unlock model instead of a cosmetic form.

Contact/request-access copy should not invent a new source of truth. The repo already has canonical outbound contact data in `src/data/home.ts` and `src/data/resume.ts`, so S02 should reuse those values for DM/email links and keep the gate tone aligned with the site’s lowercase retro-terminal voice. Verification should extend the existing `validate:site` path with warm-session browser checks instead of creating a second release gate.

## Recommendation

Implement S02 as a **locked-first static shell plus client-side unlock upgrade**:

1. **Keep S01’s cold-load contract intact** on `/domains/*` (`data-route-visibility="protected"`, `data-gate-state="locked"`, no proof markers in initial HTML).
2. **Upgrade `DomainGateShell.astro`** to include:
   - request-access copy in the site’s lowercase tone
   - direct outbound links for email + linkedin/DM
   - a passcode form with stable selectors/markers for tests
   - an empty proof mount region for the unlocked state
3. **Persist unlock in `sessionStorage`** with a versioned key like `portfolio-gate:v1` so the unlock lasts for the current browser session and automatically resets in a new session/tab lifecycle.
4. **Do not ship the raw passcode in JS.** Store a build-time public hash (for example via `PUBLIC_PORTFOLIO_GATE_HASH`) and compare it to a browser-computed digest of the entered passcode. This is still only deterrence, but it avoids putting the literal passcode directly in the bundle.
5. **Move protected proof behind a serializable payload seam.** The current unlocked `DomainPage.astro` markup depends on server-side Astro rendering, so S02 needs a reusable data-prep layer plus a client render path. The least fragile option is:
   - extract a normalized domain view-model helper from `DomainPage.astro`
   - emit a static JSON/module payload per protected domain
   - render unlocked proof client-side into the shell after successful unlock or on subsequent protected-route visits when the session marker already exists
6. **Extend existing verification instead of forking it.** Reuse `tests/helpers/site-boundary-fixtures.mjs` route inventories and add browser checks for:
   - cold protected route shows gate + request-access messaging
   - wrong passcode keeps gate locked
   - correct passcode unlocks current route
   - same browser context can open another protected route without re-entering the passcode
   - new browser context starts locked again

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Session-scoped continuity across protected routes | Browser `sessionStorage` | Matches R104 directly, needs no backend, and resets naturally with the browser session. |
| Public/protected route verification | `tests/helpers/site-boundary-fixtures.mjs` + `tests/route-boundary.browser.test.mjs` | S01 already centralized route inventories and boundary assertions here; extending them avoids drift between slice coverage and release gating. |
| Request-access contact data | `src/data/home.ts` and `src/data/resume.ts` | Email and LinkedIn already exist here; reusing them prevents stale or mismatched gate links. |
| Post-navigation script initialization | Astro `astro:page-load` lifecycle pattern | The repo already uses this pattern in client scripts, and Astro recommends it for reliable re-init after navigation. |

## Existing Code and Patterns

- `src/components/domains/DomainPage.astro` — this is the authoritative S01 seam: locked routes render `DomainGateShell`, open routes render the full proof article. S02 should preserve this seam and extract the domain normalization logic here into a shared helper so both server and client unlock paths use the same shaped data.
- `src/components/domains/DomainGateShell.astro` — already carries the protected-route marker contract from D015. Add passcode UI and request-access content here, but keep the existing locked markers stable for cold-load verification.
- `src/pages/domains/[slug].astro` — currently hardcodes `gateState="locked"` for all protected route entrypoints. That is correct for S01 and should stay the cold-load behavior in S02.
- `src/data/home.ts` — contains canonical public contact links for GitHub, LinkedIn, and email. S02 can safely reuse the LinkedIn/email values for the request-access panel.
- `src/data/resume.ts` — contains the same contact details plus a clearer single-source email value if the gate needs copy like “email me for the passcode.”
- `src/components/domains/ScreenshotGallery.astro` — demonstrates the project’s preferred lightweight client-script approach and uses `astro:page-load` for initialization.
- `src/components/resume/ResumePage.astro` — another example of plain browser-side behavior added directly in Astro without introducing a framework.
- `tests/helpers/site-boundary-fixtures.mjs` — authoritative route inventory, built-site server, and boundary marker constants. S02 verification should extend this file rather than introducing parallel selector vocabularies.
- `tests/route-boundary.browser.test.mjs` — already uses isolated browser contexts, which is exactly the right pattern for proving session persistence vs new-session reset behavior.
- `package.json` + `.github/workflows/deploy.yml` — `validate:site` currently gates deploys with S01-only checks. S02 should extend that same command path instead of adding a separate validation entrypoint that CI could forget to run.

## Constraints

- The site is **Astro static output on GitHub Pages** (`astro.config.mjs` sets `output: "static"`), so there is no runtime server available for real auth, cookie-backed personalization, or server-aware unlocked rendering.
- S01’s contract requires protected cold-load HTML to stay locked and to omit proof markers from built artifacts. S02 cannot solve unlocking by leaving proof content hidden in initial HTML.
- Current env typing only includes `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` (`src/env.d.ts`), and the deploy workflow only exports those vars. Any build-time gate hash/config needs typed env support and CI wiring.
- The boundary tests treat phrases like `flagship highlights` and `supporting work` as evidence of leaked proof on cold load. Locked-state copy must continue to avoid those phrases.
- Asset and route URLs are normalized through `assetPath()` / `domainPath()` in `src/lib/paths.ts`, so any client-fetched payload or client-rendered links need to respect base-path behavior for GitHub Pages.

## Common Pitfalls

- **Embedding the raw passcode in shipped JS** — even for a static deterrent, putting the literal passcode in the bundle makes extraction trivial. Prefer a build-time public hash and compare browser-side digests instead.
- **Trying to unlock server-rendered proof that is no longer present** — S01 intentionally removed proof from initial HTML, so S02 needs a fetchable/static payload or module-backed client render path. A visibility toggle alone will not work.
- **Letting gate copy mention protected proof labels** — phrases already used by proof-leak tests can make a locked shell look like leaked content. Keep the messaging descriptive but avoid those exact section names.
- **Testing only same-page submit success** — R104 is about continuity across protected routes and session reset behavior. Verification must cover same-context navigation and a fresh browser context.
- **Forgetting GitHub Pages base-path handling in client fetches** — hardcoded `/domains/...` JSON fetches will break if `PUBLIC_BASE_PATH` changes. Route and asset helpers need to stay the source of truth.

## Open Risks

- Client-side upgrade may cause a brief locked-shell flash on a protected-route revisit before the session marker is read and proof is mounted. That is acceptable for a static site if brief, but execution should watch for jarring flicker.
- Introducing a second rendering path for unlocked proof can create markup/style drift unless the domain data prep and DOM markers are centralized.
- A hash-based static gate is still only deterrence; anyone determined enough can replay the unlocked payload fetches. Copy and expectations should stay honest about the protection level.
- If S02 stops at unlock + text proof only, S03 must not have to re-architect the same client-render seam just to add visual obscuring/reveal.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | `astrolicious/agent-skills@astro` | available via `npx skills add astrolicious/agent-skills@astro` (discovered with `npx skills find "astro"`) |
| Browser automation / web-app verification | `agent-browser` | installed |

## Sources

- S02 scope ownership and supporting requirements come from preloaded milestone context, roadmap, and requirements: owns **R103** and **R104**, supports **R102**. (source: preloaded `.gsd/milestones/M002/M002-ROADMAP.md`, `.gsd/milestones/M002/M002-CONTEXT.md`, `.gsd/REQUIREMENTS.md`)
- The locked/open rendering seam and current protected cold-load behavior come from `src/components/domains/DomainPage.astro` and `src/pages/domains/[slug].astro`. (source: local code)
- The locked-shell marker contract and current gate UI constraints come from `src/components/domains/DomainGateShell.astro`. (source: local code)
- Canonical request-access contact data comes from `src/data/home.ts` and `src/data/resume.ts`. (source: local code)
- Existing route-boundary verification surfaces come from `tests/helpers/site-boundary-fixtures.mjs`, `tests/route-boundary.static.test.mjs`, `tests/route-boundary.browser.test.mjs`, `package.json`, and `.github/workflows/deploy.yml`. (source: local code)
- Astro recommends using `astro:page-load` to initialize behavior after navigation, and notes bundled scripts execute only once unless explicitly rerun. (source: Astro docs via Context7 — https://docs.astro.build/en/guides/view-transitions and https://docs.astro.build/en/guides/client-side-scripts)
