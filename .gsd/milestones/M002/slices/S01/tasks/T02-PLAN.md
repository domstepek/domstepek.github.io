---
estimated_steps: 5
estimated_files: 7
---

# T02: Render a locked shell for protected domain routes while keeping public pages open

**Slice:** S01 — Public vs Protected Route Boundary
**Milestone:** M002

## Description

Implement the actual route split. Protected domain pages should cold-render a real locked shell from the shared `/domains/[slug]` seam, while `/`, `/about/`, and `/resume/` remain explicitly public and continue to render their shipped content without a gate.

## Steps

1. Add `src/components/domains/DomainGateShell.astro` as the shared locked-state renderer for protected routes, including stable gate markers, withheld-proof markers, and copy that fits the current site tone without introducing the S02 passcode form yet.
2. Update `src/pages/domains/[slug].astro` and `src/components/domains/DomainPage.astro` so the protected route family renders the locked shell by default on cold load and no longer emits flagship/supporting proof content into initial static HTML.
3. Add explicit public-route markers to the real page roots for the homepage, about page, and resume page so tests can distinguish intentional public surfaces from protected ones without relying on copy alone.
4. Extend `src/styles/global.css` so the locked shell looks native to the shipped retro terminal UI and clearly reads as a boundary state instead of a broken or half-rendered page.
5. Run the S01 checks and adjust selectors/markup until both the static and browser boundary tests pass cleanly.

## Must-Haves

- [ ] `/domains/*` routes expose `data-route-visibility="protected"` and `data-gate-state="locked"` on the cold-load render while withholding flagship/supporting proof markup from initial HTML.
- [ ] `/`, `/about/`, and `/resume/` expose explicit public-route markers and remain fully accessible without rendering the protected gate shell.
- [ ] The locked-shell UI is real shipped product UI, not a placeholder, and the T01 tests pass against it.

## Verification

- `pnpm check && pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`
- Spot-check one built artifact under `dist/domains/*/index.html` to confirm proof sections are absent from cold-load HTML and the locked-shell markers are present.

## Observability Impact

- Signals added/changed: stable `data-route-visibility`, `data-gate-state`, `data-protected-gate`, and `data-protected-proof-state` markers in shipped markup
- How a future agent inspects this: inspect built HTML in `dist/` or run the S01 node/browser tests
- Failure state exposed: whether a route is mistakenly public, mistakenly gated, or leaking protected proof in initial HTML

## Inputs

- `tests/route-boundary.static.test.mjs` — expected structural contract for the built output
- `tests/route-boundary.browser.test.mjs` — expected cold-load runtime behavior for public and protected routes

## Expected Output

- `src/components/domains/DomainGateShell.astro` — reusable locked-shell renderer for protected domain routes
- `src/pages/domains/[slug].astro` — protected route entrypoint that now renders the locked boundary instead of direct proof on cold load
