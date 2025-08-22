'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import css from './Modal.module.css';

type Props = {
  children: React.ReactNode;
};

export default function Modal({ children }: Props) {
  const router = useRouter();

  const onClose = () => router.back();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={css.overlay} onClick={onBackdrop} role="dialog" aria-modal="true">
      <div className={css.content}>
        <button className={css.close} aria-label="Close modal" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
