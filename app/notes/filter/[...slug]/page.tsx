import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api/notes';
import type { NoteTag } from '@/types/note';

export const dynamic = 'force-dynamic';

const ALLOWED_TAGS = ['All', 'Work', 'Personal', 'Meeting', 'Shopping', 'Todo'] as const;
type AllowedTag = (typeof ALLOWED_TAGS)[number];

type Params = { slug?: string[] };
type SParams = { page?: string; q?: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const rawTag = decodeURIComponent(slug?.[0] ?? 'All');
  const tag = (ALLOWED_TAGS.includes(rawTag as AllowedTag) ? (rawTag as AllowedTag) : 'All') as AllowedTag;

  const title = tag === 'All' ? 'All notes - NoteHub' : `Notes tagged: ${tag} - NoteHub`;
  const description =
    tag === 'All'
      ? 'Browse all your personal notes in NoteHub.'
      : `Browse notes tagged with ${tag} in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${encodeURIComponent(rawTag)}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      siteName: 'NoteHub',
      type: 'website',
    },
  };
}

export default async function Page(
  { params, searchParams }: { params: Promise<Params>; searchParams: Promise<SParams> }
) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);

  const rawTag = decodeURIComponent(slug?.[0] ?? 'All');
  const tag = rawTag as NoteTag | 'All';

  if (!ALLOWED_TAGS.includes(tag as AllowedTag)) {
    notFound();
  }

  const pageNum = Math.max(1, Number(sp?.page ?? 1) || 1);
  const q = typeof sp?.q === 'string' ? sp.q.trim() : '';

  let initialData;
  try {
    initialData = await fetchNotes({
      page: pageNum,
      search: q,
      tag: tag === 'All' ? undefined : (tag as NoteTag),
    });
  } catch {
    initialData = { notes: [], totalPages: 1, page: pageNum };
  }

  return <NotesClient initialData={initialData} tag={rawTag} />;
}
