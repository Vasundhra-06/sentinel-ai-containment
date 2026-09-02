'use client';

import React from 'react';
import { Settings, Shield, Lock, Key, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Security & Account Settings
          </h1>
          <p className="text-xs text-gray-400 mt-1">RBAC controls, API keys, and privacy configurations</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" /> Access Control & Data Encryption
        </h3>
        <p className="text-gray-300">RBAC Enabled: User workspace isolated per protected profile authorization.</p>
        <p className="text-gray-300">Evidence Encryption: AES-256 enabled at rest for all stored media files.</p>
      </div>
    </div>
  );
}
