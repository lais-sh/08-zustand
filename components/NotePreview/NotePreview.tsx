'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Note } from '@/types/note';
import styles from './NotePreview.module.css';

interface Props {
  note: Note;
}

export default function NotePreview({ note }: Props) {
  const router = useRouter();

  const handleClose = () => router.back();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const formattedDate = useMemo(() => {
    const d = note?.createdAt ? new Date(note.createdAt) : null;
    if (!d || Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  }, [note?.createdAt]);

  if (!note) {
    return (
      <section className={styles.wrapper} role="dialog" aria-modal="true">
        <article className={styles.note}>
          <header className={styles.header}>
            <h2 className={styles.title}>Note not found</h2>
            <button
              type="button"
              onClick={handleClose}
              className={styles.closeButton}
              aria-label="Close note preview"
            >
              ✖
            </button>
          </header>
          <p className={styles.content}>We couldn't load this note.</p>
        </article>
      </section>
    );
  }

  return (
    <section
      className={styles.wrapper}
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-title"
    >
      <article className={styles.note}>
        <header className={styles.header}>
          <h2 id="note-title" className={styles.title}>
            {note.title || 'Untitled'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close note preview"
          >
            ✖
          </button>
        </header>

        <div className={styles.meta}>
          <span className={styles.tag}>{note.tag}</span>
          <time className={styles.date} dateTime={note.createdAt || ''}>
            {formattedDate}
          </time>
        </div>

        <p className={styles.content}>{note.content}</p>
      </article>
    </section>
  );
}
