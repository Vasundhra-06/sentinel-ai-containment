'use client';

import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Layers, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Containment Analytics & Predictive Intelligence
          </h1>
          <p className="text-xs text-gray-400 mt-1">Multi-platform incident analytics for Master Incident HC-2041</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-gray-400 font-medium">Overall Containment Velocity</span>
          <div className="text-3xl font-extrabold text-emerald-400 flex items-center gap-2">
            78% <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs text-gray-400">21 out of 27 occurrences successfully restricted across platforms</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-gray-400 font-medium">Top Platform Distribution</span>
          <div className="text-3xl font-extrabold text-cyan-400">Instagram / X</div>
          <p className="text-xs text-gray-400">Accounts for 62% of initial variant detection volume</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-gray-400 font-medium">Re-Upload Interception</span>
          <div className="text-3xl font-extrabold text-violet-400">4 Caught</div>
          <p className="text-xs text-gray-400">Recurring signatures automatically flagged post-restriction</p>
        </div>
      </div>
    </div>
  );
}
