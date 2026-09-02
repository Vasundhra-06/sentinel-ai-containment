'use client';

import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function ReUploadWatchPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Re-Upload Watch Engine
          </h1>
          <p className="text-xs text-gray-400 mt-1">Autonomous scanner continuously comparing incoming signals against stored fingerprints</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanner Active
        </span>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" /> Active Watch Signatures (HC-2041)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-cyan-400 font-bold block">Visual Perceptual Signatures</span>
            <p className="text-gray-300">8 Visual pHash/dHash signatures loaded in active memory worker.</p>
            <span className="text-[11px] text-emerald-400 font-semibold block">✓ Match Window: 80%–100% threshold</span>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-violet-400 font-bold block">OCR Text Overlay Patterns</span>
            <p className="text-gray-300">Keywords: "Dr. Evelyn Carter", "student department records", "research fund mystery".</p>
            <span className="text-[11px] text-cyan-300 font-semibold block">✓ NLP Entity Match Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
