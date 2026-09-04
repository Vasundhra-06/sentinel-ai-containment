'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Activity, 
  Cpu, 
  Lock, 
  Clock, 
  Share2, 
  Layers, 
  CheckCircle,
  HelpCircle,
  Radio
} from 'lucide-react';
import { AutopilotToggle } from '@/components/AutopilotToggle';
import { VerificationBreakdown } from '@/components/VerificationBreakdown';

export default function AutopilotPage() {
  const [isAutopilot, setIsAutopilot] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'AUTO' | 'MANUAL'>('ALL');

  useEffect(() => {
    const saved = localStorage.getItem('sentinel_autopilot_mode');
    if (saved !== null) {
      setIsAutopilot(saved === 'true');
    }
  }, []);

  // Incidents data showcasing the 75% Autopilot threshold
  const incidents = [
    {
      id: 'AUTO-INSTA-01',
      title: 'Deepfake Video Reel with Fake Audio',
      platform: 'Instagram',
      account: '@viral_clips_daily',
      matchScore: 96,
      date: 'Today, 14:22 UTC',
      status: 'Auto-Report Dispatched',
      summary: 'Manipulated video reel with synthesized voice clone impersonating the target.',
      url: 'https://www.instagram.com/reel/C9x81kLmPq/',
      sha256: '4f1fbc178456b8433a764893fb10a4d9ab4f91dc88231a47e091238917412894',
    },
    {
      id: 'AUTO-X-02',
      title: 'Stolen Photo & Defamatory Caption',
      platform: 'X (Twitter)',
      account: '@breaking_buzz_99',
      matchScore: 92,
      date: 'Today, 11:05 UTC',
      status: 'Auto-Report Dispatched',
      summary: 'Stolen high-res portrait reposted with fraudulent accusations and impersonation tags.',
      url: 'https://x.com/breaking_buzz_99/status/179218291044',
      sha256: '8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
    },
    {
      id: 'AUTO-FB-03',
      title: 'Fabricated Quote Graphic in Public Group',
      platform: 'Facebook',
      account: 'Group: Medical & Science News',
      matchScore: 88,
      date: 'Yesterday, 18:40 UTC',
      status: 'Auto-Report Dispatched',
      summary: 'Image flyer featuring target photo paired with misleading financial claims.',
      url: 'https://www.facebook.com/groups/medicalnews/posts/991823104',
      sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    },
    {
      id: 'MANUAL-YT-04',
      title: 'Lookalike Video Derivative with Misleading Title',
      platform: 'YouTube',
      account: 'BuzzShorts HD',
      matchScore: 68,
      date: 'Yesterday, 09:15 UTC',
      status: 'Awaiting User Authorization',
      summary: 'Partial facial similarity in video clip. Match score (68%) is below 75% threshold.',
      url: 'https://www.youtube.com/shorts/v_882910',
      sha256: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
    },
    {
      id: 'MANUAL-REDDIT-05',
      title: 'Low-Res Forum Screenshot with Ambiguous Context',
      platform: 'Reddit',
      account: 'u/forum_investigator',
      matchScore: 71,
      date: 'Aug 29, 2026',
      status: 'Awaiting User Authorization',
      summary: 'Blurry crop from image thread. Ambiguous match (71%) requires human-in-the-loop review.',
      url: 'https://www.reddit.com/r/technology/comments/1f8e91/rumor_investigation',
      sha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    },
    {
      id: 'AUTO-REDDIT-06',
      title: 'Viral Defamatory Meme Post',
      platform: 'Reddit',
      account: 'u/meme_overlord',
      matchScore: 78,
      date: 'Aug 28, 2026',
      status: 'Takedown Confirmed',
      summary: 'Defamatory post removed after automated legal notice sent to moderators.',
      url: 'https://www.reddit.com/r/memes/comments/1f8f92/viral_meme_post',
      sha256: '7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
    },
  ];

  const filteredIncidents = incidents.filter((item) => {
    if (filter === 'AUTO') return item.matchScore >= 75;
    if (filter === 'MANUAL') return item.matchScore < 75;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">
              MAIN MENU / AUTONOMOUS PROTECTION
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> 24/7 Autopilot Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-cyan-400" /> AI Autopilot Containment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous threat detection, confidence-tiered verification, and instant legal report dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/detections"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Run Manual Scan
          </Link>
        </div>
      </div>

      {/* Autopilot Controller Banner */}
      <AutopilotToggle onModeChange={(enabled) => setIsAutopilot(enabled)} />

      {/* Threshold Policy Visualizer Card */}
      <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Enforcement Protocol & Confidence Threshold
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800">
            Rule: 75% Confidence Boundary
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ≥ 75% MATCH: AUTONOMOUS DISPATCH
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Zero-Touch
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When biometric facial hashes, text handles, and synthesis indicators score <strong>75% or higher</strong>, Autopilot instantly files DMCA/platform violation notices to the host network without requiring victim interaction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> &lt; 75% MATCH: ASSISTED HUMAN REVIEW
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Manual Approval
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When a match is ambiguous (below 75%), Autopilot halts automated dispatch to prevent false reports. The post is staged with an explainable match breakdown and requires your 1-click authorization via <strong>Allow & Send</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Autopilot Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Threats Contained</span>
          <span className="text-2xl font-black text-white mt-1 block">42</span>
          <span className="text-[10px] text-emerald-400 block mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 100% High-Conf Resolved
          </span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Autonomous Reports (≥75%)</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">38</span>
          <span className="text-[10px] text-slate-400 block mt-1">Dispatched in &lt; 1.4s</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Assisted Queue (&lt;75%)</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">4</span>
          <span className="text-[10px] text-amber-400 block mt-1">Requires 1-Click Approval</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Monitored Social APIs</span>
          <span className="text-2xl font-black text-white mt-1 block">5 Apps</span>
          <span className="text-[10px] text-cyan-400 block mt-1">Insta, X, FB, YT, Reddit</span>
        </div>
      </div>

      {/* Live Incidents & Takedown Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/90">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">
              AUTOPILOT ENFORCEMENT QUEUE
            </span>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
              <Activity className="w-5 h-5 text-cyan-400" /> Active Monitored Social Media Incidents
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Posts ({incidents.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('AUTO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'AUTO'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Auto-Dispatched ≥75% (4)
            </button>
            <button
              type="button"
              onClick={() => setFilter('MANUAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'MANUAL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manual Review &lt;75% (2)
            </button>
          </div>
        </div>

        {/* Threat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIncidents.map((item) => (
            <div
              key={item.id}
              className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{item.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold uppercase">
                    {item.platform}
                  </span>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded font-black uppercase tracking-wider border ${
                  item.matchScore >= 75
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {item.matchScore >= 75 ? 'HIGH CONFIDENCE' : 'AMBIGUOUS MATCH'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.summary}</p>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  Posted By: <strong className="text-slate-200">{item.account}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Match Confidence</span>
                <span className={`font-extrabold ${item.matchScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {item.matchScore}% Match
                </span>
                <span className="text-[11px] text-slate-500">{item.date}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-400">
                  Status: <strong className="text-slate-200">{item.status}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-cyan-950/40"
                    title={`Inspect real post directly on ${item.platform}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Inspect Post
                  </a>
                  <Link
                    href="/reports"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Evidence Dossier
                  </Link>
                </div>
              </div>

              {/* Autopilot Verification & 75% Threshold Engine */}
              <VerificationBreakdown
                score={item.matchScore}
                platform={item.platform}
                account={item.account}
                title={item.title}
                isAutopilot={isAutopilot}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Connected Social Platform Dispatch Gateways */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Connected Social Media Dispatch Gateways
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All 5 Gateways Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {[
            { name: 'Instagram', api: 'Meta Graph Trust API', status: 'Connected', auto: true },
            { name: 'X (Twitter)', api: 'X Takedown Endpoint', status: 'Connected', auto: true },
            { name: 'Facebook', api: 'Meta Rights Manager', status: 'Connected', auto: true },
            { name: 'YouTube', api: 'Content ID Legal API', status: 'Connected', auto: true },
            { name: 'Reddit', api: 'Reddit Legal Moderation', status: 'Connected', auto: true },
          ].map((gateway) => (
            <div key={gateway.name} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-white block">{gateway.name}</span>
              <span className="text-[10px] text-slate-400 block">{gateway.api}</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  {gateway.status}
                </span>
                <span className="text-[9px] text-cyan-400 font-bold">Auto-Send Ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
