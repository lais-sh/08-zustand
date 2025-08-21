"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from "./TagsMenu.module.css";

const TAGS = ["Work", "Personal", "Meeting", "Shopping", "Todo"] as const;

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((v) => !v);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
    }
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        Notes ▾
      </button>

      {open && (
        <ul className={styles.menuList} role="listbox">
          <li className={styles.menuItem}>
            <Link
              href="/notes/filter/All"
              className={styles.menuLink}
              onClick={() => setOpen(false)}
            >
              All notes
            </Link>
          </li>
          {TAGS.map((tag) => (
            <li className={styles.menuItem} key={tag}>
              <Link
                href={`/notes/filter/${tag}`}
                className={styles.menuLink}
                onClick={() => setOpen(false)}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
