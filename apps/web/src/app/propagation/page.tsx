'use client';

import React from 'react';
import { PropagationGraph } from '@/components/PropagationGraph';

export default function StandalonePropagationPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Propagation Intelligence Visualizer
          </h1>
          <p className="text-xs text-gray-400 mt-1">Cross-platform lineage mapping for Master Incident HC-2041</p>
        </div>
      </div>

      <PropagationGraph />
    </div>
  );
}
