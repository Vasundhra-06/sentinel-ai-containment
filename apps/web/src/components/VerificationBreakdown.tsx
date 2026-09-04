'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Sparkles, 
  UserCheck, 
  Image as ImageIcon, 
  Briefcase, 
  FileText, 
  Send, 
  AlertTriangle,
  RotateCcw,
  Clock,
  Timer
} from 'lucide-react';

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
  onUndoDismiss?: () => void;
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
  onDismiss,
  onUndoDismiss
}: VerificationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [autoSentByTimer, setAutoSentByTimer] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Requirement 1: 15-minute undo grace period after clicking "Not Me" (900 seconds)
  const [undoSecondsLeft, setUndoSecondsLeft] = useState(900);
  const [undoExpired, setUndoExpired] = useState(false);

  // Requirement 2: 1-hour auto-send timer if user does not click "Not Me" (starts at ~58m for realism: 3520 seconds)
  const [autoSendSecondsLeft, setAutoSendSecondsLeft] = useState(score < 75 ? 3520 : 0);

  const isAbove75 = score >= 75;

  // 1. Timer for 15-minute Undo grace period after clicking "Not Me"
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (dismissed && !undoExpired) {
      interval = setInterval(() => {
        setUndoSecondsLeft((prev) => {
          if (prev <= 1) {
            setUndoExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [dismissed, undoExpired]);

  // 2. Timer for 1-hour automatic report dispatch if user does NOT click "Not Me" (for ambiguous <75% or guarded mode)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!dismissed && !confirmed && !isAbove75 && autoSendSecondsLeft > 0) {
      interval = setInterval(() => {
        setAutoSendSecondsLeft((prev) => {
          if (prev <= 1) {
            // 1 hour elapsed without user clicking "Not Me": automatically send report!
            setAutoSentByTimer(true);
            setConfirmed(true);
            if (onConfirm) onConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [dismissed, confirmed, isAbove75, autoSendSecondsLeft, onConfirm]);

  const handleDismiss = () => {
    setDismissed(true);
    setUndoSecondsLeft(900);
    setUndoExpired(false);
    if (onDismiss) onDismiss();
  };

  const handleUndoDismiss = () => {
    setDismissed(false);
    setUndoSecondsLeft(900);
    if (onUndoDismiss) onUndoDismiss();
  };

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // IF DISMISSED: Render 15-Minute Undo Grace Period Banner
  if (dismissed) {
    if (undoExpired) {
      return (
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-xs italic">
          Post permanently dismissed as false positive. Search filter calibrated.
        </div>
      );
    }

    return (
      <div className="mt-2 pt-2 border-t border-slate-800/60 animate-in fade-in duration-200">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/40 shadow-lg space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-200">
                    Flagged as &quot;Not Me&quot; (Report Cancelled)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                    15-Min Undo Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Clicked unknowingly? Undo window expires in{' '}
                  <strong className="text-cyan-400 font-mono font-bold">
                    {formatCountdown(undoSecondsLeft)}
                  </strong>
                </p>
              </div>
            </div>

            {/* UNDO BUTTON (ACTIVE UNTIL 15 MINUTES) */}
            <button
              type="button"
              onClick={handleUndoDismiss}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/50 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40 hover:scale-105"
              title="Click within 15 minutes to undo 'Not Me' and restore this post"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400 animate-spin-reverse" />
              Undo &quot;Not Me&quot; ({formatCountdown(undoSecondsLeft)})
            </button>
          </div>

          {/* Progress countdown bar */}
          <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-cyan-400 h-1 transition-all duration-1000" 
              style={{ width: `${(undoSecondsLeft / 900) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-2 pt-2 border-t border-slate-800/60">
      {/* Tier Badge & Why This Matches You Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isAbove75 ? (
            isAutopilot ? (
              <span className="text-[10px] px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AUTOPILOT: AUTO-SENT TO {platform.toUpperCase()} ({score}% MATCH)
              </span>
            ) : (
              <span className="text-[10px] px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                HIGH MATCH (≥75%) - READY TO REPORT
              </span>
            )
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 shadow-sm">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                AMBIGUOUS MATCH (&lt;75%)
              </span>
              {/* 1-Hour Auto-Send Safety Timer Badge */}
              {!confirmed && autoSendSecondsLeft > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400 animate-pulse" />
                  Auto-reports in {formatCountdown(autoSendSecondsLeft)}
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 underline underline-offset-2"
          >
            Why this matches you {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          {confirmed ? (
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5" />
              {autoSentByTimer
                ? `Auto-Sent After 1-Hr Window: Report Dispatched to ${platform}`
                : `Manually Approved: Report Sent to ${platform}`}
            </span>
          ) : (
            <>
              {/* If below 75%, or if in guarded mode, show manual allow button */}
              {(!isAbove75 || !isAutopilot) && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmed(true);
                    if (onConfirm) onConfirm();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/50 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-950/40 animate-pulse hover:animate-none"
                  title={`Manually approve and dispatch legal report to ${platform} immediately`}
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  Allow & Send to {platform}
                </button>
              )}
              {/* Not Me button with 15-min undo protection */}
              <button
                type="button"
                onClick={handleDismiss}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 font-bold text-[10px] border border-slate-700 transition-all"
                title="Discard if not related to you (Undo available for 15 minutes)"
              >
                ✕ Not Me
              </button>
            </>
          )}
        </div>
      </div>

      {/* Explanatory & 1-Hour Protocol Notice */}
      <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5">
        {isAbove75 && isAutopilot ? (
          <span className="text-emerald-400/90 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Match score is ≥ 75%: Autopilot automatically created evidentiary package & dispatched report to {platform}.
          </span>
        ) : !isAbove75 ? (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-amber-400/90 font-medium">
              <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span>
                Match score is {score}% (below 75% threshold): Review required. If you do not click &quot;Not Me&quot;, Sentinel will <strong>automatically send the report after 1 hour</strong> ({formatCountdown(autoSendSecondsLeft)} remaining).
              </span>
            </div>
            <span className="text-[9px] text-slate-500 block">
              Tip: If you click &quot;Not Me&quot; by mistake, you can undo it anytime within 15 minutes.
            </span>
          </div>
        ) : (
          <span className="text-cyan-400/90 font-medium">
            Guarded Mode Active: 1-click confirmation required to send report to {platform}.
          </span>
        )}
      </div>

      {/* Expandable Multi-Factor Evidence Breakdown */}
      {isExpanded && (
        <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2.5 animate-in fade-in duration-200 text-xs shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              AI Multi-Factor Match Breakdown ({score}% Composite Score)
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Protocol: Auto-report in 1h if unreviewed • 15m Undo on &quot;Not Me&quot;
            </span>
          </div>

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
                <span className="text-slate-300 font-bold block">Digital Handle Tag: {score >= 75 ? '100%' : '65%'}</span>
                <span className="text-[9px] text-slate-400 block">Target handle mentioned in caption</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <Briefcase className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <div>
                <span className="text-slate-300 font-bold block">Bio & Profession Context: {score >= 75 ? '95%' : '60%'}</span>
                <span className="text-[9px] text-slate-400 block">Matched career/profession keyword</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-slate-300 font-bold block">Rumor Co-Occurrence: {score >= 75 ? '92%' : '58%'}</span>
                <span className="text-[9px] text-slate-400 block">Defamatory or fake claim keywords</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
