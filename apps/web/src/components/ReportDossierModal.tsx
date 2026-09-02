'use client';

import React from 'react';
import { X, FileText, Download, ShieldCheck, UserCheck, AlertTriangle, Image as ImageIcon, Heart, Lock } from 'lucide-react';

export function ReportDossierModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans">
      <div className="glass-card w-full max-w-3xl p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-slate-900 relative shadow-2xl overflow-y-auto max-h-[92vh] space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">OFFICIAL CONTENT TAKEDOWN & RESTRICTION REPORT</span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">Platform Review Dossier (#REP-2041-01)</h3>
            <p className="text-xs text-slate-400">Generated for <strong className="text-cyan-300">Meta Trust & Safety / Instagram Legal Team</strong></p>
          </div>
        </div>

        {/* 5-SECTION STANDARDIZED REPORT CONTAINER */}
        <div className="bg-[#070c18] p-6 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 space-y-6 leading-relaxed shadow-inner">
          
          {/* Header Tag */}
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center text-cyan-400 font-bold">
            <span>SENTINEL TAKEDOWN & RESTRICTION DOSSIER</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">VERIFIED & AUDITABLE</span>
          </div>

          {/* SECTION 1: AFFECTED PERSON DETAILS */}
          <div className="space-y-1.5 border-b border-slate-800/60 pb-4">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" /> 1. AFFECTED PERSON DETAILS (VICTIM PROFILE)
            </h4>
            <div className="pl-6 space-y-1 text-[11px] text-slate-300">
              <p>• Full Name / Social Media Name: <strong className="text-white">Dr. Evelyn Carter</strong></p>
              <p>• Profession / Role on Social Media: <strong className="text-white">Research Scientist & Content Creator</strong></p>
              <p>• Registered Handles: <strong className="text-cyan-400">@evelyn_carter, @drcarter_bio</strong></p>
              <p>• Authorization Status: <strong className="text-emerald-400">VERIFIED & AUDITABLE VICTIM CONSENT GRANTED</strong></p>
            </div>
          </div>

          {/* SECTION 2: OFFENDING CREATOR ACCOUNT & POST DETAILS */}
          <div className="space-y-1.5 border-b border-slate-800/60 pb-4">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> 2. OFFENDING ACCOUNT & UNUSUAL CONTENT CREATOR DETAILS
            </h4>
            <div className="pl-6 space-y-1 text-[11px] text-slate-300">
              <p>• Created By Offender Account: <strong className="text-rose-400">@viral_leak_x</strong></p>
              <p>• Target Violation URL: <strong className="text-cyan-300 underline">https://instagram.com/p/sample_leak_01</strong></p>
              <p>• Policy Violation Category: <strong className="text-white">Impersonation, Non-Consensual Manipulated Media & Defamation</strong></p>
            </div>
          </div>

          {/* SECTION 3: UNUSUAL CONTENT PROOF (LEAK EVIDENCE) */}
          <div className="space-y-1.5 border-b border-slate-800/60 pb-4">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" /> 3. UNUSUAL CONTENT PROOF (LEAK EVIDENCE)
            </h4>
            <div className="pl-6 space-y-1 text-[11px] text-slate-300">
              <p>• Evidence Screenshot ID: <strong className="text-white">EVD-2041-01 (Manipulated Image & Fake Caption)</strong></p>
              <p>• Perceptual Image Hash (pHash): <strong className="text-violet-300 font-mono">pHash-8f9a2b1c4e</strong></p>
              <p className="break-all">• SHA-256 Checksum: <strong className="text-cyan-300 font-mono">ab4f91dc88231a47e0912389174128941029381029381029381029381</strong></p>
              <p>• Visual Match Confidence: <strong className="text-emerald-400 font-bold">96% High Visual Similarity</strong></p>
            </div>
          </div>

          {/* SECTION 4: ORIGINAL UNUSUAL CONTENT PROOF (BASELINE REFERENCE) */}
          <div className="space-y-1.5 border-b border-slate-800/60 pb-4">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> 4. ORIGINAL UNUSUAL CONTENT PROOF (BASELINE REFERENCE)
            </h4>
            <div className="pl-6 space-y-1 text-[11px] text-slate-300">
              <p>• Original Reference Image ID: <strong className="text-white">REF-PHOTO-ORIGINAL-01</strong></p>
              <p>• Baseline pHash Code: <strong className="text-emerald-400 font-mono">pHash-8f9a2b0000</strong></p>
              <p>• Forensic Analysis: <strong className="text-slate-200">Conclusively proves the offender cropped, edited, and attached fake quotes to the victim's authentic photograph.</strong></p>
            </div>
          </div>

          {/* SECTION 5: VICTIM IMPACT STATEMENT */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> 5. VICTIM IMPACT STATEMENT
            </h4>
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[11px] text-slate-200 font-sans leading-relaxed italic">
              "This unauthorized manipulated post and false claim has caused severe psychological distress, personal harassment, and significant harm to the victim's professional reputation. The unconsented viral circulation is creating ongoing public defamation and safety concerns for the victim, requiring immediate restriction and global content removal."
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Tamper-evident PDF signature attached
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              Close Preview
            </button>
            <a
              href="http://localhost:8000/api/v1/reports/HC-2041/pdf"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Official PDF Dossier
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
