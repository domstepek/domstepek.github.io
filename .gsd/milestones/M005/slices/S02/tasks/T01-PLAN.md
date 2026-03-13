---
estimated_steps: 6
estimated_files: 6
---

# T01: Upgrade root layout and create Playwright public test skeleton

**Slice:** S02 — Public pages and notes pipeline
**Milestone:** M005

## Description

The root layout (`src/app/layout.tsx`) is a minimal stub from S01 — just `<html>`, `<body>`, and `{children}`. Every public page needs the full site shell matching `BaseLayout.astro`: skip-link, header with site-title link, `<main>` with structural classes, footer, and CRT overlay. The `TerminalPanel` shared component is needed by every page in S02. Existing S01 domain page components (`DomainGatePage`, `DomainProofPage`) have their own `site-main shell` wrapper that will double-nest once the layout provides it — these must be updated. Finally, the Playwright test skeleton defines the acceptance criteria upfront.

## Steps

1. **Create `src/components/layout/TerminalPanel.tsx`** — Server component with three traffic-light `<span>` elements in a `.terminal-panel__bar` div and `{children}` in a `.terminal-panel__body` div. Match the Astro version exactly.

2. **Upgrade `src/app/layout.tsx`** — Expand to full site shell:
   - Import `Link` from `next/link` and `siteConfig` from `@/data/site`
   - Add `<a className="skip-link" href="#main-content">skip to content</a>` before the shell
   - Add `<header className="site-header"><div className="shell site-header__inner"><Link className="site-title" href="/">{siteConfig.name}</Link></div></header>`
   - Wrap `{children}` in `<main id="main-content" className="site-main shell">`
   - Add `<footer className="site-footer"><div className="shell site-footer__inner"><p>minimal shell for systems, products, and tooling.</p></div></footer>`
   - Add `<div className="crt-overlay" aria-hidden="true" />` after `.site-shell` closing div
   - Keep Space Mono font link and `globals.css` import
   - Update default metadata: `title: { default: siteConfig.defaultTitle, template: \`%s | ${siteConfig.name}\` }`, `description: siteConfig.defaultDescription`

3. **Update `DomainGatePage.tsx` and `DomainProofPage.tsx`** — Remove `className="site-main shell"` from their outer wrapper divs. The layout now provides `<main className="site-main shell">` so these components should only have their data-attribute divs. Keep all `data-*` markers intact.

4. **Migrate CSS** — Copy `.crt-overlay` block (lines ~1023–1057) and `.terminal-panel*` blocks (lines ~1219–1250) from `src/styles/global.css` into `src/app/globals.css`, placed after the existing structural CSS.

5. **Create `tests/e2e/public.spec.ts`** — Write all 8 test cases with descriptive names:
   - Test 1: Home page has `[data-home-page]`, `[data-route-visibility="public"]`, `[data-gate-state="open"]`
   - Test 2: About page has `[data-personal-page]`, public boundary markers
   - Test 3: Resume page has `[data-resume-page]`, public boundary markers
   - Test 4: Public pages contain no gate markers (iterate home/about/resume, check absence of `data-protected-gate`, `data-gate-state="locked"`)
   - Test 5: Notes index has `[data-notes-index]` and at least one `[data-note-item]`
   - Test 6: Note detail has `[data-note-page]`, `[data-note-body]` with content
   - Test 7: Unknown route shows 404 content
   - Test 8: Notes routes have no gate markers

6. **Run gate regression** — `npx playwright test tests/e2e/gate.spec.ts` to confirm the layout change + domain component edits don't break existing tests. Also `npm run build`.

## Must-Haves

- [ ] Root layout renders skip-link, header, main, footer, CRT overlay
- [ ] `next/link` used for site-title href
- [ ] `TerminalPanel` server component with traffic-light dots and children slot
- [ ] `DomainGatePage` and `DomainProofPage` no longer have `site-main shell` class on their outer div
- [ ] `.crt-overlay` and `.terminal-panel*` CSS present in `globals.css`
- [ ] `tests/e2e/public.spec.ts` committed with 8 test cases
- [ ] Existing 5 gate tests pass
- [ ] `npm run build` exits 0

## Verification

- `npx playwright test tests/e2e/gate.spec.ts --reporter=list` → 5 passed
- `npm run build` → exits 0
- `curl -s http://localhost:3000/ | grep "site-header"` → confirms layout shell renders
- `curl -s http://localhost:3000/ | grep "crt-overlay"` → confirms CRT div present

## Observability Impact

- Signals added/changed: CRT overlay div (`aria-hidden="true"`) and skip-link are now in the HTML of every page — inspectable via curl
- How a future agent inspects this: `curl -s http://localhost:3000/ | grep -E "site-header|site-footer|crt-overlay|skip-link"` — all four should match
- Failure state exposed: Missing layout elements will cause Playwright test failures on page-specific markers that depend on the structural wrapper

## Inputs

- `src/app/layout.tsx` — S01 minimal stub (body + children only)
- `src/components/layout/BaseLayout.astro` — source of truth for layout structure
- `src/components/layout/TerminalPanel.astro` — source of truth for terminal panel
- `src/components/domains/DomainGatePage.tsx` — has `className="site-main shell"` to remove
- `src/components/domains/DomainProofPage.tsx` — has `className="site-main shell"` to remove
- `src/styles/global.css` — source CSS for `.crt-overlay` and `.terminal-panel*`
- `tests/helpers/site-boundary-fixtures.mjs` — selector vocabulary for test assertions

## Expected Output

- `src/app/layout.tsx` — full site shell with header, main, footer, CRT overlay, skip-link
- `src/components/layout/TerminalPanel.tsx` — new shared server component
- `src/components/domains/DomainGatePage.tsx` — modified (removed `site-main shell` class)
- `src/components/domains/DomainProofPage.tsx` — modified (removed `site-main shell` class)
- `src/app/globals.css` — extended with `.crt-overlay` and `.terminal-panel*` CSS
- `tests/e2e/public.spec.ts` — new test file with 8 test cases (most failing until T02–T04)
