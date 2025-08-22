import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/notes';
import NoteDetailsClient from './NoteDetails.client';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function NoteModalPage({ params }: PageProps) {
  const { id } = await params;

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
