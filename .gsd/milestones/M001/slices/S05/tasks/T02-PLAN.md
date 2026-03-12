# T02: Notes Collection and Starter Notes

**Slice:** S05
**Milestone:** M001

## Goal
The site now ships a lightweight notes system with two real field notes, a reverse-chronological index, and individual note pages that stay plain and text-forward.

## Must-Haves
- [x] The notes area behaves like lightweight field notes rather than a full blog or publishing platform.
- [x] Phase 5 ships with at least 2 starter field notes so the notes area reads like a real index instead of a single orphaned post.
- [x] The notes index is a simple reverse-chronological list where each entry shows title, summary, and date before sending the visitor into the detail page.
- [x] `src/content.config.ts` exists and provides Typed notes collection schema with explicit summary and published-date fields
- [x] `src/content/notes/systems-over-abstractions.md` exists and provides A starter field note with frontmatter summary and plain Markdown body

## Steps
1. Add `src/content.config.ts` with a `notes` collection that validates `title`, `summary`, `published`, and optional `updated`, then create the two starter notes `systems-over-abstractions.md` and `keep-the-path-explicit.md` under `src/content/notes/` using flat slugs and plain Markdown bodies. Keep the frontmatter summaries intentional instead of auto-generating excerpts, write the entries as short field notes rather than essay-length posts, and do not introduce tags, categories, MDX, or a second manual registry file.
2. Create `NotesIndexPage.astro` and `NotePage.astro`, then wire thin routes for `/notes/` and `/notes/[slug]/` through `BaseLayout`. Query the notes via `getCollection("notes")`, sort them explicitly by `published` descending before rendering, and emit stable `data-notes-index`, `data-note-item`, `data-note-title`, `data-note-summary`, `data-note-date`, and `data-note-link` markers on the index plus `data-note-page`, `data-note-title`, `data-note-date`, and `data-note-body` markers on the detail page. Render machine-readable `datetime` attributes for note dates, derive page metadata from note frontmatter, and keep local back links simple and base-aware.
3. Extend `src/styles/global.css` with the smallest set of note-specific rules needed for the notes index list, metadata line, note body wrapper, and any Markdown elements used by the starter notes. Preserve the site's existing text-forward rhythm, keep the notes pages plain and scan-friendly, and avoid blog chrome such as tags, cards, archive widgets, pagination, featured-image slots, or heavy article templates. Leave subjective readability and mobile-browser judgment to `05-VALIDATION.md`.

## Context
- Migrated from `.planning/milestones/v1.0-phases/05-personal-context-notes/05-02-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/05-personal-context-notes/05-02-SUMMARY.md`
- Related legacy requirements: PROF-01, PROF-02, PROF-03, NOTE-01, NOTE-02
