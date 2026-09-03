import React from 'react';

export function SentinelLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-violet-600/30 rounded-xl blur-md -z-10" />
      
      {/* Outer futuristic badge container */}
      <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-[#0c1427] to-slate-950 border border-cyan-400/40 p-1 flex items-center justify-center shadow-lg shadow-cyan-950/60 relative overflow-hidden group">
        {/* Subtle grid pattern / circuit sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:6px_6px] opacity-20 pointer-events-none" />

        {/* Custom Vector Emblem: Cyber-Shield with AI Sentinel Eye Core */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
          <defs>
            <linearGradient id="sentinelShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="sentinelCoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <radialGradient id="irisGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Cyber Shield Crest */}
          <path
            d="M50 8 L82 22 V50 C82 70 68 86 50 94 C32 86 18 70 18 50 V22 Z"
            fill="#0b1329"
            stroke="url(#sentinelShieldGrad)"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Inner Geometric Shield Facets */}
          <path
            d="M50 18 L73 28 V48 C73 64 63 76 50 83 C37 76 27 64 27 48 V28 Z"
            fill="url(#sentinelShieldGrad)"
            fillOpacity="0.15"
            stroke="#06b6d4"
            strokeWidth="1.8"
            strokeDasharray="2 2"
          />

          {/* Sentinel Radar Crosshair Lines */}
          <line x1="50" y1="26" x2="50" y2="38" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
          <line x1="50" y1="62" x2="50" y2="74" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
          <line x1="30" y1="50" x2="40" y2="50" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
          <line x1="60" y1="50" x2="70" y2="50" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />

          {/* Central AI Eye / Aperture Ring */}
          <circle cx="50" cy="50" r="13" stroke="url(#sentinelCoreGrad)" strokeWidth="2.5" fill="#070d1e" />
          <circle cx="50" cy="50" r="8" fill="url(#irisGlow)" />

          {/* Glowing Center Pupil Core */}
          <circle cx="50" cy="50" r="3" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}
