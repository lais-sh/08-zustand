import type { Metadata } from 'next';

const siteUrl = 'https://your-vercel-domain.vercel.app';

export const metadata: Metadata = {
  title: 'Page Not Found - NoteHub',
  description: 'This page does not exist in NoteHub.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Page Not Found - NoteHub',
    description: 'Oops! The page you are looking for does not exist.',
    url: `${siteUrl}/not-found`,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    siteName: 'NoteHub',
    type: 'website',
  },
  alternates: {
    canonical: '/not-found',
  },
};

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </main>
  );
}
