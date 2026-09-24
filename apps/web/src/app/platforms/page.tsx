'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Eye, 
  EyeOff, 
  Cpu, 
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Check,
  XCircle,
  FileCheck2,
  Clock,
  Key
} from 'lucide-react';
import { 
  fetchPlatforms, 
  matchAllPlatforms, 
  syncPlatform, 
  PlatformItem, 
  MatchAllResponse 
} from '@/lib/apiClient';

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Matcher state
  const [selectedPreset, setSelectedPreset] = useState<'T001' | 'T008' | 'T012' | 'T019'>('T001');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [blurSensitive, setBlurSensitive] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchAllResponse | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    loadPlatforms();
  }, []);

  async function loadPlatforms() {
    setLoading(true);
    try {
      const data = await fetchPlatforms();
      setPlatforms(data.platforms || []);
    } catch (err) {
      console.error('Failed to load platforms:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync(platformId: string) {
    setSyncingId(platformId);
    setSyncSuccessMsg(null);
    try {
      const res = await syncPlatform(platformId);
      setSyncSuccessMsg(`Synchronized ${res.platform_name || platformId} with ${res.synced_fingerprints || 14} active hashes.`);
      await loadPlatforms();
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncingId(null);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    }
  }

  async function handleRunMatch(presetId?: 'T001' | 'T008' | 'T012' | 'T019') {
    const p = presetId || selectedPreset;
    setIsMatching(true);
    setMatchError(null);

    try {
      const fd = new FormData();
      if (uploadedFile) {
        fd.append('file', uploadedFile);
      } else {
        fd.append('sample_id', p);
      }

      const res = await matchAllPlatforms(fd);
      setMatchResult(res);
    } catch (err: any) {
      console.error('Match error:', err);
      setMatchError(err.message || 'Failed to execute multi-platform match');
    } finally {
      setIsMatching(false);
    }
  }

  function handlePresetSelect(p: 'T001' | 'T008' | 'T012' | 'T019') {
    setSelectedPreset(p);
    setUploadedFile(null);
    setPreviewUrl(null);
    handleRunMatch(p);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setUploadedFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      setMatchResult(null);
    }
  }

  // Auto-run initial match on T001
  useEffect(() => {
    handleRunMatch('T001');
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-[#0a1224] to-[#040814] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> StopNCII Federated Protection
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 5 Platforms Connected
              </span>
              <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold">
                Zero Raw Media Transmission
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              StopNCII Multi-Platform Protection Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Eliminating manual victim abuse forms. SENTINEL generates cryptographic and multi-scale perceptual digital fingerprints 
              that participating platforms match in real-time, executing <strong className="text-cyan-300">automated pre-upload interception</strong> across Instagram, Facebook, X, YouTube, and Reddit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <button
              onClick={() => loadPlatforms()}
              disabled={loading}
              className="px-5 py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Platform Feeds
            </button>
            <Link
              href="/incidents/HC-2041"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              View Active Case (HC-2041) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Connected Networks</span>
            <span className="text-xl font-black text-white mt-0.5 block flex items-center gap-1.5">
              5 Major Apps <Check className="w-4 h-4 text-emerald-400" />
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">Instagram, FB, X, YT, Reddit</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Containment Mode</span>
            <span className="text-xl font-black text-cyan-400 mt-0.5 block">
              Pre-Upload Block
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Zero-touch before publish</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Network Latency</span>
            <span className="text-xl font-black text-violet-400 mt-0.5 block">
              &lt; 20 ms
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Real-time edge evaluation</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Manual Reports Needed</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              0 Tickets
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">Fully automated StopNCII model</span>
          </div>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          {syncSuccessMsg}
        </div>
      )}

      {/* 5 CONNECTED PLATFORMS STATUS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Active Platform Protection Grid (5 Connected Apps)
            </h2>
            <p className="text-xs text-slate-400">
              Each platform independently ingests StopNCII digital fingerprints and enforces automated containment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map((p) => {
            const isSyncing = syncingId === p.id;
            return (
              <div 
                key={p.id}
                className="glass-card p-5 rounded-3xl border border-slate-800/90 bg-slate-900/80 hover:border-cyan-500/40 transition-all shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${p.brand_color} flex items-center justify-center text-white font-black text-base shadow-lg shadow-black/40`}>
                        {p.platform_key === 'instagram' && 'IG'}
                        {p.platform_key === 'facebook' && 'FB'}
                        {p.platform_key === 'x' && 'X'}
                        {p.platform_key === 'youtube' && 'YT'}
                        {p.platform_key === 'reddit' && 'RD'}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white leading-tight">{p.name}</h3>
                        <span className="text-[11px] text-slate-400">{p.company}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1.5 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Protocol:</span>
                      <span className="text-cyan-300 font-mono text-[11px] font-bold">{p.protocol}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Policy Action:</span>
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black">
                          {p.policy_action}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {p.action_description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Avg Response</span>
                        <span className="text-xs font-bold text-white font-mono">{p.avg_latency_ms} ms</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Containment Rate</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{p.containment_rate}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {p.subscribed_algorithms.map((algo) => (
                        <span key={algo} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                          {algo}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {p.active_fingerprints_count} Active Hashes
                  </span>
                  <button
                    onClick={() => handleSync(p.id)}
                    disabled={isSyncing}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Feed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE MULTI-PLATFORM DIGITAL FINGERPRINT MATCHER */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900/95 to-[#070b14] space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-[10px] font-black font-mono text-cyan-400 uppercase tracking-widest block">
              LIVE VERIFICATION ENGINE
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
              <Cpu className="w-5 h-5 text-cyan-400" /> Test Automated Cross-Platform Containment
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a benchmark sample or upload a candidate image. SENTINEL extracts digital fingerprints and simultaneously tests all 5 platform defenses.
            </p>
          </div>

          <button
            onClick={() => setBlurSensitive(!blurSensitive)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            {blurSensitive ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            {blurSensitive ? 'Sensitive Blur: ON' : 'Sensitive Blur: OFF'}
          </button>
        </div>

        {/* PRESET SELECTOR BUTTONS */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-300 block">Select Controlled Benchmark Sample:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'T001', label: 'T001: Exact Master Copy', tag: 'Cryptographic SHA-256', expect: 'CONTAINED' },
              { id: 'T008', label: 'T008: 60% Severe Crop', tag: 'Regional Tile Hash + Homography', expect: 'CONTAINED' },
              { id: 'T012', label: 'T012: Watermark Overlay', tag: 'Perceptual Variant', expect: 'CONTAINED' },
              { id: 'T019', label: 'T019: Clean Nature Photo', tag: 'Negative / Non-Harmful', expect: 'PERMITTED' },
            ].map((preset) => {
              const isSelected = selectedPreset === preset.id && !uploadedFile;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{preset.label}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      preset.expect === 'CONTAINED' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {preset.expect}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">{preset.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* OR FILE UPLOAD */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
          <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-400/60 bg-slate-900/50 text-xs font-bold text-slate-300 transition-all">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>{uploadedFile ? uploadedFile.name : 'Or Upload Custom Image for Cross-Platform Test'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          <button
            onClick={() => handleRunMatch()}
            disabled={isMatching}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all"
          >
            {isMatching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Matching All 5 Platforms...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Scan All 5 Platforms Now
              </>
            )}
          </button>
        </div>

        {matchError && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> {matchError}
          </div>
        )}

        {/* RESULTS SECTION */}
        {matchResult && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            
            {/* OVERALL CONTAINMENT RESULT BANNER */}
            <div className={`p-5 rounded-3xl border ${
              matchResult.is_harmful_match
                ? 'bg-rose-950/30 border-rose-500/40 shadow-xl shadow-rose-950/20'
                : 'bg-emerald-950/30 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {matchResult.is_harmful_match ? (
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" /> STOPNCII INTERCEPT ACTIVATED
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> CONTENT VERIFIED CLEAN
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400">
                      Sample: <strong className="text-white">{matchResult.sample_analyzed}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">
                    {matchResult.is_harmful_match
                      ? `Contained Across All 5 Platforms (${matchResult.containment_summary.total_platforms_contained}/5 Nodes Intercepted)`
                      : 'No Matching Fingerprint Found — Safe for Global Distribution'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {matchResult.is_harmful_match
                      ? `Detected harmful variant matching Incident ${matchResult.matched_incident_id} (${matchResult.protected_person}). All 5 participating platforms automatically blocked or removed the upload without requiring victim reporting.`
                      : 'Digital fingerprint did not match any protected media in the StopNCII federated registry. Zero false positive enforcement.'}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-black text-white font-mono">
                    {matchResult.overall_similarity}%
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 block font-bold">
                    Algorithm: {matchResult.match_type}
                  </span>
                </div>
              </div>

              {/* FINGERPRINT SUMMARY STRIP */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 truncate">
                  <span className="text-slate-500 block text-[10px]">Cryptographic SHA-256</span>
                  <span className="text-cyan-300 font-bold truncate block">{matchResult.digital_fingerprint.sha256}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 truncate">
                  <span className="text-slate-500 block text-[10px]">Perceptual pHash (DCT 64-bit)</span>
                  <span className="text-violet-300 font-bold truncate block">{matchResult.digital_fingerprint.phash}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">StopNCII Standard</span>
                  <span className="text-emerald-400 font-bold block flex items-center gap-1">
                    <FileCheck2 className="w-3.5 h-3.5" /> Client Zero-Raw-Media Compliant
                  </span>
                </div>
              </div>
            </div>

            {/* 5 PLATFORM DECISION CARDS */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-400 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Platform-by-Platform Containment Response:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchResult.platform_decisions.map((dec) => (
                  <div 
                    key={dec.platform_id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                      dec.contained
                        ? 'bg-slate-950/80 border-rose-500/30 hover:border-rose-500/50'
                        : 'bg-slate-950/80 border-emerald-500/30 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${dec.brand_color} flex items-center justify-center text-white font-black text-xs`}>
                            {dec.platform_key.toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block">{dec.platform_name}</span>
                            <span className="text-[10px] text-slate-400">{dec.company}</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black ${
                          dec.contained 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {dec.action_taken}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-snug">
                        {dec.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5 font-mono text-[10px]">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Latency:</span>
                        <span className="text-white font-bold">{dec.latency_ms} ms</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Callback HMAC:</span>
                        <span className="text-cyan-400 truncate max-w-[140px]" title={dec.hmac_callback_signature}>
                          {dec.hmac_callback_signature}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* WHY STOPNCII REPLACES MANUAL REPORTS SECTION */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/60 space-y-6 shadow-xl">
        <div>
          <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
            PARADIGM SHIFT
          </span>
          <h3 className="text-lg font-black text-white mt-1">
            Why SENTINEL Replaced Manual Reports with StopNCII Digital Fingerprinting
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Traditional abuse reporting burdens victims with screenshotting traumatic images and waiting days for manual review. StopNCII solves this at the protocol layer:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-white">1. Zero Raw Media Exposure</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Raw sensitive media never leaves the victim's device or secure vault. Only irreversible mathematical hashes (SHA-256, pHash, tile descriptors) are shared with participating platforms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-white">2. Pre-Upload Interception</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instead of waiting for harmful posts to go viral and filing takedown notices after the fact, platform ingestion filters intercept and block matching uploads before they ever hit public feeds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-extrabold text-white">3. Federated Cross-App Containment</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              One registered fingerprint synchronizes simultaneously across Instagram, Facebook, X, YouTube, and Reddit. Spread across multiple social networks is contained in a single stroke.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
