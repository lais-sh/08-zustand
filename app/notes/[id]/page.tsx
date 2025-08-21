import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchNoteById } from '@/lib/api/notes';
import type { Note } from '@/types/note';

type PageProps = { params: { id: string } };

const siteUrl = 'https://your-vercel-domain.vercel.app';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = params?.id;
  if (!id) {
    return {
      title: 'Note not found - NoteHub',
      description: 'The requested note does not exist.',
      openGraph: {
        title: 'Note not found - NoteHub',
        description: 'The requested note does not exist.',
        url: `${siteUrl}/notes/${id ?? ''}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  }

  try {
    const note = await fetchNoteById(id);
    if (!note) throw new Error('not-found');

    const description =
      (note.content ?? '').trim().slice(0, 140) || `Details for note "${note.title}"`;

    return {
      title: `${note.title} - NoteHub`,
      description,
      openGraph: {
        title: `${note.title} - NoteHub`,
        description,
        url: `${siteUrl}/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
        type: 'article',
      },
      alternates: { canonical: `/notes/${id}` },
    };
  } catch {
    return {
      title: 'Note not found - NoteHub',
      description: 'The requested note does not exist.',
      openGraph: {
        title: 'Note not found - NoteHub',
        description: 'The requested note does not exist.',
        url: `${siteUrl}/notes/${id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const id = params?.id;
  if (!id || typeof id !== 'string') {
    notFound();
  }

  let note: Note | undefined;
  try {
    note = await fetchNoteById(id);
  } catch {
    notFound();
  }

  if (!note) {
    notFound();
  }

  return (
    <article style={{ maxWidth: 720, margin: '2rem auto', lineHeight: 1.6 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>{note.title}</h1>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: 8,
            background: '#eef',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          {note.tag}
        </span>
      </header>

      <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{note.content}</p>

      <footer style={{ marginTop: 24, fontSize: 12, color: '#666' }}>
        Created: {note.createdAt}
        {note.updatedAt ? ` • Updated: ${note.updatedAt}` : null}
      </footer>
    </article>
  );
}
