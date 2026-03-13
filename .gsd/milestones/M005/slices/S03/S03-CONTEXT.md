---
id: S03
milestone: M005
status: ready
---

# S03: Shader and interactive client components — Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

## Goal

Port the WebGPU/WebGL2 shader background, screenshot gallery carousel/lightbox, and Mermaid diagram renderer as `'use client'` React components, mounted in the root layout and domain proof pages, proven by `data-shader-renderer` attribute and Playwright assertions.

## Why this Slice

S01 established the scaffold and the root layout. S03 wires the three interactive client components that require browser APIs — shader, gallery, and Mermaid — which cannot run as RSCs. S03 is independent of S02 (public pages) and can execute in parallel. Both S02 and S03 must complete before S04 can do full integration and prove the assembled site end-to-end.

## Scope

### In Scope

- `ShaderBackground` — `'use client'` React component wrapping `src/lib/shader/` (975 lines, unchanged) with `useEffect` init/cleanup; mounted in `src/app/layout.tsx` via `disableShader` prop pattern; canvas as direct child of `<body>` before `.site-shell`, `z-index: -1`, `pointer-events: none` (D029)
- `ScreenshotGallery` — `'use client'` React component porting `src/components/domains/ScreenshotGallery.astro` + `screenshot-gallery-init.ts` (144 lines); behavior is a faithful port of the existing Astro version: horizontal scroll carousel track + click-to-open lightbox (full image, caption) + click-outside or Escape key to close; no behavior changes
- `MermaidDiagram` — `'use client'` React component porting `src/components/diagrams/MermaidDiagram.astro`; preserves the exact dark theme config (`primaryColor`, `nodeTextColor`, `Space Mono` font, `lineColor`, all existing `themeVariables`) and `startOnLoad: false` / `mermaid.run()` pattern; no theme changes
- All three components mounted in the appropriate server-rendered parents (shader in root layout, gallery and Mermaid in `DomainProofPage`)
- `data-shader-renderer` attribute on canvas (set by existing `initDitherShader` — just needs the component wrapper to preserve it)
- Shader console logging contract preserved: `[shader] using <renderer>` on success, `[shader] <reason>` on failure (D028)
- Shader failure behavior: if neither WebGPU nor WebGL2 is available, canvas is hidden and page renders with solid dark background — silent fallback, no error UI (same as Astro behavior)
- `disableShader` prop wired through root layout so any page can opt out (D026)
- Playwright tests: shader presence (`data-shader-renderer` not `'none'` on homepage), shader absence on a page with `disableShader`, gallery carousel renders on authenticated domain proof page, Mermaid diagram renders (`.mermaid svg` present) on a domain with a flagship chart

### Out of Scope

- Changes to the shader visual style or animation — port only, no new effects
- Changes to the gallery UX (no redesign, no new lightbox library — port the existing behavior exactly)
- Changes to the Mermaid theme — preserve the existing dark theme config exactly
- Adding new client components beyond the three listed
- The `/shader-demo/` page — dropped (D038)
- Any public page rendering (homepage, about, resume, notes) — that is S02 scope
- CSS migration work — S03 writes Tailwind utility classes for gallery/diagram component wrappers as needed, but does not port the full global.css

## Constraints

- **`'use client'` boundary at component level** — `ShaderBackground`, `ScreenshotGallery`, and `MermaidDiagram` must each declare `'use client'` at the top of the file. No browser APIs (`window`, `navigator`, `document`, `HTMLCanvasElement`) may appear at module scope — only inside `useEffect` callbacks or event handlers.
- **Shader init inside `useEffect`** — `initDitherShader()` from `src/lib/shader/dither-shader.ts` is called only inside `useEffect`. Cleanup (canvas clear, animation cancellation) runs on unmount.
- **Canvas placement** — canvas is a direct child of `<body>`, rendered before `.site-shell`, with `z-index: -1` and `pointer-events: none` (D029). In the Next.js layout, this means rendering `<ShaderBackground />` before the `{children}` wrapper.
- **CSS vars must survive for shader** — `--bg`, `--accent`, and `--accent-strong` must be present as `:root` custom properties when `initDitherShader` reads them via `getComputedStyle`. These are already aliased in `src/app/globals.css` from S01 — do not remove them.
- **Mermaid `startOnLoad: false`** — `mermaid.initialize()` must be called with `startOnLoad: false`; rendering is triggered by `mermaid.run({ querySelector: ".mermaid" })` inside `useEffect` after mount, not automatically.
- **Gallery init via `useEffect`** — the `astro:page-load` event dispatch (D021) goes away in Next.js; gallery initialization runs inside `useEffect` in the `ScreenshotGallery` client component directly.
- **All app paths under `src/app/`** — per D044; `src/components/` for components, `src/lib/shader/` for the shader engine (unchanged).
- **`typescript.ignoreBuildErrors: true` still active** — run `tsc --noEmit` manually to catch type errors during S03; suppressed in build until S04.
- **Faithful ports** — no behavior changes to any of the three components. The goal is equivalence with the Astro versions, not improvement.

## Integration Points

### Consumes

- `src/app/layout.tsx` — root layout from S01; `ShaderBackground` is mounted here (before `{children}`)
- `src/app/globals.css` — provides `--bg`, `--accent`, `--accent-strong` `:root` aliases that `initDitherShader` reads via `getComputedStyle`
- `src/lib/shader/dither-shader.ts` — `initDitherShader(canvas)` entry point; framework-agnostic, no changes needed
- `src/lib/shader/webgpu-renderer.ts`, `src/lib/shader/webgl2-renderer.ts`, `src/lib/shader/types.ts` — shader engine internals; port unchanged
- `src/components/domains/DomainProofPage.tsx` — RSC from S01; `ScreenshotGallery` and `MermaidDiagram` are mounted here alongside proof content
- `src/components/domains/ScreenshotGallery.astro` + `screenshot-gallery-init.ts` — reference implementation for the React port
- `src/components/diagrams/MermaidDiagram.astro` — reference implementation for the React port (preserve `themeVariables` exactly)
- `mermaid` npm package — already in `package.json` as a dependency

### Produces

- `src/components/shader/ShaderBackground.tsx` — `'use client'` React component; wraps `initDitherShader` in `useEffect`; renders `<canvas id="shader-bg">` with `data-shader-renderer` attribute; accepts `disableShader?: boolean` prop (renders nothing when true)
- `src/components/domains/ScreenshotGallery.tsx` — `'use client'` React component; carousel track + lightbox; faithful port of Astro/TS version; no behavior changes
- `src/components/diagrams/MermaidDiagram.tsx` — `'use client'` React component; `mermaid.initialize()` + `mermaid.run()` in `useEffect`; dark theme config preserved exactly
- `src/app/layout.tsx` — updated to mount `<ShaderBackground />` as first child of `<body>`
- `src/components/domains/DomainProofPage.tsx` — updated to use `<ScreenshotGallery>` and `<MermaidDiagram>` in flagship sections
- `tests/e2e/shader.spec.ts` — Playwright tests: shader present (data-shader-renderer set), disableShader opt-out, gallery renders on domain proof page, Mermaid SVG renders

## Open Questions

- None — all behavioral decisions confirmed during discuss phase.
