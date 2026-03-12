# S05: Personal Context & Notes — completed 2026 03 09

**Goal:** Complete v1 with `how i work`, resume and `open to` framing, and lightweight notes.
**Demo:** A short `how i work` section explains Dom's approach to systems, product, and collaboration in plain language.

## Must-Haves
- A short `how i work` section explains Dom's approach to systems, product, and collaboration in plain language.
- A resume is accessible from the site in one click.
- The site explicitly states what roles, collaborations, or opportunities Dom is open to.
- The notes area provides a lightweight index with short summaries.
- Each note listed in the index opens to an individual note page.

## Tasks

- [x] **T01: About Surface and Homepage Teaser**
  A dedicated about page, stable resume anchor, and secondary homepage teaser now add personal context without pulling the homepage away from the domain map.

- [x] **T02: Notes Collection and Starter Notes**
  The site now ships a lightweight notes system with two real field notes, a reverse-chronological index, and individual note pages that stay plain and text-forward.

- [x] **T03: Dist-First Personal and Notes Validation**
  Phase 5 now has a dist-first validator plus an expanded `validate:site` gate that proves the homepage teaser, about page, notes index, and note detail routes from built output.

## Files Likely Touched
- src/lib/paths.ts
- src/data/home.ts
- src/data/personal.ts
- src/components/home/HomePage.astro
- src/components/personal/PersonalPage.astro
- src/pages/about.astro
- src/styles/global.css
- src/content.config.ts
- src/content/notes/systems-over-abstractions.md
- src/content/notes/keep-the-path-explicit.md
- src/components/notes/NotesIndexPage.astro
- src/components/notes/NotePage.astro
- src/pages/notes/index.astro
- src/pages/notes/[slug].astro
- scripts/validate-phase5.mjs
