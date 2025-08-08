import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Sentra - PSIRF Incident Analysis',
  description: 'PSIRF-aligned incident analysis tool',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
