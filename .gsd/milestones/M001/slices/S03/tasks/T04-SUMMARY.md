---
id: T04
parent: S03
milestone: M001
provides:
  - Dark theme with near-black background and light text across all pages
  - Space Mono monospace typography via Google Fonts
  - CRT scanline overlay effect using CSS repeating-linear-gradient
  - Retro pixel cursor assets (default arrow + pointer hand)
  - Personal avatar illustration on homepage hero with blend mode integration
requires: []
affects:
  - S03
key_files:
  - public/cursors/default.png
  - public/cursors/pointer.png
  - src/styles/global.css
  - src/components/layout/BaseLayout.astro
  - src/components/home/HomePage.astro
  - src/data/home.ts
key_decisions:
  - "Used mix-blend-mode: lighten to blend white-background avatar into dark theme instead of requiring transparent PNG"
  - "Generated retro pixel cursor PNGs programmatically with Node.js raw PNG encoding (no canvas/sharp dependency needed)"
  - "Applied CRT scanline via fixed overlay div with repeating-linear-gradient and pointer-events: none for zero interaction impact"
patterns_established:
  - "Dark theme: all color values flow through CSS custom properties in :root"
  - "Font stack: --font-mono replaces --font-sans as the single typography variable"
  - "Cursor: universal selector applies default.png, interactive elements get pointer.png"
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T04-PLAN.md
duration: 8min
verification_result: pass
completed_at: 2026-03-10T00:00:00Z
blocker_discovered: false
---

# T04: Dark Theme and CRT Effect

**Dark theme retheme with Space Mono monospace font, CRT scanline overlay, retro pixel cursors, and avatar illustration on homepage**

## What Happened
- Switched entire site from light to dark color scheme (#0a0a0a background, #e0e0e0 text, green accent)
- Replaced Inter sans-serif with Space Mono monospace via Google Fonts preconnect
- Added CRT scanline overlay visible as subtle horizontal lines across viewport
- Generated and integrated retro pixel cursor PNGs (arrow default + hand pointer)
- Added personal avatar illustration to homepage hero with mix-blend-mode: lighten for seamless dark-bg integration
- All existing validators (phases 1-6) continue to pass

## Deviations
None - plan executed exactly as written.

## Files Created/Modified
- `public/cursors/default.png`
- `public/cursors/pointer.png`
- `src/styles/global.css`
- `src/components/layout/BaseLayout.astro`
- `src/components/home/HomePage.astro`
- `src/data/home.ts`
