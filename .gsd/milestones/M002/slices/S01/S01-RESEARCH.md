# M002/S01 — Research

**Date:** 2026-03-12

## Summary

S01 owns **R101** (public pages stay directly accessible) and **R102** (domain portfolio pages require a passcode before protected proof is shown). Research shows the current Astro site already has a clean route split in file structure: `/`, `/about/`, and `/resume/` are thin public route files, while all protected-scope pages currently funnel through `src/pages/domains/[slug].astro` into one shared `DomainPage` renderer. That is the right seam for the boundary work.

The main constraint is more important than it first appears: the current static build emits the full domain proof directly into `dist/domains/*/index.html`. A purely client-side “hide it after load” approach would fail the slice intent because a cold visit still receives the entire proof layer in the initial HTML and browser DOM. For this milestone’s deterrent model, S01 should therefore change the server/static render for `/domains/*` so a cold load renders a locked shell only, with stable locked-state markers, while leaving public routes untouched.

## Recommendation

Implement the S01 boundary at the **shared protected route render seam**, not page-by-page:

1. Keep `/`, `/about/`, and `/resume/` exactly public and unchanged.
2. Replace direct rendering of full proof in `src/pages/domains/[slug].astro` / `DomainPage.astro` with a protected route wrapper that renders a **locked gate state by default on cold load**.
3. Introduce explicit DOM markers for verification such as `data-route-visibility="public|protected"`, `data-gate-state="locked|unlocked"`, and locked-state containers that S02/S04 can assert against.
4. Treat S01 as a boundary slice, not the full unlock slice: the default protected render should show the gate shell and withhold the proof content from initial static HTML. S02 can add passcode handling and session persistence on top of that seam.

This approach satisfies the actual slice contract: public routes remain open, while `/domains/*` stops shipping visible proof on cold load. It also preserves the current architecture style — thin route files, shared render components, base-path-aware path helpers, and plain Astro/CSS.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Public/protected path generation | `src/lib/paths.ts` helpers (`homePath`, `aboutPath`, `resumePath`, `domainPath`) | Keeps all route decisions base-path-aware and avoids hard-coded URLs in the gate flow. |
| Shared protected page rendering | `src/pages/domains/[slug].astro` + `src/components/domains/DomainPage.astro` | One seam controls all `/domains/*` pages, so the slice can enforce the route boundary once instead of duplicating logic per domain. |
| Browser-state markers | Existing `data-*` verification hooks across pages/components | The codebase already uses stable `data-*` attributes; S01 should extend that pattern for locked/protected assertions instead of inventing a new verification style. |
| Post-navigation client re-init in Astro | `astro:page-load` event pattern already used in `ScreenshotGallery.astro` and `MermaidDiagram.astro` | If S01/S02 add client boundary behavior, this is the native Astro pattern already present in the repo. |

## Existing Code and Patterns

- `src/pages/index.astro` — thin public homepage route; wraps `HomePage` in `BaseLayout` and should remain completely ungated.
- `src/pages/about.astro` — thin public about route; same public pattern as the homepage.
- `src/pages/resume.astro` — thin public resume route; another explicit public allowlist member.
- `src/pages/domains/[slug].astro` — single protected-route family entrypoint; currently resolves a slug and renders `DomainPage` directly.
- `src/components/domains/DomainPage.astro` — currently emits the full protected proof layer, including thesis, flagship details, proof links, visuals, screenshots, and related-domain links.
- `src/components/domains/ScreenshotGallery.astro` — already uses bundled client script plus `astro:page-load` re-init; useful as a reference for any gated client behavior.
- `src/components/layout/BaseLayout.astro` — shared shell, metadata, and canonical plumbing; boundary work should preserve this instead of forking layout behavior.
- `src/lib/paths.ts` — route helper source of truth; important for public allowlist links and any gate-state navigation.
- `src/data/domains/*.ts` — protected proof content source; currently imported into static generation, which is why full proof lands in built HTML today.
- `dist/domains/product/index.html` — evidence that the current build ships the entire product proof layer in static HTML, including flagship text and screenshot/image URLs.

## Constraints

- The site is built with **Astro static output** (`astro.config.mjs` sets `output: "static"` and `trailingSlash: "always"`), so there is no runtime server/auth layer to intercept protected requests.
- The current architecture is intentionally **thin routes + shared data + shared presentation components**. S01 should preserve that pattern and add a boundary wrapper rather than scattering route checks.
- `src/lib/paths.ts` and `src/data/site.ts` are **base-path aware**. Any public/protected routing logic must use helpers instead of literal `/foo/` strings.
- The existing domain pages include **proof text and visual asset URLs directly in the static HTML**. If S01 merely hides these with CSS or client JS after load, the slice has not actually created a cold-load boundary.
- There is currently **no dedicated validation/test harness** beyond `pnpm build` and `astro check`; S01 should produce stable selectors/markers so S04 can add deterministic browser verification without relying on brittle copy-only checks.

## Common Pitfalls

- **Client-only hiding after render** — Avoid rendering the full `DomainPage` and then masking it with CSS/JS. The proof is already delivered in `dist` HTML by then.
- **Accidentally gating public routes** — Avoid adding broad shell-level checks in `BaseLayout` or generic navigation components. The allowlist is explicit: `/`, `/about/`, and `/resume/` stay public.
- **Boundary logic spread across individual domain content blocks** — Keep the gate decision above the domain proof renderer. Per-flagship or per-visual conditionals will be harder to verify and easier to miss.
- **Unverifiable locked/unlocked states** — Add explicit `data-*` hooks for locked boundary state now. S04 should not have to infer lock status from prose alone.
- **Breaking Astro client behavior on navigation** — If the boundary later relies on client scripts, use Astro’s `astro:page-load` event pattern rather than assuming one-time page load execution.

## Open Risks

- Because the milestone intentionally uses a **static deterrent**, protected data may still be extractable from built assets or client bundles even if it is removed from initial HTML. That is acceptable only if the implementation clearly behaves like a lightweight gate and does not pretend to be strong security.
- The current homepage links directly to `/domains/*`. Once S01 lands, those links will become entry points into the locked boundary. Copy and UX may need to absorb that change cleanly in S02.
- If S01 introduces a locked shell but does not preserve layout/metadata consistency, protected routes could regress SEO metadata, page structure, or visual tone.
- There is no existing regression suite for route-boundary behavior, so stable markers added in S01 are part of the implementation contract, not a nice-to-have.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Browser automation | `agent-browser` | installed/available in current environment |
| Astro | `astrolicious/agent-skills@astro` | available (suggest only) — install via `npx skills add astrolicious/agent-skills@astro` |
| Astro | `delineas/astro-framework-agents@astro-framework` | available (suggest only) — install via `npx skills add delineas/astro-framework-agents@astro-framework` |
| GitHub Pages | `julianobarbosa/claude-code-skills@githubpages` | available (suggest only) — install via `npx skills add julianobarbosa/claude-code-skills@githubpages` |

## Sources

- Public route allowlist and protected route ownership are already reflected in the milestone/requirements context preloaded for S01. (source: preloaded milestone roadmap, context, requirements, decisions)
- Shared route helpers are centralized and base-path aware. (source: `src/lib/paths.ts`)
- Public pages are thin route files and currently ungated. (source: `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/resume.astro`)
- All domain pages currently route through one shared render seam. (source: `src/pages/domains/[slug].astro`, `src/components/domains/DomainPage.astro`)
- Protected visuals and screenshot interactions already use explicit `data-*` hooks and Astro client scripts. (source: `src/components/domains/ScreenshotGallery.astro`, `src/components/diagrams/MermaidDiagram.astro`)
- Static build configuration confirms there is no server runtime to enforce real auth. (source: `astro.config.mjs`)
- The current built domain page ships full protected proof in initial HTML, proving that CSS-only/client-only hiding would be insufficient for S01. (source: `dist/domains/product/index.html`)
- The current public homepage remains directly accessible and links into `/domains/*`, confirming the route split entrypoints that S01 must preserve. (source: browser verification at `http://127.0.0.1:4321/` and `dist/index.html`)
- Astro docs recommend `astro:page-load` for code that must re-run after page navigation, which matches existing project patterns. (source: Astro docs via Context7, topic: client-side scripts and `astro:page-load`)
