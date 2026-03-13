import type { Metadata } from "next";
import { NotesIndexPage } from "@/components/notes/NotesIndexPage";

export const metadata: Metadata = {
  title: "Notes",
};

export default function NotesRoute() {
  return <NotesIndexPage />;
}
