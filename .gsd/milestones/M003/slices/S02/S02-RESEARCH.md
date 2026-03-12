# S02: Site Integration and Cursor Reactivity — Research

**Date:** 2026-03-12

## Summary

S02 integrates the standalone dither shader engine (from S01) into `BaseLayout.astro` so every page gets the animated background, wires cursor/touch tracking into `ShaderInstance.setPointer()`, and adds a `disableShader` prop for per-page opt-out. The primary risks are z-index layering conflicts with the CRT overlay and gate shell, and ensuring the shader canvas doesn't block pointer events or interfere with existing DOM markers (`data-gate-state`, `data-visual-state`).

The integration is straightforward: create a `ShaderBackground.astro` component that renders a fixed fullscreen canvas, import it in `BaseLayout.astro` conditionally based on a `disableShader` prop, and wire `pointermove`/`touchmove` listeners to feed normalized coordinates to `setPointer()`. The demo page (`/shader-demo/`) already proves the rendering pattern — S02 lifts it into the shared layout.

The biggest unknowns are visual: does the shader look right behind real page content with the CRT overlay on top? This requires visual UAT on the dev server after integration.

## Recommendation

**Create `ShaderBackground.astro` as a self-contained Astro component** that renders a fixed fullscreen canvas, initializes the shader via a `<script>` block, and attaches pointer tracking. Integrate it into `BaseLayout.astro` with a `disableShader` prop (default `false`). The canvas sits at `z-index: -1` behind all content, matching the demo page pattern.

Pointer tracking should use `pointermove` on `document` (not the canvas, since canvas has `pointer-events: none`), normalizing `clientX/clientY` against `window.innerWidth/innerHeight` to produce 0–1 coordinates for `setPointer()`. Touch events are handled automatically by `pointermove` with `pointerType === 'touch'` — no separate `touchmove` listener needed.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| Shader init + lifecycle | `initDitherShader()` from S01 | Already handles WebGPU→WebGL2→null detection, rAF loop, ResizeObserver, and cleanup |
| Fullscreen canvas pattern | `/shader-demo/index.astro` | Proven `position: fixed; inset: 0` with `pointer-events: none` and `z-index: -1` |
| Gallery re-init after DOM changes | `astro:page-load` event dispatch | Existing pattern from `ScreenshotGallery.astro` — same approach if shader needs re-init |

## Existing Code and Patterns

- `src/lib/shader/dither-shader.ts` — `initDitherShader(canvas, options?)` returns `ShaderInstance | null`; `setPointer(x, y)` accepts **normalized 0–1 coordinates** (S01 forward intelligence)
- `src/lib/shader/types.ts` — `ShaderInstance` with `destroy()`, `setPointer()`, `pause()`, `resume()`; `ShaderOptions` for color overrides
- `src/pages/shader-demo/index.astro` — proven canvas integration pattern: `position: fixed; inset: 0; pointer-events: none; z-index: -1`
- `src/components/layout/BaseLayout.astro` — single shared layout used by all 8 page routes; two slot points (`head` and default); `<div class="crt-overlay">` is the last child of `<body>` at `z-index: 9999`
- `src/styles/global.css` — z-index map: skip-link `1000`, screenshot-gallery `10000`, lightbox `10000`, CRT overlay `9999`
- `src/components/domains/DomainGateShell.astro` — gate shell uses `data-gate-state`, `data-visual-state` DOM markers; no explicit z-index (flows normally in DOM order)
- `src/components/domains/domain-gate-client.ts` — flips `data-gate-state` and `data-visual-state` on unlock; no pointer capture or event interception that would conflict with shader tracking

## Constraints

- **Canvas must be behind everything** — `z-index: -1` on the fixed canvas, which sits below the `site-shell` (no z-index, so stacking context is `auto` = above `-1`) and well below CRT overlay at `9999`
- **`pointer-events: none` on canvas is mandatory** — otherwise the fullscreen fixed canvas would intercept all clicks and break the entire site
- **`setPointer(x, y)` takes normalized 0–1 coordinates** — must divide `clientX` by `window.innerWidth` and `clientY` by `window.innerHeight`, not by canvas pixel dimensions
- **Colors read once at init from CSS vars** — no runtime theme switching in this project, so this is fine
- **Astro static rendering** — the shader component's `<script>` block runs client-side; Astro deduplicates `<script>` imports so the module loads once even though `BaseLayout` renders on every page
- **No View Transitions** — the site doesn't use Astro View Transitions, so no `astro:after-swap` cleanup needed; each page load is a fresh DOM
- **All 8 page routes use BaseLayout** — `index`, `about`, `resume`, `domains/[slug]`, `notes/index`, `notes/[slug]`, `404`, `shader-demo`

## Common Pitfalls

- **Canvas behind stacking context** — `z-index: -1` only works if the canvas isn't inside a positioned parent with its own stacking context. The canvas must be a direct child of `<body>` (or at least outside `.site-shell`) to sit behind everything.
- **Pointer event collision** — forgetting `pointer-events: none` on the canvas makes the entire site unclickable. The demo page already handles this correctly.
- **Coordinate normalization mismatch** — `setPointer()` expects 0–1 range. Using pixel coordinates or canvas-relative coordinates would produce extreme values that push the blob influence way off-screen.
- **Double initialization on shader-demo page** — the demo page has its own canvas + init script. If `BaseLayout` also injects a shader canvas, the demo page would have two shaders running. The demo page should either set `disableShader` or the `ShaderBackground` component should skip init if a `#shader-canvas` already exists.
- **Cleanup on page unload** — since there are no View Transitions, each navigation is a full page load, so browser automatically cleans up GPU resources. No explicit `destroy()` needed on `beforeunload`.

## Open Risks

- **Visual quality behind real content** — the shader behind dense text/cards may look different than the standalone demo; requires visual UAT on multiple pages (homepage, domain gate, notes)
- **CRT overlay interaction** — the CRT overlay uses `mix-blend-mode: multiply` which will affect how the shader appears through it; may need opacity or color tuning (but that's S03 polish scope if needed)
- **Protected domain pages with gate shell** — the gate shell has a semi-transparent panel background; shader showing through may look good or distracting — visual check needed
- **`/shader-demo/` double-canvas** — needs explicit handling to avoid running two shader instances on the demo page

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Astro | frontend-design | installed (available in skills list) |
| WebGPU/WebGL2 | N/A | no specific skill needed — S01 already built the engine |

No additional skills needed. The work is Astro component creation + CSS layering + vanilla JS event wiring, all within established project patterns.

## Sources

- S01 summary and forward intelligence (preloaded context)
- Direct codebase exploration: BaseLayout.astro, global.css z-index map, DomainGateShell.astro, domain-gate-client.ts, shader-demo page
- S01 shader API: dither-shader.ts, types.ts
