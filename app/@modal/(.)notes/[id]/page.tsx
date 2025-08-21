import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";
import { fetchNoteById } from "@/lib/api/notes";
import NoteDetailsClient from "./NoteDetails.client";

type PageProps = { params: { id: string } };

export default async function NoteModalPage({ params }: PageProps) {
  const { id } = params;

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
