# Phase 4 Research: Flagship Proof & Visuals

**Researched:** 2026-03-10
**Domain:** Astro domain-page flagship modeling, optional visuals, and dist-first static validation
**Confidence:** HIGH

## Phase Intent

Phase 4 should deepen the five domain pages with real proof, not change the site's information architecture. The goal is to add one to two flagship stories per domain that explain the problem, role, constraints, decisions, outcome, and stack in a scannable way, with visuals only where they genuinely help.

This phase should stay deliberately narrow:

- in scope: inline flagship sections on existing domain pages, structured flagship data, optional visuals, and phase-specific validation
- out of scope: standalone case-study routes, a new `/projects/` or `/flagships/` index, homepage rewrites, and Phase 5 personal-context or notes work

## Repo-Specific Instruction Files

No `CLAUDE.md`, `.claude/skills/**/SKILL.md`, or `.agents/skills/**/SKILL.md` files were found in the repo.

## User Constraints

No `04-CONTEXT.md` exists for Phase 4 yet, so there are no additional locked discuss-phase decisions. Existing project artifacts still constrain the work:

- keep the site static Astro and GitHub Pages-safe
- keep the site minimal, text-forward, and lightweight
- keep the voice casual, direct, and lowercase
- keep the information architecture domain-first
- keep flagship proof inline on domain pages for v1; standalone case-study routes remain a v2 escape hatch through `CASE-01` and `CASE-02`
- keep visuals purposeful; no decorative gallery treatment or novelty interaction

## Current-State Implications

- The shipped site already has the stable Phase 2 and Phase 3 architecture: `src/pages/domains/[slug].astro` resolves one typed `DomainEntry`, and `src/components/domains/DomainPage.astro` renders the shared domain page pattern.
- `src/data/domains/types.ts` currently models only thesis, scope, and `supportingWork`. There is no highlight or visual schema yet, so Phase 4's main architecture choice is how to deepen the existing domain modules without breaking the shared registry.
- The homepage now consumes the same ordered `domains` registry. That means Phase 4 should preserve the existing `summary`, `title`, and slug structure instead of migrating content into a second system that the homepage does not use.
- The original repo-wide research recommended content collections for domains and highlights, but the implemented repo intentionally chose TypeScript data modules. Planning should respect the shipped pattern and avoid a midstream content-platform migration unless a pilot flagship proves TS objects are genuinely too rigid.
- `src/styles/global.css` already contains the site-wide rhythm plus domain-page styling. Phase 4 should extend that baseline with one flagship section treatment rather than introducing cards, tabs, or JS-driven layouts.
- `src/lib/paths.ts` already provides `domainPath()`, `homePath`, and `assetPath()`. `assetPath()` is the natural base-aware helper for any new screenshot or diagram paths if visuals are stored under `public/`.
- `validate:site` already chains `validate:phase1`, `validate:phase2`, and `validate:phase3`, and `.github/workflows/deploy.yml` already runs it after build. Phase 4 can slot into the same release gate by adding `validate:phase4` and widening the aggregate script.
- There is no existing highlight asset convention. Phase 4 is the first phase that needs content-specific visuals, so the plan should explicitly choose where those files live and how they are referenced.
- The existing `supportingWork` lists already give the planner a strong shortlist of likely flagship candidates per domain. That means Phase 4 does not need to rediscover the domain mapping from scratch; it mostly needs to choose which existing supporting examples graduate into deeper proof.

## Standard Stack

Phase 4 should stay on the repo's current stack:

- `Astro` static routes and components
- TypeScript data modules under `src/data/domains/`
- plain CSS in `src/styles/global.css`
- Node-based dist-first validators in `scripts/`
- the existing GitHub Actions Pages workflow and `validate:site` aggregate gate

Planning recommendation:

- keep flagship content in the existing domain TS modules for this phase
- keep visuals as static assets under `public/highlights/<domain>/<flagship>/...` and resolve them with `assetPath()`
- do not add a client framework, image gallery library, CMS, or separate content authoring system just to land 5 to 10 flagship stories

Why this is the best fit now:

- there are only five domains and one to two flagships per domain
- the repo already proved the typed-domain registry pattern through both domain pages and homepage navigation
- moving to content collections in Phase 4 would create migration risk across working code without directly satisfying `HIGH-01` through `HIGH-04`

## Architecture Patterns

### 1. Extend the existing `DomainEntry` model instead of replacing it

The most repo-aligned Phase 4 move is to add a `flagships` array to `DomainEntry` and keep each domain module as the single source of truth for both lighter supporting work and deeper flagship proof.

Recommended additional types:

- `FlagshipHighlight`
- `FlagshipVisual`

Recommended `FlagshipHighlight` fields:

- `slug` for stable ids, anchors, and future route flexibility
- `title`
- `summary` or `oneLiner` for quick-scan value
- `problem`
- `role`
- `constraints: string[]`
- `decisions: string[]`
- `outcomes: string[]`
- `stack: string[]`
- `proofLinks?: ProofLink[]`
- `visual?: FlagshipVisual`

Recommended `FlagshipVisual` fields:

- `src`
- `alt`
- optional `caption`

Why this shape fits:

- it maps directly to `HIGH-02` and `HIGH-03`
- lists keep the story scannable instead of forcing a long narrative blob
- `slug` gives Phase 4 stable anchors now and leaves room for v2 standalone case studies later
- reusing `ProofLink` keeps outbound proof consistent with Phase 2

### 2. Keep flagships inline on the domain page

The domain page should remain the visitor's main deep-dive surface in v1. A flagship is a richer section inside a domain page, not a new route family.

Recommended top-to-bottom page shape after Phase 4:

1. `back home`
2. `h1` plus thesis
3. `what belongs here` bullets plus scope line
4. `flagship highlights`
5. `supporting work`
6. `nearby domains`

Why this ordering works:

- the Phase 2 boundary explanation still orients the visitor before the deeper stories start
- the flagship section becomes the proof layer directly under the domain definition
- supporting work stays as lighter additional evidence rather than competing with the flagship section

Component recommendation:

- start by extending `src/components/domains/DomainPage.astro`
- if the markup becomes noisy, extract only the flagship section into `src/components/domains/FlagshipHighlights.astro`
- do not split the page into many tiny subsection components unless real repetition appears

### 3. Use a repeated scannable flagship pattern, not freeform mini-essays

A flagship should read as a compact evidence block. The safest shared pattern is:

- title
- one-line summary
- problem
- role
- constraints
- decisions
- outcome
- stack
- optional proof links
- optional visual

That structure keeps the strongest proof visible without requiring the visitor to read a long prose narrative. It also gives the validator clear structural targets.

### 4. Treat visuals as optional structured content

`HIGH-04` is conditional: visuals are needed where they materially improve understanding, not on every highlight. Plan for a structured optional visual object instead of a universal visual section.

Recommended visual rules:

- use a single screenshot or diagram per flagship by default
- render it with semantic `<figure>`, `<img>`, and optional `<figcaption>`
- keep alt text required whenever a visual exists
- keep captions short and explanatory
- prefer screenshots for UI-heavy stories and diagrams for platform or architecture stories
- keep visuals in the reading flow; no carousel, modal, lightbox, or zoom system

A good default path convention is:

- `public/highlights/<domain-slug>/<flagship-slug>/<filename>`

Why `public/` is the better Phase 4 default:

- the repo already uses public assets plus `assetPath()` for base-aware URLs
- dist-first validation can check the emitted `img src` without guessing Astro's transformed asset names
- it avoids introducing `src/assets` or `astro:assets` conventions mid-phase unless optimization becomes a real need

### 5. Promote existing supporting items into flagships deliberately

The current domain modules already contain curated supporting examples that likely represent the Phase 4 flagship shortlist. Planning should start by selecting from those entries before inventing new domain membership.

Likely candidate starting points from the existing data:

- `analytics`: `web portal`, `umami`, or `superset on stargazer`
- `infrastructure`: `cdk-eks`, `stargazer applications`, or `sso reverse proxy`
- `ai / ml`: `collection curator api` and `mcp demo`
- `product`: `sample tracking`, `pricing app`, or `supply forecast`
- `developer experience`: `global design system`, `web portal qa bdd`, or `product team cli`

These are not locked, but they matter for planning because the Phase 2 domain ownership is already set. Reopening every domain assignment would slow the phase and risk muddying Phase 2's boundaries.

## Likely Files To Touch

Very likely:

- `src/data/domains/types.ts`
- `src/data/domains/analytics.ts`
- `src/data/domains/infrastructure.ts`
- `src/data/domains/ai-ml.ts`
- `src/data/domains/product.ts`
- `src/data/domains/developer-experience.ts`
- `src/components/domains/DomainPage.astro`
- `src/styles/global.css`
- `scripts/validate-phase4.mjs`
- `package.json`

Likely when visuals are used:

- `public/highlights/**/*`

Possibly helpful but not required:

- `src/components/domains/FlagshipHighlights.astro`
- `src/lib/paths.ts` only if a tiny helper is added for highlight anchors or asset organization, not because the current helpers are insufficient
- `.github/workflows/deploy.yml` only if the aggregate script name changes; otherwise the workflow can stay untouched because it already runs `validate:site`

## Likely Sequencing Implications

The safest implementation order is:

1. Lock the shared flagship schema and choose the first pilot domain plus candidate stories.
2. Implement the flagship rendering pattern in the shared domain page using one real domain end to end.
3. Fill the remaining four domains with one to two real flagships each, including stack and optional visuals.
4. Do a focused CSS pass once the longest titles, lists, and any visuals are in place.
5. Add the Phase 4 dist-first validator and extend the aggregate site gate.
6. Run browser-level smoke checks on mobile and desktop widths once the automated gate is green.

Why this order matters:

- the biggest risk is not Astro routing; the risk is discovering too late that the flagship structure is either too thin to prove depth or too heavy for the site's minimal tone
- one pilot domain lets the planner test copy density, visual treatment, and section rhythm before multiplying the work across all five pages
- the validator is easiest to write after the final markup and markers are stable

## Don't Hand-Roll

Phase 4 should not introduce custom systems for problems the repo already solved or does not actually have yet.

Do not hand-roll:

- a new content platform or CMS for 5 to 10 flagship stories
- standalone flagship routes or a `/flagships/` index in v1
- a JS lightbox, carousel, modal, or slideshow for visuals
- remote image fetching or runtime media transforms
- one-off bespoke markup per domain that breaks the shared domain-page pattern
- source-coupled validation that reads TS objects directly instead of checking built HTML artifacts

Use the existing primitives instead:

- typed domain modules
- `ProofLink`
- `assetPath()`
- one shared domain page pattern
- dist-first validators in `scripts/`

## Common Pitfalls

### 1. The flagships turn into full case studies

If each highlight becomes a multi-screen narrative, Phase 4 will accidentally spend v2's standalone case-study budget.

Mitigation:

- enforce a repeated section structure
- keep each flagship limited to scannable subsections and short lists
- reserve route-level case studies for later only if one story truly outgrows the page

### 2. Supporting work and flagships blur together

If flagship entries read like only slightly longer supporting items, `HIGH-01` and `HIGH-02` will technically exist but still feel weak.

Mitigation:

- keep a clear section boundary between `flagship highlights` and `supporting work`
- require explicit `problem`, `role`, `constraints`, `decisions`, `outcomes`, and `stack` fields on every flagship
- let supporting work remain short and contextual

### 3. Phase 4 re-litigates the domain boundaries

The easiest way to lose time is to reopen every cross-domain placement decision while trying to add detail.

Mitigation:

- start from the Phase 2 canonical domain homes
- promote existing supporting entries into flagships where possible
- use nearby-domain links or short overlap notes instead of duplicating one flagship across multiple pages

### 4. Visuals become decorative noise or break under the base path

A screenshot that does not explain anything is clutter, and a broken asset path is worse than no visual.

Mitigation:

- only include visuals when they improve comprehension
- route them through a consistent asset convention and `assetPath()`
- require real alt text and keep captions purposeful
- validate emitted `img` markers and path presence in built HTML

### 5. The phase introduces architecture churn without user value

Migrating from the current TS registry to content collections in the same phase might be elegant in isolation but expensive in this repo.

Mitigation:

- keep Phase 4 on the shipped data pattern unless a pilot flagship clearly shows TS objects are blocking necessary formatting
- prefer the smallest change that makes the flagship proof real

### 6. Validation only checks presence, not depth

A validator that only looks for the word `flagship` or counts cards can miss empty or structurally weak highlights.

Mitigation:

- validate per-flagship structural markers for problem, role, constraints, decisions, outcomes, and stack
- keep the manual checklist focused on whether the stories actually feel convincing and readable

## Validation Architecture

Phase 4 should follow the same dist-first strategy as Phases 1 through 3. Validate the emitted domain HTML in `dist`, not source templates, so the release gate stays aligned with what GitHub Pages publishes.

### Automated Verification

Recommended commands:

- `pnpm astro check`
- `pnpm astro build`
- `node ./scripts/validate-phase4.mjs`
- `pnpm validate:site`

Recommended new validation entry:

- add `scripts/validate-phase4.mjs`
- add `validate:phase4` in `package.json`
- extend `validate:site` to run `validate:phase1`, `validate:phase2`, `validate:phase3`, and `validate:phase4`

Recommended flagship markers:

- `data-flagship-highlights`
- `data-flagship`
- `data-flagship-title`
- `data-flagship-problem`
- `data-flagship-role`
- `data-flagship-constraints`
- `data-flagship-decisions`
- `data-flagship-outcomes`
- `data-flagship-stack`
- `data-flagship-proof-link`
- `data-flagship-visual`

Recommended Phase 4 artifact assertions:

- each built domain artifact still exists at `dist/domains/<slug>/index.html`
- each domain page contains a flagship-highlights section
- each domain page renders at least 1 and at most 2 `data-flagship` entries
- each flagship has non-empty title text
- each flagship has non-empty `problem`, `role`, and `outcomes` text
- each flagship renders at least one constraint item and at least one decision item
- each flagship renders at least one stack item
- any `data-flagship-proof-link` uses an absolute `http(s)` URL
- any `data-flagship-visual` renders an `img` with non-empty `src` and `alt`
- visual `src` values resolve to base-aware site asset paths when they are local assets

Important validation nuance:

- do not fail the build because a flagship has no visual; `HIGH-04` is conditional
- do not make the validator decide whether a story "should have had" a visual; that is a manual review call
- do not couple the validator to source TS objects if the same answer can be derived from built HTML

### Manual Verification

Required browser-level checks after the automated gate is green:

- confirm each domain page visibly has one to two real flagship highlights and they feel distinct from supporting work
- confirm the flagship sections explain the problem, Dom's role, constraints, decisions, and outcome without requiring a long uninterrupted read
- confirm the stack or tools line is easy to spot on every flagship
- confirm any screenshot or diagram actually improves comprehension instead of acting as decoration
- confirm visuals do not overpower the text-first layout on mobile or desktop widths
- confirm the pages still read like domain hubs with deeper proof, not like a flattened project gallery or a case-study microsite collection
- tab through the new flagship content and confirm focus states, reading order, and image and link accessibility remain solid

Preferred execution path:

- use `/agent-browser --native` first for browser-accessible smoke checks before escalating any remaining subjective content judgment to manual review

### Requirement Coverage Map

- `HIGH-01`: every domain page renders 1 to 2 flagship entries in built HTML
- `HIGH-02`: every flagship renders explicit problem, role, constraints, decisions, and outcomes structure
- `HIGH-03`: every flagship renders stack or tool information
- `HIGH-04`: visuals, when present, render accessibly and clearly; whether a visual materially helps remains a manual review judgment

## Code Examples

### Suggested TypeScript shape

```ts
export interface FlagshipVisual {
  src: string;
  alt: string;
  caption?: string;
}

export interface FlagshipHighlight {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  role: string;
  constraints: string[];
  decisions: string[];
  outcomes: string[];
  stack: string[];
  proofLinks?: ProofLink[];
  visual?: FlagshipVisual;
}

export interface DomainEntry {
  slug: DomainSlug;
  order: number;
  title: string;
  summary: string;
  seoDescription: string;
  thesis: string;
  scope: string;
  belongsHere: string[];
  flagships: FlagshipHighlight[];
  supportingWork: SupportingWorkItem[];
  relatedDomains?: DomainSlug[];
}
```

### Suggested Astro section shape

```astro
<section
  class="domain-page__section flagship-highlights"
  aria-labelledby="flagship-highlights-heading"
  data-flagship-highlights
>
  <h2 class="domain-page__section-title" id="flagship-highlights-heading">
    flagship highlights
  </h2>

  {domain.flagships.map((flagship) => (
    <article class="flagship" id={`flagship-${flagship.slug}`} data-flagship>
      <h3 class="flagship__title" data-flagship-title>{flagship.title}</h3>
      <p class="flagship__summary">{flagship.summary}</p>
      <p data-flagship-problem><strong>problem:</strong> {flagship.problem}</p>
      <p data-flagship-role><strong>role:</strong> {flagship.role}</p>
      <!-- render constraints, decisions, outcomes, stack, links, and optional figure -->
    </article>
  ))}
</section>
```

## Planning Takeaway

Phase 4 is best planned as "deepen each existing domain hub with one shared flagship pattern," not "introduce case-study pages." The current repo already has the right route and data foundation. The planner should preserve the shipped typed domain registry, add a structured `flagships` layer, keep visuals optional and base-path-safe, and extend the existing dist-first site gate with a dedicated Phase 4 validator. If the phase stays disciplined about that, it will satisfy `HIGH-01` through `HIGH-04` without undoing the minimal domain-first architecture that Phases 2 and 3 already proved.

---

*Phase: 04-flagship-proof-visuals*
*Research completed: 2026-03-10*
*Ready for planning: yes*
