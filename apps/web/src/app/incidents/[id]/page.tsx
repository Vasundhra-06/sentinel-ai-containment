'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, Shield, CheckCircle2, ArrowRight, ExternalLink, Download, FileText, 
  Send, Fingerprint, Lock, Eye, Sparkles, Network, RefreshCw, X, ShieldCheck, ChevronRight,
  BarChart2, Globe, Search, TrendingUp, Layers, Share2
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { PropagationGraph } from '@/components/PropagationGraph';


export default function IncidentDetailPage() {
  const [activeTab, setActiveTab] = useState<'stopncii' | 'socialSpread' | 'occurrences' | 'propagation' | 'variants'>('stopncii');
  const [isMediaBlurred, setIsMediaBlurred] = useState<boolean>(true);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedReportDossier, setSelectedReportDossier] = useState<any>(null);
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState<any>(null);
  const [selectedFingerprintModal, setSelectedFingerprintModal] = useState<any>(null);

  const incident = {
    id: 'HC-2041',
    title: 'Manipulated Photo & Impersonation Campaign',
    person: 'Dr. Evelyn Carter',
    riskLevel: 'HIGH RISK (88/100)',
    status: 'ACTIVE MONITORING',
    description: 'Unconsented manipulated image combined with false claims circulated across multiple social media platforms.',
    occurrencesCount: 27,
    platformsCount: 5,
    variantsCount: 8,
    reuploadsCount: 4,
    containmentRate: '78% Restricted',
  };

  // 2D Graph Data for X-Axis (Platforms) and Y-Axis (Posts Count & Takedowns)
  const platformChartData = [
    { name: 'Instagram', detected: 10, removed: 10, views: 6200, share: '37%' },
    { name: 'X (Twitter)', detected: 7, removed: 5, views: 4800, share: '26%' },
    { name: 'Facebook', detected: 5, removed: 5, views: 2900, share: '18%' },
    { name: 'YouTube', detected: 3, removed: 2, views: 1100, share: '11%' },
    { name: 'Reddit', detected: 2, removed: 2, views: 450, share: '8%' },
  ];

  // 2D Timeline Graph Data for X-Axis (Dates) and Y-Axis (Spread Views)
  const timelineChartData = [
    { date: 'Aug 28', instagram: 1200, twitter: 800, facebook: 400, youtube: 200, reddit: 100 },
    { date: 'Aug 29', instagram: 3500, twitter: 2400, facebook: 1500, youtube: 500, reddit: 300 },
    { date: 'Aug 30', instagram: 5800, twitter: 4100, facebook: 2400, youtube: 900, reddit: 450 },
    { date: 'Aug 31', instagram: 6200, twitter: 4600, facebook: 2900, youtube: 1100, reddit: 450 },
    { date: 'Today', instagram: 6200, twitter: 4800, facebook: 2900, youtube: 1100, reddit: 450 },
  ];

  const socialSpreadData = [
    {
      platform: 'Instagram',
      count: 10,
      percentage: 37,
      views: '6.2K Views',
      removed: 10,
      removedPercent: 100,
      color: 'from-pink-500 to-rose-600',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      type: 'Edited Photos & Impersonation Posts',
    },
    {
      platform: 'X (Twitter)',
      count: 7,
      percentage: 26,
      views: '4.8K Views',
      removed: 5,
      removedPercent: 71,
      color: 'from-cyan-400 to-blue-600',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      type: 'Fake Tweets & Retweets',
    },
    {
      platform: 'Facebook',
      count: 5,
      percentage: 18,
      views: '2.9K Views',
      removed: 5,
      removedPercent: 100,
      color: 'from-blue-600 to-indigo-700',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      type: 'Group Rumor Posts & Clips',
    },
    {
      platform: 'YouTube',
      count: 3,
      percentage: 11,
      views: '1.1K Views',
      removed: 2,
      removedPercent: 67,
      color: 'from-red-500 to-rose-700',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      type: 'Short Video Clips & Voice Clones',
    },
    {
      platform: 'Reddit',
      count: 2,
      percentage: 8,
      views: '450 Views',
      removed: 2,
      removedPercent: 100,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      type: 'Meme Posts & Thread Comments',
    },
  ];

  const occurrences = [
    { id: 'POST-INSTA-01', platform: 'Instagram', variantType: 'Edited Photo', accountHandle: '@viral_leak_x', detectedAt: 'Today, 14:22 UTC', similarityScore: 96, status: 'Removed', pHash: 'pHash-8f9a2b1c', sha256: 'ab4f91dc88231a47e09123891741289410289381029381029381029381', url: 'https://instagram.com/p/sample1' },
    { id: 'POST-X-02', platform: 'X (Twitter)', variantType: 'Impersonation Tweet', accountHandle: '@tweet_user_99', detectedAt: 'Today, 11:05 UTC', similarityScore: 92, status: 'Restricted', pHash: 'pHash-7e8f1a2b', sha256: 'b9481029482910482910482910482910482910482910482910482910482', url: 'https://x.com/status/sample2' },
    { id: 'POST-FB-03', platform: 'Facebook', variantType: 'Fake Group Video', accountHandle: 'FB Group: Viral News', detectedAt: 'Yesterday, 18:40 UTC', similarityScore: 88, status: 'Removed', pHash: 'pHash-6d5c4b3a', sha256: 'c718a209148201948291048291048291048291048291048291048291048', url: 'https://facebook.com/groups/sample3' },
    { id: 'POST-YT-04', platform: 'YouTube', variantType: 'Audio Deepfake', accountHandle: 'News Clip HD', detectedAt: 'Yesterday, 09:15 UTC', similarityScore: 84, status: 'Restricted', pHash: 'pHash-5b4a3c2d', sha256: 'd9201948201948291048291048291048291048291048291048291048291', url: 'https://youtube.com/watch?v=sample4' },
    { id: 'POST-REDDIT-05', platform: 'Reddit', variantType: 'Forum Meme', accountHandle: 'u/meme_lord_academic', detectedAt: 'Aug 28, 2026', similarityScore: 78, status: 'Removed', pHash: 'pHash-4a3b2c1d', sha256: 'e8192019482019482910482910482910482910482910482910482910482', url: 'https://reddit.com/r/sample5' },
  ];

  const reportsWithEvidence = [
    {
      id: 'REP-2041-01',
      platform: 'Instagram',
      ownerTeam: 'Meta Trust & Safety Team',
      policyCategory: 'Impersonation & Harassment',
      status: 'Removed',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      responseDetails: 'Meta Trust & Safety confirmed violation and restricted content globally.',
      evidenceId: 'EVD-2041-01',
      evidenceName: 'Instagram Screenshot & Post Package',
      sha256: 'ab4f91dc88231a47e0912389174128941029381029381029381029381',
      pHash: 'pHash-8f9a2b1c4e',
      matchScore: 96,
      dateSent: 'Aug 28, 2026 15:00 UTC',
    },
    {
      id: 'REP-2041-02',
      platform: 'X (Twitter)',
      ownerTeam: 'X Safety & Compliance Team',
      policyCategory: 'Non-Consensual Media & Stolen Identity',
      status: 'Restricted',
      statusColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      responseDetails: 'X Safety marked post with sensitive content warning and geo-restricted in target region.',
      evidenceId: 'EVD-2041-02',
      evidenceName: 'X Tweet Screenshot & Profile Capture',
      sha256: 'b9481029482910482910482910482910482910482910482910482910482',
      pHash: 'pHash-7e8f1a2b3c',
      matchScore: 92,
      dateSent: 'Aug 29, 2026 03:15 UTC',
    },
    {
      id: 'REP-2041-03',
      platform: 'Reddit',
      ownerTeam: 'Reddit Admin & Subreddit Mods',
      policyCategory: 'Harassment / Doxxing',
      status: 'Rejected',
      statusColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      responseDetails: 'Subreddit moderators determined content is satire under community guidelines.',
      evidenceId: 'EVD-2041-03',
      evidenceName: 'Reddit Post Log & Comment Snapshot',
      sha256: 'e8192019482019482910482910482910482910482910482910482910482',
      pHash: 'pHash-4a3b2c1d5e',
      matchScore: 78,
      dateSent: 'Aug 29, 2026 12:30 UTC',
    },
    {
      id: 'REP-2041-04',
      platform: 'YouTube',
      ownerTeam: 'YouTube Legal & Copyright Team',
      policyCategory: 'Deepfake Audio & Impersonation',
      status: 'Restricted',
      statusColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      responseDetails: 'YouTube Legal age-gated the video short and pending final takedown review.',
      evidenceId: 'EVD-2041-04',
      evidenceName: 'YouTube Short Audio & Frame Digest',
      sha256: 'd9201948201948291048291048291048291048291048291048291048291',
      pHash: 'pHash-5b4a3c2d1e',
      matchScore: 84,
      dateSent: 'Aug 30, 2026 09:00 UTC',
    },
  ];

  const handleOpenDossier = (report: any) => {
    setSelectedReportDossier(report);
    setIsDossierOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">CASE DETAILS WORKBENCH</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
              {incident.riskLevel}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{incident.id}: {incident.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Protected Person: <strong className="text-white">{incident.person}</strong></p>
        </div>


      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Linked Occurrences</span>
          <span className="text-2xl font-black text-white mt-1 block">27 Linked</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Social Networks</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">5 Platforms</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Unique Formats</span>
          <span className="text-2xl font-black text-violet-400 mt-1 block">8 Formats</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Re-Uploads Caught</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">4 Recurrent</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <span className="text-[11px] text-slate-400 font-semibold block">Cleanup Rate</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">78% Restricted</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-800 space-x-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'stopncii', label: 'StopNCII Multi-Platform Containment (5 Apps)', icon: Globe },
          { id: 'socialSpread', label: 'Spread in Each Social App (X & Y Graph)', icon: BarChart2 },
          { id: 'occurrences', label: 'Found Fake Posts (27)', icon: AlertTriangle },
          { id: 'propagation', label: 'Post Spread Map', icon: Network },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 border-b-2 font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB: Spread in Each Social App (2D X-AXIS & Y-AXIS GRAPH) */}
            {/* TAB: StopNCII Platform Containment */}
      {activeTab === 'stopncii' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-[#0a1428] to-slate-950 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  StopNCII Standard Activated
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" /> Automated Cross-Platform Containment for HC-2041
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Traditional manual reporting forms have been replaced. Cryptographic SHA-256 and multi-scale perceptual tile fingerprints are synchronized across all 5 participating platforms for instant pre-upload interception.
                </p>
              </div>

              <Link
                href="/platforms"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 flex-shrink-0"
              >
                Open Platform Protection Hub <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Participating Platforms</span>
                <strong className="text-white text-sm">5 Platforms Active</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Synced Digital Hashes</span>
                <strong className="text-cyan-400 text-sm">14 Registry Descriptors</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Privacy Guarantee</span>
                <strong className="text-emerald-400 text-sm">Zero Raw Media</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Containment Status</span>
                <strong className="text-emerald-400 text-sm">100% Intercepted</strong>
              </div>
            </div>
          </div>

          {/* 5 PLATFORM CARDS FOR THIS INCIDENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                platform: 'Instagram',
                company: 'Meta StopNCII Network',
                brand_color: 'from-pink-500 via-purple-500 to-amber-500',
                action: 'PRE-UPLOAD BLOCKED',
                badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                details: 'Client-side upload gateway intercepts matching perceptual tile hashes before posting to Feed/Reels.',
                latency: '18ms',
                status: 'CONTAINMENT ACTIVE'
              },
              {
                platform: 'Facebook',
                company: 'Meta Trust & Safety Exchange',
                brand_color: 'from-blue-600 to-cyan-600',
                action: 'AUTOMATICALLY REMOVED',
                badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                details: 'Hash quarantine feed purges re-shared copies and blocks group uploads matching HC-2041 signatures.',
                latency: '22ms',
                status: 'CONTAINMENT ACTIVE'
              },
              {
                platform: 'X (formerly Twitter)',
                company: 'X Safety Operations',
                brand_color: 'from-slate-700 to-slate-900',
                action: 'PRE-UPLOAD BLOCKED',
                badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                details: 'Threat intelligence signature match rejects tweet media attachment at API ingestion.',
                latency: '14ms',
                status: 'CONTAINMENT ACTIVE'
              },
              {
                platform: 'YouTube',
                company: 'Google Content Safety Network',
                brand_color: 'from-red-600 to-rose-700',
                action: 'UPLOAD INTERCEPTED',
                badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                details: 'Video keyframe and thumbnail matching intercepts Shorts/video ingestion pipeline.',
                latency: '31ms',
                status: 'CONTAINMENT ACTIVE'
              },
              {
                platform: 'Reddit',
                company: 'Reddit Trust & Safety Operations',
                brand_color: 'from-orange-500 to-amber-600',
                action: 'POST BLOCKED AT INGESTION',
                badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                details: 'Direct media uploads filtered and third-party host links quarantined before subreddit feeds.',
                latency: '16ms',
                status: 'CONTAINMENT ACTIVE'
              }
            ].map((node) => (
              <div key={node.platform} className="glass-card p-5 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${node.brand_color} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                      {node.platform.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">{node.platform}</h4>
                      <span className="text-[10px] text-slate-400">{node.company}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${node.badgeColor}`}>
                    {node.action}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {node.details}
                </p>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Latency: <strong className="text-white">{node.latency}</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

{activeTab === 'socialSpread' && (
        <div className="space-y-6">
          
          {/* Header Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">2D GRAPH ANALYTICS (X & Y AXIS)</span>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
                <BarChart2 className="w-5 h-5 text-cyan-400" /> Spread of Unusual Content Across Each Social Media App
              </h3>
              <p className="text-xs text-slate-400 mt-1">X-Axis shows Social Media Apps. Y-Axis shows Number of Fake Posts Detected vs Removed.</p>
            </div>
            
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Total 27 Posts (~15.45K Views)
            </div>
          </div>

          {/* MAIN 2D BAR GRAPH WITH X-AXIS & Y-AXIS */}
          <div className="glass-card p-8 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" /> 2D Bar Graph: Fake Posts Detected vs Removed Per Platform
                </h4>
                <span className="text-xs text-slate-400">Vertical Y-Axis = Number of Posts • Horizontal X-Axis = Social Media Apps</span>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-3 h-3 rounded bg-cyan-400" /> Detected Posts
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded bg-emerald-400" /> Removed Posts
                </span>
              </div>
            </div>

            {/* Recharts 2D Graph Container */}
            <div className="w-full h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    fontWeight="bold"
                    tickLine={false} 
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12}
                    fontWeight="bold" 
                    tickLine={false} 
                    axisLine={{ stroke: '#334155' }}
                    label={{ value: 'Fake Posts Count (Y-Axis)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                    cursor={{ fill: 'rgba(51, 65, 85, 0.3)' }}
                  />
                  <Bar dataKey="detected" name="Detected Fake Posts" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={32} />
                  <Bar dataKey="removed" name="Removed / Restricted" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 text-center font-mono">
              X-Axis: <strong className="text-white">Instagram (10) | X (7) | Facebook (5) | YouTube (3) | Reddit (2)</strong>
            </div>
          </div>

          {/* SECOND 2D GRAPH: SPREAD VELOCITY TIMELINE (X-AXIS = DATES, Y-AXIS = VIEWS) */}
          <div className="glass-card p-8 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> 2D Line Graph: Viral Views Growth Over Time Across Apps
                </h4>
                <span className="text-xs text-slate-400">Vertical Y-Axis = Total Views • Horizontal X-Axis = Timeline Dates</span>
              </div>
            </div>

            <div className="w-full h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} fontWeight="bold" />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    fontWeight="bold"
                    label={{ value: 'Estimated Views (Y-Axis)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="instagram" name="Instagram Views" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="twitter" name="X (Twitter) Views" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="facebook" name="Facebook Views" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="youtube" name="YouTube Views" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* VISUAL PER-PLATFORM CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialSpreadData.map((item) => (
              <div key={item.platform} className="glass-card p-6 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center font-black text-white text-xs shadow-md`}>
                      {item.platform.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{item.platform}</h4>
                      <span className="text-[10px] text-slate-400">{item.type}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border ${item.badgeColor}`}>
                    {item.count} Posts Found
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-400">Share of Total Spread</span>
                    <span className="text-cyan-400 font-mono text-sm">{item.percentage}% Spread</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Takedown Removal Status</span>
                    <span className="font-bold text-emerald-400">{item.removed} of {item.count} Removed ({item.removedPercent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${item.removedPercent}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Estimated Views: <strong className="text-slate-200">{item.views}</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Monitored 24/7
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB: Takedown Requests & Evidence Sent */}
      {activeTab === 'occurrences' && (
        <div className="glass-card p-7 rounded-3xl border border-slate-800/80 bg-slate-900/80 space-y-4">
          <h3 className="text-sm font-bold text-white">Found Fake Posts Across Platforms (27)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Account</th>
                  <th className="p-3">Match %</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Inspect Post</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {occurrences.map((occ) => (
                  <tr key={occ.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-cyan-300 font-bold">{occ.id}</td>
                    <td className="p-3 font-bold">{occ.platform}</td>
                    <td className="p-3">{occ.variantType}</td>
                    <td className="p-3 text-slate-400">{occ.accountHandle}</td>
                    <td className="p-3 font-bold text-cyan-400">{occ.similarityScore}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {occ.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={occ.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-extrabold inline-flex items-center gap-1.5 transition-all shadow-sm"
                        title="Click to view exact unusual post on platform"
                      >
                        Inspect Post <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Propagation Graph */}
      {activeTab === 'propagation' && <PropagationGraph />}

      {/* Evidence Modal */}
      {selectedEvidenceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Evidence Collected For {selectedEvidenceModal.platform}
              </h3>
              <button onClick={() => setSelectedEvidenceModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Evidence Item ID</span>
                <strong className="text-cyan-300 font-mono">{selectedEvidenceModal.evidenceId}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Sent To Platform Owner</span>
                <strong className="text-white">{selectedEvidenceModal.ownerTeam} ({selectedEvidenceModal.platform})</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-300 break-all">
                SHA-256 Checksum: {selectedEvidenceModal.sha256}
              </div>
            </div>

            <button onClick={() => setSelectedEvidenceModal(null)} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Fingerprint Modal */}
      {selectedFingerprintModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-violet-400" /> Digital Fingerprint Sent To {selectedFingerprintModal.platform}
              </h3>
              <button onClick={() => setSelectedFingerprintModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Match Confidence</span>
                <strong className="text-cyan-400 font-extrabold text-sm">{selectedFingerprintModal.matchScore}% Visual Match</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                <span className="text-slate-400 block text-[10px]">Perceptual Image Hash (pHash)</span>
                <strong className="text-violet-300 text-xs">{selectedFingerprintModal.pHash}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-300 break-all">
                SHA-256 File Hash: {selectedFingerprintModal.sha256}
              </div>
            </div>

            <button onClick={() => setSelectedFingerprintModal(null)} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
              Close Preview
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
}
