import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'SENTINEL - AI-Based Digital Incident Containment System',
  description: 'Detect the Incident. Trace the Spread. Support Containment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#090d16] text-gray-100 antialiased font-sans">
        <Navigation>{children}</Navigation>
      </body>
    </html>
  );
}
