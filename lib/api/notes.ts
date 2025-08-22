import axios from 'axios';
import type { Note, NoteTag, NewNote } from '@/types/note';
import { API } from './http';

export type NotesResponse = { notes: Note[]; totalPages: number; page: number };

type FetchNotesParams = {
  page: number;
  search?: string;
  tag?: NoteTag | 'All';
};

function normalizeListResponse(raw: any, page: number): NotesResponse {
  const notes: Note[] = raw?.notes ?? raw?.results ?? raw?.items ?? raw?.data ?? [];
  const perPage = Number(raw?.perPage ?? raw?.limit ?? 12) || 12;
  const totalPages =
    Number(raw?.totalPages) ||
    (raw?.total ? Math.max(1, Math.ceil(Number(raw.total) / perPage)) : 1);
  return { notes, totalPages, page };
}

function isBadRequest(err: unknown) {
  return axios.isAxiosError(err) && err.response?.status === 400;
}

export async function fetchNotes({ page, search, tag }: FetchNotesParams): Promise<NotesResponse> {
  const baseParams: Record<string, string | number> = { page };
  if (tag && tag !== 'All') baseParams.tag = tag;

  const q = search?.trim();

  const run = async (paramName?: 'q' | 'query') => {
    const params =
      q && paramName ? { ...baseParams, [paramName]: q } : { ...baseParams };
    const { data } = await API.get('/notes', { params });
    return data;
  };

  try {
    if (!q) {
      const data = await run();
      return normalizeListResponse(data, page);
    }

    try {
      const data = await run('q');
      return normalizeListResponse(data, page);
    } catch (err) {
      if (isBadRequest(err)) {
        const data = await run('query');
        return normalizeListResponse(data, page);
      }
      throw err;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Failed to load notes', {
        url: '/notes',
        params: { page, tag: tag === 'All' ? undefined : tag, q: q ?? undefined },
        status: err.response?.status,
        data: err.response?.data,
      });
      const status = err.response?.status ?? 'unknown';
      const body = err.response?.data ?? err.message;
      throw new Error(
        `List fetch failed (${status}). ${typeof body === 'string' ? body : JSON.stringify(body)}`
      );
    }
    throw err;
  }
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const { data } = await API.get<Note | { note: Note }>(`/notes/${noteId}`);
  return (data as any)?.note ?? (data as Note);
}

export async function createNote(payload: NewNote): Promise<Note> {
  const { data } = await API.post<Note | { note: Note }>('/notes', payload);
  return (data as any)?.note ?? (data as Note);
}

export async function updateNote(
  noteId: string,
  payload: Partial<NewNote>
): Promise<Note> {
  const { data } = await API.patch<Note | { note: Note }>(`/notes/${noteId}`, payload);
  return (data as any)?.note ?? (data as Note);
}

export async function deleteNote(noteId: string): Promise<void> {
  await API.delete(`/notes/${noteId}`);
}
