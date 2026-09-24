'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Globe, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ReportsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/platforms');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-xl shadow-cyan-500/20">
        <Globe className="w-8 h-8 animate-pulse" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider">
          Upgraded to StopNCII Standard
        </span>
        <h1 className="text-2xl font-black text-white">
          Manual Abuse Reports Deprecated
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          SENTINEL has eliminated manual takedown tickets. All containment now executes via 
          <strong className="text-cyan-300"> automated digital fingerprint matching</strong> across Instagram, Facebook, X, YouTube, and Reddit.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 w-full text-left font-mono">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <CheckCircle2 className="w-4 h-4" /> Zero Raw Media Protection Active
        </div>
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <CheckCircle2 className="w-4 h-4" /> 5 Major Platforms Synchronized
        </div>
        <div className="text-slate-400 text-[11px] pt-1">
          Redirecting you to Platform Protection Hub in 1.5 seconds...
        </div>
      </div>

      <Link
        href="/platforms"
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all"
      >
        Go to Platform Protection Hub <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
