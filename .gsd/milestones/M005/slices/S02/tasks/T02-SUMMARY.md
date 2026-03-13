---
id: T02
parent: S02
milestone: M005
provides:
  - HomePage server component with full data-* marker coverage
  - PersonalPage server component with all sections and markers
  - ResumePage server component with CopyChip client component for clipboard
  - Route files for /, /about/, /resume/ with generateMetadata
  - Component CSS for home, about, resume pages in globals.css
key_files:
  - src/components/home/HomePage.tsx
  - src/components/personal/PersonalPage.tsx
  - src/components/resume/ResumePage.tsx
  - src/components/resume/CopyChip.tsx
  - src/app/page.tsx
  - src/app/about/page.tsx
  - src/app/resume/page.tsx
  - src/app/globals.css
key_decisions:
  - CopyChip uses React state (idle/hovered/copied) with className toggling rather than DOM classList manipulation — matches original behavior with CSS transition classes is-hovered/is-copied
  - PrintButton co-located in CopyChip.tsx since both are small 'use client' components for the resume page
  - Domain links on home page use next/link Link since they're internal routes; contact links use plain <a> with rel="noreferrer" for external hrefs, plain <a> for mailto
patterns_established:
  - Page components are server components in src/components/{page}/ — route files in src/app/ just import and render them with generateMetadata
  - Internal navigation uses next/link Link; external uses plain <a> with rel="noreferrer"
  - Client interactivity isolated to smallest possible 'use client' component (CopyChip) — parent page stays server component
observability_surfaces:
  - "curl -s http://localhost:3000/ | grep data-home-page"
  - "curl -s http://localhost:3000/about/ | grep data-personal-page"
  - "curl -s http://localhost:3000/resume/ | grep data-resume-page"
  - data-route-visibility="public" and data-gate-state="open" on all three pages
duration: 1 session
verification_result: passed
completed_at: 2026-03-13
blocker_discovered: false
---

# T02: Port home, about, and resume pages with component CSS

**Ported three Astro pages to React server components with full data-* markers, client-side clipboard chip, generateMetadata SEO, and complete component CSS.**

## What Happened

Created HomePage.tsx, PersonalPage.tsx, and ResumePage.tsx as server components matching the original Astro structure exactly. Each renders all sections with correct data-* attributes for machine inspection. The resume page's clipboard chip buttons are isolated in a CopyChip 'use client' component that manages hover/copied state transitions. A PrintButton component wraps window.print(). All three route files export generateMetadata with title, description, and canonical URL. The full component CSS — home-page, home-avatar, personal-page, resume-page rules plus responsive overrides and print styles — was migrated into globals.css.

## Verification

- `npx playwright test tests/e2e/public.spec.ts --grep "home|about|resume|gate markers"` → 5 passed (home markers, about markers, resume markers, no gate markers, notes gate markers)
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 passed (regression clean)
- `npm run build` → exits 0, all 5 routes generated (/, /_not-found, /about, /domains/[slug], /resume)
- Visual spot-check: browsed /, /about/, /resume/ — all render with retro terminal styling, terminal panels, CRT overlay
- Browser assertions: all data-* markers (data-home-page, data-personal-page, data-resume-page, data-route-visibility, data-gate-state, data-home-hero, data-home-domain-nav, data-home-personal-teaser, data-home-contact-links) confirmed visible
- Observability: curl confirms data-home-page, data-personal-page, data-resume-page present in HTML responses

### Slice-level verification status (intermediate — T02 of T04)

- `public.spec.ts` tests 1-4: ✅ pass (home, about, resume markers + no gate markers)
- `public.spec.ts` tests 5-6: ❌ expected fail (notes index/detail not built yet — T03)
- `public.spec.ts` test 7: ✅ pass (404 returns 404 status)
- `public.spec.ts` test 8: ❌ partial — notes routes not built yet
- `gate.spec.ts`: ✅ all 5 pass
- `npm run build`: ✅ exits 0

## Diagnostics

- `curl -s http://localhost:3000/ | grep "data-home-page"` — confirms home renders
- `curl -s http://localhost:3000/about/ | grep "data-personal-page"` — confirms about renders
- `curl -s http://localhost:3000/resume/ | grep "data-resume-page"` — confirms resume renders
- Missing data-* attributes cause Playwright failures with descriptive selector names

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `src/components/home/HomePage.tsx` — new server component porting HomePage.astro
- `src/components/personal/PersonalPage.tsx` — new server component porting PersonalPage.astro
- `src/components/resume/ResumePage.tsx` — new server component porting ResumePage.astro
- `src/components/resume/CopyChip.tsx` — new 'use client' component for clipboard chips + PrintButton
- `src/app/page.tsx` — replaced placeholder with real HomePage + generateMetadata
- `src/app/about/page.tsx` — new route file with PersonalPage + generateMetadata
- `src/app/resume/page.tsx` — new route file with ResumePage + generateMetadata
- `src/app/globals.css` — extended with home-page, home-avatar, personal-page, resume-page CSS + responsive + print styles
