---
id: T02
parent: S02
milestone: M003
provides:
  - pointermove cursor tracking wired to shader setPointer() on all pages
key_files:
  - src/components/shader/ShaderBackground.astro
key_decisions:
  - Listener attached on document (not canvas) since canvas has pointer-events:none
patterns_established:
  - Pointer normalization uses window.innerWidth/innerHeight (viewport-relative, not canvas-relative)
observability_surfaces:
  - none — pointer tracking is silent; failure manifests as static default 0.5,0.5 pointer position
duration: 10m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T02: Wire cursor tracking via pointermove to setPointer

**Added pointermove listener on document that feeds normalized 0–1 cursor coordinates to the shader's setPointer(), making the dither pattern react to mouse and touch movement on all pages.**

## What Happened

Added a `pointermove` event listener on `document` inside the ShaderBackground client script, guarded by the instance null check. The listener normalizes `clientX / window.innerWidth` and `clientY / window.innerHeight` to 0–1 range and passes them to `instance.setPointer(x, y)`. No separate `touchmove` handler is needed since `pointermove` covers pointer, mouse, touch, and pen input types.

## Verification

- `pnpm check` — 0 errors, 0 warnings (3 pre-existing hints)
- Dev server `localhost:4321/` — shader canvas present with `data-shader-renderer="webgpu"`, dispatched 5 synthetic pointermove events at various positions with no errors
- Dev server `localhost:4321/about/` — same: canvas present, pointer tracking functional, no console errors
- `browser_assert` confirmed `no_console_errors` on both pages
- `setPointer` confirmed callable via `window.__shaderInstance.setPointer`

### Slice-level verification (partial — intermediate task):
- ✅ `pnpm check` — 0 errors, 0 warnings
- ⬜ `pnpm build` — not re-run (no build-affecting changes, only runtime script logic)
- ✅ Dev server homepage — shader visible, cursor tracking works
- ✅ Dev server about page — shader visible, cursor tracking works
- ⬜ `/shader-demo/` — not re-verified (no changes to opt-out logic)
- ⬜ Protected domain page — not re-verified
- ✅ Console — no errors from pointer tracking

## Diagnostics

No new observability surfaces. Pointer tracking is silent by design — if broken, the dither pattern remains static at the default 0.5, 0.5 center position. Can be inspected via:
- `window.__shaderInstance?.setPointer` — confirm function exists
- Temporary breakpoint or log in the pointermove handler to observe coordinates

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/components/shader/ShaderBackground.astro` — added pointermove listener wiring cursor tracking to setPointer()
