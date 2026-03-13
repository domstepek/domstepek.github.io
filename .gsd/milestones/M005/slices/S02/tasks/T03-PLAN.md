---
estimated_steps: 5
estimated_files: 6
---

# T03: Notes markdown pipeline and notes pages

**Slice:** S02 — Public pages and notes pipeline
**Milestone:** M005

## Description

Build the notes pipeline replacing Astro content collections with `gray-matter` + `unified`/`remark`/`rehype`. Create the notes utility module, notes index page, and note detail page with `generateStaticParams`. Migrate notes CSS. This is the only piece of S02 that introduces a new runtime dependency and processing pipeline.

## Steps

1. **Install markdown dependencies** — `npm install gray-matter unified remark-parse remark-rehype rehype-stringify`. These replace Astro's content collection for markdown processing.

2. **Create `src/lib/notes.ts`** — TypeScript module with:
   - `NoteFrontmatter` type: `{ title: string, summary: string, published: Date, updated?: Date }`
   - `NoteEntry` type: `{ slug: string, frontmatter: NoteFrontmatter }`
   - `NoteWithContent` type: `NoteEntry & { contentHtml: string }`
   - `getAllNotes(): NoteEntry[]` — uses `fs.readdirSync` on `path.join(process.cwd(), 'src/content/notes')`, filters `.md` files, parses each with `gray-matter`, returns array sorted by `published` descending
   - `getNoteBySlug(slug: string): NoteWithContent | null` — reads the specific `.md` file, parses frontmatter with `gray-matter`, converts markdown body to HTML with `unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(content)`, returns null if file doesn't exist
   - `getAllNoteSlugs(): string[]` — returns slug list for `generateStaticParams`
   - All file reads use `fs.readFileSync` (sync is fine in server components/build-time functions)
   - Date parsing: `gray-matter` parses YAML dates as `Date` objects natively — same as Astro's `z.coerce.date()`

3. **Create `src/components/notes/NotesIndexPage.tsx` and `src/app/notes/page.tsx`** — Server component:
   - Import `getAllNotes` from `@/lib/notes`, `notePath` from `@/lib/paths`, `Link` from `next/link`, `TerminalPanel`
   - `formatDate` helper using `Intl.DateTimeFormat` with `timeZone: 'UTC'` (matching Astro version)
   - Render `data-notes-index` wrapper, back-to-home link, intro section, note list with `data-note-item`, `data-note-date`, `data-note-title`, `data-note-link`, `data-note-summary` markers
   - Route file: `generateMetadata` with title "Notes"

4. **Create `src/components/notes/NotePage.tsx` and `src/app/notes/[slug]/page.tsx`** — Server component:
   - Import `getNoteBySlug`, `getAllNoteSlugs` from `@/lib/notes`, `notesPath` from `@/lib/paths`, `TerminalPanel`
   - Render `data-note-page` wrapper, back-to-notes link, title with `data-note-title`, date with `data-note-date`, summary, and `<article className="note-page__body" data-note-body dangerouslySetInnerHTML={{ __html: contentHtml }} />`
   - Route file: `generateStaticParams` returning `getAllNoteSlugs().map(slug => ({ slug }))`, `dynamicParams = false` (unknown slugs → 404), `generateMetadata` using note title and summary
   - Call `notFound()` if `getNoteBySlug` returns null

5. **Migrate notes CSS** — Copy `.notes-index*` and `.note-page*` blocks from `src/styles/global.css` into `src/app/globals.css`. Include any responsive overrides for notes within `@media` blocks.

## Must-Haves

- [ ] `gray-matter`, `unified`, `remark-parse`, `remark-rehype`, `rehype-stringify` installed
- [ ] `src/lib/notes.ts` reads markdown files, parses frontmatter, converts to HTML
- [ ] Notes index lists all notes sorted by published date (descending)
- [ ] Note detail renders markdown body as HTML via remark pipeline
- [ ] `generateStaticParams` lists all note slugs; `dynamicParams = false`
- [ ] `formatDate` uses `timeZone: 'UTC'` to avoid timezone shifts
- [ ] `data-notes-index`, `data-note-item`, `data-note-page`, `data-note-body` markers present
- [ ] Notes CSS migrated — index and detail pages render with correct styling
- [ ] Notes Playwright tests pass

## Verification

- `npx playwright test tests/e2e/public.spec.ts --grep "notes|Notes"` → notes tests pass
- `npm run build` → exits 0 (notes are statically generated)
- `curl -s http://localhost:3000/notes/ | grep "data-note-item"` → confirms notes index lists items
- `curl -s http://localhost:3000/notes/keep-the-path-explicit/ | grep "data-note-body"` → confirms detail renders

## Observability Impact

- Signals added/changed: `data-notes-index`, `data-note-item`, `data-note-page`, `data-note-body` DOM markers on notes pages — inspectable via curl
- How a future agent inspects this: `curl -s http://localhost:3000/notes/ | grep -c "data-note-item"` → should return 2 (two notes); `curl -s http://localhost:3000/notes/keep-the-path-explicit/ | grep "data-note-body"` → confirms rendered markdown
- Failure state exposed: `getNoteBySlug` returning null triggers `notFound()` → 404; `generateStaticParams` missing a slug means the route doesn't exist at build time

## Inputs

- `src/content/notes/keep-the-path-explicit.md` — note with `{ title, summary, published }` frontmatter
- `src/content/notes/systems-over-abstractions.md` — second note, same frontmatter shape
- `src/content.config.ts` — Astro schema reference for frontmatter types
- `src/components/notes/NotesIndexPage.astro` — source of truth for index structure/markers
- `src/components/notes/NotePage.astro` — source of truth for detail structure/markers
- `src/lib/paths.ts` — `notePath(slug)`, `notesPath`, `homePath`
- `src/app/layout.tsx` — T01's layout (provides site shell)
- `src/components/layout/TerminalPanel.tsx` — T01's shared component
- `src/styles/global.css` — source CSS for `.notes-index*` and `.note-page*`

## Expected Output

- `src/lib/notes.ts` — new notes utility module
- `src/components/notes/NotesIndexPage.tsx` — new server component
- `src/app/notes/page.tsx` — new route file with `generateMetadata`
- `src/components/notes/NotePage.tsx` — new server component
- `src/app/notes/[slug]/page.tsx` — new route file with `generateStaticParams`, `dynamicParams = false`, `generateMetadata`
- `src/app/globals.css` — extended with `.notes-index*` and `.note-page*` CSS
- `package.json` — updated with markdown dependencies
