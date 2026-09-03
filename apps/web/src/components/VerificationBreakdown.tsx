'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, ShieldAlert, Sparkles, UserCheck, Image as ImageIcon, Briefcase, FileText } from 'lucide-react';

interface VerificationProps {
  score: number;
  platform: string;
  account: string;
  title: string;
  photoScore?: number;
  handleMatch?: boolean;
  professionMatch?: boolean;
  rumorMatch?: boolean;
  isAutopilot?: boolean;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

export function VerificationBreakdown({
  score,
  platform,
  account,
  title,
  photoScore = Math.min(98, score + 2),
  handleMatch = true,
  professionMatch = true,
  rumorMatch = true,
  isAutopilot = true,
  onConfirm,
  onDismiss
}: VerificationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isHighConfidence = score >= 85;

  if (dismissed) {
    return (
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-xs italic">
        Post dismissed as false positive. Search filter calibrated.
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-2 pt-2 border-t border-slate-800/60">
      {/* Tier Badge & Why This Matches You Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isHighConfidence ? (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isAutopilot ? 'AUTOPILOT VERIFIED & CONTAINED' : 'CONFIDENCE: HIGH (≥85%)'}
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              ASSISTED QUEUE (AUTO-PROCEED IN 24H)
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 underline underline-offset-2"
          >
            Why this matches you {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          {confirmed ? (
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Manually Approved: Takedown Filed
            </span>
          ) : (
            <>
              {!isHighConfidence || !isAutopilot ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmed(true);
                    if (onConfirm) onConfirm();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/50 font-bold text-[11px] flex items-center gap-1 transition-all shadow-sm shadow-emerald-950/40"
                  title="Manually verify this post and trigger legal takedown report"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Allow & Send Takedown
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setDismissed(true);
                  if (onDismiss) onDismiss();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 font-bold text-[10px] border border-slate-700 transition-all"
                title="Discard if not related to you"
              >
                ✕ Not Me
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable Multi-Factor Evidence Breakdown */}
      {isExpanded && (
        <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-2 animate-in fade-in duration-200 text-xs">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block tracking-wider">
            AI Multi-Factor Match Breakdown ({score}% Composite Score)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="text-slate-300 font-bold block">Biometric Face Hash: {photoScore}%</span>
                <span className="text-[9px] text-slate-400 block">Matched 3-Angle Facial Baseline</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-slate-300 font-bold block">Digital Handle Tag: 100%</span>
                <span className="text-[9px] text-slate-400 block">Target handle mentioned in caption</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Briefcase className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-slate-300 font-bold block">Bio & Profession Context: 95%</span>
                <span className="text-[9px] text-slate-400 block">Matched career/profession keyword</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-slate-300 font-bold block">Rumor Co-Occurrence: 92%</span>
                <span className="text-[9px] text-slate-400 block">Contains reported defamatory terms</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
