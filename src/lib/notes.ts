import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NoteFrontmatter {
  title: string;
  summary: string;
  published: Date;
  updated?: Date;
}

export interface NoteEntry {
  slug: string;
  frontmatter: NoteFrontmatter;
}

export interface NoteWithContent extends NoteEntry {
  contentHtml: string;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

function parseFrontmatter(raw: Record<string, unknown>): NoteFrontmatter {
  return {
    title: String(raw.title ?? ""),
    summary: String(raw.summary ?? ""),
    published: raw.published instanceof Date ? raw.published : new Date(String(raw.published)),
    updated: raw.updated
      ? raw.updated instanceof Date
        ? raw.updated
        : new Date(String(raw.updated))
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return all notes sorted by published date (newest first). */
export function getAllNotes(): NoteEntry[] {
  const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(NOTES_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        frontmatter: parseFrontmatter(data),
      };
    })
    .sort(
      (a, b) =>
        b.frontmatter.published.getTime() - a.frontmatter.published.getTime(),
    );
}

/** Return a single note with its markdown body rendered to HTML. */
export function getNoteBySlug(slug: string): NoteWithContent | null {
  const filePath = path.join(NOTES_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const result = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(content);

  return {
    slug,
    frontmatter: parseFrontmatter(data),
    contentHtml: String(result),
  };
}

/** Return all note slugs for generateStaticParams. */
export function getAllNoteSlugs(): string[] {
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
