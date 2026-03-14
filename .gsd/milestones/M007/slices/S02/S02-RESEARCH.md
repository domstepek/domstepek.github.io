# S02: Engineering Journal Agent Skill — Research

**Date:** 2026-03-14

## Summary

S02 is a pure authoring task — write a SKILL.md file and create a symlink. No website code changes, no dependencies to install, no build pipeline modifications. The skill reviews conversation context and writes a markdown journal entry to the hardcoded path `/Users/jstepek/Personal Repos/website/src/content/notes/`.

The primary risk is getting the SKILL.md format right so it's discoverable by both pi and Cursor, and generating output that exactly matches the S01 frontmatter contract. Secondary risk is writing instructions that produce good journal entries — the skill is essentially a detailed prompt, and its quality determines journal quality.

The existing `forge-standup-transcript` skill provides the strongest reference for a complex authoring skill, while the `electron` and `agent-browser` skills demonstrate the minimal SKILL.md YAML frontmatter format. No external libraries or APIs are needed.

## Recommendation

Write a single `SKILL.md` file at `~/.agents/skills/engineering-journal/SKILL.md` with:

1. **YAML frontmatter** with `name` and `description` fields (the two fields all discovered skills share)
2. **Structured instructions** that guide the agent through: scanning conversation context → extracting topic/decisions/code → generating frontmatter → writing the markdown body → saving the file → reporting what was written
3. **Inline examples** of the exact frontmatter schema and body structure so the agent doesn't hallucinate fields
4. **Evidence TODO convention** as HTML comments (`<!-- TODO: screenshot of X -->`) embedded in the body where supporting media would add value
5. **Symlink** from `~/.gsd/agent/skills/engineering-journal` → `~/.agents/skills/engineering-journal`

The skill should NOT use any tool-specific APIs, scripts, or external dependencies. It is a pure SKILL.md — instructions that any agent can follow using standard file-writing tools.

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| SKILL.md frontmatter format | Existing skills (`electron`, `agent-browser`, `find-skills`) | All use the same `name`/`description` YAML pattern — pi and Cursor auto-discover from this |
| Complex authoring skill structure | `forge-standup-transcript/SKILL.md` | Shows how to structure multi-step agent workflows with clear phases, guardrails, and output format |
| Slug generation | Kebab-case from title | Standard pattern — lowercase, replace spaces/special chars with hyphens, strip non-alphanumeric |
| readTime calculation | S01's formula: `Math.ceil(words / 200)`, min 1 | Skill should replicate the same ~200wpm estimate for consistency |

## Existing Code and Patterns

- `~/.agents/skills/electron/SKILL.md` — minimal global skill format: YAML frontmatter with `name`, `description`, optional `allowed-tools`, then markdown instructions. This is the simplest reference.
- `~/.gsd/agent/skills/forge-standup-transcript/SKILL.md` — complex multi-step skill with phases (scan → collect → build → write → save). Shows how to structure a skill that produces a file artifact with specific format requirements. Closest structural analog to the journal skill.
- `src/lib/notes.ts` → `parseFrontmatter()` — the authoritative frontmatter parser. Fields: `title` (string), `summary` (string), `published` (Date from YYYY-MM-DD), `updated?` (Date), `tags` (string[]), `type` ('note' | 'journal'), `readTime` (calculated, not from frontmatter — but harmless if included). Defaults: `tags: []`, `type: 'note'`, `readTime: 1`.
- `src/content/notes/shiki-and-rich-markdown-test.md` — example journal-type entry with all rich rendering paths. Good structural template for the skill's output format.
- `src/content/notes/keep-the-path-explicit.md` — example of the casual first-person tone the skill should produce. Key characteristics: "I" capitalized (D031), direct statements, no hedging, concrete examples over abstract claims.
- Existing tag values: `[opinion, engineering]`, `[testing, webdev]` — all lowercase, single-word or hyphenated. Skill should enforce this convention.

## Constraints

- **Hardcoded output path**: `/Users/jstepek/Personal Repos/website/src/content/notes/<slug>.md` — no path detection, no config. This is a personal skill for one repo.
- **Frontmatter must match `parseFrontmatter` exactly**: The parser silently defaults malformed fields rather than failing (S01 Forward Intelligence). If the skill writes `tags: "webgpu"` instead of `tags: [webgpu]`, it'll build but display no tags. The skill instructions must include an explicit frontmatter example.
- **`readTime` is auto-calculated at build time**: `parseFrontmatter()` computes it from word count, ignoring any frontmatter value. The skill can include a `readTime` field for human reference but it's overridden at render time. Decision: include it anyway — useful when reviewing the file before build.
- **`type` must be `journal`**: The skill generates journal entries, not short opinion notes.
- **`published` format**: Must be `YYYY-MM-DD` — gray-matter parses this as a Date object. Including time or timezone would work but is inconsistent with existing notes.
- **Tags must be lowercase**: Existing convention. Tag filter uses exact string matching (S01 Forward Intelligence), so `WebGPU` ≠ `webgpu`.
- **Cross-agent compatibility**: No pi-specific tool names (`read`, `write`, `bash`) or Cursor-specific APIs. Use generic instructions like "write the file" or "create the directory". Most agents understand "write this content to this path."
- **No `allowed-tools` needed**: This skill uses only basic file writing — no special tools like `agent-browser` or `npx` commands.
- **Media convention**: Images in `public/notes/<slug>/`, referenced as `/notes/<slug>/filename.ext`. The skill mentions this in TODO comments but does NOT create the directory or move files.

## Common Pitfalls

- **Frontmatter YAML quoting** — If the generated title contains a colon (e.g. `title: WebGPU: A Deep Dive`), YAML parsing breaks. The skill must instruct the agent to quote titles containing special characters: `title: "WebGPU: A Deep Dive"`.
- **Tags as comma-separated string vs array** — `tags: webgpu, nextjs` is invalid YAML. Must be `tags: [webgpu, nextjs]` or the multi-line array form. The skill should show the inline array syntax since all existing notes use it.
- **Slug collision** — If the agent generates a slug that matches an existing note filename, it overwrites. The skill should instruct the agent to check if the file already exists before writing.
- **Overly long entries** — The skill generates from conversation context which could be extensive. Without length guidance, the agent may produce 3000+ word entries. The skill should target 600–1200 words for a focused journal entry.
- **Generic tone** — Without explicit tone instructions, agents produce corporate-sounding prose ("In this article, we explore..."). The skill must be explicit about the casual engineering voice: direct statements, concrete examples, "I" not "we", no introduction fluff.
- **Missing summary** — The `summary` field appears on the notes index page. If the skill generates a vague summary ("A journal entry about my recent work"), the index page loses value. The skill should instruct: summary is one sentence stating the specific insight or outcome.

## Open Risks

- **Skill discoverability across agents**: The skill is at `~/.agents/skills/engineering-journal/SKILL.md` and symlinked to `~/.gsd/agent/skills/`. Pi auto-discovers both paths (confirmed from `<available_skills>` in system prompt). Cursor discovers skills from `~/.cursor/skills/` — a second symlink to `~/.cursor/skills/engineering-journal` may be needed for Cursor, but this is outside S02 scope (the context says "works across agents" but only specifies the two paths).
- **Journal quality variance**: The skill is a prompt, not a program. Output quality depends on the agent model's writing ability and the richness of conversation context. Thin conversations will produce thin journals. The skill should include a minimum-context check: if the conversation doesn't have enough substance, suggest the user add more context before invoking.
- **readTime in frontmatter vs auto-calculated**: The `parseFrontmatter` function calculates readTime from content word count, ignoring any frontmatter value. Including `readTime` in frontmatter is harmless but slightly misleading. Decision from S02-CONTEXT: include it for human reference during review. No risk to rendering.

## Skills Discovered

| Technology | Skill | Status |
|------------|-------|--------|
| Engineering journal / writing | `eddiebe147/claude-settings@journal-prompter` (46 installs) | available — journal prompting, but generic; not repo-specific |
| Engineering journal / writing | `sundial-org/awesome-openclaw-skills@agent-chronicle` (16 installs) | available — session chronicling, potentially useful pattern |
| Engineering culture | `refoundai/lenny-skills@engineering-culture` (502 installs) | available — tangential; covers engineering culture not journal writing |

**Assessment**: None of the discovered skills are directly useful. The journal-prompter and agent-chronicle skills are generic journaling tools, not repo-specific markdown generators with a frontmatter contract. The engineering-journal skill is bespoke to this project's schema, media conventions, and tone. No installs recommended.

## Sources

- SKILL.md format and YAML frontmatter pattern (source: `~/.agents/skills/electron/SKILL.md`, `~/.agents/skills/agent-browser/SKILL.md`)
- Complex authoring skill workflow pattern (source: `~/.gsd/agent/skills/forge-standup-transcript/SKILL.md`)
- Frontmatter parser and defaults (source: `src/lib/notes.ts` — `parseFrontmatter()`)
- Existing note tone and style (source: `src/content/notes/keep-the-path-explicit.md`, `src/content/notes/systems-over-abstractions.md`)
- S01 Forward Intelligence on fragile areas (source: `.gsd/milestones/M007/slices/S01/S01-SUMMARY.md`)
- Skill symlink convention (source: `ls -la ~/.gsd/agent/skills/dogfood` → points to `~/.cursor/skills/dogfood`)
