import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  ArrowRight, 
  Network, 
  FileText, 
  Eye, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Activity,
  Layers,
  ShieldAlert,
  Search
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2 font-sans">
      {/* Hero Section */}
      <section className="relative glass-card p-10 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/60 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> AI-Based Harmful Content Detection & Containment
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Detect the Incident. <br />
            <span className="gradient-text-cyan-violet">Trace the Spread.</span> Support Containment.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-medium max-w-2xl">
            SENTINEL is a victim-authorized automation platform designed to organize, trace, document, and monitor harmful digital content incidents. Instead of looking at every harmful post separately, SENTINEL links all crops, screenshots, memes, and video derivatives into one unified <strong className="text-cyan-300 font-bold">Master Incident</strong>.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs tracking-wide uppercase shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              Launch Command Center <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/incidents/HC-2041"
              className="px-6 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-xs tracking-wide uppercase transition-all"
            >
              View Active Case HC-2041
            </Link>
          </div>
        </div>
      </section>

      {/* Core Innovation Paradigm Comparison */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-7 rounded-2xl border border-rose-500/30 bg-rose-950/20 space-y-3 shadow-xl">
          <span className="text-[11px] font-extrabold text-rose-400 uppercase tracking-wider block">Traditional Moderation Approach</span>
          <h3 className="text-lg font-bold text-white">Item-by-Item Isolated Response</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Treats Post A, Post B, and Post C as separate problems. Deleting one post leaves crops, memes, screenshots, and re-uploads active on other platforms.
          </p>
        </div>

        <div className="glass-card p-7 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-3 shadow-xl">
          <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider block">SENTINEL Innovation</span>
          <h3 className="text-lg font-bold text-white">Incident-Centric Digital Containment</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Groups all detected variants into a Master Incident container (<strong className="text-cyan-300 font-bold">HC-2041</strong>), maps propagation lineage, preserves evidence, and continuously watches for re-uploads.
          </p>
        </div>
      </section>

      {/* 4 Primary Capabilities */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Multimodal Fingerprinting</h4>
          <p className="text-xs text-slate-400 leading-relaxed">SHA-256 for exact copies, pHash for near-duplicates, and visual embeddings for heavily cropped media.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800/80 bg-slate-900/60 hover:border-violet-500/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Propagation Intelligence</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Interactive topology graphs visualizing variant spread timelines and platform transitions.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800/80 bg-slate-900/60 hover:border-emerald-500/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Evidence Vault & PDF Reports</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Tamper-evident archives with cryptographic hash verification and downloadable PDF review dossiers.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border border-slate-800/80 bg-slate-900/60 hover:border-amber-500/40 transition-colors shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Re-Upload Watch</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Autonomous signature scanner continuously watching for post-restriction recurring variants.</p>
        </div>
      </section>
    </div>
  );
}
