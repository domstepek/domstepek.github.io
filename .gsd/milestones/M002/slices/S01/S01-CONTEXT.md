---
id: S01
milestone: M002
status: ready
---

# S01: Public vs Protected Route Boundary — Context

## Goal

Deliver a clear public-versus-protected route boundary so `/`, `/about/`, and `/resume/` stay directly accessible while cold visits to `/domains/*` render a real locked gate state instead of portfolio proof.

## Why this Slice

This slice establishes the highest-risk boundary first: protecting the domain route family without regressing the public discovery layer. It unblocks S02 by creating the locked rendering path and user-facing gate state that the later passcode flow will plug into.

## Scope

### In Scope

- Keep `/`, `/about/`, and `/resume/` directly accessible with no gate behavior.
- Treat `/domains/*` as the protected route family for this slice.
- Render a real locked state on cold loads to protected domain routes.
- Make the locked domain state a generic access gate rather than exposing domain-specific title, intro, or proof content.
- Emphasize contact-for-password messaging in the locked state before passcode entry ships in S02.
- Provide stable locked/public markers that later verification can assert against.

### Out of Scope

- Adding the actual passcode entry interaction in this slice; that lands in S02.
- Expanding protection to `/notes/*` in this slice.
- Revealing domain-specific shell content while locked.
- Choosing the final passcode source or rotation approach.
- Implementing protected-visual reveal behavior; that lands in S03.

## Constraints

- Respect the existing GitHub Pages static-hosting model; this slice is only a route-boundary and locked-state step within the lightweight deterrent approach.
- Preserve direct public access to `/`, `/about/`, and `/resume/` with no regression to the current public site shell.
- Keep the user-facing tone aligned with the existing lowercase retro-terminal style.
- The locked `/domains/*` experience should be generic and contact-oriented, not a partial preview of the underlying domain page.
- `/notes/*` stays public and untouched for now.

## Integration Points

### Consumes

- `src/pages/domains/[slug].astro` — existing protected route family that must switch from full render to locked gate state on cold visits.
- `src/pages/index.astro` — public homepage that must remain ungated.
- `src/pages/about.astro` — public about page that must remain ungated.
- `src/pages/resume.astro` — public resume page that must remain ungated.
- `src/lib/paths.ts` — source of truth for route boundaries and public/protected path handling.
- Existing domain page components and route helpers — reused so the boundary can be introduced without reworking site structure.

### Produces

- `protected-route boundary for /domains/*` — explicit protected-vs-public split for this milestone.
- `public-route allowlist for /, /about/, and /resume/` — invariant that later slices and verification depend on.
- `shared locked-state rendering path for domain pages` — generic gate shell that S02 can extend with passcode entry.
- `contact-first locked gate state` — user-facing blocked experience that tells visitors how to request access.
- `stable locked/public verification markers` — deterministic DOM hooks for dist checks and browser cold-load verification.

## Open Questions

- What exact contact methods and outbound links should the locked gate show? — Current direction is a contact-first gate, but execution still needs the final DM/email/link set.
- How generic should the locked page feel visually while still matching the destination route? — Current direction is to avoid domain-specific content exposure, but planning may still decide whether breadcrumbs, route labels, or neutral framing are acceptable.
- Should protected routes return a distinct document title or metadata while locked? — Current direction is generic locked presentation, but planning should confirm how far that extends into SEO/title behavior.
