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

const isBadRequest = (e: unknown) =>
  axios.isAxiosError(e) && e.response?.status === 400;

function sanitizeQuery(q?: string): string {
  if (!q) return '';
  return q.replace(/[^\p{L}\p{N}\s\-_'.,]/gu, ' ').trim();
}

export async function fetchNotes({ page, search, tag }: FetchNotesParams): Promise<NotesResponse> {
  const baseParams: Record<string, string | number> = { page };
  if (tag && tag !== 'All') baseParams.tag = tag;

  const q = sanitizeQuery(search);

  const run = async (key?: 'q' | 'query') => {
    const params =
      q && key ? { ...baseParams, [key]: q } : { ...baseParams };
    const { data } = await API.get('/notes', { params });
    return data;
  };

  try {
    if (!q) {
      return normalizeListResponse(await run(), page);
    }
    try {
      return normalizeListResponse(await run('q'), page);
    } catch (err) {
      if (isBadRequest(err)) {
        return normalizeListResponse(await run('query'), page);
      }
      throw err;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Failed to load notes', {
        url: '/notes',
        params: { ...baseParams, q: q || undefined },
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
