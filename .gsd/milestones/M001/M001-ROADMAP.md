# M001: MVP (Phases 1-6) — SHIPPED 2026-03-10

**Vision:** A personal website for Dom that gives a minimal first impression and lets visitors drill into the main themes of his work.

## Success Criteria

- The site ships as a static Astro site on GitHub Pages with working metadata, 404 handling, and base-aware routing.
- Visitors can navigate from a domain-first homepage into five focused domain hubs with clear theses and proof links.
- Each domain page includes curated supporting work plus flagship highlights with role, decisions, outcomes, stack, and visuals where useful.
- The site includes personal context (`/about/`), a lightweight notes system, and a working custom domain configuration.
- Build validation gates cover the full shipped milestone from publishing foundation through custom-domain setup.

## Slices

- [x] **S01: Publishing Foundation — completed 2026 03 09** `risk:medium` `depends:[]`
  > After this: the site builds and deploys as a readable static Astro foundation with shared layout, metadata, and release gates.
- [x] **S02: Domain Hubs & Supporting Work — completed 2026 03 09** `risk:medium` `depends:[S01]`
  > After this: visitors can open five domain hubs with clear theses, supporting work, and proof-link paths.
- [x] **S03: Homepage Positioning — completed 2026 03 10** `risk:medium` `depends:[S02]`
  > After this: the homepage clearly frames Dom's scope, routes into all five domains, and surfaces contact plus freshness.
- [x] **S04: Flagship Proof & Visuals — completed 2026 03 10** `risk:medium` `depends:[S03]`
  > After this: each domain page includes substantive flagship stories with outcomes, stack, and visuals where they help comprehension.
- [x] **S05: Personal Context & Notes — completed 2026 03 09** `risk:medium` `depends:[S04]`
  > After this: the site includes `/about/`, resume/open-to framing, and a lightweight notes system with index and detail pages.
- [x] **S06: Custom Domain via is A Dev — completed 2026 03 10** `risk:medium` `depends:[S05]`
  > After this: the site resolves under the custom domain configuration with CNAME and validation coverage in place.

## Boundary Map

### S01 → S02
Produces:
  static Astro foundation, shared layout shell, metadata baseline, build/deploy pipeline, and base-aware path helpers

Consumes: nothing (leaf slice)

### S02 → S03
Produces:
  typed domain registry, five domain hub routes, supporting-work structure, and proof-link conventions

Consumes from S01:
  shared layout, routing/path helpers, and deploy-safe static-site foundation

### S03 → S04
Produces:
  homepage hero, domain-first navigation, contact links, freshness signal, and homepage validation markers

Consumes from S02:
  domain registry and domain route structure

### S04 → S05
Produces:
  flagship story schema, rollout across all domain hubs, and visual proof patterns

Consumes from S03:
  homepage positioning and from S02 domain hub structure

### S05 → S06
Produces:
  about page, resume anchor flow, notes index/detail routes, and personal-context validation gates

Consumes from S04:
  shipped domain content model and site-wide styling/patterns

### S06 → terminal
Produces:
  root-domain config, CNAME, is-a-dev registration assets, and end-to-end validation for the shipped static site

Consumes from S05:
  complete built site and validation pipeline
