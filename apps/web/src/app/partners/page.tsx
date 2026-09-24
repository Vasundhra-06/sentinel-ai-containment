'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, AlertTriangle, RefreshCw, Send, Lock, 
  Cpu, Key, Database, Globe, Check, Eye, EyeOff, Layers, Sparkles
} from 'lucide-react';
import { fetchRegistryItems, runPartnerDemo } from '@/lib/apiClient';

export default function PartnersRegistryPage() {
  const [registryItems, setRegistryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPartner, setSelectedPartner] = useState<string>('partner_meta_demo');
  const [selectedPolicy, setSelectedPolicy] = useState<string>('REMOVED');
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadRegistry();
  }, []);

  const loadRegistry = async () => {
    setIsLoading(true);
    try {
      const items = await fetchRegistryItems();
      setRegistryItems(items);
    } catch (err: any) {
      console.log('Error loading registry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunDemo = async () => {
    setIsDemoRunning(true);
    setErrorMsg(null);
    setDemoResult(null);

    try {
      const formData = new FormData();
      formData.append('partner_id', selectedPartner);
      formData.append('policy_action', selectedPolicy);
      formData.append('target_occurrence_id', 'HC-2041-001');
      if (demoFile) {
        formData.append('file', demoFile);
      }

      const res = await runPartnerDemo(formData);
      setDemoResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo simulation failed.');
    } finally {
      setIsDemoRunning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-12">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              TRUSTED FEDERATED REGISTRY
            </span>
            <span className="text-[10px] font-bold text-slate-400 font-mono">Cursor-Synchronized Feed</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Fingerprint Registry & Local Partner Demo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Approved fingerprints are published to subscribed safety partners with opaque IDs and cryptographic signatures. Victim PII and original evidence media are never exported.
          </p>
        </div>

        <button
          onClick={loadRegistry}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Registry
        </button>
      </div>

      {/* Grid: Left = Local Partner Demo Runner, Right = Active Registry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Local Partner Simulation */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/90 space-y-6 shadow-xl">
            
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  ISOLATED DEMO ENVIRONMENT
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> Local Partner Simulation Runner
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Simulates real-world platform ingestion: computes real fingerprints on test media, matches against subscribed registry deltas, executes mock platform policy, and sends signed HMAC callbacks.
              </p>
            </div>

            {/* Config Form */}
            <div className="space-y-4 text-xs">
              
              {/* Partner Select */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Subscribed Safety Partner Platform:</label>
                <select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold focus:border-cyan-500 outline-none"
                >
                  <option value="partner_meta_demo">Meta Platform Safety (Simulated Demo)</option>
                  <option value="partner_x_demo">X Safety Operations (Simulated Demo)</option>
                </select>
              </div>

              {/* Policy Action Select */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Simulated Platform Policy Decision:</label>
                <select
                  value={selectedPolicy}
                  onChange={(e) => setSelectedPolicy(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold focus:border-cyan-500 outline-none"
                >
                  <option value="REMOVED">REMOVED (Content Taken Down Across Network)</option>
                  <option value="BLOCKED">BLOCKED (Pre-Upload Prevented At Ingestion)</option>
                  <option value="RESTRICTED">RESTRICTED (Sensitive Content Blur Applied)</option>
                  <option value="NO_ACTION">NO_ACTION (Dismissed / Policy Compliant)</option>
                </select>
              </div>

              {/* Media File Upload */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">Optional Test Media Fixture:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDemoFile(e.target.files?.[0] || null)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-950 file:text-cyan-300"
                />
                <span className="text-[10px] text-slate-500 block">Defaults to existing Incident occurrence HC-2041-001 if no custom file selected.</span>
              </div>

              {/* Run Action */}
              <button
                onClick={handleRunDemo}
                disabled={isDemoRunning}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all"
              >
                {isDemoRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Computing Fingerprint & Simulating Webhook...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Trigger Simulated Partner Match & Callback
                  </>
                )}
              </button>
            </div>

            {/* Demo Results Display */}
            {demoResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {demoResult.status}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Policy: {demoResult.policy_applied}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-slate-400">
                  <div>Occurrence: <strong className="text-slate-200">{demoResult.occurrence_id}</strong></div>
                  <div>Partner: <strong className="text-cyan-300">{demoResult.partner_id}</strong></div>
                  <div>Signature Alg: <strong className="text-slate-300">{demoResult.signature_verification.algorithm}</strong></div>
                  <div className="truncate">HMAC Signature: <strong className="text-emerald-400">{demoResult.signature_verification.signature}</strong></div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[10px] text-amber-300">
                  ⚠️ {demoResult.demo_notice}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

          </div>

          {/* Algorithm Compatibility Matrix */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Supported Registry Formats
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Cryptographic Binary Hash (SHA-256)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Exact byte-level duplicate suppression</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SUPPORTED</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Perceptual Hashes (pHash, dHash, aHash)</span>
                  <span className="text-[10px] text-slate-500 font-mono">DCT frequency fingerprint for scaled/compressed media</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SUPPORTED</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Regional Tile Hashes (Multi-Scale)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Spatial quadrant & center tiles for crop matching</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SUPPORTED</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">SIFT / ORB Keypoint Descriptors</span>
                  <span className="text-[10px] text-slate-500 font-mono">Local planar homography & inlier geometry checks</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">SUPPORTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Fingerprint Registry Explorer */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Active Registry Items ({registryItems.length})
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Cursor: Incremental Sync</span>
            </div>

            {registryItems.length > 0 ? (
              <div className="space-y-3">
                {registryItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300">{item.opaque_id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {item.algorithm} v{item.version}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.status === 'ACTIVE' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-slate-400 break-all">
                      <span className="text-slate-500">Value: </span>{item.fingerprint_value}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Scope: {item.authorization_scope}</span>
                      <span>Rev: {item.revision}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Database className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">No registry items loaded.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
