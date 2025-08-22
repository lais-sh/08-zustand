import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/notes';
import Modal from '@/components/Modal/Modal';
import NoteDetailsClient from './NoteDetails.client';

type PageProps = { params: { id: string } };

export default async function NoteModalPage({ params }: PageProps) {
  const { id } = params;

  const qc = new QueryClient();

  try {
    await qc.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch {
  }

  return (
    <Modal>
      <HydrationBoundary state={dehydrate(qc)}>
        <NoteDetailsClient noteId={id} />
      </HydrationBoundary>
    </Modal>
  );
}
