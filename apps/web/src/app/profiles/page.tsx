'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Shield, Lock, CheckCircle2, User, Globe, MessageSquare, Edit3 } from 'lucide-react';

export default function ProtectedProfilesPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">MY PROTECTED PROFILE</span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5 flex items-center gap-2">
            Protected Identity & Account Details
          </h1>
          <p className="text-xs text-slate-400 mt-1">Your registered social media identity and saved protection settings.</p>
        </div>

        <Link
          href="/detections"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile Details
        </Link>
      </div>

      {/* Main Profile Details Card */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-cyan-500/20 border border-cyan-400/40">
              EC
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Dr. Evelyn Carter</h2>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">Research Scientist & Content Creator</p>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Profile ID: PROF-8821</span>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Lock className="w-4 h-4 text-emerald-400" /> Protection Active
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Social Media Name</span>
            <strong className="text-white text-sm block">Dr. Evelyn Carter</strong>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Job & Role Mentioned Online</span>
            <strong className="text-white text-sm block">Research Scientist & Content Creator</strong>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Known Social Handles</span>
            <strong className="text-cyan-400 text-sm font-mono block">@evelyn_carter, @drcarter_bio</strong>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Apps Monitored</span>
            <strong className="text-emerald-400 text-sm block">Instagram, X, Facebook, YouTube, Reddit</strong>
          </div>
        </div>

        {/* Protection Consent Box */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-white block">Takedown Authorization Granted</span>
              <span className="text-slate-400 text-[11px]">SENTINEL is authorized to save proof & request takedowns for fake posts targeting this profile.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
