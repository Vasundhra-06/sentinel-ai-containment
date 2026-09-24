'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Shield, CheckCircle2, AlertTriangle, Eye, EyeOff, 
  ArrowRight, Sparkles, Layers, Sliders, RefreshCw, FileText, Check, X, ShieldAlert, Cpu
} from 'lucide-react';
import { runPairwiseCompare, enrolVariant } from '@/lib/apiClient';

export default function CompareWorkspacePage() {
  const [candidateFile, setCandidateFile] = useState<File | null>(null);
  const [candidatePreview, setCandidatePreview] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [enrolSuccess, setEnrolSuccess] = useState<string | null>(null);

  // Preset demo test cases
  const presets = [
    { label: 'T008: 60% Severe Crop', desc: 'Overcomes global pHash via USAC-MAGSAC & regional tiling', sampleName: 'T008_crop_60.png' },
    { label: 'T007: 85% Crop', desc: 'Slight crop retaining dominant facial features', sampleName: 'T007_crop_85.png' },
    { label: 'T012: Text Overlay', desc: 'High-contrast watermarked modification', sampleName: 'T012_watermark_overlay.png' },
    { label: 'T019: Unrelated Nature', desc: 'Hard negative control (landscape photo)', sampleName: 'T019_neg_nature_01.png' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCandidateFile(file);
      setCandidatePreview(URL.createObjectURL(file));
      setCompareResult(null);
      setErrorMsg(null);
      setEnrolSuccess(null);
    }
  };

  const handleRunCompare = async () => {
    if (!candidateFile) {
      setErrorMsg("Please select a candidate image to compare.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setEnrolSuccess(null);

    try {
      const formData = new FormData();
      formData.append('incident_id', 'HC-2041');
      formData.append('candidate_file', candidateFile);
      const res = await runPairwiseCompare(formData);
      setCompareResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Comparison failed. Please verify API backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrolAsVariant = async () => {
    if (!candidateFile) return;
    try {
      const formData = new FormData();
      formData.append('label', candidateFile.name.replace(/\.[^/.]+$/, "") || "Verified Variant");
      formData.append('variant_type', 'MODIFIED');
      formData.append('reason', compareResult?.reasons?.[0] || "Verified via SIFT + USAC-MAGSAC homography");
      formData.append('file', candidateFile);
      
      const res = await enrolVariant('HC-2041', formData);
      setEnrolSuccess(`Variant ${res.id} successfully enrolled and active in Fingerprint Registry!`);
    } catch (err: any) {
      setErrorMsg("Enrolment error: " + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-12">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              INSPECTABLE GEOMETRIC VERIFIER
            </span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">Calibration v2.0-geom</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Pairwise Media Comparison Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare candidate media directly against Master Incident <strong className="text-cyan-300 font-mono">HC-2041</strong> using SIFT keypoints, USAC-MAGSAC homography, regional tile hashing, and deep feature embeddings.
          </p>
        </div>

        {/* Sensitive Media Toggle */}
        <button
          onClick={() => setIsBlurred(!isBlurred)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all shadow-md"
        >
          {isBlurred ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
          <span>{isBlurred ? 'Reveal Sensitive Previews' : 'Blur Sensitive Previews'}</span>
        </button>
      </div>

      {/* Main Dual-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Reference & Candidate Images */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Reference Box */}
            <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" /> Master Reference Asset
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                  REF-2041-ROOT
                </span>
              </div>
              
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                <div className={`w-full h-full flex items-center justify-center p-4 transition-all duration-300 ${isBlurred ? 'blur-md grayscale' : ''}`}>
                  <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-violet-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                    EC
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-slate-300 flex justify-between">
                  <span>Dr. Evelyn Carter</span>
                  <span className="text-cyan-400 font-mono">512×512 PNG</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between font-mono text-[10px]">
                  <span>SHA-256:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">4f1fbc178456b843...</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span>pHash:</span>
                  <span className="text-cyan-300">pHash-c0c0c0c03f3f</span>
                </div>
              </div>
            </div>

            {/* Candidate Box */}
            <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Discovered Candidate Media
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  {candidateFile ? candidateFile.name : 'NO FILE'}
                </span>
              </div>

              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                {candidatePreview ? (
                  <img 
                    src={candidatePreview} 
                    alt="Candidate Preview" 
                    className={`w-full h-full object-contain transition-all duration-300 ${isBlurred ? 'blur-md grayscale' : ''}`}
                  />
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-500">
                    <Search className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-xs">Select or upload candidate image</p>
                  </div>
                )}

                {compareResult?.signals?.geometry_usac?.is_match && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-emerald-500/90 text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg">
                    <CheckCircle2 className="w-3 h-3" /> USAC INLIERS: {compareResult.signals.geometry_usac.inlier_count}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 text-center transition-all">
                  <span>Choose Custom Image...</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

          </div>

          {/* Action Trigger */}
          <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              {candidateFile ? `Ready to compare ${candidateFile.name}` : 'Select an image above or choose a preset below'}
            </p>
            <button
              onClick={handleRunCompare}
              disabled={!candidateFile || isLoading}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg ${
                candidateFile && !isLoading
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-cyan-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing SIFT & USAC Geometry...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Run Inspectable Comparison
                </>
              )}
            </button>
          </div>

          {/* Error / Success Feedback */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
            </div>
          )}
          {enrolSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {enrolSuccess}
            </div>
          )}
        </div>

        {/* Right Column: Multi-Signal Inspection Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-6">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Cpu className="w-4 h-4 text-cyan-400" /> Multi-Signal Decision Evidence
            </h3>

            {compareResult ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                
                {/* Top Decision Banner */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  compareResult.recommended_state === 'VERIFIED_RELATED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : compareResult.recommended_state === 'REVIEW_REQUIRED'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300'
                }`}>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Recommended State</span>
                    <span className="text-base font-black tracking-wide">{compareResult.recommended_state}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono block opacity-80">Visual Score</span>
                    <span className="text-xl font-black">{compareResult.visual_similarity}%</span>
                  </div>
                </div>

                {/* Individual Signals Table */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Individual Verified Signals</span>
                  
                  {/* Exact SHA-256 */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Cryptographic Exact SHA-256:</span>
                    <span className={`font-mono font-bold ${compareResult.signals.exact_sha256 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {compareResult.signals.exact_sha256 ? 'MATCH' : 'DIFFERENT'}
                    </span>
                  </div>

                  {/* SIFT + USAC-MAGSAC */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">SIFT + USAC-MAGSAC Homography:</span>
                      <span className={`font-bold font-mono ${compareResult.signals.geometry_usac.is_match ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {compareResult.signals.geometry_usac.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1 font-mono text-[10px] text-slate-400 border-t border-slate-800/60">
                      <div>Inliers: <strong className="text-cyan-300">{compareResult.signals.geometry_usac.inlier_count}</strong></div>
                      <div>Ratio: <strong className="text-cyan-300">{compareResult.signals.geometry_usac.inlier_ratio}</strong></div>
                      <div>Reproj: <strong className="text-cyan-300">{compareResult.signals.geometry_usac.reprojection_error}px</strong></div>
                    </div>
                  </div>

                  {/* Regional Tile Matching */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Regional Multi-Scale Tile Match:</span>
                    <div className="text-right font-mono text-[11px]">
                      <span className={`font-bold ${compareResult.signals.regional_tile_min_distance <= 10 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        Dist {compareResult.signals.regional_tile_min_distance}
                      </span>
                      {compareResult.signals.regional_matched_tile && (
                        <span className="text-[10px] text-slate-500 block">({compareResult.signals.regional_matched_tile})</span>
                      )}
                    </div>
                  </div>

                  {/* Deep Embedding Cosine */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Deep Embedding Cosine Similarity:</span>
                    <span className="font-mono font-bold text-cyan-300">
                      {compareResult.signals.embedding_cosine_similarity}
                    </span>
                  </div>
                </div>

                {/* Primary Rationale */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Decision Rationale</span>
                  {compareResult.reasons.map((r: string, idx: number) => (
                    <p key={idx} className="text-xs text-slate-300 font-medium leading-relaxed">
                      • {r}
                    </p>
                  ))}
                </div>

                {/* Review & Enrolment Controls */}
                <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                  <button
                    onClick={handleEnrolAsVariant}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40"
                  >
                    <Check className="w-3.5 h-3.5" /> Enrol as Verified Variant in Incident
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <Sliders className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">Awaiting candidate image comparison...</p>
                <p className="text-[11px] text-slate-600">Select an image and click "Run Inspectable Comparison" to view geometry alignment.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
