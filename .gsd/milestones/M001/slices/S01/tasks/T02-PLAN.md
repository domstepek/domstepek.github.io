# T02: Accessible Shell and Metadata Baseline

**Slice:** S01
**Milestone:** M001

## Goal
Shared Astro layout with centralized metadata, readable global CSS, a sparse homepage, a real noindex 404 page, and shared favicon/OG defaults

## Must-Haves
- [x] All Phase 1 pages share one layout that emits a non-empty `<title>`, `meta name="description"`, `link rel="canonical"`, `meta property="og:title"`, `meta property="og:description"`, `meta property="og:image"`, and favicon link from one centralized metadata API.
- [x] The homepage and 404 page build into real static HTML with a visible skip link, readable line length and spacing, obvious link treatment, and `:focus-visible` keyboard focus states.
- [x] The 404 page is a real static page with `noindex` metadata and a base-aware route back to the homepage.
- [x] `src/components/layout/BaseLayout.astro` exists and provides Shared shell, metadata defaults, and accessibility landmarks
- [x] `src/components/layout/BaseLayout.astro` exists and provides Page title wiring

## Steps
1. Build a `BaseLayout` that owns the document shell and accepts `title`, `description`, `canonicalPath`, `ogImage`, and `noindex`. Set document language, add `header`, `main`, and `footer` landmarks, and include a visible skip link. Create global CSS tuned for text-forward reading: system font stack, comfortable font sizing and line height, readable max width, strong contrast, touch-friendly spacing, link treatment that does not rely on color alone, and visible keyboard focus states. Do not optimize only for a tiny hero; the shell must still work for longer domain pages in later phases.
2. Replace any placeholder scaffold content with an intentionally sparse homepage that is only rich enough to verify semantics, typography, and metadata flow. Add a real `404.astro` that uses the same layout, sets `noindex`, and includes a clear link back to the homepage through `homePath`. Keep copy minimal and do not pull final homepage positioning, domain navigation, or flagship content from later phases into this plan.
3. Create a simple favicon and a default Open Graph image that match the minimal aesthetic, then wire them through the centralized metadata flow instead of page-by-page references. Keep the assets deliberately simple and dependable, and ensure the layout references them through shared helpers so they remain valid under a non-root base path.

## Context
- Migrated from `.planning/milestones/v1.0-phases/01-publishing-foundation/01-02-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/01-publishing-foundation/01-02-SUMMARY.md`
- Related legacy requirements: QUAL-01, QUAL-02, QUAL-03, QUAL-04
