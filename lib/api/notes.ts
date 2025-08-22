import axios from 'axios';
import type { Note, NoteTag, NewNote } from '@/types/note';
import { API } from './http';

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
  page: number;
};

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

export async function fetchNotes({ page, search, tag }: FetchNotesParams): Promise<NotesResponse> {
  const params: Record<string, string | number> = { page };

  const q = search?.trim();
  if (q) params.q = q;

  if (tag && tag !== 'All') params.tag = tag;

  try {
    const { data } = await API.get('/notes', { params });
    return normalizeListResponse(data, page);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 'unknown';
      const body = err.response?.data ?? err.message;
      console.error('Failed to load notes', { url: '/notes', params, status, body });
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

export async function updateNote(noteId: string, payload: Partial<NewNote>): Promise<Note> {
  const { data } = await API.patch<Note | { note: Note }>(`/notes/${noteId}`, payload);
  return (data as any)?.note ?? (data as Note);
}

export async function deleteNote(noteId: string): Promise<void> {
  await API.delete(`/notes/${noteId}`);
}
