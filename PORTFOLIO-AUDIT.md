# Portfolio Audit & Improvement Recommendations

Audit date: March 2026
Branch: `audit/portfolio-improvements`
Status: **recommendations only — no code changes made**

---

## Part 1: Best Practices Comparison

### What top portfolio advice says to do


| Practice                                             | Current site                                                                                            | Gap?                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 2-5 curated flagship projects with deep walkthroughs | Yes — 10 flagships across 5 domains, each with problem/role/constraints/decisions/outcomes              | Minor — quantity is high; some flagships could hit harder with tighter copy |
| Guide the reader like a tour guide through decisions | Yes — the flagship structure does this well                                                             | No                                                                          |
| Show who you are (brief bio, personality)            | Partial — "about" page covers work style but reads dry; no personal warmth or story                     | Yes                                                                         |
| Clear contact / CTA                                  | Yes — github, linkedin, email on homepage                                                               | No                                                                          |
| Live demos or screenshots                            | Very limited — only SVG diagrams on 3 flagships; no screenshots, no live demos beyond the MCP demo link | Yes                                                                         |
| Mobile responsive                                    | Yes — media queries and clamp() sizing throughout                                                       | No                                                                          |
| Concise, scannable copy                              | Partial — some sections are wall-of-text; bullet points help but paragraphs run long                    | Yes                                                                         |
| Resume / downloadable PDF                            | No PDF — only an in-page "resume" section with bullet highlights                                        | Yes                                                                         |
| Proof of active work / freshness signal              | Yes — "currently" section on homepage with date                                                         | No                                                                          |
| Unique design personality                            | Yes — CRT overlay, pixel cursors, Space Mono, dark terminal aesthetic. Distinctive.                     | No                                                                          |
| Blog / writing samples                               | Yes — notes section with 2 entries                                                                      | Minor — only 2 notes feels thin; more content would strengthen credibility  |


### What the site does well already

- **Domain-based navigation** is a distinctive structural choice that most portfolios don't attempt. It positions you as someone who thinks in systems, not just projects.
- **Flagship highlight structure** (problem → role → constraints → decisions → outcomes → stack → proof) is thorough and well-organized for a technical audience.
- **Visual identity** is strong. CRT scanlines, pixel cursors, monospace font, dark bg — it has personality without being gimmicky.
- **SEO and meta** are solid: canonical URLs, OG tags, twitter cards, structured descriptions.
- **Accessibility basics** are present: skip link, aria-labelledby, semantic HTML, focus-visible outlines.
- **Data-driven architecture** is clean: all content lives in TypeScript data files, components are purely presentational.

---

## Part 2: Structural & Content Recommendations

### 2.1 Homepage (`src/data/home.ts`, `HomePage.astro`)

**Freshness section copy:**

> "refining the homepage so the five domains read like a quick map instead of a project list."

This is process-speak that doesn't tell a visitor anything useful. Consider replacing with something about what you're actually working on or interested in right now — a technology, a problem space, a side project. The "currently" block should give a stranger a reason to care.

**Lead copy:**

> "the projects here sit where data, platform, workflow, and internal tooling overlap. this homepage is a quick route into the five areas where that work shows up most often."

This is self-referential (talks about the homepage rather than about you or your work). A visitor landing here cold needs to understand what you do in one read, not how the site is organized.

**Domain intro:**

> "pick the domain that matches the problem. the links below are the main route through the site, not a side gallery."

"not a side gallery" is defensive and unnecessary. The navigation speaks for itself. Consider cutting this to just the first sentence.

### 2.2 About Page (`src/data/personal.ts`, `PersonalPage.astro`)

**Lead:**

> "i like work that sits between product questions, system shape, and the operational details that usually get hand-waved until they hurt."

Good line. Reads human.

**How I Work — systems:**

> "i try to make the data model, workflows, and failure modes obvious early so the team is not discovering the real shape of the problem at the end."

Solid. No changes needed.

**How I Work — product:**

> "i like ambiguous product spaces where the right answer comes from tightening the loop between what users need, what the system can support, and what the team can actually maintain."

Fine but long. Could trim "the right answer comes from" — just say "where the work is tightening the loop..."

**How I Work — collaboration:**

> "i work best with people who like direct feedback, quick iteration, and clear tradeoffs. i document decisions, surface risks early, and try to make handoffs lighter instead of louder."

Good. No changes needed.

**Open to — intro:**

> "i'm open to full-time roles plus the right contract or fractional work when the problem is meaningful and the team wants someone who can move between product, platform, and implementation."

This sentence is overloaded. Consider breaking into two shorter statements.

**Resume — summary:**

> "short version: i've spent most of my time building internal platforms, operational tools, data-heavy products, and the glue between product intent and real delivery constraints."

"the glue between product intent and real delivery constraints" is a good phrase. The rest is a list. Works fine.

**Resume — note:**

> "the domain pages are where the deeper proof lives; this section is the compact version."

Self-referential again. The visitor can see that the domain pages exist. Consider cutting.

### 2.3 Domain Pages

**Analytics — web portal — outcomes[2]:**

> "became the clearest analytics proof point in the portfolio because the reporting depth was tied to real day-to-day use."

Self-referential. An outcome should describe impact, not comment on the portfolio. Rewrite to describe the actual impact on the team.

**Infrastructure — cdk-eks — decisions[2]:**

> "kept environment-specific values in dedicated config layers instead of cloning the stack code per stage."

Fine. Technical and clear.

**AI/ML — collection curator api — decisions[1]:**

> "paired Express and Apollo for the main api surface while keeping FastAPI behind a reverse-proxied secondary service for python-heavy work."

Good technical detail. Reads well.

**AI/ML — mcp demo — constraints[2]:**

> "it had to show both user-driven and agent-driven behavior instead of collapsing them into the same vague flow."

Good.

**Product — sample tracking — outcomes[2]:**

> "reduced the need to reconcile exports, shipment context, and recurring updates across separate tools."

Fine.

**Developer Experience — global design system — outcomes[2]:**

> "made it easier to ship consistent interface work across separate apps."

Generic. What apps? How many? Any metric or specificity would help.

**General domain page pattern:** The "the kind of work i do here" + "scope" + "belongsHere" bullets are somewhat repetitive. The thesis already establishes the domain's purpose, then the scope restates it, then the bullets restate it again. Consider whether scope and belongsHere could be collapsed into one tighter section.

### 2.4 Notes

Only 2 notes. Both are good — concise, opinionated, not AI-sounding. But two entries makes the section feel like a placeholder. Either commit to writing more regularly or consider removing the section until there's enough content to justify it (5+ entries).

---

## Part 3: Content Tone Audit (AI Slop Check)

### Verdict: **mostly clean, with a few patterns to watch**

The writing generally reads like a real person. Lowercase style, casual contractions, specific technical references, and genuine opinions all help. The notes in particular read well — short, direct, opinionated.

### Patterns that edge toward generic / AI-adjacent phrasing


| Location                                  | Phrase                                                                                                                | Issue                                                                                                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home.ts` lead                            | "this homepage is a quick route into the five areas where that work shows up most often"                              | Meta-commentary about the site rather than substance                                                                                                                  |
| `home.ts` domainIntro                     | "the links below are the main route through the site, not a side gallery"                                             | Defensive framing                                                                                                                                                     |
| `home.ts` freshness.value                 | "refining the homepage so the five domains read like a quick map instead of a project list"                           | Process navel-gazing                                                                                                                                                  |
| `personal.ts` resume.note                 | "the domain pages are where the deeper proof lives; this section is the compact version"                              | Self-referential                                                                                                                                                      |
| `analytics.ts` web portal outcomes[2]     | "became the clearest analytics proof point in the portfolio"                                                          | Breaks the fourth wall                                                                                                                                                |
| Multiple flagship outcomes                | "gave the team..." / "made it easier..." / "reduced the need..."                                                      | These three patterns repeat across nearly every flagship. They're not wrong, but the repetition makes them blend together. Varying the sentence structure would help. |
| Multiple flagship constraints             | "the X had to Y without Z"                                                                                            | Same template used across most flagships. Reads formulaic after the third domain page.                                                                                |
| `infrastructure.ts` stargazer outcomes[2] | "reduced deployment drift between environments by putting chart structure and values under the same repo conventions" | Fine individually but follows the exact same "reduced X by Y" pattern as other outcomes                                                                               |


### What reads well (not AI-sounding)

- `personal.ts` lead — "the operational details that usually get hand-waved until they hurt" — genuine, specific
- `personal.ts` collaboration — "make handoffs lighter instead of louder" — good turn of phrase
- `personal.ts` boundaries[0] — "i'm a better fit for systems with ownership and ambiguity than for narrow feature-factory work" — clear, direct
- `product.ts` thesis — "when the software has to hold together a messy real-world process, not just present a clean screen" — human, opinionated
- `ai-ml.ts` thesis — "not when a chatbot veneer is the whole pitch" — sharp, reads real
- Both notes — short, direct, opinionated without being preachy

---

## Part 4: Suggested Improvements (Priority Order)

### High priority

1. **Add screenshots or visuals to more flagships.** Only 3 of 10 flagships have visuals, and those are SVG diagrams. Real screenshots (even redacted ones) of dashboards, UIs, or architecture would massively increase credibility. This is the single biggest gap vs. best-practice portfolios.
2. **Cut self-referential copy.** Every place the site talks about itself ("this homepage is...", "the domain pages are where...", "became the clearest proof point in the portfolio") should be rewritten to talk about the work or the impact instead. Visitors don't need a guided tour of the website's structure — they need to understand what you built and why it mattered.
3. **Vary outcome/constraint sentence patterns.** The "gave the team..." / "reduced the..." / "made it easier..." template is solid individually but repeats verbatim across domains. Rewrite ~half of them with different framing to break the pattern.

### Medium priority

1. **Rewrite the freshness section** to describe actual current work or interests, not site maintenance.
2. **Rewrite the homepage lead** to focus on what you do and who you help, not on how the website is organized.
3. **Add a downloadable resume PDF.** The in-page resume section is fine, but hiring managers and recruiters routinely want a PDF they can forward internally.
4. **Tighten the about page "open to" intro** — break it into two sentences or trim the subordinate clause chain.
5. **Collapse the domain page "scope" + "belongsHere" redundancy.** The thesis → scope → bullets pattern says the same thing three times with different granularity. Consider merging scope into the thesis or dropping it.

### Low priority

1. **Write more notes** (target 5-8) or remove the section as a nav-level feature until there's enough content.
2. **Add specificity to generic outcomes** — "made it easier to ship consistent interface work across separate apps" would be stronger as "across 4 product surfaces" or whatever the real number was.
3. **Consider adding a "what I'm reading / thinking about" or interests section** to the about page for human warmth. The site is thorough on professional capability but gives almost zero sense of you as a person. This is fine for some audiences but can feel impersonal.

---

## Part 5: What NOT to Change

- The domain-based navigation. It's distinctive and well-executed.
- The visual design (CRT, pixel cursors, monospace). It has personality.
- The flagship highlight structure (problem/role/constraints/decisions/outcomes/stack). It's thorough.
- The lowercase style. It's consistent and fits the aesthetic.
- The TypeScript data architecture. Clean separation of content from presentation.
- The notes that exist. They read well.

