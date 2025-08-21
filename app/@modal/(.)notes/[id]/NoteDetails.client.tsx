"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/notes";
import type { Note } from "@/types/note";
import styles from "./NoteDetails.module.css";

interface Props {
  noteId: string;
}

export default function NoteDetailsClient({ noteId }: Props) {
  const {
    data: note,
    isPending,
    isError,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isPending) return <p>Loading...</p>;

  if (isError || !note) {
    return (
      <p style={{ color: "red" }}>
        Failed to load note{error?.message ? `: ${error.message}` : ""}
      </p>
    );
  }

  const createdAt =
    note.createdAt ? new Date(note.createdAt).toLocaleString() : "";

  return (
    <article className={styles.wrapper}>
      <h1 className={styles.title}>{note.title}</h1>
      <p className={styles.content}>{note.content}</p>

      <p>
        <strong>Tag:</strong> {note.tag}
      </p>

      {createdAt && (
        <p>
          <em>Created at: {createdAt}</em>
        </p>
      )}
    </article>
  );
}
