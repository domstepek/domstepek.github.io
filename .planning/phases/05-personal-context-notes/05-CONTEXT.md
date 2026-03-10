# Phase 5: Personal Context & Notes - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete v1 with a dedicated personal layer plus a lightweight notes area. This phase should add `how i work`, resume access, and `open to` framing without overwhelming the existing domain-first homepage, and it should introduce a notes index plus individual note pages without turning the site into a full blog or publishing system.

</domain>

<decisions>
## Implementation Decisions

### Personal-context placement and density
- The main personal layer should live on a dedicated personal page rather than making the homepage profile-heavy.
- That personal page should be moderate in depth: a few clearly separated sections, still easy to scan quickly.
- The homepage should include a light teaser for the personal page below the domain navigation so the domains remain the primary route through the site.
- `how i work`, resume, and `open to` should be distinct sections on the same personal page rather than merged into one long block or split across multiple destinations.

### Open to framing
- Explicitly say that the site owner is open to full-time roles plus contract or fractional work.
- Describe opportunities using both job-title language and problem-space language.
- Include light boundaries or filters so the right people can self-select, but avoid a long exclusion list.
- The tone should read as selectively open to the right fit rather than actively job-seeking.

### Notes format and depth
- Notes should feel like short field notes, not full essays by default.
- The notes index should show title, short summary, and date for each note.
- The notes index should be a simple reverse-chronological list.
- Individual note pages should stay plain and text-forward, with only light framing such as a date and short intro.

### Claude's Discretion
- Exact route names and navigation labels for the personal page and notes area, as long as they stay easy to find and consistent with the site's minimal structure.
- Exact resume delivery format, as long as the resume is reachable in one click from the personal page and stays compatible with the site's text-forward style.
- Exact copy phrasing, number of starter notes, and CSS treatment for the homepage teaser and personal-page sections.

</decisions>

<specifics>
## Specific Ideas

- Keep the homepage domain-first; personal context should be easy to find, but clearly secondary to the domain map.
- The personal page should read like a moderate, segmented profile rather than a deep autobiographical narrative.
- Notes should read like lightweight field notes with enough summary context to scan from the index quickly.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layout/BaseLayout.astro`: shared shell, metadata handling, header, footer, and skip-link support for any new personal or notes routes.
- `src/data/home.ts`: current homepage copy model and the natural place to add a light teaser or supporting metadata for the personal layer.
- `src/components/home/HomePage.astro`: existing homepage structure where a personal teaser can slot below the domain navigation without replacing the domain-first flow.
- `src/styles/global.css`: established text-forward spacing, headings, link styles, and focus states that can support personal and notes pages without a new visual system.
- `src/lib/paths.ts`: base-aware route and asset helpers needed for GitHub Pages-safe personal, notes, and resume links.
- `src/data/site.ts`: centralized metadata defaults for any new routes or resume asset references.

### Established Patterns
- The site currently uses thin page routes with page-specific data and the shared `BaseLayout`, instead of pushing page logic into route files.
- Homepage content is intentionally lightweight and data-driven, so the personal layer should be introduced as a secondary teaser rather than a homepage takeover.
- Existing pages are sectioned by headings, stay text-forward, and avoid card-heavy or JS-driven interaction patterns.
- The repo does not yet have a notes content source, a personal page route, or a resume asset, so Phase 5 will define those patterns within the current static Astro structure.

### Integration Points
- New personal and notes routes will plug into `src/pages/` alongside the homepage and domain routes.
- Homepage teaser placement should connect through `src/components/home/HomePage.astro` and likely be sourced from `src/data/home.ts` or a new adjacent data module.
- The personal page can reuse the existing moderate-section pattern already proven on the homepage and domain pages while staying distinct from the domain hubs.
- Notes index and note pages will need a simple static content source and route shape that remain compatible with the current build and shared validation workflow.

</code_context>

<deferred>
## Deferred Ideas

- Theme or tag-based browsing for notes stays deferred to a later notes-expansion phase.
- Splitting the personal layer into multiple dedicated profile pages stays out of scope unless a later phase needs more depth than one personal page can hold.

</deferred>

---

*Phase: 05-personal-context-notes*
*Context gathered: 2026-03-10*
