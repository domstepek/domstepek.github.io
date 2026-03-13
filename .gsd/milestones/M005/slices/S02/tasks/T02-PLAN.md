---
estimated_steps: 5
estimated_files: 8
---

# T02: Port home, about, and resume pages with component CSS

**Slice:** S02 — Public pages and notes pipeline
**Milestone:** M005

## Description

Port the three data-driven public pages from Astro components to React server components. Each page imports its data module, renders JSX with all required `data-*` markers, uses `next/link` for internal links, and exports `generateMetadata` for SEO. The resume page's clipboard chip buttons and print button are the only client-side JS — isolated in a `CopyChip` `'use client'` component. All component CSS is migrated from `src/styles/global.css`.

## Steps

1. **Create `src/components/home/HomePage.tsx`** — Server component matching `HomePage.astro`. Import `homePage` from `@/data/home`, `domains` from `@/data/domains`, path helpers from `@/lib/paths`, `Link` from `next/link`, and `TerminalPanel`. Render the full page structure: hero section with avatar, eyebrow, title, lead; terminal panel wrapping domain nav, personal teaser, contact, and freshness sections. All `data-*` attributes preserved: `data-home-page`, `data-route-visibility="public"`, `data-gate-state="open"`, `data-home-hero`, `data-home-domain-nav`, `data-home-domain-link`, `data-home-personal-teaser`, `data-home-personal-link`, `data-home-resume-link`, `data-home-contact-links`, `data-home-contact-link`, `data-home-freshness`. Use `Link` for internal hrefs (aboutPath, resumePath, domainPath), plain `<a>` with `rel="noreferrer"` for external hrefs.

2. **Update `src/app/page.tsx`** — Replace placeholder with real home page. Import `HomePage`, render `<HomePage />`. Export `generateMetadata` returning `{ title: homePage.seo.title, description: homePage.seo.description, alternates: { canonical: '/' } }`.

3. **Create `src/components/personal/PersonalPage.tsx` and `src/app/about/page.tsx`** — Server component matching `PersonalPage.astro`. Import `personalPage`, path helpers, `Link`, `TerminalPanel`. Render all sections: intro, how-i-work principles, open-to roles/problems/boundaries, resume highlights, notes link. All `data-*` attributes: `data-personal-page`, `data-route-visibility="public"`, `data-gate-state="open"`, `data-how-i-work`, `data-how-i-work-systems`, `data-how-i-work-product`, `data-how-i-work-collaboration`, `data-open-to`, `data-resume-section`, `data-personal-notes-link`. Route file exports `generateMetadata`.

4. **Create `src/components/resume/CopyChip.tsx`** — `'use client'` component. Accepts `copyText: string`, `label: string`, `printText: string`. Renders `<button>` with `data-copy`, hover/copied state management via `useState`. Also create a `PrintButton` (can be in same file) wrapping `window.print()`. Create `src/components/resume/ResumePage.tsx` — Server component matching `ResumePage.astro`. Uses `CopyChip` for clipboard buttons, `PrintButton` for print. All `data-*` attributes: `data-resume-page`, `data-route-visibility="public"`, `data-gate-state="open"`. Create `src/app/resume/page.tsx` route with `generateMetadata`.

5. **Migrate component CSS** — Copy from `src/styles/global.css` into `src/app/globals.css`:
   - `.home-page*` rules (lines ~193–309)
   - `.home-avatar*` rules (lines ~1059–1145)
   - `.personal-page*` rules (lines ~310–380+)
   - `.resume-page*` rules
   - Any responsive overrides for these components within `@media` blocks

## Must-Haves

- [ ] `HomePage.tsx` renders all sections with correct `data-*` markers
- [ ] `PersonalPage.tsx` renders all sections with correct `data-*` markers
- [ ] `ResumePage.tsx` renders all sections with correct `data-*` markers
- [ ] `CopyChip` is `'use client'` with clipboard functionality
- [ ] All internal links use `next/link` `<Link>`; external links use plain `<a>`
- [ ] Each route file exports `generateMetadata` with title, description, canonical
- [ ] `data-route-visibility="public"` and `data-gate-state="open"` on home/about/resume
- [ ] All component CSS migrated — pages render with correct visual styling
- [ ] Home/about/resume Playwright tests pass
- [ ] Gate tests still pass (regression)

## Verification

- `npx playwright test tests/e2e/public.spec.ts --grep "home|about|resume|gate markers"` → relevant tests pass
- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 passed
- `npm run build` → exits 0
- Visual spot-check: `next dev` + browse `/`, `/about/`, `/resume/` — content renders with retro styling

## Observability Impact

- Signals added/changed: `data-home-page`, `data-personal-page`, `data-resume-page` markers + `data-route-visibility="public"` on each page — machine-inspectable via curl
- How a future agent inspects this: `curl -s http://localhost:3000/ | grep "data-home-page"` → confirms home renders; same pattern for about/resume
- Failure state exposed: Missing data attributes cause Playwright test failures with selector names in error output

## Inputs

- `src/app/layout.tsx` — T01's upgraded layout with full site shell
- `src/components/layout/TerminalPanel.tsx` — T01's shared component
- `src/data/home.ts` — home page data (pure TypeScript, no changes needed)
- `src/data/personal.ts` — personal/about page data
- `src/data/resume.ts` — resume page data
- `src/data/domains/index.ts` — domain list for home page domain nav
- `src/lib/paths.ts` — route helpers (homePath, aboutPath, domainPath, etc.)
- `src/components/home/HomePage.astro` — source of truth for home page structure
- `src/components/personal/PersonalPage.astro` — source of truth for about page structure
- `src/components/resume/ResumePage.astro` — source of truth for resume page structure
- `src/styles/global.css` — source CSS for all component classes

## Expected Output

- `src/app/page.tsx` — real home page (replaces placeholder)
- `src/components/home/HomePage.tsx` — new server component
- `src/app/about/page.tsx` — new route file
- `src/components/personal/PersonalPage.tsx` — new server component
- `src/app/resume/page.tsx` — new route file
- `src/components/resume/ResumePage.tsx` — new server component
- `src/components/resume/CopyChip.tsx` — new `'use client'` component
- `src/app/globals.css` — extended with `.home-page*`, `.home-avatar*`, `.personal-page*`, `.resume-page*` CSS
