'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  Image as ImageIcon, 
  Heart, 
  Lock, 
  Send, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  ExternalLink,
  Flame,
  Scale
} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNotice?: 'first' | 'second';
}

export function ReportDossierModal({ isOpen, onClose, defaultNotice = 'first' }: ModalProps) {
  const [noticeType, setNoticeType] = useState<'first' | 'second'>(defaultNotice);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans animate-in fade-in duration-150">
      <div className="glass-card w-full max-w-3xl p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-slate-900 relative shadow-2xl overflow-y-auto max-h-[92vh] space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Title */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
            noticeType === 'second' 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/20' 
              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-cyan-500/20'
          }`}>
            {noticeType === 'second' ? <Flame className="w-6 h-6 text-rose-400 animate-pulse" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
                {noticeType === 'second' ? 'STATUTORY ESCALATION DOSSIER' : 'OFFICIAL CONTENT TAKEDOWN REPORT'}
              </span>
              {noticeType === 'second' && (
                <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40 animate-pulse">
                  SECOND TIMED NOTICE
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-white mt-0.5">
              {noticeType === 'second'
                ? '2nd-Timed Escalation: Platform Non-Compliance & Repeat Re-Upload'
                : 'Platform Review Dossier (#REP-2041-01)'}
            </h3>
            <p className="text-xs text-slate-400">
              Recipient: <strong className="text-cyan-300">Meta Trust & Safety / Instagram General Counsel</strong>
            </p>
          </div>
        </div>

        {/* NOTICE TYPE SELECTOR TABS */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setNoticeType('first')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              noticeType === 'first'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> 1st Notice: Standard Takedown Report
          </button>
          <button
            type="button"
            onClick={() => setNoticeType('second')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              noticeType === 'second'
                ? 'bg-gradient-to-r from-rose-500/25 to-amber-500/25 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-950/40'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" /> 
            <span>2nd Notice: Escalated (Ignored 1st Report + Re-Upload)</span>
          </button>
        </div>

        {/* ----------------- 1ST NOTICE LAYOUT ----------------- */}
        {noticeType === 'first' && (
          <div className="bg-[#070c18] p-6 rounded-2xl border border-slate-800 text-xs font-mono text-slate-200 space-y-6 leading-relaxed shadow-inner animate-in fade-in duration-200">
            {/* Header Tag */}
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center text-cyan-400 font-bold">
              <span>SENTINEL TAKEDOWN & RESTRICTION DOSSIER</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                INITIAL NOTICE • VERIFIED & AUDITABLE
              </span>
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
                &quot;This unauthorized manipulated post and false claim has caused severe psychological distress, personal harassment, and significant harm to the victim's professional reputation. The unconsented viral circulation is creating ongoing public defamation and safety concerns for the victim, requiring immediate restriction and global content removal.&quot;
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 2ND NOTICE (ESCALATED FORMAT) ----------------- */}
        {noticeType === 'second' && (
          <div className="bg-[#070c18] p-6 rounded-2xl border border-rose-500/30 text-xs font-mono text-slate-200 space-y-5 leading-relaxed shadow-inner animate-in fade-in duration-200">
            {/* Escalation Banner */}
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="text-xs font-black text-rose-200 block uppercase tracking-wider">
                      STATUTORY NON-COMPLIANCE & REPEAT INFRINGER ESCALATION
                    </span>
                    <p className="text-[11px] text-rose-300/90 mt-0.5 font-sans">
                      The host platform owner ignored the initial takedown notice (#REP-2041-01), allowing the same offender ID (<strong className="text-white">@viral_leak_x</strong>) to re-upload recurrent derivatives. Safe harbor immunity is formally contested.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1.5 flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  AUTO-DISPATCHED
                </span>
              </div>
              <div className="text-[10px] bg-slate-950/70 p-2 rounded border border-rose-500/30 text-slate-300 font-mono flex flex-wrap items-center justify-between gap-2">
                <span>Dispatch Mode: <strong className="text-emerald-400">Sentinel Autopilot (Zero-Touch)</strong></span>
                <span>Gateway: <strong className="text-cyan-400">Meta Legal Compliance API</strong></span>
                <span>Audit Ref: <strong className="text-amber-400">#ESC-META-90412</strong></span>
              </div>
            </div>

            {/* SECTION 1: VICTIM PROFILE */}
            <div className="space-y-1.5 border-b border-slate-800/60 pb-3">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" /> 1. AFFECTED PERSON DETAILS (RE-VERIFIED VICTIM PROFILE)
              </h4>
              <div className="pl-6 space-y-1 text-[11px] text-slate-300">
                <p>• Protected Individual: <strong className="text-white">Dr. Evelyn Carter</strong> (Research Scientist & Verified Creator)</p>
                <p>• Handles: <strong className="text-cyan-400">@evelyn_carter, @drcarter_bio</strong></p>
                <p>• Representation: <strong className="text-emerald-400">SENTINEL Incident Containment System (Certified Legal Proxy)</strong></p>
              </div>
            </div>

            {/* SECTION 2: REPEAT INFRINGER ACCOUNT & RECURRENT RECORD */}
            <div className="space-y-1.5 border-b border-slate-800/60 pb-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> 2. REPEAT INFRINGER ACCOUNT & POSTING PATTERN
              </h4>
              <div className="pl-6 space-y-1 text-[11px] text-slate-300">
                <p>• Offender ID: <strong className="text-rose-400 font-bold">@viral_leak_x</strong> (CONFIRMED REPEAT OFFENDER)</p>
                <p>• Violation History: <strong className="text-amber-300">4 Verified Recurrent Violations on record</strong></p>
                <p>• Malicious Pattern: <span className="text-slate-300">Account re-uploads cropped variations and audio synthesis following initial notification.</span></p>
              </div>
            </div>

            {/* SECTION 3: RECORD OF IGNORED 1ST REPORT */}
            <div className="space-y-1.5 border-b border-slate-800/60 pb-3">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" /> 3. AUDIT TRAIL OF UNANSWERED / IGNORED 1ST REPORT
              </h4>
              <div className="pl-6 space-y-1 text-[11px] text-slate-300">
                <p>• Original Notice Ticket: <strong className="text-cyan-300">#REP-2041-01</strong> (Dispatched via Meta Graph API)</p>
                <p>• Transmission Timestamp: <strong className="text-slate-200">August 28, 2026, 15:00 UTC</strong></p>
                <p>• Response Status: <strong className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">UNRESPONSIVE / IGNORED (&gt; 48 Hours Exceeded)</strong></p>
                <p>• Statutory Breach: <span className="text-slate-300">Service provider failed to act expeditiously to remove the unauthorized content upon notification.</span></p>
              </div>
            </div>

            {/* SECTION 4: NEW RE-UPLOAD FORENSIC EVIDENCE */}
            <div className="space-y-1.5 border-b border-slate-800/60 pb-3">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" /> 4. NEW RE-UPLOAD FORENSIC PROOF (RECURRENT LEAK)
              </h4>
              <div className="pl-6 space-y-1 text-[11px] text-slate-300">
                <p>• Active Recurrent Post URL: <strong className="text-cyan-300 underline">https://instagram.com/reel/C9x81kLmPq/</strong></p>
                <p>• New Evidence Record: <strong className="text-white">EVD-2041-006 (Recurrent Video Derivative with Synthesized Audio)</strong></p>
                <p>• Perceptual Hash (pHash): <strong className="text-violet-300">pHash-8f9a2b1c70</strong> (Distance: 2 from baseline)</p>
                <p className="break-all">• Cryptographic SHA-256: <strong className="text-cyan-300">5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6</strong></p>
                <p>• Biometric Facial Correlation: <strong className="text-emerald-400 font-bold">96% High Biometric Certainty</strong></p>
              </div>
            </div>

            {/* SECTION 5: DEMANDED ESCALATED REMEDIES */}
            <div className="space-y-1.5 border-b border-slate-800/60 pb-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" /> 5. MANDATORY ESCALATED REMEDIES DEMANDED
              </h4>
              <div className="pl-6 space-y-1.5 text-[11px] text-slate-300">
                <p>• <strong className="text-white">1. Immediate Global Deletion:</strong> Expeditiously delete both the original post and all recurring derivatives across CDNs.</p>
                <p>• <strong className="text-rose-400 font-bold">2. Permanent Account Termination:</strong> Permanently ban offender account <strong className="text-white">@viral_leak_x</strong> pursuant to repeat infringer mandates under 17 U.S.C. § 512(i) & EU Digital Services Act Article 23.</p>
                <p>• <strong className="text-cyan-300">3. Hash-Level Upload Interception:</strong> Ingest the provided pHash and SHA-256 into automated upload filters to block mirror accounts.</p>
              </div>
            </div>

            {/* SECTION 6: SAFE HARBOR FORFEITURE */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> 6. SAFE HARBOR FORFEITURE & RESERVATION OF RIGHTS
              </h4>
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[11px] text-slate-200 font-sans leading-relaxed italic">
                &quot;FORMAL NOTICE: Having received formal notice of infringement and subsequently allowed repeat re-uploads by the identical account, the platform can no longer claim safe harbor immunity under 17 U.S.C. § 512(c)(1)(A). Continued hosting creates direct contributory liability with statutory damages of up to $150,000 per willful violation. All civil and injunctive remedies are expressly reserved.&quot;
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {noticeType === 'second' 
              ? 'Escalated Statutory Packet • Certified Hash Fingerprints'
              : 'Tamper-evident PDF signature attached'}
          </span>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {noticeType === 'second' && (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>✓ Autopilot: 2nd Notice Auto-Dispatched to Meta Legal Counsel</span>
              </span>
            )}

            <a
              href={noticeType === 'second' 
                ? 'http://localhost:8000/api/v1/reports/HC-2041/second-notice/pdf'
                : 'http://localhost:8000/api/v1/reports/HC-2041/pdf'
              }
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> 
              {noticeType === 'second' ? 'Download 2nd Notice PDF' : 'Download 1st Notice PDF'}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
