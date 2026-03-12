# S02: Site Integration and Cursor Reactivity

**Goal:** Every page on the site has the dither shader as its background, the pattern responds to cursor movement, individual pages can opt out via a layout prop, and the shader coexists cleanly with the CRT overlay and gate/unlock layers.
**Demo:** Open `localhost:4321` — the homepage shows the animated dither background behind all content. Move the cursor — the dither pattern shifts subtly. Navigate to `/about/`, `/domains/product-engineering/`, `/notes/` — all have the shader. The `/shader-demo/` page does not render a duplicate shader. A page with `disableShader` shows no shader canvas.

## Must-Haves

- `ShaderBackground.astro` component renders a fullscreen fixed canvas behind all content
- `BaseLayout.astro` accepts `disableShader` prop (default `false`) and conditionally includes `ShaderBackground`
- `pointermove` on `document` feeds normalized 0–1 coordinates to `ShaderInstance.setPointer()`
- Canvas has `pointer-events: none` and `z-index: -1` — does not intercept clicks
- Canvas is a direct child of `<body>` (outside `.site-shell`) to stay behind all stacking contexts
- `/shader-demo/` page sets `disableShader` to avoid double-canvas
- `data-shader-renderer` attribute present on the canvas for machine inspection
- `pnpm check` and `pnpm build` pass with no new errors

## Proof Level

- This slice proves: integration
- Real runtime required: yes — must verify shader renders behind real page content in a browser
- Human/UAT required: yes — visual quality of shader behind real content, CRT overlay interaction, gate shell layering

## Verification

- `pnpm check` — 0 errors, 0 warnings (pre-existing hints excluded)
- `pnpm build` — succeeds with shader canvas in all page HTML outputs
- Dev server at `localhost:4321/` — shader canvas visible, `data-shader-renderer` set, cursor tracking works
- Dev server at `localhost:4321/shader-demo/` — only one shader canvas present (the demo's own, not a duplicate from BaseLayout)
- Dev server at protected domain page — shader visible behind gate shell
- Console shows `[shader] using <renderer>` exactly once per page load

## Observability / Diagnostics

- Runtime signals: `[shader] using <renderer>` console.info on init; `[shader] ...` console.warn on failure; `data-shader-renderer` DOM attribute on canvas
- Inspection surfaces: `document.querySelector('[data-shader-renderer]')` returns the active canvas with renderer tag; pointer state observable via `window.__shaderInstance?.setPointer` (debug only)
- Failure visibility: `data-shader-renderer="none"` or missing canvas indicates total failure; console warnings log the reason
- Redaction constraints: none — no secrets in shader path

## Integration Closure

- Upstream surfaces consumed: `initDitherShader()` from `src/lib/shader/dither-shader.ts`, `ShaderInstance` from `src/lib/shader/types.ts`
- New wiring introduced in this slice: `ShaderBackground.astro` component → `BaseLayout.astro` conditional include → `pointermove` listener → `setPointer()` cursor tracking
- What remains before the milestone is truly usable end-to-end: S03 — `prefers-reduced-motion` support, tab-hidden pause, browser tests for canvas presence/opt-out, full `pnpm validate:site` regression proof

## Tasks

- [x] **T01: Create ShaderBackground.astro and integrate into BaseLayout** `est:30m`
  - Why: This is the core integration — the shader needs to render on every page via the shared layout, with per-page opt-out support
  - Files: `src/components/shader/ShaderBackground.astro`, `src/components/layout/BaseLayout.astro`
  - Do: Create `ShaderBackground.astro` with a fullscreen fixed canvas (position:fixed, inset:0, z-index:-1, pointer-events:none), client script that imports `initDitherShader` and initializes on the canvas. Add `disableShader` prop to `BaseLayout.astro` (default false). Conditionally render `ShaderBackground` when `!disableShader`. Place the canvas element as a direct child of `<body>`, before `.site-shell`, so it sits below all stacking contexts. Update `/shader-demo/` to pass `disableShader` since it has its own canvas.
  - Verify: `pnpm check` passes, `pnpm build` succeeds, dev server shows shader on homepage and about page, `/shader-demo/` has only one shader canvas
  - Done when: Shader renders as background on all pages except shader-demo, no z-index conflicts with CRT overlay or gate shell, `data-shader-renderer` attribute present on canvas

- [x] **T02: Wire cursor tracking via pointermove to setPointer** `est:20m`
  - Why: R403 requires cursor reactivity — the dither pattern must respond to pointer position
  - Files: `src/components/shader/ShaderBackground.astro`
  - Do: Add a `pointermove` event listener on `document` inside the ShaderBackground client script. Normalize `event.clientX / window.innerWidth` and `event.clientY / window.innerHeight` to produce 0–1 coordinates. Pass to `instance.setPointer(x, y)`. Clean up the listener if shader init fails (returns null). No separate `touchmove` needed — `pointermove` handles touch via `pointerType`.
  - Verify: Move cursor on dev server — the dither pattern visibly shifts near the pointer. Touch simulation in devtools also works. Console shows no errors.
  - Done when: Cursor movement visibly affects the dither pattern on any page with the shader active

## Files Likely Touched

- `src/components/shader/ShaderBackground.astro` (new)
- `src/components/layout/BaseLayout.astro` (modified — add `disableShader` prop + conditional include)
- `src/pages/shader-demo/index.astro` (modified — add `disableShader` prop)
