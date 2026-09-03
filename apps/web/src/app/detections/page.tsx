'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DetectionsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
