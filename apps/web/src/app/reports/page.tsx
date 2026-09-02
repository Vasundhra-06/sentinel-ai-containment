'use client';

import React, { useState } from 'react';
import { Send, FileText, CheckCircle2, AlertTriangle, ExternalLink, Download, UserCheck, Image as ImageIcon, Heart, Lock } from 'lucide-react';
import { ReportDossierModal } from '@/components/ReportDossierModal';

export default function ReportsPage() {
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const reports = [
    {
      id: 'REP-2041-01',
      app: 'Instagram',
      ownerTeam: 'Meta Trust & Safety Team',
      status: 'Removed',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dateSent: 'Aug 28, 2026',
      victimName: 'Dr. Evelyn Carter',
      victimProfession: 'Research Scientist & Content Creator',
      offenderAccount: '@viral_leak_x',
      targetUrl: 'https://instagram.com/p/sample_leak_01',
      category: 'Impersonation & Non-Consensual Media',
      evidenceId: 'EVD-2041-01 (Manipulated Photo & Fake Caption)',
      pHash: 'pHash-8f9a2b1c4e',
      sha256: 'ab4f91dc88231a47e0912389174128941029381029381029381029381',
      matchScore: 96,
      originalRef: 'REF-PHOTO-ORIGINAL-01 (Baseline Photo)',
      impactStatement: 'This unauthorized manipulated post and false claim has caused severe psychological distress, personal harassment, and significant harm to the victim\'s professional reputation.',
    },
    {
      id: 'REP-2041-02',
      app: 'X (Twitter)',
      ownerTeam: 'X Safety & Compliance Team',
      status: 'Restricted',
      statusColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      dateSent: 'Aug 29, 2026',
      victimName: 'Dr. Evelyn Carter',
      victimProfession: 'Research Scientist & Content Creator',
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
      app: 'Reddit',
      ownerTeam: 'Reddit Admin & Subreddit Mods',
      status: 'Rejected',
      statusColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      dateSent: 'Aug 29, 2026',
      victimName: 'Dr. Evelyn Carter',
      victimProfession: 'Research Scientist & Content Creator',
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
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">TAKEDOWN REPORTS LOG</span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Takedown & Restriction Reports Sent To Social Media Apps
          </h1>
          <p className="text-xs text-slate-400 mt-1">Standardized 5-section reports detailing victim identity, offender account, unusual leak proof, original reference image, and victim impact statement.</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((rpt) => (
          <div key={rpt.id} className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-5 shadow-xl hover:border-cyan-500/40 transition-all">
            
            {/* Report Title Row */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-cyan-400">{rpt.id}</span>
                <span className="text-sm font-extrabold text-white">{rpt.app}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  Owner: <strong className="text-slate-100">{rpt.ownerTeam}</strong>
                </span>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded font-black uppercase tracking-wider border ${rpt.statusColor}`}>
                Status: {rpt.status}
              </span>
            </div>

            {/* 5-SECTION STANDARDIZED REPORT SUMMARY */}
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
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> 2. Offending Account & Creator Details
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
                  <Heart className="w-3.5 h-3.5" /> 5. Victim Impact Statement
                </span>
                <p className="text-slate-300 pl-5 italic text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  "{rpt.impactStatement}"
                </p>
              </div>

            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-400 text-[11px]">Date Sent: {rpt.dateSent}</span>

              <button
                onClick={() => setIsDossierOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-cyan-950/40 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> View Standardized PDF Report
              </button>
            </div>

          </div>
        ))}
      </div>

      <ReportDossierModal isOpen={isDossierOpen} onClose={() => setIsDossierOpen(false)} />
    </div>
  );
}
