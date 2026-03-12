---
id: S03
milestone: M002
status: ready
---

# S03: Protected Visual Reveal — Context

<!-- Slice-scoped context. Milestone-only sections (acceptance criteria, completion class,
     milestone sequence) do not belong here — those live in the milestone context. -->

## Goal

Prove that protected visuals (images, screenshots, mermaid diagrams) are correctly withheld from locked domain pages and correctly rendered after unlock, without regressing public-page images.

## Why this Slice

S01 withholds all proof content from cold-load HTML and S02 mounts proof client-side on unlock — but neither slice explicitly verifies that the visual assets (flagship images, screenshot galleries, mermaid diagrams) are absent when locked and present when unlocked. S03 closes that gap with deterministic visual-protection checks that S04 needs as a stable verification surface for the full end-to-end regression gate.

## Scope

### In Scope

- Deterministic verification that locked domain pages contain no leaked image `src` attributes, screenshot gallery markup, or rendered mermaid diagram output in the cold-load HTML.
- Deterministic verification that after unlock, flagship visuals, screenshot galleries, and mermaid diagrams render correctly in the mounted proof view.
- Stable DOM markers or hooks for visual-state verification that S04 can consume.
- Explicit verification that public-page images (homepage avatar, any non-domain visuals) are unaffected by protected-visual logic.

### Out of Scope

- Adding blurred preview teasers or placeholder thumbnails to the locked shell — the full-withholding approach is confirmed; locked pages show no visual previews.
- Adding any new visual treatment to the locked gate shell (no "visuals protected" indicators or placeholder blocks).
- Changing the unlock flow, gate messaging, or session persistence — those belong to S02.
- Changing the public/protected route boundary — that belongs to S01.
- End-to-end browser flow verification combining all slices — that belongs to S04.

## Constraints

- The full-withholding model is confirmed: all visuals (images, screenshots, mermaid diagrams) are treated uniformly — withheld when locked, shown when unlocked. No category gets special treatment.
- Public-page images must be proven unaffected — the verification must cover both protected and public surfaces.
- Must use the existing boundary marker contract from D015 and extend it rather than inventing a parallel marker vocabulary.
- Must integrate into the existing `validate:site` release gate rather than creating a separate validation path.
- The cold-load HTML contract from S01 must remain intact — S03 adds verification on top, it does not change what the server ships.

## Integration Points

### Consumes

- `src/components/domains/DomainGateShell.astro` — the locked-shell markup to verify contains no visual assets.
- `src/components/domains/domain-proof-view.ts` — the browser-side proof renderer to verify produces correct visual DOM after unlock.
- `src/components/domains/ScreenshotGallery.astro` — the gallery component whose markup must be absent in locked state and present after unlock.
- `src/components/diagrams/MermaidDiagram.astro` — the diagram component whose output must be absent in locked state and present after unlock.
- `src/data/domains/*.ts` — domain data files to know which domains have visuals, screenshots, and diagrams for targeted verification.
- `tests/helpers/site-boundary-fixtures.mjs` — shared boundary fixtures to extend with visual-protection assertions.
- D015 marker contract: `data-protected-proof-state="withheld"` as the locked-state visual-absence signal.
- S02 session unlock contract — needed to verify the post-unlock visual state in browser tests.

### Produces

- Stable visual-state markers or DOM hooks that S04 can use for end-to-end visual verification.
- Dist-level assertions that protected pages contain no image srcs, gallery markup, or diagram output in shipped HTML.
- Browser-level assertions that after unlock, visuals render correctly in the proof view.
- Public-page image safety assertions proving no regression from protected-visual logic.
- Extended `validate:site` coverage incorporating visual-protection checks.

## Open Questions

- Exact set of DOM patterns to check for visual leakage — current thinking: `<img>` tags with proof-related srcs, `[data-screenshot-gallery]` elements, and `[data-flagship-visual]` elements in the cold-load HTML of protected routes. Planning should finalize the exact selectors.
- Whether visual verification needs a real browser test (images actually loading) or if artifact-level checks (no img srcs in HTML) are sufficient — current thinking: artifact checks for withholding, browser checks for post-unlock rendering since S02 mounts proof client-side.
