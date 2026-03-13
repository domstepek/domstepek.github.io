import Link from "next/link";
import { TerminalPanel } from "@/components/layout/TerminalPanel";
import { getAllNotes } from "@/lib/notes";
import { homePath, notePath } from "@/lib/paths";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(value)
    .toLowerCase();

export function NotesIndexPage() {
  const notes = getAllNotes();

  return (
    <div className="notes-index" data-notes-index>
      <p className="notes-index__back">
        <Link className="notes-index__back-link" href={homePath}>
          Back home
        </Link>
      </p>

      <TerminalPanel>
        <section className="notes-index__intro">
          <h1>Notes</h1>
          <p>
            Short field notes on system shape, product decisions, and the small
            implementation details that either clarify a workflow or quietly make
            it worse.
          </p>
        </section>

        <div className="notes-index__list">
          {notes.map((note) => (
            <article
              key={note.slug}
              className="notes-index__item"
              data-note-item
            >
              <div className="notes-index__meta">
                <time
                  data-note-date
                  dateTime={note.frontmatter.published.toISOString()}
                >
                  {formatDate(note.frontmatter.published)}
                </time>
              </div>
              <h2 className="notes-index__title" data-note-title>
                <Link data-note-link href={notePath(note.slug)}>
                  {note.frontmatter.title}
                </Link>
              </h2>
              <p data-note-summary>{note.frontmatter.summary}</p>
            </article>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}
