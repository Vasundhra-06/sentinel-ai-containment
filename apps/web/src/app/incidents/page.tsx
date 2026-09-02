'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, ArrowUpRight, CheckCircle2, Layers } from 'lucide-react';
import { MOCK_MASTER_INCIDENT } from '@/lib/mockData';

export default function IncidentsDirectoryPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Master Incidents Directory
          </h1>
          <p className="text-xs text-gray-400 mt-1">Incident-Centric Digital Containment Containers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-500/50 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> HIGH RISK (88/100)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  ACTIVE MONITORING
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{MOCK_MASTER_INCIDENT.id}: {MOCK_MASTER_INCIDENT.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Protected Person: <strong className="text-gray-200">{MOCK_MASTER_INCIDENT.protectedProfile}</strong></p>
            </div>

            <Link
              href={`/incidents/${MOCK_MASTER_INCIDENT.id}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 self-start sm:self-center"
            >
              Open Incident Workspace <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-gray-300 my-4 leading-relaxed">
            {MOCK_MASTER_INCIDENT.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-black/40 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-gray-400 block text-[11px]">Occurrences</span>
              <span className="font-bold text-white text-base">{MOCK_MASTER_INCIDENT.occurrencesCount} Linked</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Platforms</span>
              <span className="font-bold text-cyan-400 text-base">{MOCK_MASTER_INCIDENT.platformsCount} Social Sources</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Unique Variants</span>
              <span className="font-bold text-violet-400 text-base">{MOCK_MASTER_INCIDENT.variantsCount} Formats</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Re-Uploads</span>
              <span className="font-bold text-amber-400 text-base">{MOCK_MASTER_INCIDENT.reUploadsCount} Recurrent</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Containment Rate</span>
              <span className="font-bold text-emerald-400 text-base">{MOCK_MASTER_INCIDENT.containmentRate}% Restricted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
