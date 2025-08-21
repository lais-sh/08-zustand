import { notFound } from "next/navigation";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api/notes";
import type { NoteTag } from "@/types/note";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const ALLOWED_TAGS: ReadonlyArray<NoteTag | "All"> = [
  "All",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Todo",
];

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const [rawTag] = params.slug ?? [];
  const tag = (rawTag ?? "All") as NoteTag | "All";

  if (!ALLOWED_TAGS.includes(tag)) {
    return {
      title: "Notes - Not Found",
      description: "This filter does not exist.",
    };
  }

  const title = tag === "All" ? "All notes - NoteHub" : `Notes tagged: ${tag} - NoteHub`;
  const description =
    tag === "All"
      ? "Browse all your personal notes in NoteHub."
      : `Browse notes tagged with ${tag} in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://your-vercel-domain.vercel.app/notes/filter/${tag}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const [rawTag, rawPage] = params.slug ?? [];
  const tag = (rawTag ?? "All") as NoteTag | "All";

  if (!ALLOWED_TAGS.includes(tag)) {
    notFound();
  }

  const page = rawPage ? Number(rawPage) : 1;
  if (!Number.isFinite(page) || page < 1) {
    notFound();
  }

  try {
    const data = await fetchNotes({ page, tag });

    if (!data || data.notes.length === 0) {
      return (
        <>
          <h1>{tag === "All" ? "All notes" : `Notes tagged: ${tag}`}</h1>
          <p>No notes found.</p>
        </>
      );
    }

    return (
      <>
        <h1>{tag === "All" ? "All notes" : `Notes tagged: ${tag}`}</h1>
        <NoteList notes={data.notes} />
      </>
    );
  } catch (e) {
    console.error("❌ Error fetching notes:", e);
    return <p>Could not fetch the list of notes. Please try again later.</p>;
  }
}