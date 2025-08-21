'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api/notes';
import { normalizeTag } from '@/lib/api/tags';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import type { NotesResponse } from '@/types/note';
import type { NoteTag } from '@/lib/api/tags';

interface NotesClientProps {
  initialData: NotesResponse;
  tag?: string;
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [debouncedSearch] = useDebounce(search, 500);
  const safeTag: NoteTag | 'All' | undefined = normalizeTag(tag);

  const { data = initialData, isError } = useQuery({
    queryKey: ['notes', { page, search: debouncedSearch, tag: safeTag }],
    queryFn: () => fetchNotes({ page, search: debouncedSearch, tag: safeTag }),
    initialData,
    placeholderData: (prev) => prev,
  });

  const handleSearch = (query: string) => {
    setPage(1);
    setSearch(query);
  };

  if (isError) {
    return <p style={{ color: 'red' }}>Failed to load notes.</p>;
  }

  return (
    <>
      <Link href="/notes/action/create">➕ Create note</Link>

      <SearchBox onSearch={handleSearch} />

      {data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}

      {data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
