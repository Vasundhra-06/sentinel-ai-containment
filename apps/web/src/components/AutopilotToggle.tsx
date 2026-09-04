'use client';

import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Sparkles, CheckCircle2, Info } from 'lucide-react';

export function AutopilotToggle({ 
  onModeChange 
}: { 
  onModeChange?: (isAutopilot: boolean) => void 
}) {
  const [isAutopilot, setIsAutopilot] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sentinel_autopilot_mode');
    if (saved !== null) {
      setIsAutopilot(saved === 'true');
    }
  }, []);

  const handleToggle = (enabled: boolean) => {
    setIsAutopilot(enabled);
    localStorage.setItem('sentinel_autopilot_mode', String(enabled));
    if (onModeChange) onModeChange(enabled);
  };

  return (
    <div className="glass-card p-3 sm:p-3.5 rounded-2xl border border-cyan-500/25 bg-slate-900/90 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
          isAutopilot 
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner' 
            : 'bg-slate-800 text-amber-400 border border-slate-700'
        }`}>
          {isAutopilot ? <Zap className="w-5 h-5 animate-pulse" /> : <ShieldCheck className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
              AI AUTOPILOT CONTAINMENT
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                isAutopilot 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {isAutopilot ? 'AUTONOMOUS ACTIVE' : 'GUARDED MODE'}
              </span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isAutopilot 
              ? 'Matches with ≥75% are automatically reported & sent to social media for takedown. Matches below 75% require manual approval.' 
              : 'AI auto-prepares all evidence, awaiting your 1-click confirmation before submitting.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => handleToggle(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            isAutopilot 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-950/50' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Full Autopilot
        </button>
        <button
          type="button"
          onClick={() => handleToggle(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            !isAutopilot 
              ? 'bg-slate-800 text-amber-300 border border-amber-500/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Guarded
        </button>
      </div>
    </div>
  );
}
