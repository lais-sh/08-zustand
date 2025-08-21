"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/notes"; // <— перенесено з lib/api.ts
import type { Note } from "@/types/note";

type NotePreviewProps = {
  noteId: string;
  onClose?: () => void;
};

export default function NotePreview({ noteId, onClose }: NotePreviewProps) {
  const router = useRouter();
  const close = onClose ?? (() => router.back());

  const {
    data,
    error,
    isError,
    isPending,      // v5
    isFetching,     // корисно для повторних фетчів
  } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const loading = isPending || (isFetching && !data);

  return (
    <Modal onClose={close}>
      {loading && <div style={{ padding: 24 }}>Loading…</div>}

      {isError && (
        <div style={{ padding: 24 }}>
          <p>
            Could not load preview.
            {" "}
            {error instanceof Error ? error.message : ""}
          </p>
          <button onClick={close}>Close</button>
        </div>
      )}

      {data && !loading && !isError && (
        <article
          style={{
            background: "#fff",
            padding: 24,
            maxWidth: 680,
            width: "100%",
            borderRadius: 12,
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <h2 style={{ margin: 0, lineHeight: 1.2 }}>{data.title}</h2>
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                background: "#eef",
                borderRadius: 8,
                whiteSpace: "nowrap",
              }}
            >
              {data.tag}
            </span>
          </header>

          <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{data.content}</p>

          <footer style={{ marginTop: 16 }}>
            <button onClick={close}>Close</button>
          </footer>
        </article>
      )}
    </Modal>
  );
}
