'use client';

import React from 'react';
import { FileText, Download, Lock, CheckCircle2 } from 'lucide-react';

export default function EvidencePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">SAVED PROOF LOCKER</span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Saved Proof & Screenshot Locker
          </h1>
          <p className="text-xs text-slate-400 mt-1">All saved screenshots and digital proof codes. These are locked and verified so social media apps cannot deny your takedown request.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'PROOF-2041-01', app: 'Instagram', post: 'Fake Photo & Caption', date: 'Aug 28, 2026', code: 'SHA-256: ab4f91dc88231a47e091238917412894102' },
          { id: 'PROOF-2041-02', app: 'X (Twitter)', post: 'Stolen Photo Tweet', date: 'Aug 29, 2026', code: 'SHA-256: b9481029482910482910482910482910482' },
          { id: 'PROOF-2041-03', app: 'Facebook', post: 'Fake Rumor Video', date: 'Aug 29, 2026', code: 'SHA-256: c718a209148201948291048291048291048' },
          { id: 'PROOF-2041-04', app: 'YouTube', post: 'Fake Audio Clip', date: 'Aug 30, 2026', code: 'SHA-256: d9201948201948291048291048291048291' },
        ].map((item) => (
          <div key={item.id} className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-cyan-400">{item.id}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                VERIFIED PROOF
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{item.post}</h4>
              <p className="text-xs text-slate-400 mt-0.5">Source: <strong>{item.app}</strong></p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300/90 break-all">
              {item.code}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <span>Saved: {item.date}</span>
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-cyan-400" /> Download Proof File
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
