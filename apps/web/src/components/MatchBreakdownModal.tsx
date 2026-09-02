'use client';

import React from 'react';
import { X, CheckCircle, ShieldAlert, Sparkles, FileText, AlertTriangle } from 'lucide-react';

export function MatchBreakdownModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-card w-full max-w-xl p-6 rounded-2xl border border-white/10 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Explainable AI Similarity Breakdown</h3>
            <p className="text-xs text-gray-400">Master Incident Match: <span className="text-cyan-400 font-semibold">HC-2041</span></p>
          </div>
        </div>

        {/* Overall Match Score Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-violet-950/60 border border-cyan-500/30 flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-cyan-300 font-medium">Overall Confidence Score</span>
            <div className="text-2xl font-extrabold text-white flex items-center gap-2">
              94% <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">LIKELY RELATED</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">Risk Assessment</span>
            <div className="text-sm font-bold text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> HIGH RISK
            </div>
          </div>
        </div>

        {/* Multimodal Score Matrix */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Visual Perceptual Hash (pHash)</span>
              <span className="text-cyan-400">94%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">OCR Text Overlay Extraction</span>
              <span className="text-violet-400">88%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-violet-400 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Semantic Text NLP Similarity</span>
              <span className="text-cyan-400">91%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: '91%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Target Context & Entity Correlation</span>
              <span className="text-violet-400">93%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-violet-400 rounded-full" style={{ width: '93%' }} />
            </div>
          </div>
        </div>

        {/* Recommendation Box */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6 text-xs">
          <h4 className="font-semibold text-white mb-1 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> System Recommendation
          </h4>
          <p className="text-gray-300">
            Suggest association with Master Incident <span className="text-cyan-400 font-semibold">HC-2041</span> and queue for automated platform reporting.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
          >
            Close Breakdown
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            Confirm & Associate
          </button>
        </div>
      </div>
    </div>
  );
}
