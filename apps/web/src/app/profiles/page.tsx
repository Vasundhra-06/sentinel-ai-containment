'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, Shield, Lock, CheckCircle2, User, Globe, MessageSquare, Edit3, Save, X } from 'lucide-react';
import { useSentinelUser } from '@/context/SentinelUserContext';

export default function ProtectedProfilesPage() {
  const { currentUser, updateProfile } = useSentinelUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editProfession, setEditProfession] = useState(currentUser.profession);
  const [editHandles, setEditHandles] = useState(currentUser.handles);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName,
      profession: editProfession,
      handles: editHandles,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">MY PROTECTED PROFILE</span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5 flex items-center gap-2">
            Protected Identity &amp; Account Details
          </h1>
          <p className="text-xs text-slate-400 mt-1">Your registered social media identity and saved protection settings.</p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Saved to SQLite &amp; Cloud!
            </span>
          )}
          <button
            onClick={() => {
              setEditName(currentUser.name);
              setEditProfession(currentUser.profession);
              setEditHandles(currentUser.handles);
              setIsEditing(!isEditing);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'Cancel Editing' : 'Edit Profile Details'}
          </button>
        </div>
      </div>

      {/* Inline Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="glass-card p-6 rounded-2xl border border-cyan-500/40 bg-slate-900/95 space-y-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-cyan-400" /> Modify Protected Profile Information
            </h3>
            <span className="text-[10px] text-slate-400">Updates propagate across entire Sentinel system</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Full Legal / Social Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs"
                placeholder="e.g. Dr. Evelyn Carter"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Profession / Role</label>
              <input
                type="text"
                value={editProfession}
                onChange={(e) => setEditProfession(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs"
                placeholder="e.g. Research Scientist & Creator"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">Official Handles (comma-separated)</label>
              <input
                type="text"
                value={editHandles}
                onChange={(e) => setEditHandles(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 text-xs"
                placeholder="e.g. @handle1, @handle2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes System-Wide
            </button>
          </div>
        </form>
      )}

      {/* Main Profile Details Card */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-cyan-500 to-emerald-400 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-cyan-500/20 border border-cyan-400/40">
              {currentUser.avatarInitials}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{currentUser.name}</h2>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">{currentUser.profession}</p>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Profile ID: {currentUser.id}-{currentUser.avatarInitials}</span>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Lock className="w-4 h-4 text-emerald-400" /> Protection Active
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Social Media Name</span>
            <strong className="text-white text-sm block">{currentUser.name}</strong>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Job &amp; Role Mentioned Online</span>
            <strong className="text-white text-sm block">{currentUser.profession}</strong>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Known Social Handles</span>
            <strong className="text-cyan-400 text-sm font-mono block">{currentUser.handles}</strong>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Apps Monitored</span>
            <strong className="text-emerald-400 text-sm block">{currentUser.monitoredApps}</strong>
          </div>
        </div>

        {/* Protection Consent Box */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-white block">Takedown Authorization Granted</span>
              <span className="text-slate-400 text-[11px]">SENTINEL is authorized to save proof &amp; request takedowns for fake posts targeting this profile.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
