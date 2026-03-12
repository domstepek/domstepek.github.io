# S02: Site Integration and Cursor Reactivity — UAT

**Milestone:** M003
**Written:** 2026-03-12

## UAT Type

- UAT mode: live-runtime
- Why this mode is sufficient: This slice wires the shader into the live site layout — verifying canvas presence, z-layering, cursor tracking, and opt-out behavior requires a running dev server and real browser interaction, not just artifact inspection.

## Preconditions

- Dev server running at `localhost:4321` via `pnpm dev`
- Browser with WebGPU or WebGL2 support (Chrome/Edge recommended)

## Smoke Test

Open `localhost:4321/` — a fullscreen shader canvas should be visible behind all page content. Open browser console — should show `[shader] using webgpu` (or `webgl2`) exactly once. Move cursor — dither pattern should shift subtly near the pointer.

## Test Cases

### 1. Shader renders on homepage

1. Navigate to `localhost:4321/`
2. Inspect DOM: `document.querySelector('[data-shader-renderer]')`
3. **Expected:** Canvas element returned with `data-shader-renderer="webgpu"` (or `"webgl2"`), `position: fixed`, `z-index: -1`, `pointer-events: none`, first child of `<body>`

### 2. Shader renders on about page

1. Navigate to `localhost:4321/about/`
2. Inspect DOM: `document.querySelector('[data-shader-renderer]')`
3. **Expected:** Canvas present with `data-shader-renderer` set, shader animating behind content

### 3. Shader renders on protected domain page behind gate shell

1. Navigate to `localhost:4321/domains/product/`
2. Verify the gate shell is visible (locked state)
3. Inspect DOM for shader canvas
4. **Expected:** Shader canvas present as first child of body, gate shell content renders above the shader, no visual conflict between shader and gate/CRT layers

### 4. Shader-demo has no duplicate canvas

1. Navigate to `localhost:4321/shader-demo/`
2. Check for `#shader-bg` element (BaseLayout's shader)
3. Check for `#shader-canvas` element (demo's own shader)
4. Count elements with `[data-shader-renderer]`
5. **Expected:** `#shader-bg` absent, `#shader-canvas` present, exactly 1 element with `data-shader-renderer`

### 5. Cursor tracking affects shader

1. Navigate to `localhost:4321/`
2. Move cursor across the viewport
3. **Expected:** Dither pattern visibly shifts or changes intensity near cursor position. No console errors from pointermove handler.

### 6. Console logging contract

1. Navigate to any page with shader enabled
2. Open browser console
3. **Expected:** `[shader] using webgpu` (or `webgl2`) logged exactly once. No error-level messages from the shader.

## Edge Cases

### disableShader prop works via page-level override

1. Confirm `/shader-demo/` has no `#shader-bg` canvas
2. **Expected:** The `disableShader` prop successfully prevents BaseLayout from rendering ShaderBackground

### Canvas does not intercept clicks

1. On any shader-enabled page, click links and buttons
2. **Expected:** All interactive elements work normally — canvas has `pointer-events: none` and does not steal focus or clicks

## Failure Signals

- Missing `[data-shader-renderer]` canvas on a page that should have the shader
- `data-shader-renderer="none"` — indicates no GPU API was available
- Console warnings starting with `[shader]` — indicates initialization failure
- Two shader canvases on `/shader-demo/` — disableShader prop not working
- Layout shift or content appearing behind the shader canvas — z-index conflict
- Click/tap not working on page elements — canvas intercepting pointer events

## Requirements Proved By This UAT

- R403 — Cursor reactivity: pointermove listener feeds normalized coordinates to setPointer, dither pattern responds to pointer movement (Test 5)
- R404 — Per-page opt-out: disableShader prop prevents shader canvas rendering on shader-demo (Test 4), shader present on all other pages (Tests 1–3)
- R401 (partial, supporting) — Shader renders as ambient background on all pages via BaseLayout integration (Tests 1–3)

## Not Proven By This UAT

- R406 — `prefers-reduced-motion` respect and tab-hidden pause (S03 scope)
- R407 — Full `pnpm validate:site` regression suite (S03 scope)
- R405 (full) — WebGL2 fallback rendering parity (proven in S01, regression-tested in S03)
- Visual pixel-level comparison of cursor effect (verified functionally, not visually pixel-matched)

## Notes for Tester

- The dither pattern's cursor reactivity is intentionally subtle — look for slight shifts in blob positions or intensity near the cursor, not dramatic visual changes.
- The shader background may be harder to see on pages with dark content sections — scroll to lighter areas or edges to confirm the animated dither pattern.
- The CRT overlay (scanlines at z-index 9999) should render above the shader — both effects should coexist without conflict.
