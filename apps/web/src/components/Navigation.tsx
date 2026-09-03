'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  LayoutDashboard, 
  AlertTriangle, 
  Search, 
  FileText, 
  Send, 
  UserCheck, 
  Bell, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  Sparkles,
  X,
  Check,
  ShieldAlert,
  ExternalLink,
  Info,
  User,
  Briefcase,
  AtSign,
  Camera,
  Calendar,
  ShieldCheck,
  Pencil,
  PlusCircle
} from 'lucide-react';

export function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'CRITICAL',
      title: 'Fake Photo Found on Instagram',
      description: 'Edited picture of Dr. Evelyn Carter detected on @viral_leak_x (96% Match).',
      time: '10 mins ago',
      read: false,
      link: '/detections',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: ShieldAlert,
    },
    {
      id: 2,
      type: 'SUCCESS',
      title: 'Instagram Post Deleted Successfully',
      description: 'Meta Trust & Safety confirmed violation and permanently removed post REP-2041-01.',
      time: '1 hour ago',
      read: false,
      link: '/reports',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: CheckCircle2,
    },
    {
      id: 3,
      type: 'REUPLOAD',
      title: 'Re-Upload Caught on YouTube Shorts',
      description: 'Automatic 24/7 scanner caught duplicate video clip on YouTube Shorts (85% Match).',
      time: '2 hours ago',
      read: false,
      link: '/incidents/1',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
    },
    {
      id: 4,
      type: 'RESTRICTED',
      title: 'X Tweet Restricted & Warning Applied',
      description: 'X Safety placed sensitive content warning on status 1948201 in target region.',
      time: 'Yesterday',
      read: true,
      link: '/reports',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: Info,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const navItems = [
    { name: 'Home Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'User Input', path: '/detections', icon: Pencil, badge: 'Input' },
    { name: 'Main Cases', path: '/incidents', icon: AlertTriangle },
    { name: 'Takedown Requests', path: '/reports', icon: Send },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0b1120] border-r border-slate-800/80 flex flex-col h-full z-40 shadow-2xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3 bg-slate-900/40">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30 flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5 leading-none">
              SENTINEL
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">v1.0</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight mt-1">AI-Based Digital Incident Containment System</p>
          </div>
        </div>

        {/* Protected Profile Context Badge (ENTIRE BOX IS CLICKABLE FOR PROFILE DETAILS) */}
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          className="mx-3 my-4 p-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 shadow-inner flex items-center justify-between cursor-pointer group transition-all"
          title="Click to view Protected Profile Details"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <div className="truncate">
              <span className="text-xs font-extrabold text-slate-100 group-hover:text-cyan-300 block truncate transition-colors">Protected Profile</span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">ACTIVE PROTECTION</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsProfileModalOpen(true); }}
            className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 group-hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-extrabold flex items-center gap-1 flex-shrink-0 transition-colors shadow-sm"
          >
            <Lock className="w-2.5 h-2.5" /> View
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <h3 className="px-3 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase mb-2">
            MAIN MENU
          </h3>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Engine Status Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400">System Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Scanning Social Media For Leaks</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-16 flex-shrink-0 border-b border-slate-800/80 bg-[#0b1120]/80 backdrop-blur-xl px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> ACTIVE CASE: <strong className="text-white">HC-2041</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Quick Action Button */}
            <Link
              href="/detections"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <Pencil className="w-3.5 h-3.5" /> User Input
            </Link>

            {/* NOTIFICATION BELL BUTTON */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(prev => !prev)}
                className={`relative p-2 rounded-xl border transition-all ${
                  isNotificationsOpen 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-cyan-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border border-slate-900" />
                )}
              </button>

              {/* NOTIFICATION CENTER DROPDOWN PANEL */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card p-4 rounded-2xl border border-cyan-500/30 bg-slate-900 shadow-2xl z-50 animate-in fade-in duration-150 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-extrabold text-sm text-white">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                          {unreadCount} New
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {notifications.map((notif) => {
                      const IconComponent = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 relative cursor-pointer ${
                            notif.read
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                              : 'bg-slate-950 border-cyan-500/30 shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-3.5 h-3.5 text-cyan-400" />
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase border ${notif.badgeColor}`}>
                                {notif.type}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{notif.time}</span>
                          </div>

                          <h5 className="font-bold text-white text-xs leading-tight">{notif.title}</h5>
                          <p className="text-[11px] text-slate-300 leading-snug">{notif.description}</p>

                          <div className="pt-1 flex items-center justify-between">
                            <Link
                              href={notif.link}
                              onClick={() => setIsNotificationsOpen(false)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                            >
                              View Details <ExternalLink className="w-3 h-3" />
                            </Link>

                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-cyan-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 24/7 Automated Notification Engine Active
                  </div>
                </div>
              )}
            </div>

            {/* TOP-RIGHT USER AVATAR BUTTON "EC" (CLICK TARGET 2 FOR PROFILE DETAILS) */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-cyan-500 to-emerald-400 hover:scale-105 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-cyan-500/20 border border-white/20 transition-all cursor-pointer"
                title="Click to view Protected Profile Details"
              >
                EC
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#070b14]">
          {children}
        </main>
      </div>

      {/* USER PROFILE DETAILS MODAL (OPENED BY CLICKING "EC" OR "PROTECTED PROFILE VIEW") */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-cyan-500/30 bg-slate-900 relative shadow-2xl space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-cyan-500 to-emerald-400 flex items-center justify-center font-black text-lg text-white shadow-xl shadow-cyan-500/30 border border-white/20 flex-shrink-0">
                EC
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">Dr. Evelyn Carter</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-semibold mt-0.5">Research Scientist & Content Creator</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Profile ID: PROF-8821-EC</p>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="space-y-4 text-xs">
              
              {/* Protection Status Box */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <span className="font-bold text-white block">24/7 Automatic AI Protection</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Consent Authorization: AUDITABLE & ACTIVE</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  PROTECTED
                </span>
              </div>

              {/* Registered Social Media Handles */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-cyan-400" /> Monitored Social Media Name & Handles
                </span>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Instagram:</span>
                    <strong className="text-cyan-300">@evelyn_carter</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">X (Twitter):</span>
                    <strong className="text-cyan-300">@drcarter_bio</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Facebook:</span>
                    <strong className="text-cyan-300">Evelyn Carter Official</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">YouTube:</span>
                    <strong className="text-cyan-300">@evelyn_research</strong>
                  </div>
                </div>
              </div>

              {/* Reference Baseline Photo Proof */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" /> Reference Baseline Photo
                </span>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs flex-shrink-0">
                    REF-01
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <p className="font-bold text-white">Baseline Reference Photograph</p>
                    <p className="text-[10px] text-slate-400 font-mono">pHash Signature: pHash-8f9a2b0000</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">Used for 24/7 automatic fake post comparison</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Profile Footer Actions with Edit & Add New Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/detections?mode=edit"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Pencil className="w-3.5 h-3.5 text-cyan-400" /> Edit Existing Search Input
                </Link>

                <Link
                  href="/detections?mode=new"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add New Search Project
                </Link>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Protected since Aug 15, 2026
                </span>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-slate-400 hover:text-white font-semibold underline"
                >
                  Close Profile
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
