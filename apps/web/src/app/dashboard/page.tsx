'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert,
  Globe,
  ExternalLink, AlertTriangle, Search, FileText, CheckCircle2, ArrowRight, Eye, Shield, Send, RefreshCw, Network, Sparkles, Filter, Activity, BarChart2, TrendingUp, Lock
} from 'lucide-react';
import { PropagationGraph } from '@/components/PropagationGraph';
import { useSentinelUser } from '@/context/SentinelUserContext';

export default function DashboardPage() {
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'RESOLVED'>('ALL');

  const { currentUser, incidents } = useSentinelUser();

  const newsLeaks = incidents.map((item) => ({
    id: item.id,
    url: item.url,
    title: item.title,
    platform: item.platform,
    account: item.account,
    priority: (item.priority || (item.matchScore >= 75 ? 'HIGH' : 'MEDIUM')) as 'HIGH' | 'MEDIUM' | 'RESOLVED',
    priorityBadge: item.priorityBadge || (item.matchScore >= 75 ? 'HIGH PRIORITY' : 'AMBIGUOUS REVIEW'),
    matchScore: item.matchScore,
    status: item.status,
    date: item.date,
    summary: `${item.type} targeting ${currentUser.name} on ${item.platform} (${item.account}).`,
  }));

  const filteredNews = newsLeaks.filter((item) => {
    if (priorityFilter === 'HIGH') return item.priority === 'HIGH';
    if (priorityFilter === 'MEDIUM') return item.priority === 'MEDIUM';
    if (priorityFilter === 'RESOLVED') return item.priority === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      {/* Welcome Banner */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">HOME DASHBOARD</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Protection Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Social Media Fake Post & Leak Protection
          </h1>
          <p className="text-xs text-slate-400 mt-1">We search social media for fake posts targeting you, save proof, and help you get them deleted.</p>
        </div>


      </div>


      {/* Main Stats Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Main Cases</span>
          <span className="text-2xl font-black text-white mt-1 block">1 Case</span>
          <span className="text-[10px] text-cyan-400 block mt-1">HC-2041 Active</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Fake Posts Found</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">10 Posts</span>
          <span className="text-[10px] text-slate-400 block mt-1">Across 4 Apps</span>
        </div>



        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Posts Removed</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">14 Posts</span>
          <span className="text-[10px] text-emerald-400 block mt-1">Deleted by Apps</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Cleanup Rate</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">94%</span>
          <span className="text-[10px] text-slate-400 block mt-1">Protection Rating</span>
        </div>
      </div>

      {/* ADVANCED DIGITAL CONTAINMENT CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Link href="/compare" className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/90 hover:border-cyan-400 transition-all group shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              CROP-RESISTANT AI
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-extrabold text-white text-sm">Pairwise Media Comparison</h4>
          <p className="text-xs text-slate-400 mt-1">
            Compare candidate media with SIFT keypoints, USAC-MAGSAC homography, and regional tiling.
          </p>
        </Link>

        <Link href="/partners" className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/90 hover:border-emerald-400 transition-all group shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SIMULATED DEMO
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-extrabold text-white text-sm">Partner Registry & Demo</h4>
          <p className="text-xs text-slate-400 mt-1">
            Publish approved fingerprints to partner feeds and test platform policy webhook callbacks.
          </p>
        </Link>

        <Link href="/incidents/HC-2041" className="glass-card p-5 rounded-2xl border border-violet-500/30 bg-slate-900/90 hover:border-violet-400 transition-all group shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
              MASTER CASE
            </span>
            <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-extrabold text-white text-sm">Master Incident HC-2041</h4>
          <p className="text-xs text-slate-400 mt-1">
            Expandable case container with 2 verified variants, 7 occurrences, and full audit provenance.
          </p>
        </Link>

      </div>

      {/* PRIORITY FEED OF FAKE NEWS & LEAKS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/90">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">PRIORITY NEWS & LEAK MONITOR</span>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> High Priority News & Fake Post Alerts
            </h3>
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {[
              { id: 'ALL', label: 'All Leaks (5)' },
              { id: 'HIGH', label: 'High Priority (2)' },
              { id: 'MEDIUM', label: 'Medium Priority (2)' },
              { id: 'RESOLVED', label: 'Resolved (1)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPriorityFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  priorityFilter === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Cards Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((news) => (
            <div key={news.id} className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{news.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold uppercase">{news.platform}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded font-black uppercase tracking-wider border ${
                  news.priority === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : news.priority === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {news.priorityBadge}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{news.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{news.summary}</p>
                <div className="text-[11px] font-mono text-slate-400 mt-2">Posted By: <strong className="text-slate-200">{news.account}</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Match Score</span>
                <span className="font-extrabold text-cyan-400">{news.matchScore}% Match</span>
                <span className="text-[11px] text-slate-500">{news.date}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-400">Status: <strong className="text-slate-200">{news.status}</strong></span>
                <div className="flex items-center gap-2">
                  <a
                    href={(news as any).url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-sm"
                    title={`Inspect real post directly on ${news.platform}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Inspect Post
                  </a>
                  <Link
                    href="/platforms"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-400" /> Containment Hub
                  </Link>
                </div>
              </div>


            </div>
          ))}
        </div>
      </div>



      {/* VISUAL SPREAD VELOCITY & TAKEDOWN TIMELINE ANALYTICS */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">VISUAL ANALYTICS</span>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
              <BarChart2 className="w-5 h-5 text-cyan-400" /> Spread Velocity vs Takedown Speed
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 94% Takedown Efficiency
          </span>
        </div>

        {/* Visual Analytics Bar Comparison */}
        <div className="space-y-4 pt-2">
          {[
            { platform: 'Instagram', detected: 4, removed: 4, percent: 100, color: 'bg-emerald-500' },
            { platform: 'X (Twitter)', detected: 3, removed: 2, percent: 67, color: 'bg-cyan-500' },
            { platform: 'Facebook', detected: 2, removed: 2, percent: 100, color: 'bg-blue-500' },
            { platform: 'YouTube', detected: 1, removed: 1, percent: 100, color: 'bg-violet-500' },
          ].map((bar) => (
            <div key={bar.platform} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span>{bar.platform}</span>
                <span>{bar.removed} of {bar.detected} Removed ({bar.percent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                <div className={`h-full ${bar.color} transition-all duration-500 rounded-full`} style={{ width: `${bar.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
