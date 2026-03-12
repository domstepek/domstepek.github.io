---
estimated_steps: 5
estimated_files: 3
---

# T01: Create ShaderBackground.astro and integrate into BaseLayout

**Slice:** S02 — Site Integration and Cursor Reactivity
**Milestone:** M003

## Description

Create the `ShaderBackground.astro` component that renders a fullscreen fixed canvas and initializes the dither shader, then integrate it into `BaseLayout.astro` with a `disableShader` prop for per-page opt-out. Update the existing `/shader-demo/` page to opt out since it manages its own canvas.

## Steps

1. Create `src/components/shader/ShaderBackground.astro` with:
   - A `<canvas>` element with `id="shader-bg"` styled as `position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1`
   - A `<script>` block that imports `initDitherShader` from `../../lib/shader/dither-shader.js` and calls it on the canvas
   - `data-shader-renderer` will be set by `initDitherShader` automatically
2. Add `disableShader?: boolean` to `BaseLayout.astro`'s Props interface (default `false`)
3. Conditionally render `<ShaderBackground />` in `BaseLayout.astro` when `!disableShader`, placing it as the first child of `<body>` (before the skip-link and `.site-shell`) so it sits behind all stacking contexts
4. Update `src/pages/shader-demo/index.astro` to pass `disableShader` to `BaseLayout` to avoid double-canvas
5. Verify with `pnpm check` and `pnpm build`, then visually confirm on dev server

## Must-Haves

- [ ] `ShaderBackground.astro` renders a fullscreen fixed canvas with `z-index: -1` and `pointer-events: none`
- [ ] Canvas is a direct child of `<body>`, before `.site-shell`, to sit below all stacking contexts
- [ ] `BaseLayout.astro` accepts `disableShader` prop (default `false`)
- [ ] `ShaderBackground` only renders when `disableShader` is falsy
- [ ] `/shader-demo/` passes `disableShader` to avoid running two shader instances
- [ ] `pnpm check` and `pnpm build` pass

## Verification

- `pnpm check` — 0 errors, 0 warnings (excluding pre-existing hints)
- `pnpm build` — succeeds
- Dev server `localhost:4321/` — shader canvas present with `data-shader-renderer` attribute set
- Dev server `localhost:4321/shader-demo/` — only one `#shader-canvas` element, no `#shader-bg`
- Dev server `localhost:4321/about/` — shader visible behind content
- Console shows `[shader] using <renderer>` exactly once per page

## Observability Impact

- Signals added/changed: ShaderBackground inherits S01's console logging contract (`[shader] using <renderer>` / `[shader] ...` warn). No new signals needed.
- How a future agent inspects this: `document.querySelector('[data-shader-renderer]')` on any page returns the canvas with renderer tag; absence means `disableShader` is active or init failed
- Failure state exposed: `data-shader-renderer="none"` if no GPU API; missing canvas element if `disableShader` is set; console warnings on init failure

## Inputs

- `src/lib/shader/dither-shader.ts` — `initDitherShader(canvas, options?)` public API from S01
- `src/lib/shader/types.ts` — `ShaderInstance` interface
- `src/components/layout/BaseLayout.astro` — current layout with `<body>` structure
- `src/pages/shader-demo/index.astro` — existing demo page with its own canvas
- S01 Forward Intelligence: `setPointer(x, y)` accepts 0–1 normalized coords; colors read from CSS vars at init; `data-shader-renderer` set automatically by `initDitherShader`

## Expected Output

- `src/components/shader/ShaderBackground.astro` — new component with fullscreen canvas + client init script
- `src/components/layout/BaseLayout.astro` — modified with `disableShader` prop and conditional `ShaderBackground` include
- `src/pages/shader-demo/index.astro` — modified to pass `disableShader`
