'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  Lock, 
  ExternalLink, 
  Heart, 
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  Clock,
  Scale
} from 'lucide-react';
import { ReportDossierModal } from '@/components/ReportDossierModal';
import { useSentinelUser } from '@/context/SentinelUserContext';

export default function ReportsPage() {
  const { currentUser } = useSentinelUser();
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [activeModalNotice, setActiveModalNotice] = useState<'first' | 'second'>('first');

  const openDossier = (type: 'first' | 'second') => {
    setActiveModalNotice(type);
    setIsDossierOpen(true);
  };

  const reports = [
    {
      id: 'REP-2041-02-ESCALATED',
      isEscalated: true,
      app: 'Instagram (Meta Trust & Safety)',
      ownerTeam: 'Meta Legal & General Counsel',
      status: 'AUTOPILOT: 2ND NOTICE AUTO-DISPATCHED',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold flex items-center gap-1.5',
      dateSent: 'Auto-Dispatched by Autopilot (Zero-Touch) • Ticket #ESC-META-90412',
      victimName: currentUser.name,
      victimProfession: currentUser.profession,
      offenderAccount: '@viral_leak_x (Repeat Offender: 4 Recurrent Posts)',
      targetUrl: 'https://instagram.com/reel/C9x81kLmPq/',
      category: 'Statutory Non-Compliance & Persistent Re-Upload',
      evidenceId: 'EVD-2041-006 (Recurrent Video Derivative with Synthesized Voice)',
      pHash: 'pHash-8f9a2b1c70',
      sha256: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
      matchScore: 96,
      originalRef: 'REF-PHOTO-ORIGINAL-01 (Baseline Photo)',
      impactStatement: 'Platform owner failed to act on verified 1st Notice (#REP-2041-01), enabling the same offender ID to re-upload viral deepfakes. Formal safe-harbor forfeiture notice issued.',
    },
    {
      id: 'REP-2041-01',
      isEscalated: false,
      app: 'Instagram',
      ownerTeam: 'Instagram Trust & Safety Team',
      status: 'Removed',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dateSent: 'Aug 28, 2026',
      victimName: currentUser.name,
      victimProfession: currentUser.profession,
      offenderAccount: '@viral_leak_x',
      targetUrl: 'https://instagram.com/p/sample_leak_01',
      category: 'Impersonation & Defamation',
      evidenceId: 'EVD-2041-01 (Manipulated Screenshot & Fake Quote)',
      pHash: 'pHash-8f9a2b1c4e',
      sha256: 'ab4f91dc88231a47e0912389174128941029381029381029381029381',
      matchScore: 96,
      originalRef: 'REF-PHOTO-ORIGINAL-01 (Baseline Photo)',
      impactStatement: 'This unauthorized manipulated post and false claim has caused severe psychological distress, personal harassment, and significant harm to the victim\'s professional reputation.',
    },
    {
      id: 'REP-2041-02',
      isEscalated: false,
      app: 'X (Twitter)',
      ownerTeam: 'X Safety & Compliance Team',
      status: 'Restricted',
      statusColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      dateSent: 'Aug 29, 2026',
      victimName: currentUser.name,
      victimProfession: currentUser.profession,
      offenderAccount: '@tweet_user_99',
      targetUrl: 'https://x.com/user/status/1948201',
      category: 'Stolen Photo & Rumor Tweet',
      evidenceId: 'EVD-2041-02 (Tweet Screenshot & Profile Capture)',
      pHash: 'pHash-7e8f1a2b3c',
      sha256: 'b9481029482910482910482910482910482910482910482910482910482',
      matchScore: 92,
      originalRef: 'REF-PHOTO-ORIGINAL-01 (Baseline Photo)',
      impactStatement: 'The unconsented viral tweet is creating ongoing public defamation, stalking, and safety concerns for the victim.',
    },
    {
      id: 'REP-2041-03',
      isEscalated: false,
      app: 'Reddit',
      ownerTeam: 'Reddit Admin & Subreddit Mods',
      status: 'Rejected',
      statusColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      dateSent: 'Aug 29, 2026',
      victimName: currentUser.name,
      victimProfession: currentUser.profession,
      offenderAccount: 'u/meme_lord_academic',
      targetUrl: 'https://reddit.com/r/sample5',
      category: 'Harassment / Doxxing Post',
      evidenceId: 'EVD-2041-03 (Reddit Forum Post Log)',
      pHash: 'pHash-4a3b2c1d5e',
      sha256: 'e8192019482019482910482910482910482910482910482910482910482',
      matchScore: 78,
      originalRef: 'REF-PHOTO-ORIGINAL-01 (Baseline Photo)',
      impactStatement: 'Mod review rejected report as satire. High distress caused to victim; appeal requested with full evidence.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-12">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
            TAKEDOWN & STATUTORY REPORTS LOG
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Takedown & Escalated 2nd-Timed Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard 1st reports and Escalated 2nd-Timed statutory non-compliance notices for protected profile <strong className="text-cyan-300">{currentUser.name}</strong>.
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((rpt) => (
          <div 
            key={rpt.id} 
            className={`glass-card p-6 sm:p-7 rounded-2xl border bg-slate-900/90 space-y-5 shadow-xl transition-all ${
              rpt.isEscalated 
                ? 'border-rose-500/40 hover:border-rose-500/60 shadow-rose-950/30 ring-1 ring-rose-500/20' 
                : 'border-slate-800 hover:border-cyan-500/40'
            }`}
          >
            {/* Escalated Alert Badge for 2nd Notice */}
            {rpt.isEscalated && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span className="text-xs font-black text-rose-200 uppercase tracking-wide">
                      2ND-TIMED STATUTORY ESCALATION • AUTOPILOT AUTO-SENT
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ZERO-TOUCH AUTO DISPATCHED
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/40">
                      DMCA 17 U.S.C. § 512(i)
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-rose-200/90 leading-relaxed font-sans">
                  Autopilot detected that the 1st notice was ignored (&gt;48h) and the same account (<strong className="text-white">@viral_leak_x</strong>) re-uploaded unauthorized content. Sentinel automatically compiled and transmitted this 2nd Escalated Statutory Notice to Meta Legal Counsel without waiting for manual intervention.
                </p>
              </div>
            )}

            {/* Report Title Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold ${rpt.isEscalated ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {rpt.id}
                </span>
                <span className="text-sm font-extrabold text-white">{rpt.app}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  Owner: <strong className="text-slate-100">{rpt.ownerTeam}</strong>
                </span>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded font-black uppercase tracking-wider border ${rpt.statusColor}`}>
                Status: {rpt.status}
              </span>
            </div>

            {/* STANDARDIZED REPORT SUMMARY */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-4 text-xs">
              {/* Section 1: Victim Profile */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> 1. Affected Person Details (Victim Profile)
                </span>
                <p className="text-slate-300 pl-5">
                  Name: <strong className="text-white">{rpt.victimName}</strong> • Profession: <strong className="text-white">{rpt.victimProfession}</strong> • Authorization: <strong className="text-emerald-400">VERIFIED CONSENT</strong>
                </p>
              </div>

              {/* Section 2: Offending Account */}
              <div className="space-y-1">
                <span className={`text-[11px] font-bold flex items-center gap-1.5 ${rpt.isEscalated ? 'text-rose-400' : 'text-amber-400'}`}>
                  <AlertTriangle className="w-3.5 h-3.5" /> 2. Offending Account & Violation Pattern
                </span>
                <p className="text-slate-300 pl-5">
                  Offender Handle: <strong className="text-rose-400">{rpt.offenderAccount}</strong> • Category: <strong className="text-slate-100">{rpt.category}</strong>
                </p>
              </div>

              {/* Section 3: Unusual Content Proof */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> 3. Unusual Content Proof (Leak Evidence)
                </span>
                <div className="pl-5 font-mono text-[11px] text-slate-300 space-y-0.5">
                  <p>Evidence ID: {rpt.evidenceId} ({rpt.matchScore}% Match)</p>
                  <p className="break-all text-cyan-300">SHA-256: {rpt.sha256}</p>
                </div>
              </div>

              {/* Section 4: Original Reference Image Proof */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> 4. Original Reference Image Proof (Baseline)
                </span>
                <p className="text-slate-300 pl-5 font-mono text-[11px]">
                  Original Reference: <strong className="text-emerald-300 font-sans">{rpt.originalRef}</strong> (Authentic baseline photo)
                </p>
              </div>

              {/* Section 5: Victim Impact Statement */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> 5. Victim Impact Statement & Statutory Demand
                </span>
                <p className="text-slate-300 pl-5 italic text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  &quot;{rpt.impactStatement}&quot;
                </p>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">Date / Audit: {rpt.dateSent}</span>

              <div className="flex flex-wrap items-center gap-2">
                {rpt.isEscalated ? (
                  <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>✓ 2nd Notice Auto-Dispatched to Platform Owner</span>
                  </span>
                ) : null}

                <button
                  onClick={() => openDossier(rpt.isEscalated ? 'second' : 'first')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                    rpt.isEscalated
                      ? 'bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white shadow-rose-950/40'
                      : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-cyan-950/40'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" /> 
                  {rpt.isEscalated ? 'Preview 2nd-Timed Escalated Report' : 'View Standardized PDF Report'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      <ReportDossierModal 
        isOpen={isDossierOpen} 
        onClose={() => setIsDossierOpen(false)} 
        defaultNotice={activeModalNotice} 
      />
    </div>
  );
}
