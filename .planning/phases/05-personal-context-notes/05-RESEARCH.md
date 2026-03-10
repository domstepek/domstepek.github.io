# Phase 5 Research: Personal Context & Notes

**Researched:** 2026-03-10
**Domain:** Astro personal-page routing, resume asset delivery, Markdown-backed notes, and dist-first static validation
**Confidence:** HIGH

## Phase Intent

Phase 5 should finish v1 with a small personal layer and a small writing layer, without changing the site's core information architecture. The goal is not to turn the homepage into a profile page or introduce a full blog. The goal is to add one dedicated personal surface plus a lightweight notes system that fits the existing minimal, static Astro build.

This phase should stay deliberately narrow:

- in scope: one dedicated personal page, a homepage teaser, explicit `how i work` and `open to` framing, resume access, a notes index, individual note pages, and phase-specific validation
- out of scope: CMS or database work, tags/search/pagination, a global nav rewrite, a generated PDF pipeline, and any attempt to turn notes into a full publishing platform

## Repo-Specific Instruction Files

No `CLAUDE.md`, `.claude/skills/**/SKILL.md`, or `.agents/skills/**/SKILL.md` files were found in the repo.

## User Constraints

Phase 5 already has locked discuss-phase context in `05-CONTEXT.md`, so planning should treat these as settled constraints:

- keep the site static Astro and GitHub Pages-safe
- keep the site minimal, text-forward, and lightweight
- keep the voice casual, direct, and lowercase
- keep the homepage domain-first, with personal context as a secondary route
- place the main personal layer on a dedicated page instead of making the homepage profile-heavy
- keep `how i work`, `open to`, and resume access as distinct sections on the same personal page
- frame `open to` as selectively open to the right fit, not broadly job-seeking
- keep notes as short field notes with title, summary, and date on a simple reverse-chronological index
- keep individual note pages plain and readable rather than styled like a blog theme

## Current-State Implications

- The shipped site currently has only three route surfaces: the homepage, the five domain pages, and the 404 page. Phase 5 is the first phase that adds a non-domain secondary route family.
- `src/components/layout/BaseLayout.astro` already owns metadata, canonical URLs, skip-link support, and the shared shell. New routes should only need page metadata plus page-body components.
- The repo already prefers thin route files that pass data into page components: `src/pages/index.astro` renders `HomePage`, and `src/pages/domains/[slug].astro` renders `DomainPage`. Phase 5 should preserve that pattern.
- `src/lib/paths.ts` is the established source of truth for internal and asset URLs. Adding `about`, `notes`, and resume links directly in templates would work technically, but it would skip the base-path safety the repo already standardized.
- `src/data/home.ts` owns homepage-specific copy. That makes it the natural place for the new homepage teaser copy, even if the teaser links to a separate personal data source.
- `src/styles/global.css` already contains the full text-first rhythm plus page-specific section treatments. Phase 5 should extend that baseline instead of creating a second visual system.
- Public assets are already handled by `assetPath()` and shipped via `public/`, with Phase 4 visuals under `public/highlights/...`. That is the clearest existing precedent for a local resume PDF.
- No notes data source exists today, and no `src/content.config.ts` exists yet. Notes are the first part of this repo that genuinely wants repeated authored text entries with their own pages.
- `tsconfig.json` already extends `astro/tsconfigs/strict`, which Astro documents as a valid TypeScript baseline for content collections. Phase 5 does not need TS config cleanup first.
- The current validation flow is already dist-first and aggregate: `package.json` chains `validate:phase1` through `validate:phase4` inside `validate:site`. Phase 5 should slot into that same gate rather than inventing a second release path.
- There is still no persistent site-wide nav beyond the site title and existing local back links. Discoverability should come from a homepage teaser and a few local cross-links, not from a shell rewrite.

## Standard Stack

Phase 5 should stay on the repo's current stack, with one deliberate addition for notes:

- `Astro` static routes and components
- TypeScript data modules for homepage and personal-page copy
- Astro content collections plus Markdown for note entries
- plain CSS in `src/styles/global.css`
- Node-based dist-first validators in `scripts/`
- local `public/` assets for any resume PDF
- the existing GitHub Actions Pages workflow and `validate:site` aggregate gate

Planning recommendation:

- keep the dedicated personal page on the existing typed data-module pattern
- use Astro content collections for the notes area
- keep the resume self-hosted as a local static asset unless there is a strong reason not to

Why this is the best fit now:

- a single personal page does not justify a new authoring system
- notes do justify first-class content handling because they are multi-entry, text-heavy, and likely to expand in v2
- Astro content collections are built-in, type-safe, and compatible with static GitHub Pages builds
- this avoids both extremes: no awkward note bodies inside TS strings, and no mid-phase migration of existing domain/home data into a new content platform

## Architecture Patterns

### 1. Keep the homepage domain-first and add one light personal teaser

The homepage should stay the map into the five domains. Personal context should become a secondary route, not the new hero. The safest placement is a short teaser section below the domain navigation and above or alongside the current contact/freshness cluster.

Recommended route shape:

- `/about/` for the dedicated personal page
- `/notes/` for the notes index
- `/notes/[slug]/` for note detail pages

Why `/about/` is the strongest default:

- it is conventional and easy to find
- it does not sound like a second homepage
- it can hold `how i work`, `open to`, and `resume` without implying a broader portfolio restructure

Homepage recommendation:

- add one short section with 1 to 2 sentences and a clear link to `/about/`
- do not move `how i work` copy or the notes list onto the homepage
- do not add a large global nav just to surface this phase

A small local cross-link from `/about/` to `/notes/` is useful. A shell-level nav change is probably not necessary yet.

### 2. Model the personal page as one typed data module plus one shared component

The repo already favors thin route files and typed data-backed page components. Phase 5 should follow that pattern for the personal page rather than hardcoding long copy directly in `src/pages/about.astro`.

Recommended files:

- `src/data/personal.ts`
- `src/components/personal/PersonalPage.astro`
- `src/pages/about.astro`

Recommended `PersonalPageData` shape:

- `lead`
- `howIWork`
- `openTo`
- `resume`
- `seo`

Recommended `howIWork` shape:

- a short intro sentence
- three short labeled entries for `systems`, `product`, and `collaboration`

Recommended `openTo` shape:

- one plain-language intro paragraph
- a short list of role modes such as full-time, contract, or fractional
- a short list of problem spaces or environments that fit best
- light boundaries or filters, kept brief

Recommended `resume` shape:

- link label
- href
- format (`pdf` or `html`)
- optional update note

Why this fits:

- `PROF-01` explicitly wants systems, product, and collaboration coverage, so a typed three-part shape keeps that from turning vague
- the page is small enough that TS-backed structured copy is simpler than a full content authoring system
- keeping SEO fields in the same module mirrors the existing `src/data/home.ts` pattern

### 3. Use an Astro content collection for notes, not a hand-rolled note registry

Notes are the first feature in this repo that really wants one file per entry plus individual pages. This is where Astro's built-in content collections become worth introducing.

Recommended content architecture:

- add `src/content.config.ts`
- add a `notes` collection backed by `src/content/notes/*.md`
- use a flat slug space for v1
- render the notes index from `getCollection("notes")`
- render each note page by `getStaticPaths()` plus `render(entry)`

Recommended note frontmatter fields:

- `title`
- `summary`
- `published`
- optional `updated`

Keep the body plain Markdown. Do not introduce MDX, tags, or related-note references in this phase unless a note genuinely needs them.

Why content collections are the better Phase 5 choice:

- they validate note metadata with a schema
- they let the repo render Markdown bodies cleanly without storing long strings in TS modules
- they match the likely v2 direction for `NOTE-03` tags or broader archive growth
- they are built into Astro, so this is not a new third-party platform decision

Important Astro nuance from the docs:

- `getCollection()` order is non-deterministic, so the notes list must be sorted manually by date
- the plan should make that explicit up front instead of assuming file order

### 4. Keep the notes UI intentionally small and explicit

The notes area should feel like field notes, not a blog theme.

Recommended notes index shape:

- page intro
- reverse-chronological list
- each item shows title, summary, and date
- each item links directly to its note page

Recommended note page shape:

- title
- date
- optional one-sentence deck or intro if useful
- Markdown body inside one readable article wrapper
- light back link to `/notes/`

Good defaults for v1:

- start with at least 2 real notes if possible, even though the validator only needs 1 or more
- keep slugs flat, for example `/notes/systems-over-abstractions/`
- use summary frontmatter instead of auto-generating excerpts from body content

Why summary frontmatter is better than excerpt generation:

- it satisfies `NOTE-01` explicitly
- it gives the planner control over index density and tone
- it keeps validation simple and deterministic

### 5. Treat the resume as a local static asset by default

The cleanest Phase 5 resume delivery is a self-hosted PDF copied from `public/` and linked from the personal page via `assetPath()`.

Preferred option:

- `public/resume/dom-stepek-resume.pdf`
- link to it from the personal page
- keep the URL stable even if the file is updated later

Why this is the best default:

- Astro's docs explicitly call `public/` the place for untouched static files and assets such as PDFs
- `assetPath()` keeps the link GitHub Pages base-path safe
- dist-first validation can assert that the linked file actually exists in the built output

Acceptable fallback:

- a simple `/resume/` HTML page if there is no PDF available yet

Avoid as the primary v1 path:

- an external Drive, Dropbox, or LinkedIn resume URL
- a custom PDF generation or print-CSS pipeline

Planning nuance:

- `PROF-02` says the resume should be accessible in one click from the site, while the captured Phase 5 context centers the resume on the personal page
- decide early whether the phase interprets that as "one click from `/about/`" or "one click from the homepage or global chrome"
- if the stricter reading matters, a small secondary resume link in the homepage teaser is the lowest-churn way to satisfy it without making the homepage profile-heavy

## Likely Files To Touch

Very likely:

- `src/lib/paths.ts`
- `src/data/home.ts`
- `src/components/home/HomePage.astro`
- `src/styles/global.css`
- `package.json`
- `scripts/validate-phase5.mjs`

Very likely new files:

- `src/data/personal.ts`
- `src/components/personal/PersonalPage.astro`
- `src/pages/about.astro`
- `src/content.config.ts`
- `src/content/notes/*.md`
- `src/components/notes/NotesIndexPage.astro`
- `src/components/notes/NotePage.astro`
- `src/pages/notes/index.astro`
- `src/pages/notes/[slug].astro`

Likely when the preferred resume path is used:

- `public/resume/dom-stepek-resume.pdf`

Possibly helpful but not required:

- `src/data/site.ts` only if a small metadata default or shared page-description helper becomes useful
- `astro.config.mjs` is probably untouched; content collections do not require a config change there for this phase
- `.github/workflows/deploy.yml` should stay untouched if `validate:site` remains the aggregate gate

## Likely Sequencing Implications

The safest implementation order is:

1. Lock the route names, note content model, and resume delivery choice before writing UI markup.
2. Extend `src/lib/paths.ts` with `aboutPath`, `notesPath`, and `notePath()` so every new link stays base-aware from the start.
3. Implement the personal page plus homepage teaser end to end.
4. Implement one note through the full notes pipeline: collection schema, index rendering, detail page, and note-body wrapper.
5. Add the remaining starter notes once the index/detail pattern feels right.
6. Do the CSS pass after the longest real copy and the first note body exist.
7. Add the Phase 5 dist-first validator and extend `validate:site`.
8. Run browser-level smoke checks after the automated gate is green.

Why this order matters:

- the main risk is not the route count; it is locking the right content model and copy density before multiplying it
- one pilot note is the fastest way to confirm whether the collection schema, Markdown wrapper, and summary shape are right
- the validator should be written after the final markers and link conventions are stable

## Don't Hand-Roll

Phase 5 should not invent new systems for problems Astro or the repo already solve well.

Do not hand-roll:

- a CMS, remote content loader, or database-backed notes system
- a custom Markdown registry in TypeScript just to avoid using Astro content collections
- tag filtering, search, pagination, or archive-by-year navigation in v1
- a site-wide nav overhaul when a homepage teaser and local cross-links can do the job
- a PDF build or generation pipeline for the resume
- hardcoded `/website/...` paths in templates or data
- source-coupled validation that reads collection files directly when built HTML can prove the same behavior

Use the existing primitives instead:

- `BaseLayout`
- thin route files
- `src/data/home.ts` and a new `src/data/personal.ts`
- `routePath()` and `assetPath()` helpers
- Astro content collections and Markdown for notes
- one new dist-first validator inside `scripts/`

## Common Pitfalls

### 1. The homepage stops being domain-first

If the personal teaser turns into a second hero or a large profile block, Phase 3's positioning work gets diluted.

Mitigation:

- keep the teaser short
- place it below the domain nav
- make `/about/` the destination for the fuller copy

### 2. The personal page turns into a biography instead of a working profile

Long autobiographical narrative will satisfy the "personal" idea while missing the actual requirements.

Mitigation:

- make `how i work` explicitly about systems, product, and collaboration
- keep `open to` concrete about roles, engagement types, and fit
- keep the page segmented and scannable

### 3. Notes become an accidental blog platform

Adding tags, categories, featured images, pagination, or elaborate post chrome will burn time without helping `NOTE-01` or `NOTE-02`.

Mitigation:

- keep the route family flat
- keep the schema minimal
- defer tags, search, and archive features to `NOTE-03`

### 4. Notes render in the wrong order

Astro's docs call out that `getCollection()` ordering is non-deterministic. If the planner assumes file order, the index can drift across platforms or after file changes.

Mitigation:

- sort notes explicitly by `published` descending
- use machine-readable `datetime` attributes on the rendered dates
- validate the built index ordering if it becomes part of the locked Phase 5 behavior

### 5. The resume link breaks under the base path or points somewhere weakly owned

A broken or off-site resume link undercuts the "one click" requirement quickly.

Mitigation:

- prefer a local PDF in `public/`
- resolve it through `assetPath()`
- validate the emitted href and, for local assets, the file's existence in `dist`

### 6. Validation only checks the notes index and misses broken note pages

It is easy to prove that the list exists while missing that one or more note detail routes do not render correctly.

Mitigation:

- make the validator follow each note link discovered in built `dist/notes/index.html`
- validate the target note artifacts and their core content markers

### 7. Markdown exposes styling gaps that the current site rarely hits

The current global CSS already handles headings, paragraphs, lists, links, and images, but notes may introduce blockquotes, code fences, or denser heading stacks.

Mitigation:

- either constrain v1 notes to simple prose, lists, and links
- or add a small `.note-page` prose wrapper with only the missing element styles
- do not add a generic blog theme just to solve a couple of Markdown elements

## Validation Architecture

Phase 5 should follow the same dist-first strategy as Phases 1 through 4. Validate emitted HTML and emitted assets in `dist`, not source templates or raw content files, so the release gate stays aligned with what GitHub Pages will publish.

### Automated Verification

Recommended commands:

- `pnpm check`
- `pnpm build`
- `node ./scripts/validate-phase5.mjs`
- `pnpm validate:site`

Recommended new validation entry:

- add `scripts/validate-phase5.mjs`
- add `validate:phase5` in `package.json`
- extend `validate:site` to run `validate:phase1`, `validate:phase2`, `validate:phase3`, `validate:phase4`, and `validate:phase5`

Recommended markers:

Homepage:

- `data-home-personal-teaser`
- `data-home-personal-link`
- optional `data-home-resume-link` if the stricter `PROF-02` interpretation is chosen

About or personal page:

- `data-personal-page`
- `data-how-i-work`
- `data-how-i-work-systems`
- `data-how-i-work-product`
- `data-how-i-work-collaboration`
- `data-open-to`
- `data-resume-link`

Notes index:

- `data-notes-index`
- `data-note-item`
- `data-note-title`
- `data-note-summary`
- `data-note-date`
- `data-note-link`

Note detail page:

- `data-note-page`
- `data-note-body`

Recommended Phase 5 artifact assertions:

- the about page exists at `dist/about/index.html`
- the notes index exists at `dist/notes/index.html`
- the homepage exposes exactly one personal teaser section and a base-aware link to the about page
- the about page has a non-empty `how i work` section plus non-empty systems, product, and collaboration sub-markers
- the about page has a non-empty `open to` section
- the about page exposes a resume link
- if the resume href is local, it uses the expected base-aware asset path and the PDF exists in `dist`
- if the resume href is remote, it uses an absolute `https:` URL
- the notes index renders at least one note item
- every note item has non-empty title, summary, and date text
- every note link resolves to a base-aware `/notes/<slug>/` path
- every linked note artifact exists in `dist`
- every note detail page exposes a non-empty title, date, and body marker
- note pages derive metadata from note content, at minimum title and summary or description

Strong dist-first pattern for notes:

- parse the built notes index
- collect the rendered note hrefs from `data-note-link`
- derive the expected `dist` artifact path for each href
- validate those built note pages directly

Important validation nuance:

- do not couple the validator to the notes collection source if the index HTML already exposes the same facts
- do not make the validator judge copy quality; it should prove structure and path correctness
- if reverse-chronological ordering is treated as locked behavior, validate it from rendered `datetime` attributes rather than from file names

### Manual Verification

Required browser-level checks after the automated gate is green:

- confirm the homepage still reads as a domain map first, with the personal teaser clearly secondary
- confirm the personal page is easy to scan and does not feel like a biography dump
- confirm `how i work` clearly covers systems, product, and collaboration in plain language
- confirm the `open to` section feels selective and concrete, not vague or actively job-seeking
- confirm the resume opens successfully in one click from the chosen Phase 5 surface
- confirm the notes index is easy to skim and the summaries do real work
- confirm every note detail page feels plain, readable, and text-forward on mobile and desktop widths
- tab through the new links and content to confirm focus states, reading order, and keyboard navigation remain solid

Preferred execution path:

- use `/agent-browser --native` first for browser-accessible smoke checks before escalating remaining copy or tone judgment to manual review

### Requirement Coverage Map

- `PROF-01`: the about page exposes a `how i work` section with explicit systems, product, and collaboration coverage
- `PROF-02`: the site exposes a resume link that resolves correctly from the chosen Phase 5 surface
- `PROF-03`: the about page exposes concrete `open to` copy about roles, collaborations, or opportunities
- `NOTE-01`: the notes index renders note items with title, summary, and date
- `NOTE-02`: each note item links to a static note detail page that renders correctly

## Code Examples

### Suggested path helpers

```ts
export const aboutPath = routePath("about");
export const notesPath = routePath("notes");
export const notePath = (slug: string) => routePath("notes", slug);
export const resumePath = assetPath("resume/dom-stepek-resume.pdf");
```

### Suggested personal-page data shape

```ts
export interface PersonalPageData {
  lead: string;
  howIWork: {
    intro?: string;
    principles: Array<{
      key: "systems" | "product" | "collaboration";
      title: string;
      body: string;
    }>;
  };
  openTo: {
    intro: string;
    roles: string[];
    problemSpaces: string[];
    boundaries?: string[];
  };
  resume: {
    href: string;
    label: string;
    format: "pdf" | "html";
    note?: string;
  };
  seo: {
    title: string;
    description: string;
  };
}
```

### Suggested notes collection config

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { notes };
```

### Suggested notes query pattern

```ts
const notes = (await getCollection("notes")).sort(
  (left, right) => right.data.published.valueOf() - left.data.published.valueOf(),
);
```

### Suggested about-page section shape

```astro
<section aria-labelledby="how-i-work-heading" data-how-i-work>
  <h2 id="how-i-work-heading">how i work</h2>
  <div data-how-i-work-systems>
    <h3>systems</h3>
    <p>{/* short copy */}</p>
  </div>
  <div data-how-i-work-product>
    <h3>product</h3>
    <p>{/* short copy */}</p>
  </div>
  <div data-how-i-work-collaboration>
    <h3>collaboration</h3>
    <p>{/* short copy */}</p>
  </div>
</section>
```

## Planning Takeaway

Phase 5 is best planned as "add one modest about surface plus one small, Markdown-backed notes system," not "rebrand the homepage" and not "launch a blog." The current repo already has the right shell, path helpers, metadata contract, and dist-first validation pattern. The planner should keep the personal page in the existing typed data and component architecture, use Astro content collections only where notes genuinely need them, prefer a local PDF resume under `public/`, and extend the shared `validate:site` gate with a Phase 5 validator that follows rendered note links through built artifacts. That will satisfy `PROF-01` through `NOTE-02` without undoing the static, minimal, domain-first architecture the first four phases established.

---

*Phase: 05-personal-context-notes*
*Research completed: 2026-03-10*
*Ready for planning: yes*
