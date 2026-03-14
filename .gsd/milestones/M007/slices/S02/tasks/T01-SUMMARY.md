---
id: T01
parent: S02
milestone: M007
provides:
  - Engineering journal SKILL.md at ~/.agents/skills/engineering-journal/SKILL.md
  - GSD symlink at ~/.gsd/agent/skills/engineering-journal for pi auto-discovery
key_files:
  - ~/.agents/skills/engineering-journal/SKILL.md
  - ~/.gsd/agent/skills/engineering-journal (symlink)
key_decisions:
  - Included readTime in frontmatter template despite being overridden at build time — useful for human review before publishing
  - Used inline YAML array syntax for tags ([a, b]) matching existing notes convention rather than multi-line
  - Hardcoded output path to /Users/jstepek/Personal Repos/website/src/content/notes/ — personal skill for one repo
patterns_established:
  - Multi-phase skill structure (scan → frontmatter → body → save) for authoring skills
  - Evidence TODO convention as HTML comments for deferred media
observability_surfaces:
  - none — static file, not a runtime component
duration: 10m
verification_result: passed
completed_at: 2026-03-14
blocker_discovered: false
---

# T01: Write the engineering journal SKILL.md and create GSD symlink

**Created the engineering journal agent skill file with four-phase authoring instructions and GSD symlink for pi discoverability.**

## What Happened

Wrote `~/.agents/skills/engineering-journal/SKILL.md` — a structured prompt that any agent (pi, Cursor, etc.) can follow to generate journal entries from conversation context. The skill covers four phases:

1. **Context scan**: Instructions to extract topic, decisions, code, problems, and insights from conversation. Includes a minimum-context check that stops the agent if the conversation is too thin.
2. **Frontmatter generation**: Exact template and field-by-field rules matching `parseFrontmatter()` from `src/lib/notes.ts`. Includes contract warnings about silent defaults (tags as array not string, type must be `journal`, YAML quoting for special characters).
3. **Body writing**: Tone rules referencing D031 (sentence case) and D058 (casual engineering voice). Structure guidance with heading conventions, code block language tags, evidence TODO comments, and 600–1200 word target.
4. **Save and report**: Slug generation algorithm, collision check, hardcoded output path, and post-save reporting format.

Created symlink `~/.gsd/agent/skills/engineering-journal` → `~/.agents/skills/engineering-journal` for GSD/pi auto-discovery.

## Verification

- `test -f ~/.agents/skills/engineering-journal/SKILL.md` → OK (file exists)
- `test -L ~/.gsd/agent/skills/engineering-journal` → OK (symlink exists)
- `head -4 SKILL.md` → shows `name: engineering-journal` and `description:` fields
- `readlink ~/.gsd/agent/skills/engineering-journal` → `/Users/jstepek/.agents/skills/engineering-journal`
- `grep -c "^##" SKILL.md` → 15 sections (covers all four phases plus guardrails)

Slice-level checks that pass after T01:
- ✅ `test -f ~/.agents/skills/engineering-journal/SKILL.md` — skill file present
- ✅ `test -L ~/.gsd/agent/skills/engineering-journal` — symlink present
- ✅ `head -5 SKILL.md | grep -q "^name:"` — valid YAML frontmatter
- ⏳ Validation entry + pnpm build — T02 scope
- ⏳ pnpm test — T02 scope
- ⏳ Remove validation entry — T02 scope

## Diagnostics

- File presence: `ls -la ~/.agents/skills/engineering-journal/SKILL.md`
- Symlink target: `readlink ~/.gsd/agent/skills/engineering-journal`
- Pi discoverability: check `<available_skills>` list in pi system prompt for `engineering-journal` entry
- If skill doesn't appear in pi discovery: check YAML frontmatter is valid (must have `name:` and `description:` in the `---` block)

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `~/.agents/skills/engineering-journal/SKILL.md` — complete skill file with YAML frontmatter and four-phase authoring instructions
- `~/.gsd/agent/skills/engineering-journal` — symlink to `~/.agents/skills/engineering-journal`
