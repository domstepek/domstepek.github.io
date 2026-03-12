---
id: S02
milestone: M002
status: ready
---

# S02: Session Unlock Flow and Gate Messaging — Context

<!-- Slice-scoped context. Milestone-only sections (acceptance criteria, completion class,
     milestone sequence) do not belong here — those live in the milestone context. -->

## Goal

Wire the passcode entry flow and contact-for-password messaging into the existing locked gate shell so a visitor can unlock all protected domain pages for the current browser session.

## Why this Slice

S01 shipped the locked shell but it has placeholder copy and no way to actually unlock. S02 makes the gate usable: visitors who don't have the password see how to request it, and visitors who do have it can enter it once and browse freely. This unblocks S03 (visual reveal needs an unlocked state to reveal into) and S04 (verification needs an unlock flow to exercise).

## Scope

### In Scope

- Replace the placeholder locked-shell copy with real gate messaging in the casual lowercase site voice.
- Show LinkedIn DM link and email address as contact channels for requesting the password.
- Inline passcode input on the gate page — no modal, no separate page, no expand/collapse.
- Validate passcode against a build-time public hash (per D018).
- On wrong passcode: subtle CSS shake animation on the input plus an inline error message.
- On correct passcode: quick fade/transition from locked shell to full proof view on the same page.
- Persist unlock in `sessionStorage` with a versioned marker (per D018) — one unlock covers all `/domains/*` routes.
- Unlock survives same-tab refresh (F5) — `sessionStorage` persists within the tab.
- Cross-route continuity: navigating from one unlocked domain page to another loads already-unlocked.
- Mount unlocked proof through the shared client-renderable domain view-model and `renderDomainProof()` already built in S01.
- Extend `validate:site` with both a dist validator for locked-shell messaging and a browser warm-session unlock test (per D017).

### Out of Scope

- Changing the homepage domain cards — no lock icons, badges, or hints that domain pages are gated.
- Protected-visual blur/obscure behavior — that belongs to S03.
- Rate limiting or lockout on wrong passcode attempts.
- Any server-side validation or auth.
- Passcode rotation UI or admin tooling.
- Protecting routes beyond `/domains/*`.

## Constraints

- Gate copy must use the site's existing casual lowercase voice (D003) and retro terminal aesthetic (D005).
- Gate copy must not include phrases like "flagship highlights" or "supporting proof" — the existing proof-leak tests treat those as evidence of escaped protected content (per S01 forward intelligence).
- The `DomainPage` gate-state seam from S01 must stay stable — unlock wires through it, not around it (D016).
- The cold-load HTML contract from S01 (D015 marker vocabulary) must remain intact — S02 adds client-side behavior on top, it does not change what the server ships.
- Hosting is static GitHub Pages — no runtime server, no edge functions (D004, D009).

## Integration Points

### Consumes

- `src/components/domains/DomainGateShell.astro` — the locked-shell UI that S02 replaces copy in and adds the passcode input to.
- `src/components/domains/DomainPage.astro` — the gate-state seam that switches between locked and unlocked renders.
- `src/components/domains/domain-proof-view.ts` — the browser-side `renderDomainProof()` function that produces unlocked proof DOM.
- `src/data/domains/domain-view-model.ts` — the `buildDomainProofViewModel()` function and `DomainProofViewModel` type used to feed proof rendering.
- `tests/helpers/site-boundary-fixtures.mjs` — shared route inventories and boundary helpers for extending validators.
- `scripts/validate-m002-s01.mjs` — existing dist validator to extend or complement.
- D015 marker contract: `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, `data-protected-proof-state="withheld"`.

### Produces

- Passcode entry flow with inline input, shake-on-error, and fade-to-proof on success.
- Session-scoped unlock state contract via versioned `sessionStorage` marker.
- Gate landing content with LinkedIn DM link and email address.
- Unlocked rendering path: client-side proof mount through `DomainPage` seam shared across all protected domain routes.
- Extended `validate:site` coverage: dist validator for locked-shell messaging plus browser warm-session unlock test.

## Open Questions

- Exact email address and LinkedIn profile URL to display on the gate — need the literal values at implementation time. Current thinking: pull from existing site data or config if available, otherwise hardcode.
- Exact gate copy wording — confirmed casual/direct tone and contact channels, but the specific sentences are agent's discretion during execution as long as they match the site voice and avoid proof-label phrases.
- Transition duration for the unlock fade — confirmed "quick" but exact timing (e.g. 200ms vs 400ms) is agent's discretion during execution.
