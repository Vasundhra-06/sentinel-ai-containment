'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  profession: string;
  handles: string;
  organization: string;
  avatarInitials: string;
  isProtected: boolean;
  monitoredApps: string;
  photos: {
    angle1: string | null;
    angle2: string | null;
    angle3: string | null;
  };
}

export interface IncidentItem {
  id: string;
  platform: string;
  account: string;
  type: string;
  title: string;
  matchScore: number;
  riskLevel: string;
  status: string;
  url: string;
  phash: string;
  sha256: string;
  date: string;
  priorityBadge?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'RESOLVED';
  isEscalated?: boolean;
  isAutoDispatched?: boolean;
  dismissedAt?: number | null; // epoch timestamp when "Not Me" was clicked
  isBenign?: boolean;
}

export interface SentinelContextType {
  currentUser: UserProfile;
  incidents: IncidentItem[];
  reportsCount: number;
  activeCaseId: string;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addScannedDetections: (newLeaks: IncidentItem[], userMeta?: Partial<UserProfile>) => void;
  dismissIncident: (id: string) => void;
  undoDismissal: (id: string) => void;
  confirmContainment: (id: string) => void;
  resetToDefaults: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'PROF-8821',
  name: 'Dr. Evelyn Carter',
  profession: 'Research Scientist & Content Creator',
  handles: '@evelyn_carter, @drcarter_bio',
  organization: 'Carter Bio-Research & Content Lab',
  avatarInitials: 'EC',
  isProtected: true,
  monitoredApps: 'Instagram, X, Facebook, YouTube, Reddit, TikTok',
  photos: {
    angle1: null,
    angle2: null,
    angle3: null,
  },
};

const DEFAULT_INCIDENTS: IncidentItem[] = [
  {
    id: 'LEAK-INSTA-01',
    platform: 'Instagram',
    account: '@viral_leak_x',
    type: 'Edited Video Derivative with Synthesized Voice',
    title: 'Manipulated Video & Defamatory Impersonation',
    matchScore: 96,
    riskLevel: 'HIGH RISK',
    priority: 'HIGH',
    priorityBadge: 'HIGH PRIORITY',
    status: 'Auto-Dispatched by Autopilot',
    url: 'https://www.instagram.com/reel/C9x81kLmPq/',
    phash: 'pHash-8f9a2b1c70',
    sha256: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
    date: 'Today, 14:22 UTC',
    isEscalated: true,
    isAutoDispatched: true,
  },
  {
    id: 'LEAK-X-02',
    platform: 'X (Twitter)',
    account: '@news_leak_bot',
    type: 'Cropped Photo & Unauthorized Mirror',
    title: 'Synthetic Claim Regarding Private Research',
    matchScore: 84,
    riskLevel: 'HIGH RISK',
    priority: 'HIGH',
    priorityBadge: 'HIGH PRIORITY',
    status: 'Auto-Dispatched by Autopilot',
    url: 'https://x.com/news_leak_bot/status/182910482910',
    phash: 'pHash-7f8a9b2c3d',
    sha256: '9f8e7d6c5b4a39281706543210fedcba9876543210abcdef0123456789abcdef',
    date: 'Today, 12:05 UTC',
    isAutoDispatched: true,
  },
  {
    id: 'LEAK-TIK-03',
    platform: 'TikTok',
    account: '@trend_remix_club',
    type: 'Ambiguous Face Swap Derivative',
    title: 'Voiceover Commentary on Stolen Portrait',
    matchScore: 71,
    riskLevel: 'AMBIGUOUS (71%)',
    priority: 'MEDIUM',
    priorityBadge: 'AMBIGUOUS REVIEW',
    status: 'Pending Review (1-Hr Auto-Send)',
    url: 'https://tiktok.com/@trend_remix_club/video/7291048201948',
    phash: 'pHash-3a4b5c6d7e',
    sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    date: 'Today, 09:14 UTC',
    isAutoDispatched: false,
  },
];

function deriveInitials(name: string): string {
  if (!name) return 'SP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export function SentinelUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_PROFILE);
  const [incidents, setIncidents] = useState<IncidentItem[]>(DEFAULT_INCIDENTS);
  const activeCaseId = 'HC-2041';

  // 1. Initial Load from LocalStorage and Backend API
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('sentinel_user_profile');
      if (savedProfile) {
        setCurrentUser(JSON.parse(savedProfile));
      }
      const savedIncidents = localStorage.getItem('sentinel_incidents');
      if (savedIncidents) {
        setIncidents(JSON.parse(savedIncidents));
      }
    } catch (e) {
      console.warn('LocalStorage not accessible', e);
    }

    // Background fetch from SQLite backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/profiles/current`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.full_name) {
          setCurrentUser((prev) => {
            const updated: UserProfile = {
              ...prev,
              name: data.full_name,
              handles: data.handles || prev.handles,
              organization: data.organization || prev.organization,
              avatarInitials: deriveInitials(data.full_name),
            };
            try {
              localStorage.setItem('sentinel_user_profile', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      })
      .catch(() => {
        // Backend offline, fallback to local state
      });
  }, []);

  // 2. Update Profile action
  const updateProfile = async (data: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const newName = data.name || prev.name;
      const updated: UserProfile = {
        ...prev,
        ...data,
        avatarInitials: data.name ? deriveInitials(newName) : prev.avatarInitials,
      };
      try {
        localStorage.setItem('sentinel_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Synchronize to SQLite backend
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/profiles/current`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.name || currentUser.name,
          organization: data.organization || currentUser.organization,
          profession: data.profession || currentUser.profession,
          handles: data.handles || currentUser.handles,
        }),
      });
    } catch (err) {
      console.warn('Backend sync failed, state saved locally:', err);
    }
  };

  // 3. Add newly scanned detections (from User Input)
  const addScannedDetections = (newLeaks: IncidentItem[], userMeta?: Partial<UserProfile>) => {
    if (userMeta) {
      updateProfile(userMeta);
    }

    setIncidents((prev) => {
      // Avoid duplicate IDs
      const existingIds = new Set(prev.map((i) => i.id));
      const filteredNew = newLeaks.filter((l) => !existingIds.has(l.id));
      const merged = [...filteredNew, ...prev];
      try {
        localStorage.setItem('sentinel_incidents', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });
  };

  // 4. Dismiss incident ("Not Me" action with 15-min undo)
  const dismissIncident = (id: string) => {
    setIncidents((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            dismissedAt: Date.now(),
            status: 'Dismissed by User (Undo Active: 15m)',
          };
        }
        return item;
      });
      try {
        localStorage.setItem('sentinel_incidents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 5. Undo dismissal
  const undoDismissal = (id: string) => {
    setIncidents((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            dismissedAt: null,
            status: 'Active Leak (Protection Restored)',
          };
        }
        return item;
      });
      try {
        localStorage.setItem('sentinel_incidents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 6. Confirm containment
  const confirmContainment = (id: string) => {
    setIncidents((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Takedown Notice Dispatched',
            isAutoDispatched: true,
          };
        }
        return item;
      });
      try {
        localStorage.setItem('sentinel_incidents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // 7. Reset to defaults
  const resetToDefaults = () => {
    setCurrentUser(DEFAULT_PROFILE);
    setIncidents(DEFAULT_INCIDENTS);
    try {
      localStorage.removeItem('sentinel_user_profile');
      localStorage.removeItem('sentinel_incidents');
    } catch (e) {}
  };

  return (
    <SentinelContext.Provider
      value={{
        currentUser,
        incidents,
        reportsCount: incidents.filter((i) => i.isAutoDispatched).length + 1,
        activeCaseId,
        updateProfile,
        addScannedDetections,
        dismissIncident,
        undoDismissal,
        confirmContainment,
        resetToDefaults,
      }}
    >
      {children}
    </SentinelContext.Provider>
  );
}

export function useSentinelUser() {
  const context = useContext(SentinelContext);
  if (!context) {
    throw new Error('useSentinelUser must be used within a SentinelUserProvider');
  }
  return context;
}
