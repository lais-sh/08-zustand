import css from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {year} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Lais Shamukh</p>
          <p>
            Contact us:{" "}
            <a href="mailto:lithshamok@gmail.com" className={css.link}>
              lithshamok@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
