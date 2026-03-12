# GSD State

**Active Milestone:** M002 — Portfolio Access Gate
**Active Slice:** S02 — Session Unlock Flow and Gate Messaging
**Active Task:** None
**Phase:** Ready to start S02

## Recent Decisions
- Use a simple static passcode gate instead of real auth because the site stays on GitHub Pages.
- Protect `/domains/*` only.
- Keep `/`, `/about/`, and `/resume/` public.
- Persist unlock state for the current browser session.
- Use stable public/protected boundary markers for route-split verification.
- Gate S01 with both built-artifact checks and a real browser cold-load test before deploy.
- Keep `/domains/[slug]` on a shared `DomainPage` seam with explicit gate states so locked cold loads and later unlocked renders reuse one route path.

## Blockers
- None

## Next Action
Start S02 on top of the shipped boundary seam: add the passcode UI, request-access messaging, and session-scoped unlock behavior while preserving the existing route markers and release-gated validation path.
