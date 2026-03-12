---
id: S02
milestone: M002
status: ready
---

# S02: Session Unlock Flow and Gate Messaging — Context

## Goal

Deliver an in-place passcode unlock flow for protected `/domains/*` routes that preserves session-scoped access, keeps the gate messaging clear and lightweight, and helps visitors know how to request the password when they do not have it.

## Why this Slice

S02 turns the S01 locked boundary into a usable protected-access experience. It unblocks S03 by establishing the real unlock interaction, the session continuity contract, and the locked-state messaging that the later visual-reveal work will rely on.

## Scope

### In Scope

- Add a working passcode entry flow on protected `/domains/*` routes.
- Keep unlock behavior in-place so a visitor who enters the correct passcode stays on the current domain page and sees it open there.
- Persist unlock state for the current browser session across protected route navigation.
- Show gentle inline error feedback when the wrong passcode is entered, without kicking the visitor out of the current gate view.
- Make the failed-passcode feedback feel lightweight rather than punitive, including a subtle animation treatment.
- Prioritize LinkedIn DM as the primary request-access CTA on the gate.
- Include suggested request wording that asks the visitor to share their reason for requesting access, while making clear the reason can be simple.
- Keep the gate messaging aligned with the existing lowercase retro-terminal tone.

### Out of Scope

- Changing the protected route scope beyond `/domains/*`.
- Reworking the public routes or public site information architecture.
- Treating the gate as strong security or introducing real auth.
- Final protected-visual blur/reveal behavior; that belongs in S03.
- Expanding protection to notes in this milestone.
- Deciding long-term passcode rotation/management policy beyond what is needed to make the slice usable.

## Constraints

- Build on the S01 locked-shell boundary and verification-marker contract rather than replacing it.
- Unlock state must remain session-scoped, not durable across browser sessions.
- The unlock flow should feel gentle and polished, not harsh or suspicious.
- Wrong-passcode handling should stay inline on the gate instead of redirecting elsewhere.
- LinkedIn DM should be the primary request-access path, with supporting guidance for what to send.
- The request-access copy should explicitly reassure visitors that a simple reason for requesting access is acceptable.
- If haptic feedback is used, it should support the same gentle feel and not become gimmicky or disruptive.

## Integration Points

### Consumes

- `S01 locked boundary for /domains/*` — provides the protected-route seam and default locked render that this slice augments with passcode entry and unlock behavior.
- `data-route-visibility`, `data-gate-state`, and locked-shell markers` — existing verification hooks that must continue to distinguish locked and unlocked states.
- `src/pages/domains/[slug].astro` and shared domain route rendering` — protected route entry path where unlock-in-place behavior must attach.
- `browser session storage/state` — session-scoped mechanism used to remember access across protected routes.
- `existing site tone and shared styles/components` — keeps the new gate flow visually and editorially consistent with the shipped site.

### Produces

- `passcode entry flow for protected routes` — a real unlock interaction on `/domains/*`.
- `session-scoped unlock state contract` — one successful unlock grants protected-route access for the current browser session.
- `inline failure feedback state` — gentle wrong-passcode response with subtle motion/feedback while preserving the gate context.
- `contact-first gate messaging with LinkedIn DM priority` — clear path for requesting access when the visitor does not have the password.
- `request template guidance` — suggested outreach copy that asks for the visitor’s reason in a low-friction way.
- `stable locked/unlocked verification surface` — selectors or markers that later slices and regression checks can use to prove unlock continuity.

## Open Questions

- What exact LinkedIn/email/outbound link mix should appear alongside the primary DM CTA? — Current direction is LinkedIn-first with any secondary options clearly subordinate.
- Which moments should trigger haptic feedback, if any? — Current direction is to keep it subtle and supportive, likely limited to error/success moments rather than every interaction.
- How explicit should the request template be on-page? — Current direction is to make it easy to copy/use while keeping the gate concise and not overly scripted.
