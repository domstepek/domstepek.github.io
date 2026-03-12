# S01: Public vs Protected Route Boundary — UAT

**Milestone:** M002
**Written:** 2026-03-12

## UAT Type

- UAT mode: artifact-driven
- Why this mode is sufficient: S01 proves the cold-load route boundary, shipped HTML withholding, and real-browser entry behavior; it does not yet ship human-facing unlock interaction, so artifact and browser verification are the right proof for this slice.

## Preconditions

- Dependencies installed.
- Fresh production build present via `pnpm build`.
- Validation commands available locally: `node --test tests/route-boundary.static.test.mjs`, `node --test tests/route-boundary.browser.test.mjs`, and `pnpm validate:site`.

## Smoke Test

Run `pnpm validate:site` and confirm it reports the route boundary contract passed, with public routes left open and protected routes rendered as locked shells in the real browser smoke test.

## Test Cases

### 1. Public routes stay open

1. Run `pnpm build`.
2. Run `node --test tests/route-boundary.static.test.mjs`.
3. Confirm the `/`, `/about/`, and `/resume/` assertions pass.
4. Run `node --test tests/route-boundary.browser.test.mjs`.
5. **Expected:** The public-route tests pass in both artifact and browser checks, and no protected-gate shell appears on those pages.

### 2. Protected cold loads render the locked boundary

1. Run `pnpm build`.
2. Run `node --test tests/route-boundary.static.test.mjs`.
3. Check the protected-route assertions for `/domains/product/`, `/domains/analytics-ai/`, and `/domains/developer-experience/`.
4. Run `node --test tests/route-boundary.browser.test.mjs`.
5. **Expected:** Each protected route exposes `data-route-visibility="protected"`, `data-gate-state="locked"`, `data-protected-gate`, and `data-protected-proof-state="withheld"` on cold load.

### 3. Protected proof is withheld from initial HTML

1. Run `pnpm build`.
2. Run `pnpm validate:route-boundary`.
3. Inspect any reported failures if the command fails.
4. **Expected:** The validator passes and does not find leaked flagship/supporting proof markers or proof nodes inside `dist/domains/*/index.html`.

## Edge Cases

### Public route accidentally over-gated

1. Run `pnpm validate:site` after any route/layout change.
2. **Expected:** The command fails with a route-specific message if a public page starts exposing protected markers or a gate shell.

### Protected route leaks proof terminology or markup

1. Run `node --test tests/route-boundary.static.test.mjs` after editing locked-shell copy or domain-page markup.
2. **Expected:** The test fails with the exact protected route and leaked marker/snippet if proof content or banned proof labels enter the cold-load HTML.

## Failure Signals

- `pnpm validate:route-boundary` reports a route-specific missing marker or leaked proof snippet.
- `node --test tests/route-boundary.browser.test.mjs` fails on missing `[data-protected-gate]`, wrong gate-state markers, or non-zero proof node counts.
- A public route begins rendering the locked shell or exposes protected markers.
- A protected cold load contains flagship/supporting proof markup in `dist/`.

## Requirements Proved By This UAT

- R101 — Public routes remain directly accessible with no protected shell on `/`, `/about/`, and `/resume/`.
- R102 — Protected `/domains/*` cold loads render a gate state and withhold protected proof before any unlock behavior exists.

## Not Proven By This UAT

- R102 does not yet prove correct passcode entry because S01 does not ship the unlock flow.
- R103 is not proven; request-access messaging and contact links are deferred to S02.
- R104 is not proven; session-scoped unlock persistence is deferred to S02.
- R105 is not proven; obscured-but-visible protected visuals are deferred to S03.
- Human-experience questions about copy tone and clarity are not covered by this artifact-driven UAT.

## Notes for Tester

This slice is intentionally about the boundary, not usability after unlock. If the commands prove public pages stay open and protected cold loads stay locked with no leaked proof, the slice is behaving as designed even though there is no passcode form yet.
