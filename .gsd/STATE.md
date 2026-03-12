# GSD State

**Active Milestone:** M002 — Portfolio Access Gate
**Active Slice:** S02 — Session Unlock Flow and Gate Messaging
**Active Task:** T03 — Wire S02 into release validation and unlock diagnostics
**Phase:** S02 in progress; T01 and T02 completed, T03 ready to execute

## Recent Decisions
- Use a simple static passcode gate instead of real auth because the site stays on GitHub Pages.
- Protect `/domains/*` only.
- Keep `/`, `/about/`, and `/resume/` public.
- Persist unlock state for the current browser session.
- Use stable public/protected boundary markers for route-split verification.
- Gate S01 with both built-artifact checks and a real browser cold-load test before deploy.
- Keep `/domains/[slug]` on a shared `DomainPage` seam with explicit gate states so locked cold loads and later unlocked renders reuse one route path.
- Extend `validate:site` with a fast locked-shell validator plus a warm-session browser unlock test before deploy.
- Implement the S02 unlock path with a build-time public hash, a versioned `sessionStorage` marker, and a shared client-renderable domain proof view.
- Keep T01's new S02 regressions out of the existing S01 release validator until T03 wires the slice into `validate:site` intentionally.
- Use localStorage as a cross-tab bridge alongside sessionStorage for unlock carryover because sessionStorage is per-tab (per top-level browsing context).

## Blockers
- None

## Next Action
Execute T03: Wire S02 into release validation and unlock diagnostics — add the S02 gate-message and warm-session checks into `validate:site` and the deploy workflow.
