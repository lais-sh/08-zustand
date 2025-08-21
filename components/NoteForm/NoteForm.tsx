'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { createNote } from '@/lib/api/notes'; // бажано рознести api за модулями
import type { NewNote } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore'; // zustand store з draft/persist
import styles from './NoteForm.module.css';

interface Props {
  /** Опційно: якщо форму все ще відкриваєш у модалці — пробрось onClose */
  onClose?: () => void;
}

export default function NoteForm({ onClose }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Zustand draft
  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const goBack = useCallback(() => {
    if (onClose) onClose();
    else router.back();
  }, [onClose, router]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: NewNote) => createNote(data),
    onSuccess: async () => {
      // оновлюємо список нотаток
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      // чистимо драфт тільки після успішного сабміту
      clearDraft();
      // повертаємося назад (або закриваємо модалку)
      goBack();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as { name: keyof NewNote; value: string };
    // миттєво пишемо зміни в zustand (persist -> localStorage)
    setDraft({ [name]: value } as Partial<NewNote>);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // беремо поточний стан драфта як payload
    mutate(draft as NewNote);
  };

  const handleCancel = () => {
    // драфт НЕ чистимо — щоб користувач міг продовжити пізніше
    goBack();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        <span className={styles.label}>Title</span>
        <input
          name="title"
          value={draft.title}
          onChange={handleChange}
          required
          disabled={isPending}
          className={styles.input}
          placeholder="Your note title"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Content</span>
        <textarea
          name="content"
          value={draft.content}
          onChange={handleChange}
          disabled={isPending}
          className={styles.textarea}
          placeholder="Write your note..."
          rows={6}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Tag</span>
        <select
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          disabled={isPending}
          className={styles.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </label>

      <div className={styles.actions}>
        <button type="submit" disabled={isPending} className={styles.primary}>
          {isPending ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={handleCancel} disabled={isPending} className={styles.ghost}>
          Cancel
        </button>
      </div>
    </form>
  );
}
