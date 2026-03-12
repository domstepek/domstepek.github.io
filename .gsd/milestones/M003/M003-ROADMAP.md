# M003: GPU Shader Background

**Vision:** Add a custom-written faded dither GPU shader as an ambient, cursor-reactive background effect across all pages, reinforcing the site's retro terminal identity with genuine technical craft.

## Success Criteria

- Visitors see an animated faded dither pattern as the background on every page
- The dither pattern responds subtly to cursor/pointer movement
- The effect uses the site's existing accent color palette (greens, muted dark tones)
- Unsupported browsers see the plain dark background with no errors or broken layout
- Individual pages can opt out of the shader via a layout prop
- The full `pnpm validate:site` release gate passes after integration

## Key Risks / Unknowns

- WebGPU device acquisition reliability — adapter/device creation can fail on some hardware or driver configurations, requiring robust error handling before canvas setup
- Canvas z-layering with existing DOM — the shader canvas must sit behind all content, CRT overlay, gate shell, and blur/reveal layers without z-index conflicts
- Visual parity between WebGPU and WebGL2 renderers — the dither math ports cleanly but color space handling may produce visible differences

## Proof Strategy

- WebGPU reliability → retire in S01 by proving the shader renders on a real browser with fallback to WebGL2 when WebGPU is unavailable
- Canvas z-layering → retire in S02 by proving the shader coexists with gate shell, unlock flow, and CRT overlay on a protected domain page
- Visual parity → retire in S01 by implementing both renderers and comparing output visually

## Verification Classes

- Contract verification: Browser tests confirming shader canvas presence, animation frame loop, cursor uniform updates, and opt-out behavior
- Integration verification: Full `pnpm validate:site` suite (20 existing tests + 3 validators) passes with shader integrated
- Operational verification: None — static site
- UAT / human verification: Visual quality assessment of the dither effect across pages

## Milestone Definition of Done

This milestone is complete only when all are true:

- Shader renders and animates on all pages via BaseLayout.astro
- Cursor movement visibly affects the dither pattern
- Per-page opt-out works (verified by at least one page with shader disabled)
- WebGL2 fallback renders a comparable effect when WebGPU is unavailable
- Graceful degradation shows plain dark background when no GPU API is available
- `prefers-reduced-motion` disables or reduces animation
- The full `pnpm validate:site` passes
- No layout shifts, interaction blocking, or console errors from the shader

## Requirement Coverage

- Covers: R401, R402, R403, R404, R405, R406, R407
- Partially covers: none
- Leaves for later: R201, R202, R203, R204
- Orphan risks: none

## Slices

- [x] **S01: Faded dither shader engine** `risk:high` `depends:[]`
  > After this: opening `localhost:4321` shows an animated faded dither pattern filling the viewport as a standalone canvas, with soft green-tinted blobs dissolving through an ordered dither grid, running on WebGPU or WebGL2.

- [x] **S02: Site integration and cursor reactivity** `risk:medium` `depends:[S01]`
  > After this: every page on the site has the dither shader as its background, the pattern responds to cursor movement, individual pages can opt out via a layout prop, and the shader coexists cleanly with the CRT overlay and gate/unlock layers.

- [ ] **S03: Polish, performance, and regression proof** `risk:low` `depends:[S02]`
  > After this: the shader respects `prefers-reduced-motion`, pauses when the tab is hidden, the full `pnpm validate:site` suite passes, and a browser test confirms shader canvas presence and opt-out behavior.

## Boundary Map

### S01 → S02

Produces:
- `src/lib/shader/dither-shader.ts` — `initDitherShader(canvas: HTMLCanvasElement, options?: ShaderOptions): ShaderInstance` — creates and starts the shader on a canvas element
- `src/lib/shader/types.ts` — `ShaderInstance` interface with `destroy()`, `setPointer(x, y)`, `pause()`, `resume()` methods; `ShaderOptions` interface with color config
- `src/lib/shader/webgpu-renderer.ts` — WebGPU renderer implementation (WGSL fragment shader)
- `src/lib/shader/webgl2-renderer.ts` — WebGL2 fallback renderer (GLSL fragment shader)

Consumes:
- nothing (first slice)

### S02 → S03

Produces:
- `src/components/shader/ShaderBackground.astro` — Astro component that renders the shader canvas and wires initialization
- `BaseLayout.astro` updated with `disableShader` prop and `ShaderBackground` integration
- Cursor tracking wired via `pointermove` / `touchmove` events feeding `setPointer(x, y)`

Consumes from S01:
- `dither-shader.ts` → `initDitherShader()` for canvas setup
- `types.ts` → `ShaderInstance` for lifecycle control (`pause`, `resume`, `destroy`, `setPointer`)
