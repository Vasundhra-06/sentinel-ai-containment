'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Shield, Lock, Key, Bell, Database, CheckCircle2, 
  AlertTriangle, UserCheck, Trash2, Plus, Copy, Check, RefreshCw, Eye, Globe
} from 'lucide-react';
import { 
  fetchAccessSettings, updateProcessingMode, generateRecoveryCodes, 
  fetchRepresentatives, createRepresentative, revokeRepresentative 
} from '@/lib/apiClient';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [processingMode, setProcessingMode] = useState<string>('CONSENTED_ANALYSIS');
  const [retentionDays, setRetentionDays] = useState<number>(30);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Representative Form State
  const [repEmail, setRepEmail] = useState('');
  const [repName, setRepName] = useState('');
  const [repScopes, setRepScopes] = useState('SUBMIT,VIEW_MEDIA,REVIEW');
  const [isCreatingRep, setIsCreatingRep] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const acc = await fetchAccessSettings();
      setSettings(acc);
      setProcessingMode(acc.processing_mode || 'CONSENTED_ANALYSIS');
      setRetentionDays(acc.retention_days || 30);

      const reps = await fetchRepresentatives();
      setRepresentatives(reps);
    } catch (err: any) {
      console.log('Error loading settings data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMode = async () => {
    try {
      await updateProcessingMode(processingMode, retentionDays);
      setStatusMsg('Privacy processing mode & retention period updated successfully.');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      alert('Error updating mode: ' + err.message);
    }
  };

  const handleGenerateCodes = async () => {
    try {
      const res = await generateRecoveryCodes(8);
      setRecoveryCodes(res.codes);
    } catch (err: any) {
      alert('Error generating recovery codes: ' + err.message);
    }
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCreateRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repEmail) return;
    try {
      const res = await createRepresentative(repEmail, repName, repScopes);
      setInvitationUrl(res.invitation_url || null);
      setRepEmail('');
      setRepName('');
      setIsCreatingRep(false);
      loadAllData();
    } catch (err: any) {
      alert('Error creating representative grant: ' + err.message);
    }
  };

  const handleRevokeRep = async (id: string) => {
    if (!confirm('Are you sure you want to revoke representative access immediately?')) return;
    try {
      await revokeRepresentative(id);
      loadAllData();
    } catch (err: any) {
      alert('Error revoking representative: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans pb-16">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              SECURITY & ACCESS GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Privacy, Recovery & Representative Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure client-side vs consented analysis modes, generate hashed single-use recovery codes, and manage authorized representative delegation.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {statusMsg}
        </div>
      )}

      {/* 1. Processing Mode & Retention */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" /> Analysis Processing Mode & Data Retention
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select how candidate media is inspected and how long server temporary artifacts are retained.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Local Mode Card */}
          <div 
            onClick={() => setProcessingMode('LOCAL_FINGERPRINT')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              processingMode === 'LOCAL_FINGERPRINT'
                ? 'bg-cyan-950/30 border-cyan-500 text-slate-200 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> LOCAL FINGERPRINT MODE
              </span>
              <input 
                type="radio" 
                checked={processingMode === 'LOCAL_FINGERPRINT'} 
                onChange={() => setProcessingMode('LOCAL_FINGERPRINT')}
                className="accent-cyan-500" 
              />
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Generates cryptographic hashes (SHA-256) and perceptual hashes (pHash) on the user's browser device. Only fingerprints and minimal metadata are transmitted. Original media never leaves your device.
            </p>
          </div>

          {/* Consented Server Mode Card */}
          <div 
            onClick={() => setProcessingMode('CONSENTED_ANALYSIS')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              processingMode === 'CONSENTED_ANALYSIS'
                ? 'bg-cyan-950/30 border-cyan-500 text-slate-200 shadow-lg shadow-cyan-950/50'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> CONSENTED ANALYSIS MODE
              </span>
              <input 
                type="radio" 
                checked={processingMode === 'CONSENTED_ANALYSIS'} 
                onChange={() => setProcessingMode('CONSENTED_ANALYSIS')}
                className="accent-cyan-500" 
              />
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Uploads media with explicit user consent to private, encrypted server storage for deep SIFT + USAC-MAGSAC geometric homography verification, multi-scale regional tile matching, and OCR verification.
            </p>
          </div>

        </div>

        {/* Retention Period Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
          <div>
            <span className="font-bold text-slate-300 block">Stated Server Retention Period:</span>
            <span className="text-[11px] text-slate-500">Temporary thumbnails and working copies are purged automatically after expiration.</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-bold focus:border-cyan-500 outline-none text-xs"
            >
              <option value={7}>7 Days (Strict Minimal)</option>
              <option value={30}>30 Days (Standard Investigation)</option>
              <option value={90}>90 Days (Extended Legal Preservation)</option>
            </select>
            <button
              onClick={handleSaveMode}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Save Policy
            </button>
          </div>
        </div>
      </div>

      {/* 2. Account Recovery & Single-Use Hashed Codes */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> One-Time Emergency Recovery Credentials
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-entropy single-use codes for emergency access. Stored in backend as salted SHA-256 hashes.
            </p>
          </div>
          <button
            onClick={handleGenerateCodes}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3 h-3" /> Generate New Codes
          </button>
        </div>

        {recoveryCodes.length > 0 ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">
                ⚠️ Save these 8 single-use codes immediately. They will not be displayed again:
              </span>
              <button
                onClick={handleCopyCodes}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied!' : 'Copy All'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-cyan-300">
              {recoveryCodes.map((c, i) => (
                <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-center font-bold">
                  {c}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>8 Recovery codes active on file. Rate-limited single-use validation enforced.</span>
            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              ACTIVE & SECURED
            </span>
          </div>
        )}
      </div>

      {/* 3. Authorized Representative Access Grants */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Authorized Representatives ({representatives.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Grant expiring, permission-scoped delegation to legal counsel, advocates, or trusted representatives.
            </p>
          </div>
          <button
            onClick={() => setIsCreatingRep(!isCreatingRep)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Invite Representative
          </button>
        </div>

        {/* Create Representative Form Modal / Drawer */}
        {isCreatingRep && (
          <form onSubmit={handleCreateRep} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4 text-xs animate-in fade-in">
            <h3 className="font-bold text-white text-xs">Invite Trusted Representative</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold">Representative Email:</label>
                <input
                  type="email"
                  required
                  placeholder="counsel@legal-advocates.org"
                  value={repEmail}
                  onChange={(e) => setRepEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 block font-semibold">Representative Name (Optional):</label>
                <input
                  type="text"
                  placeholder="Sarah Jenkins, Esq."
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block font-semibold">Granted Scopes (Comma-separated):</label>
              <input
                type="text"
                value={repScopes}
                onChange={(e) => setRepScopes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px] outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Available: SUBMIT, VIEW_MEDIA, REVIEW, EXPORT</span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingRep(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Generate One-Time Invitation Link
              </button>
            </div>
          </form>
        )}

        {/* Invitation URL Banner if generated */}
        {invitationUrl && (
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-1 text-xs">
            <span className="font-bold text-cyan-300 block">One-Time Representative Invitation Link Generated:</span>
            <p className="font-mono text-[11px] text-slate-300 break-all p-2 rounded bg-slate-900 border border-slate-800">
              {invitationUrl}
            </p>
            <span className="text-[10px] text-slate-400">Share this link directly with your representative. It expires in 7 days.</span>
          </div>
        )}

        {/* Representative List */}
        {representatives.length > 0 ? (
          <div className="space-y-3">
            {representatives.map((rep) => (
              <div key={rep.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rep.representative_name || rep.representative_email}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({rep.representative_email})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span>Scopes: [{rep.scopes}]</span>
                    <span>•</span>
                    <span className={rep.status === 'ACTIVE' ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{rep.status}</span>
                  </div>
                </div>

                {rep.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleRevokeRep(rep.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-[11px] border border-rose-500/30 flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Revoke Access
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-xs">
            No external representatives currently granted access.
          </div>
        )}
      </div>

      {/* 4. Harm Category Review Policy Rules */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3 text-xs">
        <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Category-Specific Takedown Routing Policies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400 text-[11px]">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <strong className="text-white block mb-1">Unconsented Intimate Media & Manipulation</strong>
            <span>Direct partner registry push with expedited DMCA takedown dossier generation.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <strong className="text-white block mb-1">Defamation & Academic Impersonation</strong>
            <span>Multi-source temporal correlation with lexical handle and credential verification.</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-[10px] text-rose-300">
          🛡️ <strong>Safety Safeguard:</strong> Any sexual content involving minors (CSAM/CSAE) is strictly blocked from prototype collection and routed immediately to certified specialist support organizations (NCMEC / Internet Watch Foundation).
        </div>
      </div>

    </div>
  );
}
