'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { AxiosError } from 'axios';
import type { Note } from '@/types/note';
import { fetchNoteById } from '@/lib/api/notes'; 

type Props = {
  noteId?: string;
};

export default function NoteDetailsClient({ noteId }: Props) {
  const params = useParams<{ id: string | string[] }>();
  const routeId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = noteId ?? routeId;

  const { data, isLoading, isError, error } = useQuery<Note, AxiosError>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id as string),
    enabled: !!id,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (!id) return null;
  if (isLoading) return <p>Loading…</p>;
  if (isError || !data) {
    return (
      <p style={{ color: 'red' }}>
        Failed to load note{error?.message ? `: ${error.message}` : ''}
      </p>
    );
  }

  return (
    <article style={{ maxWidth: 720, margin: '2rem auto', lineHeight: 1.6 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>{data.title}</h1>
        <span style={{ padding: '4px 8px', borderRadius: 8, background: '#eef', fontSize: 12 }}>
          {data.tag}
        </span>
      </header>

      <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{data.content}</p>

      <footer style={{ marginTop: 24, fontSize: 12, color: '#666' }}>
        Created: {data.createdAt}
        {data.updatedAt ? ` • Updated: ${data.updatedAt}` : null}
      </footer>
    </article>
  );
}
