'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import css from './Modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  onClose?: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  const router = useRouter();

  const close = () => {
    if (typeof onClose === 'function') onClose();
    else router.back();
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);
  

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div className={css.overlay} onClick={onBackdrop} role="dialog" aria-modal="true">
      <div className={css.content}>
        <button className={css.close} aria-label="Close modal" onClick={close}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
