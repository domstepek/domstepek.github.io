---
id: T01
parent: S02
milestone: M003
provides:
  - ShaderBackground.astro component with fullscreen fixed canvas
  - BaseLayout disableShader prop for per-page opt-out
  - Shader integrated on all pages except shader-demo
key_files:
  - src/components/shader/ShaderBackground.astro
  - src/components/layout/BaseLayout.astro
  - src/pages/shader-demo/index.astro
key_decisions:
  - Canvas placed as first child of <body> before skip-link and .site-shell to sit below all stacking contexts
patterns_established:
  - disableShader prop pattern for per-page shader opt-out
observability_surfaces:
  - "document.querySelector('[data-shader-renderer]') — returns canvas with renderer tag on any page, absent when disableShader is set"
  - "Console: [shader] using <renderer> exactly once per page load"
duration: 10m
verification_result: passed
completed_at: 2026-03-12
blocker_discovered: false
---

# T01: Create ShaderBackground.astro and integrate into BaseLayout

**Created ShaderBackground.astro with fullscreen fixed canvas and integrated into BaseLayout with disableShader opt-out prop.**

## What Happened

All three files were already correctly implemented from the previous attempt. Verified the implementation:

1. `ShaderBackground.astro` — renders a `<canvas id="shader-bg">` with `position: fixed; inset: 0; z-index: -1; pointer-events: none; aria-hidden: true`. Client script imports `initDitherShader` and initializes on the canvas, storing the instance on `window.__shaderInstance`.

2. `BaseLayout.astro` — added `disableShader?: boolean` to Props (default `false`). Conditionally renders `<ShaderBackground />` as first child of `<body>`, before skip-link and `.site-shell`.

3. `shader-demo/index.astro` — passes `disableShader` to BaseLayout to avoid double-canvas.

## Verification

- `pnpm check` — 0 errors, 0 warnings (3 pre-existing hints)
- `pnpm build` — succeeds, 11 pages built
- `dist/index.html` contains `shader-bg` (1 match)
- `dist/about/index.html` contains `shader-bg` (1 match)
- `dist/shader-demo/index.html` — 0 matches for `shader-bg` (disableShader works)
- Dev server `/` — canvas present, `data-shader-renderer="webgpu"`, `position: fixed`, `z-index: -1`, first child of body
- Dev server `/about/` — shader-bg present, `data-shader-renderer="webgpu"`
- Dev server `/shader-demo/` — no `#shader-bg`, only `#shader-canvas` with `data-shader-renderer="webgpu"`
- Console shows `[shader] using webgpu` exactly once per page load

### Slice-level verification (partial — T01 scope):

| Check | Status |
|---|---|
| `pnpm check` — 0 errors | ✅ |
| `pnpm build` — succeeds | ✅ |
| Shader canvas on `/` with `data-shader-renderer` | ✅ |
| `/shader-demo/` — only one canvas, no duplicate | ✅ |
| Protected domain page — shader behind gate | ⏳ not tested (visual only) |
| Console `[shader] using <renderer>` once per page | ✅ |
| Cursor tracking works | ⏳ T02 scope |

## Diagnostics

- `document.querySelector('[data-shader-renderer]')` — returns canvas with renderer tag; absence means disableShader is active or init failed
- `data-shader-renderer="none"` indicates no GPU API available
- Console `[shader] using <renderer>` on success, `[shader] ...` warnings on failure
- `window.__shaderInstance` available for debug inspection

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/components/shader/ShaderBackground.astro` — new component with fullscreen fixed canvas and client-side shader init
- `src/components/layout/BaseLayout.astro` — added disableShader prop and conditional ShaderBackground include
- `src/pages/shader-demo/index.astro` — added disableShader prop to avoid double-canvas
