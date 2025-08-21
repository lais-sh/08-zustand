import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const siteUrl = 'https://your-vercel-domain.vercel.app';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub - Manage Your Notes',
  description: 'Create, filter and manage notes with ease.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'NoteHub - Manage Your Notes',
    description: 'Create, filter and manage notes with ease.',
    url: siteUrl,
    images: [
      'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    ],
    siteName: 'NoteHub',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          {modal}
        </TanStackProvider>
      </body>
    </html>
  );
}
