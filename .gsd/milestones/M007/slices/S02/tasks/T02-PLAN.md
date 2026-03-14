---
estimated_steps: 5
estimated_files: 3
---

# T02: Validate skill output renders end-to-end

**Slice:** S02 — Engineering Journal Agent Skill
**Milestone:** M007

## Description

Prove that a journal entry written following the skill's exact output format integrates with the S01 markdown pipeline. Write a validation entry using the skill's frontmatter template and body conventions (type: journal, tags array, code block, evidence TODO comment), build the site, verify it renders correctly, run all 18 Playwright tests, then remove the validation artifact.

## Steps

1. Write `src/content/notes/engineering-journal-validation-test.md` following the skill's exact output format:
   - Frontmatter: `title` (quoted, contains colon to exercise quoting rule), `summary` (one concrete sentence), `published` (today's date YYYY-MM-DD), `tags: [engineering, testing]`, `type: journal`
   - Body: short intro paragraph, `## Heading`, a code block with language tag, an evidence TODO comment (`<!-- TODO: screenshot of X -->`), ~200 words (under minimum but sufficient for validation)
2. Run `pnpm build` — verify the validation entry appears in the build output (route generated for `/notes/engineering-journal-validation-test`)
3. Run `pnpm test` — all 18 Playwright tests pass (validation entry doesn't break existing tests)
4. Inspect the built output to verify frontmatter parsed correctly: tags present, type is journal, readTime calculated
5. Remove `src/content/notes/engineering-journal-validation-test.md` — this was a verification artifact, not permanent content

## Must-Haves

- [ ] Validation entry uses the exact frontmatter format from the SKILL.md (quoted title, tags array, type: journal)
- [ ] `pnpm build` succeeds with the validation entry present
- [ ] All 18 Playwright tests pass
- [ ] Validation entry removed after verification — no test artifacts left in the repo

## Verification

- `pnpm build` output includes route for the validation entry
- `pnpm test` — 18/18 tests pass
- `test ! -f src/content/notes/engineering-journal-validation-test.md` — cleanup confirmed
- `git status` shows no untracked content files

## Observability Impact

- Signals added/changed: None — validation artifact is temporary
- How a future agent inspects this: T02-SUMMARY.md will record the verification results (build output, test count, frontmatter parsing proof)
- Failure state exposed: If `parseFrontmatter()` silently defaults any field, the build will succeed but rendered output will have wrong metadata — inspect `data-note-tags` attribute on the rendered page to catch this

## Inputs

- `~/.agents/skills/engineering-journal/SKILL.md` — the skill written in T01; the validation entry must follow its exact output format
- `src/lib/notes.ts` — `parseFrontmatter()` is the parser that must accept the generated frontmatter
- `src/content/notes/shiki-and-rich-markdown-test.md` — existing journal entry for structural reference

## Expected Output

- Verification evidence that the skill's output format integrates with the pipeline (build succeeds, tests pass, frontmatter parses correctly)
- Clean repo state — no validation artifacts remain
- T02-SUMMARY.md recording the integration proof
