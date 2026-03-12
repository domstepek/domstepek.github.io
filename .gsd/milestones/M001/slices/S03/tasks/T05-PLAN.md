# T05: Domain Hub Copy Audit

**Slice:** S03
**Milestone:** M001

## Goal
Rewrote all 5 domain hub pages from internal taxonomy notes to visitor-facing descriptions with action-oriented bullet items

## Must-Haves
- [x] Domain hub pages contain only visitor-facing copy with no internal categorization language
- [x] The 'what belongs here' section is either rewritten with visitor-friendly framing or removed
- [x] All 5 domain data files have scope/belongsHere text that reads naturally to a site visitor
- [x] `src/data/domains/analytics.ts` exists and provides Visitor-facing domain scope and examples
- [x] `src/components/domains/DomainPage.astro` exists and provides Updated section heading that reads as visitor-facing

## Steps
1. Rewrite the internal-sounding copy to read naturally for a visitor. Keep the casual lowercase voice established by the site. Keep the same data fields (thesis, scope, belongsHere) — just rewrite the values. **1. Update the section heading in DomainPage.astro:** Change `"what belongs here"` to `"the kind of work i do here"` (or similar visitor-friendly framing). Keep the same element, class, and id — only change the text content. **2. Rewrite `scope` in each domain file:** Current pattern: "if X, it belongs here; if Y, it belongs somewhere else" — reads like a sorting rule. New pattern: A short sentence describing what kind of work this domain covers, written as if explaining to someone browsing the site. Drop the "belongs here / belongs somewhere else" framing entirely. Examples of the transformation: - BEFORE: "if the job is helping people inspect, compare, or trust the data itself, it belongs here; if the hard part is shipping the platform or model behavior, it belongs somewhere else." - AFTER: "this covers the reporting, measurement, and data-trust side of products — the work where the main challenge is making the numbers useful, not building the platform underneath." **3. Rewrite `belongsHere` items in each domain file:** Current pattern: Abstract descriptions of work categories. New pattern: Concrete examples of what Dom actually builds/does in this domain, written casually. Keep them as an array of strings. Same number of items (3-4 each). Examples of the transformation: - BEFORE: "reporting products that turn warehouse or event data into daily operator workflows" - AFTER: "building dashboards and reports that ops teams actually use every morning" **4. Review `thesis` in each domain file:** The thesis lines are borderline — some read okay ("i build analytics systems when the real bottleneck is understanding the business, not collecting one more table") but check each one. If any reads too much like an internal note rather than something Dom would say casually to someone, rewrite it. **CONSTRAINTS:** - Keep the casual lowercase voice — no Title Case, no corporate tone - Keep it short — scope should be 1-2 sentences max, belongsHere items should be 1 line each - Do NOT change the TypeScript field names, types, or data structure - Do NOT change any other fields (title, slug, summary, seoDescription, flagships, supportingWork) - Do NOT change DomainPage.astro structure — only the heading text
2. Human reviews the rewritten copy on each domain hub page. Run `pnpm dev` and check: 1. Navigate to /domains/analytics/ — scope and bullet list read naturally 2. Navigate to /domains/infrastructure/ — same check 3. Navigate to /domains/ai-ml/ — same check 4. Navigate to /domains/product/ — same check 5. Navigate to /domains/developer-experience/ — same check 6. Section heading reads as visitor-facing (not "what belongs here") 7. No copy feels like an internal note or sorting taxonomy

## Context
- Migrated from `.planning/milestones/v1.0-phases/03-homepage-positioning/03-05-PLAN.md`
- Legacy outcome recorded in `.planning/milestones/v1.0-phases/03-homepage-positioning/03-05-SUMMARY.md`
- Related legacy requirements: HOME-01, HOME-02, HOME-03, HOME-04
