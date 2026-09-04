import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { SentinelUserProvider } from '@/context/SentinelUserContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#070b14',
};

export const metadata: Metadata = {
  title: 'SENTINEL - AI-Based Digital Incident Containment System',
  description: 'Detect the Incident. Trace the Spread. Support Containment. Available on Mobile, Laptop & Desktop.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SENTINEL',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-[#070b14] text-slate-100 antialiased font-sans overflow-x-hidden min-h-screen">
        <SentinelUserProvider>
          <Navigation>{children}</Navigation>
        </SentinelUserProvider>
      </body>
    </html>
  );
}
