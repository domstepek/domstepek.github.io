# T01: About Surface and Homepage Teaser

**Slice:** S05
**Milestone:** M001

## Goal
A dedicated about page, stable resume anchor, and secondary homepage teaser now add personal context without pulling the homepage away from the domain map.

## Must-Haves
- [x] The site gets one dedicated personal surface at `/about/` with a light local path into `/notes/`, while the homepage stays domain-first and only adds a short secondary teaser that routes into the fuller profile.
- [x] `how i work`, `open to`, and `resume` remain three distinct, scannable sections on the same personal page, with explicit systems, product, and collaboration coverage plus selectively-open opportunity framing.
- [x] A visitor can reach the resume in one click from the site and land on a stable on-page resume section without leaving the repo-owned site surface.
- [x] `src/lib/paths.ts` exists and provides Base-aware helpers for the about page, notes routes, and the resume-section anchor path
- [x] `src/data/home.ts` exists and provides Compact homepage teaser copy that keeps personal framing secondary to the domain map

## Steps
1. Add `aboutPath`, `notesPath`, `notePath()`, and `resumePath` to `src/lib/paths.ts`, with `resumePath` resolving to the dedicated resume section anchor on `/about/` so the requirement stays one-click accessible without a separate asset dependency. Extend `src/data/home.ts` with a compact `personalTeaser` object and small direct-resume CTA copy, then create `src/data/personal.ts` with typed lowercase copy for `lead`, `howIWork`, `openTo`, `resume`, and `seo`. Keep `howIWork` explicitly split into systems, product, and collaboration, keep `openTo` concrete about full-time plus contract or fractional work, and shape `resume` as structured on-page content instead of assuming a user-supplied PDF already exists.
2. Create `PersonalPage.astro` so it renders a short lead plus three distinct sections: `how i work`, `open to`, and `resume`, plus a small local link into `/notes/` that keeps the writing surface easy to find without expanding the homepage. Emit stable `data-personal-page`, `data-how-i-work`, `data-how-i-work-systems`, `data-how-i-work-product`, `data-how-i-work-collaboration`, `data-open-to`, `data-resume-section`, and `data-personal-notes-link` markers, give the resume section a stable `id` that `resumePath` can target directly, and keep the page segmented, plain-language, and text-forward rather than biographical or card-heavy. Create `src/pages/about.astro` as a thin route under `BaseLayout`, add only the supporting global CSS needed for readable section rhythm, and ensure the about page itself acts as the canonical v1 personal surface.
3. Insert one short teaser section below the domain navigation and above the contact or freshness cluster, using 1 to 2 sentences, a clear link to `/about/`, and a small direct resume link to `resumePath`. Keep the teaser visually and structurally secondary to the five domain links so the homepage remains the domain map first. Emit `data-home-personal-teaser`, `data-home-personal-link`, and `data-home-resume-link` markers.

## Context
- Migrated from `.planning/milestones/v1.0-phases/05-personal-context-notes/05-01-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/05-personal-context-notes/05-01-SUMMARY.md`
- Related legacy requirements: PROF-01, PROF-02, PROF-03, NOTE-01, NOTE-02
