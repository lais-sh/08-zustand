'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/notes';
import type { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),

    onMutate: async (noteId: string) => {
      setDeletingId(noteId);

      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData<Note[]>(['notes']);
      queryClient.setQueryData<Note[]>(['notes'], (old) =>
        (old ?? []).filter((n) => String(n.id) !== String(noteId))
      );

      return { previous };
    },
    onError: (err, _noteId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['notes'], ctx.previous);
      }
      console.error('❌ Failed to delete note:', err);
    },
    onSuccess: (_data, noteId) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', noteId] });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => {
        const idStr = String(id);
        const isThisDeleting = deletingId === idStr;

        return (
          <li key={idStr} className={css.listItem}>
            <Link href={`/notes/${idStr}`} className={css.link} aria-label={`Open note ${title}`}>
              <h2 className={css.title}>{title}</h2>
              <p className={css.content}>{content}</p>
              <span className={css.tag}>{tag}</span>
            </Link>

            <button
              className={css.button}
              type="button"
              aria-label={`Delete note ${title}`}
              onClick={() => mutate(idStr)}
              disabled={isThisDeleting}
            >
              {isThisDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

