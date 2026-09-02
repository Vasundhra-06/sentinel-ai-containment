'use client';

import React from 'react';
import { Network, Share2, ArrowRight, CheckCircle, ShieldAlert, FileText, Sparkles } from 'lucide-react';

export function PropagationGraph() {
  const nodes = [
    {
      id: 'root',
      label: 'Master Incident HC-2041',
      sub: 'Original Upload',
      platform: 'Instagram',
      type: 'root',
      variant: 'Original',
      status: 'Removed',
      date: '2026-08-28 14:22',
      account: '@unauth_source_01',
      color: 'border-cyan-500 bg-cyan-950/80 text-cyan-300'
    },
    {
      id: 'crop1',
      label: 'HC-2041-002',
      sub: 'Cropped Variant',
      platform: 'Instagram',
      type: 'child',
      variant: 'Cropped',
      status: 'Removed',
      date: '2026-08-28 16:05',
      account: '@repost_bot_99',
      color: 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
    },
    {
      id: 'screen1',
      label: 'HC-2041-003',
      sub: 'X Screenshot',
      platform: 'X (Twitter)',
      type: 'child',
      variant: 'Screenshot',
      status: 'Restricted',
      date: '2026-08-29 02:40',
      account: '@viral_leaks_x',
      color: 'border-violet-500 bg-violet-950/40 text-violet-200'
    },
    {
      id: 'fb1',
      label: 'HC-2041-004',
      sub: 'Facebook Edit',
      platform: 'Facebook',
      type: 'child',
      variant: 'Cropped',
      status: 'Removed',
      date: '2026-08-29 08:15',
      account: '@campus_news_unfiltered',
      color: 'border-blue-500 bg-blue-950/40 text-blue-200'
    },
    {
      id: 'meme1',
      label: 'HC-2041-005',
      sub: 'Reddit Meme',
      platform: 'Reddit',
      type: 'child',
      variant: 'Meme Overlay',
      status: 'Active',
      date: '2026-08-29 11:50',
      account: 'u/meme_lord_academic',
      color: 'border-amber-500 bg-amber-950/40 text-amber-200'
    },
    {
      id: 'yt1',
      label: 'HC-2041-006',
      sub: 'YouTube Short',
      platform: 'YouTube',
      type: 'child',
      variant: 'Video Clip',
      status: 'Pending Review',
      date: '2026-08-30 08:30',
      account: '@drama_recap_daily',
      color: 'border-rose-500 bg-rose-950/40 text-rose-200'
    }
  ];

  return (
    <div className="w-full glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Propagation Topology Graph
          </h3>
          <p className="text-xs text-gray-400">Visualizing detected derivative paths and cross-platform spread</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live Multimodal Lineage
          </span>
        </div>
      </div>

      {/* Interactive Propagation Map */}
      <div className="relative min-h-[380px] w-full bg-[#080d18] rounded-xl border border-white/5 p-6 flex flex-col justify-center items-center">
        {/* Master Node */}
        <div className="mb-8 p-4 rounded-xl border-2 border-cyan-400 bg-cyan-950/80 shadow-lg shadow-cyan-500/20 text-center w-72 transition-all hover:scale-105">
          <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 mb-1">
            <span>MASTER INCIDENT</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300">Instagram</span>
          </div>
          <h4 className="font-bold text-white text-base">HC-2041 (Original)</h4>
          <p className="text-xs text-gray-300 mt-1">First detected: @unauth_source_01</p>
          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ✓ Status: Removed
          </span>
        </div>

        {/* Branch Lines */}
        <div className="w-full flex justify-center items-center gap-4 relative mb-6">
          <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-400 to-violet-500" />
        </div>

        {/* Derivative Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          {nodes.slice(1).map((node) => (
            <div
              key={node.id}
              className={`p-3.5 rounded-xl border ${node.color} backdrop-blur-md shadow-md transition-all hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                <span>{node.platform}</span>
                <span className="opacity-80">{node.variant}</span>
              </div>
              <h5 className="font-bold text-white text-xs">{node.label}</h5>
              <p className="text-[11px] text-gray-300 truncate mt-0.5">{node.account}</p>
              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="text-gray-400">{node.date.split(' ')[0]}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-semibold ${
                    node.status === 'Removed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : node.status === 'Restricted'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : node.status === 'Active'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {node.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-400 px-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Removed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Restricted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Pending Review
          </span>
        </div>
        <p className="text-[11px]">Note: Lineage maps detected timing and similarity correlations</p>
      </div>
    </div>
  );
}
