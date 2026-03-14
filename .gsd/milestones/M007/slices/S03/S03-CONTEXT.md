---
id: S03
milestone: M007
status: ready
---

# S03: Domain page markdown enrichment — Context

## Goal

Audit the three domain flagship entries, add full markdown rendering (including Shiki-highlighted code blocks) to the `problem`, `constraints[]`, `decisions[]`, and `outcomes[]` fields in `DomainProofPage`, then rewrite domain content in a single pass to use inline code, bold/emphasis, and block elements where they add signal.

## Why this Slice

S01 builds the markdown pipeline and CSS for the notes section. S03 extends the benefit to the domain proof pages — the portfolio's most content-rich surface. With a unified pipeline already wired, adding markdown rendering to domain fields is low-risk; the audit-then-enrich approach ensures changes are targeted rather than busywork.

## Scope

### In Scope

- Add markdown-to-HTML rendering (reusing the unified + Shiki pipeline from S01) for these fields in `DomainProofPage`:
  - `flagship.problem`
  - `flagship.constraints[]` (each item)
  - `flagship.decisions[]` (each item)
  - `flagship.outcomes[]` (each item)
- Audit all three domains (`analytics-ai`, `developer-experience`, `product`) and identify where inline code, bold/emphasis, or code blocks improve clarity
- Rewrite content in those fields to use markdown where the audit finds real value — not blanket reformatting, only where it adds signal
- Fenced code blocks with full Shiki syntax highlighting are supported inside domain cards — same treatment as notes, even though the context is a compact bordered card
- Audit and rewrite happen in a single pass — no intermediate approval step; user reviews via git diff or browser
- CSS: ensure rendered markdown inside domain cards is styled consistently with the retro terminal aesthetic — code spans, `<strong>`, `<em>`, and Shiki code blocks should look intentional inside the card layout
- All 18 existing Playwright tests continue to pass

### Out of Scope

- `supportingWork[].context` — short descriptions rarely warrant markdown; left as plain text
- `flagship.summary`, `flagship.role`, `thesis`, `scope` — narrative prose; not targeted for markdown enrichment in this slice
- `title`, `stack[]`, `belongsHere[]` — structural/metadata fields, never markdown
- Adding new content sections or new flagship entries — enrichment only, no data model expansion
- Any changes to the notes pipeline or note content (S01 scope)
- Any changes to the engineering journal skill (S02 scope)

## Constraints

- `DomainProofPage` is a server component (`src/components/domains/DomainProofPage.tsx`) — markdown rendering must be server-side, not a client island
- The unified pipeline from S01 must be reused, not duplicated — extract a shared `renderMarkdown(content: string): Promise<string>` helper
- DOM marker contract must be preserved: `data-route-visibility`, `data-protected-proof-state`, `data-visual-state`, `data-flagship`, `data-supporting-work`, `data-supporting-item` — Playwright tests depend on these (D013, D015)
- `dangerouslySetInnerHTML` is acceptable for rendered markdown — domain data is authored and committed, not user input; same pattern as `NotePage.tsx`
- Fields remain `string` / `string[]` in `types.ts` — no TypeScript type changes needed; strings just happen to contain markdown syntax

## Integration Points

### Consumes

- `src/lib/notes.ts` (or a shared extract) — the unified + Shiki async pipeline built in S01; `renderMarkdown()` helper extracted from here
- `src/components/domains/DomainProofPage.tsx` — server component where rendered fields are mounted
- `src/data/domains/analytics-ai.ts`, `developer-experience.ts`, `product.ts` — content files to be audited and selectively enriched
- `src/app/globals.css` — existing markdown styles from S01; may need a scoped variant for domain card context

### Produces

- `src/lib/markdown.ts` — shared `renderMarkdown(content: string): Promise<string>` helper (extracted from the S01 pipeline)
- `src/components/domains/DomainProofPage.tsx` — updated to render `problem`, `constraints[]`, `decisions[]`, `outcomes[]` as HTML via `dangerouslySetInnerHTML`
- `src/data/domains/analytics-ai.ts`, `developer-experience.ts`, `product.ts` — selectively enriched with inline code, bold/emphasis, and code blocks where the audit identifies value
- `src/app/globals.css` — any new CSS scopes needed to style markdown elements inside domain cards

## Open Questions

- **Shared render helper location**: Should `renderMarkdown()` live in `src/lib/notes.ts` as an additional export, or be extracted to a new `src/lib/markdown.ts`? Current thinking: extract to `src/lib/markdown.ts` — keeps `notes.ts` focused and makes the helper clearly reusable by `DomainProofPage` without importing from a notes-specific module.
- **Code blocks in domain content**: Full Shiki code blocks are in scope, but does any current domain content actually warrant a fenced code block? Current thinking: unlikely — most decisions and constraints are prose referencing tool names inline (`WebdriverIO`, `pnpm workspaces`, etc.). If none of the content calls for a code block naturally, don't force it.
