import type { Metadata } from 'next';
import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

const siteUrl = 'https://your-vercel-domain.vercel.app';

export const metadata: Metadata = {
  title: 'Create a New Note - NoteHub',
  description: 'Add a new note to your collection.',
  openGraph: {
    title: 'Create a New Note - NoteHub',
    description: 'Fill the form to create your new note.',
    url: `${siteUrl}/notes/action/create`,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    siteName: 'NoteHub',
    type: 'website',
  },
  alternates: { canonical: '/notes/action/create' },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
