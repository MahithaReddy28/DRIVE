import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'D.R.I.V.E. — Disaster Rerouting & Intelligent Vehicle Engine',
  description: 'Live disaster-aware emergency supply graph rerouting engine when roads fail.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-command-bg text-command-text antialiased">
        {children}
      </body>
    </html>
  );
}
