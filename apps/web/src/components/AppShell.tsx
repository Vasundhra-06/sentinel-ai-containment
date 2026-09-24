'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { SentinelUserProvider } from '@/context/SentinelUserContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === '/workspace') return <>{children}</>;
  return <SentinelUserProvider><Navigation>
    <aside className="mb-6 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-100">
      Legacy demonstration: platform connections, removal results and monitoring may be simulated.
      {' '}<Link href="/workspace" className="underline font-semibold">Open the authenticated case workspace</Link>
    </aside>
    {children}
  </Navigation></SentinelUserProvider>;
}
