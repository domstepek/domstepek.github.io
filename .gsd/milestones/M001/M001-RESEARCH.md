# Research Summary

**Project:** Dom Personal Site  
**Research Date:** 2026-03-09

## Recommended Direction

- Build a domain-first static personal site: a very short homepage plus deeper capability pages that show proof instead of acting like a repo gallery.
- Use `snwy.me` as inspiration for restraint, tone, and pacing, but add enough structure for depth:
  - thesis
  - examples
  - outcomes
  - outbound links
- Keep the voice casual, direct, and lowercase.
- Treat curation as a core product decision. Five domains is good only if each one has clear boundaries and enough evidence.

## Stack Decision

- Use `Astro` with `TypeScript`, Astro Content Collections, Markdown-first content, plain CSS, and deployment via GitHub Actions to GitHub Pages.
- Start with no client framework and no SPA behavior.
- Use content schemas so domains and highlights stay typed and maintainable.
- Assume static export and GitHub Pages base-path constraints from day one.

## Table Stakes For V1

- A homepage that quickly explains who Dom is, what kinds of systems he builds, and where to click next.
- Visible navigation to the domain pages:
  - analytics
  - infrastructure / devops
  - ai / ml tooling
  - product engineering
  - developer experience
- A shared domain-page structure:
  - short thesis
  - selected examples
  - 1-2 flagship highlights
  - supporting work
  - proof links
- Concrete proof on every page:
  - what it was
  - Dom's role
  - why it mattered
  - what changed after it shipped
- Low-friction contact links on the first screen:
  - GitHub
  - LinkedIn
  - email
- Strong reading quality:
  - mobile friendly
  - fast
  - accessible
  - semantic
  - obvious links
  - strong contrast
- A small freshness signal such as `currently`, `now`, or `last updated`

## Deliberate Exclusions For V1

- No CMS, database, auth, comments, or backend-dependent features
- No blog, search, client-side filtering, or flat `/projects/` index
- No standalone route for every project in the first version
- No React or Next-style app complexity, SSR features, or heavy animation libraries
- No giant skills list, repo dump, novelty portfolio gimmicks, or copy that simply mirrors LinkedIn

## Architecture Decisions

- Keep the route shape simple:
  - `/`
  - `/domains/[slug]`
  - `/404.html`
- The homepage is the only overview page.
- Domain pages are the primary deep pages.
- Keep content in `src/content`, site-wide config in `src/data`, helper logic in `src/lib`, and styling in a small global CSS layer.
- Use structured collections for domains and highlights with stable slugs and typed frontmatter.
- Let route files own content loading and route decisions while components stay presentational.
- Let each domain define which highlights are featured.
- Include deployment polish as part of the core architecture:
  - base path
  - canonical URLs
  - sitemap
  - OG image
  - favicon
  - 404 behavior

## Biggest Risks To Watch

- Scope sprawl from trying to represent every repo equally
- Weak domain boundaries that create overlap and duplicated stories
- Low-information copy that sounds broad but proves little
- GitHub Pages pathing mistakes after deployment
- Content maintenance cost if bios and summaries are duplicated across files

## Planning Implications

- Define the inclusion rule for each domain before writing copy.
- Do a content inventory early and choose 1-2 flagship stories per domain before building too many components.
- Build in this order:
  1. Astro scaffold and Pages setup
  2. content schemas
  3. base layout and typography
  4. homepage
  5. one strongest domain page end to end
  6. remaining domain pages
  7. deployment polish
- Start with the strongest proof areas first, especially analytics, infrastructure / devops, and AI / ML tooling.
- Centralize repeated metadata so later edits stay cheap.

## Key Findings

**Stack:** Astro + TypeScript + Markdown + plain CSS + GitHub Actions on GitHub Pages  
**Table Stakes:** short homepage, clear domain navigation, proof-oriented domain pages, contact links, strong readability  
**Watch Out For:** scope sprawl, muddy domain boundaries, generic copy, and GitHub Pages pathing issues

---
*Last updated: 2026-03-09 after research synthesis*

# Research: Architecture

**Project:** Dom Personal Site  
**Focus:** Site structure, routing, content model, and build order for a domain-first static site  
**Research Date:** 2026-03-09

## Recommended Architecture

Use `Astro` as the site framework and treat the site as a pure static build. This fits GitHub Pages, keeps runtime JavaScript near zero, gives clean file-based routing, and makes future edits happen mostly in content files instead of page code.

Recommended route shape:

```text
/
/domains/analytics/
/domains/infrastructure/
/domains/ai-ml/
/domains/product/
/domains/developer-experience/
/404.html
```

Key decisions:

- Keep `/` as the only overview page.
- Make domain pages the primary deep pages.
- Do not create a flat `/projects/` index in v1.
- Render flagship projects inside their parent domain page rather than giving every project its own route.
- Leave room for future nested detail pages if a flagship story becomes too long.
- Keep v1 intentionally static:
  - no CMS
  - no blog
  - no client-side filtering
  - no site search
  - no SPA router

## Page And Component Boundaries

Pages should own content loading and route-level decisions. Components should stay presentational and receive typed data.

### Pages

- `src/pages/index.astro`
  - loads site config
  - loads ordered domain summaries
  - renders the landing page
- `src/pages/domains/[slug].astro`
  - resolves one domain
  - pulls related highlights
  - renders one shared domain template
- `src/pages/404.astro`
  - renders a minimal fallback page

### Layout And Shared Components

- `src/components/layout/BaseLayout.astro`
  - page shell
  - metadata
  - typography baseline
- `src/components/sections/HomeIntro.astro`
  - landing page intro copy
- `src/components/sections/DomainIndex.astro`
  - list of domain links or cards on the homepage
- `src/components/sections/DomainHero.astro`
  - domain title, summary, capabilities, tools
- `src/components/sections/FlagshipHighlights.astro`
  - 1-2 deeper examples with outcomes and links
- `src/components/sections/SupportingWorkList.astro`
  - concise list of additional related work
- `src/components/shared/ContactLinks.astro`
  - GitHub, LinkedIn, email
- `src/lib/content.ts`
  - sorting
  - joins
  - helper lookups

### Directory Shape

```text
src/
  pages/
    index.astro
    domains/[slug].astro
    404.astro
  components/
    layout/
      BaseLayout.astro
    sections/
      HomeIntro.astro
      DomainIndex.astro
      DomainHero.astro
      FlagshipHighlights.astro
      SupportingWorkList.astro
    shared/
      ContactLinks.astro
  content/
    domains/
    highlights/
  data/
    site.ts
  lib/
    content.ts
  styles/
    global.css
  assets/
public/
  favicon.svg
  og-default.png
```

## Content Model

Keep narrative content in `src/content`, site-wide configuration in `src/data`, and static files in `public` or `src/assets`.

### Site Config

Location: `src/data/site.ts`

Suggested fields:

- `name`
- `title`
- `description`
- `intro`
- `contactLinks`
- `defaultSeoImage`
- `navLabels`

### Domains Collection

Location: `src/content/domains/*.md`

Suggested fields:

- `slug`
- `title`
- `summary`
- `order`
- `capabilities[]`
- `tools[]`
- `featuredHighlightSlugs[]`
- `otherWork[]`
- `seoDescription`

Purpose:

- powers the homepage domain index
- drives the domain routes
- defines domain ordering

### Highlights Collection

Location: `src/content/highlights/*.mdx` or `*.md`

Suggested fields:

- `slug`
- `domain`
- `title`
- `oneLiner`
- `role`
- `period`
- `stack[]`
- `outcomes[]`
- `links[]`
- `sortOrder`
- `coverImage`

Purpose:

- stores flagship project highlights
- renders deeper examples inline on domain pages

### Modeling Rules

- Use Markdown for domain entries.
- Use MDX only if a highlight needs richer formatting.
- Let the domain entry decide which highlights are featured.
- Keep short supporting mentions directly in the domain entry rather than creating separate files for everything.
- Keep slug stability separate from display copy.

## Suggested Build Order

1. Bootstrap Astro and the GitHub Pages deployment path.
2. Define the site, domain, and highlight schemas.
3. Build the base layout, metadata helpers, and typography system.
4. Implement the landing page using real content data.
5. Implement one domain page end to end, preferably `analytics` or `infrastructure`.
6. Populate the remaining domain pages and highlight entries.
7. Add deploy polish:
   - 404 page
   - canonical URLs
   - sitemap
   - OG image
   - favicon
   - GitHub Actions workflow
8. Do a final content pass to ensure the lowercase, direct tone stays consistent.

## Why This Structure Fits

- It keeps the site domain-first instead of repo-first.
- It makes content editing cheap and maintainable.
- It gives enough structure for depth without turning the site into a content platform.
- It preserves the minimal feel of the landing page while allowing deeper pages to carry the detail.

## Confidence Notes

- **High confidence:** A domain-first static architecture is the right fit for the brief.
- **High confidence:** One shared domain template and no standalone project routes in v1 keeps the site clean.
- **Medium confidence:** The exact content volume may push one or two flagship stories into their own route later, but that should be a later decision.

---
*Last updated: 2026-03-09 after research*

# Research: Stack

**Project:** Dom Personal Site  
**Focus:** Standard 2025 stack for a minimal multi-page personal site with domain-based navigation  
**Hosting Constraint:** GitHub Pages  
**Research Date:** 2026-03-09

## Recommended Stack

- Use `Astro` as the site framework with `TypeScript`, Astro Content Collections, Markdown content, plain CSS, and deployment through GitHub Actions to GitHub Pages.
- This is the strongest fit for a personal site that is mostly static, text-first, lightweight, and multi-page.
- Astro gives reusable layouts and components, clean file-based routing, and near-zero client JavaScript by default.
- The site structure maps naturally to Astro:
  - `src/pages/index.astro` for the landing page
  - `src/content/domains/*.md` for domain pages
  - `src/content/highlights/*.mdx` or `*.md` for flagship project highlights
- Start with no client framework at all. If a small interaction is needed later, add a tiny Astro island instead of making the whole site React-driven.
- Use plain CSS with a small handcrafted design layer: CSS variables, system font stack, clear spacing, simple link states, and minimal motion.
- Deploy with GitHub Actions to GitHub Pages rather than relying on an older branch-publish flow.

## Alternatives Considered

### Plain HTML/CSS

- Technically viable and the lightest possible option.
- Best only if the site were truly one page with a contact section.
- Once the site includes multiple domain pages and repeatable case-study structure, hand-maintained HTML becomes annoying quickly.

### Eleventy

- Strong runner-up.
- Excellent for static content sites and GitHub Pages compatibility.
- Simpler than app frameworks, but Astro has a better fit for component reuse and typed content collections in this project.

### Vite Static Build

- Fine if the goal is a tiny app-like frontend with vanilla JS, Preact, or React.
- Not the best default here because routing, content modeling, and static authoring would need to be assembled more manually.

### Next.js Static Export

- Possible, but not the right choice here.
- Adds React and Next complexity to a site that mostly needs prerendered HTML.
- Easy to accidentally lean on features that do not belong on GitHub Pages.

### Hugo

- Still a solid static-site option.
- Best for people who strongly prefer content-first workflows outside the JS/TS ecosystem.
- Less aligned with the modern frontend ergonomics likely to be comfortable in this repo.

### Jekyll

- Historically associated with GitHub Pages.
- No longer the best greenfield default for this kind of project.
- Brings in a more legacy Ruby-oriented toolchain than this site needs.

## Suggested Libraries And Tools

- `astro` for the framework
- `typescript` for configuration, schemas, and safer content typing
- Astro Content Collections with `zod` for structured frontmatter
- Markdown-first content authoring for domains and concise project summaries
- `@astrojs/mdx` only if richer embeds or custom formatting are needed later
- Plain CSS for styling
- `astro:assets` for optimized images if screenshots or portraits get added
- `prettier` plus `prettier-plugin-astro` for formatting
- `astro check` for validation
- `pnpm` as the package manager
- GitHub Actions plus Pages deployment for release automation
- Optional later: `@playwright/test` for a light smoke test

## What Not To Use And Why

- Do not use SSR-first or server-dependent features. GitHub Pages is static hosting.
- Do not build this as a SPA-first React or Vue app. The site wants fast static HTML and low client JS.
- Do not default to full `Next.js` app-router patterns unless the project later grows beyond static-site constraints.
- Do not start with Tailwind plus a component library for v1. A sparse personal site is faster and clearer with a small handcrafted CSS layer.
- Do not add a CMS, database, or search system in v1. The content volume is small and static files are simpler.
- Do not lean on heavy animation libraries or “portfolio template” kits. They fight the intended text-forward tone.

## GitHub Pages Notes

- If this is deployed as a project site such as `username.github.io/website`, the build will likely need a base path like `/website`.
- If it becomes a user site or gets a custom domain, the deployment config can be simplified.
- The stack should assume static export from the beginning so Pages constraints shape the implementation early.

## Confidence Notes

- **High confidence:** Astro is the best default for this project as described.
- **Medium confidence:** Eleventy is the strongest fallback if a more traditional static-site-generator workflow is preferred.
- **Low confidence:** Next.js is worth the added complexity here unless the site later expands into something much more interactive.

---
*Last updated: 2026-03-09 after research*

# Research: Features

**Project:** Dom Personal Site  
**Focus:** What features and content patterns a domain-first engineer personal site should include  
**Research Date:** 2026-03-09

## Table Stakes

- A landing page that answers three questions immediately:
  - who Dom is
  - what kinds of systems he builds
  - what a visitor should click next
- Domain-first navigation visible on the homepage:
  - `analytics platforms`
  - `platform / devops`
  - `ai / ml tooling`
  - `product engineering`
  - `developer experience`
- Proof, not claims. Each domain page should state:
  - what it was
  - Dom's role
  - why it mattered
  - what changed after it shipped
- One to two flagship stories in the strongest areas so visitors can understand depth, not just breadth.
- A clear credibility path for employers, collaborators, and peers. The site itself should be skimmable enough that a visitor can reconstruct scope and seniority quickly.
- Low-friction contact and outbound links on the first screen:
  - GitHub
  - LinkedIn
  - email
- A polished reading experience:
  - mobile friendly
  - fast loading
  - accessible
  - semantic headings
  - good contrast
  - strong social preview metadata
- Some sign that the site is current, such as a small `currently`, `now`, or `last updated` note.
- Consistent voice: casual, direct, lowercase, and non-corporate.

## Differentiators

- Domain pages that explain patterns, not just accomplishments. Each page should open with a short thesis about the types of problems Dom tends to solve in that area.
- Simple architecture snapshots or mini diagrams for the strongest analytics, platform, or AI stories.
- Cross-domain framing that shows how product, platform, analytics, and AI work connect in practice.
- A short `how i work` or `operating style` section that makes Dom's working style legible.
- Sanitized scale markers:
  - deployment complexity
  - team context
  - data volume or system scale
  - reliability constraints
- Curated public artifacts:
  - repos
  - design system work
  - CLI tools
  - docs
  - screenshots
- Optional `notes` or `thinking` section instead of a full blog, if there are a few durable writeups worth sharing.
- A brief `open to` or `working with me` note if the site should support recruiting or collaboration.

## Anti-Features

- A flat project gallery or raw repo dump
- A giant skills list or tag cloud
- Heavy motion, novelty navigation, or “terminal portfolio” styling
- Generic AI-sounding copy with little concrete information
- Case studies that only list technologies without discussing the problem, tradeoffs, or impact
- Too many thin pages that do not earn their own space
- Features that fight GitHub Pages constraints:
  - custom backends
  - auth walls
  - dynamic comment systems
  - overbuilt contact forms
- Duplicating LinkedIn line-for-line instead of synthesizing the story

## Notes On Content Hierarchy

- The homepage should stay intentionally short:
  - intro
  - current framing
  - domain links
  - 2-3 proof cues
  - contact links
- Domain links should be ordered by strength and distinctiveness, not neutrality. Based on the repo scan, `analytics platforms`, `platform / devops`, and `ai / ml tooling` are especially strong.
- Each domain page should share a repeatable shape:
  - short thesis
  - 3-5 selected examples
  - 1-2 flagship highlights
  - a short supporting-work list
  - outbound proof links
- Flagship detail should live inline at first. Separate case-study pages are only necessary if a story becomes much longer or more media-heavy.
- `About` should remain secondary if included.
- If the content inventory ends up uneven, four strong domain pages are better than five padded ones.

## Project-Specific Recommendation

For this site, the most likely v1 content shape is:

- A sparse landing page with a lowercase intro
- Five domain pages organized by capability area
- One to two flagship highlights per domain
- Supporting mentions for related repos that do not need full treatment
- Contact links and a lightweight freshness signal

This balances the `snwy.me` inspiration with the much broader body of work that needs to be represented.

## Confidence Notes

- **High confidence:** Clear positioning, visible proof, low-friction contact, and fast readability are stable expectations in 2025.
- **Medium-high confidence:** Architecture visuals, operating-style notes, and curated public artifacts would meaningfully strengthen the site for Dom's profile, but they are not required for v1.
- **Medium confidence:** The exact domain split may improve once the full content inventory is assembled and edited.

---
*Last updated: 2026-03-09 after research*

# Research: Pitfalls

**Project:** Dom Personal Site  
**Focus:** Common mistakes and failure modes for a domain-first engineering portfolio on GitHub Pages  
**Research Date:** 2026-03-09

## Major Pitfalls

| ID | Pitfall | Why It Matters Here |
|----|---------|---------------------|
| P1 | Trying to cover too much | Dom has a broad body of work. If the site tries to represent every repo or project equally, it stops feeling minimal and becomes noisy. |
| P2 | Letting GitHub structure drive the site | Repo names and code splits reflect implementation history, not the story visitors need. |
| P3 | Choosing fuzzy or overlapping domains | If the themes are vague, visitors will not know where to click and projects will get repeated in multiple places. |
| P4 | Writing polished but low-information copy | Broad engineering experience can easily turn into generic phrases like “platform,” “AI,” or “scalable” with little substance. |
| P5 | Making big claims without enough proof | High-level domain pages need concrete examples or they read like positioning rather than evidence. |
| P6 | Copying `snwy.me` too literally | The feel is useful, but this project needs more depth than the reference site. |
| P7 | Designing as if GitHub Pages were a full app platform | Static hosting constraints can break routing, asset paths, and runtime expectations if ignored early. |
| P8 | Choosing a stack heavier than the site | It is easy to overbuild a personal site before the core story exists. |
| P9 | Creating content that is expensive to keep current | If updates require editing many files or duplicating content, the site will go stale. |
| P10 | Confusing minimal design with weak readability | Minimal does not mean tiny type, low contrast, or unclear links. |

## Warning Signs

### P1: Trying To Cover Too Much

- More than 4-6 top-level sections appear
- The homepage starts needing “featured,” “archive,” or “misc” buckets
- The content inventory keeps growing without a curation rule

### P2: Letting GitHub Structure Drive The Site

- Page outlines are mostly repo lists
- One real-world system would require multiple repo cards just to explain the work
- Navigation quietly turns back into a project gallery

### P3: Choosing Fuzzy Or Overlapping Domains

- It is hard to decide where a project belongs
- The same blurb appears on multiple pages
- Domain labels sound clever but not predictive

### P4: Low-Information Copy

- Most sentences could describe almost any senior engineer
- The copy is heavy on adjectives and tool names but light on constraints, users, tradeoffs, and outcomes

### P5: Big Claims Without Proof

- A page says Dom has done analytics, platform, AI, or DX work but gives no concrete example
- Links go straight to GitHub with no context

### P6: Reference Site Copied Too Literally

- The homepage feels stylish but does not answer what Dom actually builds
- Deeper pages feel bolted on instead of intentional

### P7: GitHub Pages Constraints Ignored

- Local dev works only at `/`
- Refreshing a deep route breaks
- Asset URLs assume root hosting
- The implementation assumes server routes or secrets

### P8: Stack Too Heavy

- More time goes into framework evaluation and tooling than content
- There are multiple content sources before launch

### P9: Content Too Expensive To Maintain

- The same bio or project summary is repeated in several files
- Adding one new example means editing several pages manually

### P10: Weak Readability

- Light gray text dominates
- Links are unclear
- The design looks minimal in screenshots but is harder to scan in practice

## Prevention Strategies

### P1

- Set explicit inclusion rules early:
  - 4-6 domains max
  - 1-2 flagship examples per domain
  - a short set of supporting mentions
- Treat omission as a feature, not a failure.

### P2

- Make domains the primary navigation unit.
- Treat repos as evidence inside stories, not as the site structure itself.

### P3

- Write a one-line inclusion rule for each domain:
  - what belongs there
  - what does not
  - what visitor question it answers

### P4

- Force every page to answer:
  - what was built
  - what problem it solved
  - what made it hard
  - what changed because of it

### P5

- Give each domain page at least one proof block with:
  - context
  - role
  - constraints
  - decisions
  - outcome

### P6

- Borrow the reference site's restraint and tone, not its content thinness.
- The homepage should make Dom's focus clear within a few seconds.

### P7

- Choose a stack that is static-export-friendly from the beginning.
- Test the built site under the real GitHub Pages base path.
- Avoid server-dependent features in v1.

### P8

- Start with the smallest system that can ship the content.
- Add richer tooling only after the core content model and pages are working.

### P9

- Centralize repeated metadata.
- Use a small content model so adding or removing examples is cheap.
- Review the site periodically after major work changes.

### P10

- Optimize for reading:
  - strong contrast
  - obvious links
  - clear focus states
  - comfortable line height
  - generous spacing

## When To Address Each Pitfall

| Pitfall | Best Time To Address |
|---------|----------------------|
| P1 | Before content inventory turns into page outlines |
| P2 | During initial information architecture |
| P3 | Before naming top-level navigation |
| P4 | During first draft copy and again during editing |
| P5 | While selecting examples for each domain |
| P6 | During wireframes and first homepage review |
| P7 | Before choosing the framework and again before deployment |
| P8 | Before scaffolding the project |
| P9 | While defining the content model, then post-launch during reviews |
| P10 | During visual design, responsive work, and pre-launch QA |

## Most Relevant Risks For This Project

The three most likely failure points here are:

1. **Scope sprawl** from trying to include too much
2. **Weak domain boundaries** that make the information architecture muddy
3. **GitHub Pages pathing and static-hosting issues** if deployment constraints are not handled early

## Confidence Notes

- **High confidence:** The biggest risks are curation and information architecture more than visual polish alone.
- **High confidence:** Scope, domain clarity, and Pages constraints are the most likely failure points for this brief.
- **Medium confidence:** Some implementation pitfalls depend on the final stack, but the content and architecture risks are stable regardless.

---
*Last updated: 2026-03-09 after research*