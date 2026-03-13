import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'jds',
  description: 'Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="site-shell">{children}</body>
    </html>
  );
}
