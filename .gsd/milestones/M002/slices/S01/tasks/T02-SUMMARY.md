---
id: T02
parent: S01
milestone: M002
provides:
  - Cold-load protected `/domains/*` routes now render a real locked shell with stable boundary markers while public top-level pages stay explicitly open.
key_files:
  - src/components/domains/DomainGateShell.astro
  - src/components/domains/DomainPage.astro
  - src/pages/domains/[slug].astro
  - src/components/home/HomePage.astro
  - src/components/personal/PersonalPage.astro
  - src/components/resume/ResumePage.astro
  - src/styles/global.css
key_decisions:
  - D016 shared the `/domains/[slug]` boundary through `DomainPage` via an explicit `gateState` switch so locked and later unlocked renders use one seam.
patterns_established:
  - Protected route entrypoints should render through a shared gate-aware component seam instead of duplicating locked-shell markup per domain page.
  - Public route roots should expose explicit `data-route-visibility="public"` and `data-gate-state="open"` markers while keeping protected markers absent.
observability_surfaces:
  - `node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`
  - Built HTML inspection in `dist/domains/*/index.html`
  - Browser DOM markers on public and protected route roots
duration: 1h
verification_result: passed
completed_at: 2026-03-12T13:07:12Z
blocker_discovered: false
---

# T02: Render a locked shell for protected domain routes while keeping public pages open

**Shipped a real retro locked shell for `/domains/*`, withheld protected proof from cold-load HTML, and marked public roots explicitly as open.**

## What Happened

I added `src/components/domains/DomainGateShell.astro` as the shared locked-state renderer for protected domain routes. It ships real product UI instead of placeholder text, carries the required locked-boundary markers, and previews the domain without leaking flagship or supporting proof content.

I then routed `src/pages/domains/[slug].astro` through `DomainPage` with `gateState="locked"`. Inside `src/components/domains/DomainPage.astro`, the domain route now switches between the new locked shell and the existing full proof render through one explicit seam. For this slice, protected cold loads take the locked path, so flagship and supporting proof nodes are no longer emitted into built HTML.

For the public side, I added explicit `data-route-visibility="public"` and `data-gate-state="open"` markers to the real page roots in `HomePage`, `PersonalPage`, and `ResumePage`. That keeps `/`, `/about/`, and `/resume/` intentionally public without relying on content copy for distinction.

I extended `src/styles/global.css` with native-looking locked-shell styling that matches the retro terminal aesthetic: terminal chrome, muted bordered cards, and responsive layout treatment so the boundary reads as deliberate product state rather than a broken render.

During verification, the browser boundary test initially failed because the new shell copy itself used the forbidden phrases `flagship highlights` and `supporting proof`, which the test treats as leaked proof. I removed those exact phrases from the shell copy and reran the same build-and-test command until the boundary suite passed cleanly.

## Verification

- Passed: `pnpm check`
- Passed: `pnpm build && node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs`
- Spot-checked: `dist/domains/product/index.html` contains `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, and `data-protected-proof-state="withheld"`, and does not contain proof-section markers.
- Browser-verified on built output via local static server:
  - `/` exposes `[data-home-page][data-route-visibility='public'][data-gate-state='open']`
  - `/domains/product/` exposes `[data-protected-gate][data-route-visibility='protected'][data-gate-state='locked'][data-protected-proof-state='withheld']`
  - Both browser checks passed with no console errors and no failed requests after clearing stale prior-session logs.
- Slice-level check run as requested:
  - Failed/pending by design for this task: `pnpm validate:site` (`Command "validate:site" not found`) because T03 is the planned task that wires this slice into the aggregate validation script.

## Diagnostics

- Run `node --test tests/route-boundary.static.test.mjs tests/route-boundary.browser.test.mjs` to validate the route boundary contract.
- Inspect `dist/domains/*/index.html` to confirm protected markers are present and proof selectors are absent from cold-load HTML.
- Inspect the live DOM on built output for:
  - protected routes: `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, `data-protected-proof-state="withheld"`
  - public routes: `data-route-visibility="public"`, `data-gate-state="open"`

## Deviations

- None.

## Known Issues

- `pnpm validate:site` does not exist yet. That aggregate release-gate wiring remains the explicit scope of T03.

## Files Created/Modified

- `src/components/domains/DomainGateShell.astro` — new shared locked-shell renderer for protected cold loads.
- `src/components/domains/DomainPage.astro` — added the `gateState` seam and preserved the full proof render behind the open path.
- `src/pages/domains/[slug].astro` — switched protected route entrypoints to cold-render the locked shell.
- `src/components/home/HomePage.astro` — added explicit public route markers to the homepage root.
- `src/components/personal/PersonalPage.astro` — added explicit public route markers to the about page root.
- `src/components/resume/ResumePage.astro` — added explicit public route markers to the resume page root.
- `src/styles/global.css` — styled the locked shell to match the existing retro terminal UI.
- `.gsd/DECISIONS.md` — recorded the shared domain boundary seam decision as D016.
