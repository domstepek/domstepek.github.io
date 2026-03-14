# S02: Engineering Journal Agent Skill

**Goal:** A global agent skill at `~/.agents/skills/engineering-journal/` that turns conversation context into well-structured journal markdown entries, written directly to `src/content/notes/` with correct frontmatter matching the S01 schema contract.
**Demo:** The skill file is discoverable by pi (appears in `<available_skills>`), and a journal entry written following the skill's exact output format renders correctly on the website with proper tags, type `journal`, and rich content.

## Must-Haves

- SKILL.md exists at `~/.agents/skills/engineering-journal/SKILL.md` with valid YAML frontmatter (`name`, `description`)
- Skill instructions cover the full authoring workflow: scan context → extract topic/decisions/code → generate frontmatter → write markdown body → save file → report result
- Frontmatter output format in the skill exactly matches `parseFrontmatter()` contract: `title` (quoted if special chars), `summary`, `published` (YYYY-MM-DD), `updated?`, `tags: [lowercase]`, `type: journal`
- Skill enforces tone conventions: casual first-person, sentence case with "I" capitalized (D031, D058), concrete examples over abstractions, no introduction fluff
- Skill includes media convention: `public/notes/<slug>/` for images, `<!-- TODO: screenshot of X -->` evidence markers
- Skill includes guardrails: slug collision check, 600–1200 word target, minimum-context check
- Symlink `~/.gsd/agent/skills/engineering-journal` → `~/.agents/skills/engineering-journal` exists
- A validation journal entry following the skill's output format builds and renders correctly
- All 18 existing Playwright tests pass

## Proof Level

- This slice proves: integration (skill output integrates with the S01 markdown pipeline and renders correctly)
- Real runtime required: yes (production build + Playwright tests against rendered output)
- Human/UAT required: no (frontmatter parsing and rendering verified mechanically; tone quality is baked into the skill instructions and validated by sample output inspection)

## Verification

- `test -f ~/.agents/skills/engineering-journal/SKILL.md && echo "SKILL exists"` — skill file present
- `test -L ~/.gsd/agent/skills/engineering-journal && echo "Symlink exists"` — GSD symlink present
- `head -5 ~/.agents/skills/engineering-journal/SKILL.md | grep -q "^name:"` — valid YAML frontmatter
- Write a validation entry to `src/content/notes/`, run `pnpm build` — entry renders without errors
- `pnpm test` — all 18 Playwright tests pass
- Remove validation entry after verification passes

## Observability / Diagnostics

- Runtime signals: none — the skill is a static SKILL.md file, not a running service
- Inspection surfaces: `ls -la ~/.agents/skills/engineering-journal/SKILL.md` for file presence; `readlink ~/.gsd/agent/skills/engineering-journal` for symlink target; pi `<available_skills>` list for discoverability
- Failure visibility: `parseFrontmatter()` silently defaults malformed fields — if the skill generates bad frontmatter, notes will build but display wrong metadata (empty tags, wrong type). The diagnostic is to inspect the rendered note page's `data-note-tags` attribute.
- Redaction constraints: none

## Integration Closure

- Upstream surfaces consumed: `NoteFrontmatter` type and `parseFrontmatter()` defaults from `src/lib/notes.ts` (S01); media convention `public/notes/<slug>/`; `src/content/notes/` target directory
- New wiring introduced in this slice: skill file + symlink (authoring tool, not runtime code)
- What remains before the milestone is truly usable end-to-end: S03 (domain page markdown enrichment) — independent of this slice

## Tasks

- [x] **T01: Write the engineering journal SKILL.md and create GSD symlink** `est:25m`
  - Why: This is the primary deliverable — the skill file that any agent can follow to generate journal entries matching the site's frontmatter schema and tone conventions
  - Files: `~/.agents/skills/engineering-journal/SKILL.md`, `~/.gsd/agent/skills/engineering-journal` (symlink)
  - Do: Write SKILL.md with YAML frontmatter (`name`, `description`), structured multi-phase instructions (scan context → extract → generate frontmatter → write body → save → report), inline frontmatter example matching `parseFrontmatter()` exactly, tone guardrails (D031/D058), media convention, slug collision check, word count target (600–1200), minimum-context check. Create symlink. Reference existing skills (`forge-standup-transcript` for workflow structure, `electron` for minimal YAML format) and existing notes for tone (`keep-the-path-explicit.md`).
  - Verify: `test -f ~/.agents/skills/engineering-journal/SKILL.md`, `test -L ~/.gsd/agent/skills/engineering-journal`, YAML frontmatter has `name` and `description` fields
  - Done when: SKILL.md exists with complete authoring instructions, symlink points to correct target

- [x] **T02: Validate skill output renders end-to-end** `est:15m`
  - Why: Proves the skill's output format actually integrates with the S01 pipeline — frontmatter parses correctly, content renders with Shiki highlighting, and no existing tests break
  - Files: `src/content/notes/engineering-journal-validation-test.md` (temporary), `src/lib/notes.ts` (read-only reference)
  - Do: Write a sample journal entry following the skill's exact output format (type: journal, tags array, quoted title, code block, evidence TODO comment). Run production build. Verify the entry appears in the notes index with correct tags and type. Run all 18 Playwright tests. Remove the validation entry after verification passes.
  - Verify: `pnpm build` succeeds with the validation entry, `pnpm test` — 18/18 pass, validation entry removed after verification
  - Done when: Skill output format proven to integrate with the pipeline, all tests pass, no test artifacts left in the repo

## Files Likely Touched

- `~/.agents/skills/engineering-journal/SKILL.md` (created)
- `~/.gsd/agent/skills/engineering-journal` (symlink created)
- `src/content/notes/engineering-journal-validation-test.md` (created then removed — verification artifact only)
