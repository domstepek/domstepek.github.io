---
estimated_steps: 5
estimated_files: 2
---

# T01: Write the engineering journal SKILL.md and create GSD symlink

**Slice:** S02 — Engineering Journal Agent Skill
**Milestone:** M007

## Description

Write the SKILL.md file that any agent (pi, Cursor, etc.) can follow to generate a journal entry from conversation context. The skill is a structured prompt — no executable code, no dependencies, no tool-specific APIs. It guides the agent through scanning conversation context, extracting the topic and key decisions, generating frontmatter matching the `parseFrontmatter()` contract exactly, writing the markdown body in the site's casual first-person tone, and saving the file to `src/content/notes/`. Also create the GSD symlink for discoverability.

## Steps

1. Create `~/.agents/skills/engineering-journal/` directory if it doesn't exist
2. Write `SKILL.md` with:
   - YAML frontmatter: `name: engineering-journal`, `description` field with trigger phrases (e.g. "write a journal entry", "engineering journal", "turn this session into a note")
   - **Phase 1 — Context scan**: Instructions to review conversation for topic, decisions made, code written, problems solved, and key insights
   - **Phase 2 — Frontmatter generation**: Exact frontmatter template with field-by-field rules (`title` quoted if it contains colons, `published` as YYYY-MM-DD, `tags` as YAML inline array `[lowercase, hyphenated]`, `type: journal`, `summary` as one concrete sentence, optional `readTime` for human reference)
   - **Phase 3 — Body writing**: Tone rules (casual first-person, "I" not "we", sentence case per D031, concrete examples, no intro fluff, 600–1200 words), structure guidance (## headings, code blocks with language tags, evidence TODO comments as `<!-- TODO: screenshot of X -->`), media convention (`public/notes/<slug>/` for images referenced as `/notes/<slug>/filename.ext`)
   - **Phase 4 — Save and report**: Slug generation (kebab-case from title), collision check (verify file doesn't already exist), write to `/Users/jstepek/Personal Repos/website/src/content/notes/<slug>.md`, report what was written (title, slug, tags, word count)
   - **Guardrails section**: Minimum-context check (if conversation is too thin, suggest adding more context), YAML quoting rules, tag format enforcement
3. Create symlink: `ln -s ~/.agents/skills/engineering-journal ~/.gsd/agent/skills/engineering-journal`
4. Verify file exists and YAML frontmatter parses: `head -5` shows `name:` and `description:` fields
5. Verify symlink target: `readlink ~/.gsd/agent/skills/engineering-journal` resolves to `~/.agents/skills/engineering-journal`

## Must-Haves

- [ ] SKILL.md has valid YAML frontmatter with `name` and `description`
- [ ] Instructions cover all four phases: context scan → frontmatter → body → save
- [ ] Inline frontmatter example matches `parseFrontmatter()` exactly (tags as array, type as 'journal', published as YYYY-MM-DD)
- [ ] Tone instructions reference D031 sentence case and D058 casual engineering voice
- [ ] Media convention documented with directory path and reference syntax
- [ ] Guardrails: slug collision check, word count target, minimum-context check, YAML quoting
- [ ] Symlink created and valid

## Verification

- `test -f ~/.agents/skills/engineering-journal/SKILL.md && echo OK` — file exists
- `test -L ~/.gsd/agent/skills/engineering-journal && echo OK` — symlink exists
- `head -4 ~/.agents/skills/engineering-journal/SKILL.md` — shows YAML frontmatter with `name` and `description`
- `readlink ~/.gsd/agent/skills/engineering-journal` — resolves to correct target
- `grep -c "^##" ~/.agents/skills/engineering-journal/SKILL.md` — has multiple sections (phases)

## Observability Impact

- Signals added/changed: None — static file, no runtime component
- How a future agent inspects this: `ls ~/.agents/skills/engineering-journal/SKILL.md` for presence; `readlink ~/.gsd/agent/skills/engineering-journal` for symlink; pi auto-discovery shows it in `<available_skills>`
- Failure state exposed: If YAML frontmatter is malformed, pi won't discover the skill (it won't appear in `<available_skills>`)

## Inputs

- `~/.agents/skills/electron/SKILL.md` — reference for minimal YAML frontmatter format
- `~/.gsd/agent/skills/forge-standup-transcript/SKILL.md` — reference for multi-phase authoring skill structure
- `src/lib/notes.ts` — `parseFrontmatter()` is the authoritative frontmatter contract
- `src/content/notes/keep-the-path-explicit.md` — reference for tone and voice
- `src/content/notes/shiki-and-rich-markdown-test.md` — reference for journal-type entry with rich content
- S02-RESEARCH.md — constraints, pitfalls, and format decisions

## Expected Output

- `~/.agents/skills/engineering-journal/SKILL.md` — complete skill file with YAML frontmatter and structured authoring instructions
- `~/.gsd/agent/skills/engineering-journal` — symlink to the skill directory
