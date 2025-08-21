import css from "./CreateNote.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";

export const metadata = {
  title: "Create a New Note - NoteHub",
  description: "Add a new note to your collection.",
  openGraph: {
    title: "Create a New Note - NoteHub",
    description: "Fill the form to create your new note.",
    url: "https://your-vercel-domain.vercel.app/notes/action/create",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
