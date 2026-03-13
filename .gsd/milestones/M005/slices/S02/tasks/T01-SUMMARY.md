---
id: T01
parent: S02
milestone: M005
provides:
  - Full site shell in root layout (skip-link, header, main, footer, CRT overlay)
  - TerminalPanel shared server component
  - Playwright public test skeleton (8 test cases)
  - Domain page components updated to avoid double-nesting site-main shell
key_files:
  - src/app/layout.tsx
  - src/components/layout/TerminalPanel.tsx
  - src/app/globals.css
  - tests/e2e/public.spec.ts
key_decisions:
  - Layout uses body.site-shell (matching S01 pattern) rather than a separate div wrapper — crt-overlay and skip-link are direct body children
patterns_established:
  - Root layout provides site-main shell wrapper — page components should not duplicate it
  - TerminalPanel.tsx is the React equivalent of TerminalPanel.astro — import from @/components/layout/TerminalPanel
observability_surfaces:
  - "curl -s http://localhost:3000/ | grep -E 'site-header|site-footer|crt-overlay|skip-link' — all four match on every page"
duration: 15m
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T01: Upgrade root layout and create Playwright public test skeleton

**Expanded root layout to full site shell with header/footer/CRT overlay, created TerminalPanel server component, and wrote 8-case Playwright public test skeleton.**

## What Happened

1. Created `src/components/layout/TerminalPanel.tsx` — server component with traffic-light dots bar and children slot, matching TerminalPanel.astro exactly.

2. Upgraded `src/app/layout.tsx` from minimal stub to full site shell:
   - Skip-link before header
   - `<header>` with site-title `<Link>` from `next/link`
   - `<main id="main-content" className="site-main shell">` wrapping children
   - `<footer>` with tagline
   - `<div className="crt-overlay" aria-hidden="true" />` at end of body
   - Metadata uses `siteConfig` with title template pattern

3. Removed `className="site-main shell"` from `DomainGatePage.tsx` and `DomainProofPage.tsx` outer wrapper divs — layout now provides this, preventing double-nesting.

4. Migrated `.crt-overlay` and `.terminal-panel*` CSS blocks from `src/styles/global.css` into `src/app/globals.css`.

5. Created `tests/e2e/public.spec.ts` with all 8 test cases covering home/about/resume markers, gate marker absence, notes pipeline, 404, and notes gate isolation. Tests 1–4 and 7 depend on pages built in T02/T04; tests 5–6 and 8 depend on T03.

6. Ran gate regression and build verification — both pass.

## Verification

- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → **5 passed** (no regression from layout changes)
- `npm run build` → **exits 0** (3 static routes + 1 dynamic)
- `curl -s http://localhost:3000/ | grep "site-header"` → present ✅
- `curl -s http://localhost:3000/ | grep "crt-overlay"` → present ✅
- `curl -s http://localhost:3000/ | grep "skip-link"` → present ✅
- `curl -s http://localhost:3000/ | grep "site-footer"` → present ✅

## Diagnostics

- Inspect layout shell on any page: `curl -s http://localhost:3000/ | grep -E "site-header|site-footer|crt-overlay|skip-link"` — all four should match
- Missing layout elements will cause Playwright failures in public.spec.ts when pages are built in T02–T04

## Deviations

None.

## Known Issues

- Public test cases 1–8 will fail until T02–T04 build the actual page components and routes — this is expected per the task plan.

## Files Created/Modified

- `src/components/layout/TerminalPanel.tsx` — new server component with traffic-light dots and children slot
- `src/app/layout.tsx` — expanded from stub to full site shell with skip-link, header, main, footer, CRT overlay
- `src/components/domains/DomainGatePage.tsx` — removed `site-main shell` className (layout provides it)
- `src/components/domains/DomainProofPage.tsx` — removed `site-main shell` className (layout provides it)
- `src/app/globals.css` — added `.crt-overlay` and `.terminal-panel*` CSS blocks
- `tests/e2e/public.spec.ts` — new test file with 8 public page acceptance test cases
