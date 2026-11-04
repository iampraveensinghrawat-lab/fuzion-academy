import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fuzion Academy — Spoken English, Soft Skills & AI Learning Hub',
  description:
    'Premier English Learning Management System featuring AI Speaking Coach, 100+ Games Hub, Study Materials, and Faculty Portal in Sector-11, Pratap Vihar, Ghaziabad.',
  keywords: [
    'Spoken English',
    'Fuzion Academy',
    'IELTS Preparation',
    'Soft Skills',
    'AI Speaking Coach',
    'Ghaziabad English Institute',
  ],
  authors: [{ name: 'Praveen Singh Rawat' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#f4f5fd]">
        {children}
      </body>
    </html>
  );
}
