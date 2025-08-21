import Link from "next/link";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <Link href="/" className={css.link}>
          Home
        </Link>
        <TagsMenu />
      </nav>
    </header>
  );
}