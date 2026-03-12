---
id: S02
parent: M003
milestone: M003
provides:
  - ShaderBackground.astro component with fullscreen fixed canvas behind all content
  - BaseLayout disableShader prop for per-page shader opt-out
  - pointermove cursor tracking wired to shader setPointer() on all pages
  - Shader integrated site-wide except shader-demo (which uses disableShader)
requires:
  - slice: S01
    provides: initDitherShader() API, ShaderInstance with setPointer/destroy/pause/resume
affects:
  - S03
key_files:
  - src/components/shader/ShaderBackground.astro
  - src/components/layout/BaseLayout.astro
  - src/pages/shader-demo/index.astro
key_decisions:
  - D029: Canvas placed as first child of <body> before skip-link and .site-shell with z-index -1 to sit below all stacking contexts
  - D030: /shader-demo/ passes disableShader to BaseLayout to avoid double-canvas
  - Pointer listener attached on document (not canvas) since canvas has pointer-events:none
  - Pointer normalization uses window.innerWidth/innerHeight (viewport-relative)
patterns_established:
  - disableShader prop pattern for per-page shader opt-out via BaseLayout
  - Pointer normalization to 0–1 range for shader uniform consumption
observability_surfaces:
  - "document.querySelector('[data-shader-renderer]') — returns canvas with renderer tag; absent when disableShader is set"
  - "Console: [shader] using <renderer> exactly once per page load"
  - "window.__shaderInstance — debug-only reference to active ShaderInstance"
drill_down_paths:
  - .gsd/milestones/M003/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S02/tasks/T02-SUMMARY.md
duration: 20m
verification_result: passed
completed_at: 2026-03-12
---

# S02: Site Integration and Cursor Reactivity

**Shader renders as background on all pages with cursor-reactive dither pattern, per-page opt-out via disableShader prop, and clean coexistence with CRT overlay and gate/unlock layers.**

## What Happened

Two tasks completed the site integration and cursor wiring:

**T01 — ShaderBackground.astro + BaseLayout integration:** Created `ShaderBackground.astro` with a fullscreen fixed canvas (`position: fixed; inset: 0; z-index: -1; pointer-events: none; aria-hidden: true`). The canvas is placed as the first child of `<body>`, before the skip-link and `.site-shell`, so it sits below all stacking contexts including the CRT overlay (z-index 9999) and gate shell. Added `disableShader` prop to `BaseLayout.astro` (default `false`) — `ShaderBackground` is conditionally rendered when `!disableShader`. Updated `/shader-demo/` to pass `disableShader` to avoid a double-canvas.

**T02 — Cursor tracking:** Added a `pointermove` event listener on `document` inside the ShaderBackground client script. The listener normalizes `clientX / window.innerWidth` and `clientY / window.innerHeight` to 0–1 coordinates and passes them to `instance.setPointer(x, y)`. No separate `touchmove` handler needed — `pointermove` covers pointer, mouse, touch, and pen input types.

## Verification

- `pnpm check` — 0 errors, 0 warnings (3 pre-existing hints)
- `pnpm build` — succeeds, 11 pages built, shader canvas present in all page HTML except shader-demo
- Dev server `/` — canvas present, `data-shader-renderer="webgpu"`, `position: fixed`, `z-index: -1`, first child of body
- Dev server `/about/` — shader-bg present, `data-shader-renderer="webgpu"`
- Dev server `/shader-demo/` — no `#shader-bg`, only `#shader-canvas` (disableShader works, one canvas total)
- Dev server `/domains/product/` — shader visible behind gate shell, canvas present as first child of body
- Console shows `[shader] using webgpu` exactly once per page load, no errors
- Cursor tracking functional — `window.__shaderInstance.setPointer` callable, pointermove events processed without errors

## Requirements Advanced

- R403 (Shader reacts to cursor movement) — pointermove listener feeds normalized coordinates to shader; dither pattern responds to pointer position on all pages
- R404 (Shader present on all pages with per-page opt-out) — ShaderBackground integrated into BaseLayout with disableShader prop; shader-demo uses opt-out successfully

## Requirements Validated

- none — full validation requires S03 browser tests and `pnpm validate:site` regression proof

## New Requirements Surfaced

- none

## Requirements Invalidated or Re-scoped

- none

## Deviations

None.

## Known Limitations

- `prefers-reduced-motion` not yet respected — deferred to S03
- Tab-hidden pause not yet implemented — deferred to S03
- No browser tests for shader canvas presence or opt-out — deferred to S03
- `pnpm validate:site` not run — S03 scope
- Visual cursor reactivity verified via synthetic events and function existence, not via visual pixel comparison (appropriate for this slice level)

## Follow-ups

- none — all remaining work is planned in S03

## Files Created/Modified

- `src/components/shader/ShaderBackground.astro` — new component with fullscreen fixed canvas, client-side shader init, and pointermove cursor tracking
- `src/components/layout/BaseLayout.astro` — added disableShader prop and conditional ShaderBackground include
- `src/pages/shader-demo/index.astro` — added disableShader prop to avoid double-canvas

## Forward Intelligence

### What the next slice should know
- The shader is fully wired and rendering on all pages. S03 only needs to add `prefers-reduced-motion` respect, tab-hidden pause, browser tests, and run `pnpm validate:site`.
- `window.__shaderInstance` exposes the full `ShaderInstance` interface for test inspection.
- `document.querySelector('[data-shader-renderer]')` is the stable machine-inspection surface for browser tests.

### What's fragile
- The z-index layering depends on the canvas being outside `.site-shell` at z-index -1 — if any future layout change wraps the canvas inside a stacking context, it could appear above content.
- The CRT overlay at z-index 9999 is the highest layer; anything added above that would also cover the CRT effect.

### Authoritative diagnostics
- `data-shader-renderer` attribute on the canvas — trustworthy renderer detection without parsing console output
- Console `[shader] using <renderer>` — one log per page load confirms successful init
- Absence of `#shader-bg` element — confirms disableShader is working

### What assumptions changed
- No assumptions changed — the S01 API surface worked exactly as documented in the boundary map
