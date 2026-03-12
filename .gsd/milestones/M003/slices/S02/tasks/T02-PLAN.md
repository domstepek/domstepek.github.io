---
estimated_steps: 3
estimated_files: 1
---

# T02: Wire cursor tracking via pointermove to setPointer

**Slice:** S02 — Site Integration and Cursor Reactivity
**Milestone:** M003

## Description

Add pointer/cursor tracking to the `ShaderBackground.astro` client script so the dither pattern reacts to mouse and touch movement. The `pointermove` event on `document` feeds normalized 0–1 coordinates into `ShaderInstance.setPointer()`, making the shader subtly responsive to user interaction across all pages.

## Steps

1. In `ShaderBackground.astro`'s `<script>` block, after `initDitherShader` returns a non-null instance, add a `pointermove` listener on `document` that normalizes `event.clientX / window.innerWidth` and `event.clientY / window.innerHeight` and calls `instance.setPointer(x, y)`
2. Guard the listener: only attach if `instance` is non-null; no cleanup needed since each page load is a fresh DOM (no View Transitions)
3. Verify on dev server: move cursor on homepage, about page, and a protected domain page — the dither pattern visibly shifts. Check console for any errors.

## Must-Haves

- [ ] `pointermove` listener on `document` feeds normalized 0–1 coords to `setPointer()`
- [ ] Normalization uses `clientX / window.innerWidth` and `clientY / window.innerHeight` (not canvas dimensions)
- [ ] Listener only attached when shader init succeeds (instance is non-null)
- [ ] Touch interaction works via `pointermove` (no separate `touchmove` needed)
- [ ] No console errors from pointer tracking

## Verification

- Dev server: move mouse on `localhost:4321/` — dither pattern visibly shifts near pointer
- Dev server: move mouse on `localhost:4321/about/` — same cursor reactivity
- Dev server: open devtools mobile simulation, touch-drag — pattern responds
- Console: no errors or warnings from pointer tracking code
- `pnpm check` still passes

## Observability Impact

- Signals added/changed: None — pointer coordinates are fed into the existing shader uniform system (S01's `setPointer` updates the pointer uniform each frame)
- How a future agent inspects this: The shader's pointer uniform reflects cursor position; can verify by checking that `setPointer` is being called (add temporary breakpoint or log)
- Failure state exposed: If pointer tracking is broken, the dither pattern won't respond to cursor movement — visible in browser but not logged (no error state, just static default 0.5, 0.5 pointer)

## Inputs

- `src/components/shader/ShaderBackground.astro` — from T01, contains client script with `initDitherShader` call
- S01 Forward Intelligence: `setPointer(x, y)` accepts normalized 0–1 coordinates

## Expected Output

- `src/components/shader/ShaderBackground.astro` — modified with `pointermove` listener wiring cursor tracking to `setPointer()`
