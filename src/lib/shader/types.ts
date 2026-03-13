/**
 * Shared types, constants, and utilities for the dither shader engine.
 */

// ── Interfaces ──────────────────────────────────────────────────────

/** Linear RGB color triplet (each channel 0–1). */
export interface ShaderColors {
  bg: [number, number, number];
  accent: [number, number, number];
  strong: [number, number, number];
}

/** Options passed to the public shader factory. */
export interface ShaderOptions {
  /** Override palette colors (linear RGB). When omitted, read from CSS vars. */
  colors?: Partial<ShaderColors>;
  /** Explicit canvas element. When omitted, one is created internally. */
  canvas?: HTMLCanvasElement;
}

/** Public handle returned to consumers for lifecycle control. */
export interface ShaderInstance {
  destroy(): void;
  setPointer(x: number, y: number): void;
  addRipple(x: number, y: number, force?: boolean): void;
  pause(): void;
  resume(): void;
}

/**
 * Internal renderer interface — implemented by WebGPU and WebGL2 backends.
 * Generic enough that either GPU API can satisfy it.
 */
export interface Renderer {
  /** Acquire GPU resources. Returns `false` if the backend is unavailable. */
  init(canvas: HTMLCanvasElement, colors: ShaderColors): Promise<boolean>;
  /** Draw one frame. `time` is elapsed seconds; `pointer` is normalized 0–1. */
  render(time: number, pointer: [number, number]): void;
  /** Update the ripple ring buffer. Called before render each frame. */
  updateRipples(ripples: Float32Array, count: number): void;
  /** Handle canvas resize. */
  resize(width: number, height: number): void;
  /** Release all GPU resources. */
  destroy(): void;
}

// ── Bayer 8×8 ordered dither threshold matrix ───────────────────────

/**
 * Classic Bayer 8×8 ordered dither threshold matrix, normalized to 0–1.
 * Values are `(M[r][c] + 0.5) / 64` where M is the standard Bayer matrix.
 *
 * Row-major order: index = row * 8 + col.
 */
export const BAYER_8X8 = new Float32Array([
  /* row 0 */  0.007813, 0.507813, 0.132813, 0.632813, 0.039063, 0.539063, 0.164063, 0.664063,
  /* row 1 */  0.757813, 0.257813, 0.882813, 0.382813, 0.789063, 0.289063, 0.914063, 0.414063,
  /* row 2 */  0.195313, 0.695313, 0.070313, 0.570313, 0.226563, 0.726563, 0.101563, 0.601563,
  /* row 3 */  0.945313, 0.445313, 0.820313, 0.320313, 0.976563, 0.476563, 0.851563, 0.351563,
  /* row 4 */  0.054688, 0.554688, 0.179688, 0.679688, 0.023438, 0.523438, 0.148438, 0.648438,
  /* row 5 */  0.804688, 0.304688, 0.929688, 0.429688, 0.773438, 0.273438, 0.898438, 0.398438,
  /* row 6 */  0.242188, 0.742188, 0.117188, 0.617188, 0.210938, 0.710938, 0.085938, 0.585938,
  /* row 7 */  0.992188, 0.492188, 0.867188, 0.367188, 0.960938, 0.460938, 0.835938, 0.335938,
]);

// ── Utilities ───────────────────────────────────────────────────────

/**
 * Convert a hex sRGB color string to linear RGB (each channel 0–1).
 *
 * Accepts `#RGB`, `#RRGGBB`, or `RRGGBB` formats.
 * Uses the standard sRGB → linear transfer function.
 */
export function srgbToLinear(hex: string): [number, number, number] {
  let h = hex.replace(/^#/, '');

  // Expand shorthand (#RGB → RRGGBB)
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  return [channelToLinear(r), channelToLinear(g), channelToLinear(b)];
}

/** sRGB channel (0–1) → linear channel (0–1). */
function channelToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
