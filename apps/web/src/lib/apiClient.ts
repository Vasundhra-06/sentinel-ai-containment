import { MOCK_MASTER_INCIDENT, MOCK_OCCURRENCES, MOCK_EVIDENCE, MOCK_REPORTS, MOCK_AUDIT_LOGS, Incident, Occurrence, EvidenceItem, ReportItem, AuditLogItem } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ReferenceAsset {
  id: string;
  incident_id: string;
  asset_type: string;
  original_filename?: string;
  sha256: string;
  phash?: string;
  dhash?: string;
  ahash?: string;
  width?: number;
  height?: number;
  provenance?: string;
  created_at: string;
}

export interface VariantItem {
  id: string;
  incident_id: string;
  root_reference_id?: string;
  variant_type: string;
  label?: string;
  sha256?: string;
  phash?: string;
  dhash?: string;
  ahash?: string;
  pdq_hash?: string;
  status: string; // PENDING_REVIEW, VERIFIED_RELATED, REJECTED, REVOKED
  enrolled_at?: string;
  reviewer_id?: string;
  decision_reason?: string;
  created_at: string;
}

export interface IncidentDetail {
  id: string;
  title: string;
  profile_id: string;
  category: string;
  status: string;
  risk_score: number;
  risk_level: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  protected_profile_name?: string;
  references_count: number;
  variants_count: number;
  occurrences_count: number;
  containment_rate: number;
  references: ReferenceAsset[];
  variants: VariantItem[];
  occurrences: Occurrence[];
}

export async function fetchIncidents(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('Error fetching incidents list:', err);
  }
  return [MOCK_MASTER_INCIDENT];
}

export async function fetchIncidentDetail(id: string): Promise<IncidentDetail> {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('API backend offline, serving seed mock data for incident detail:', err);
  }
  return {
    id: "HC-2041",
    title: MOCK_MASTER_INCIDENT.title,
    profile_id: "PROF-8821",
    category: "UNCONSENTED_MEDIA",
    status: "ACTIVE MONITORING",
    risk_score: 88,
    risk_level: "HIGH",
    description: MOCK_MASTER_INCIDENT.description,
    created_at: "2026-08-28T14:22:00Z",
    protected_profile_name: "Dr. Evelyn Carter",
    references_count: 1,
    variants_count: 2,
    occurrences_count: MOCK_OCCURRENCES.length,
    containment_rate: 78,
    references: [],
    variants: [
      {
        id: "VAR-2041-01",
        incident_id: "HC-2041",
        variant_type: "ORIGINAL",
        label: "Master Source Image",
        sha256: "ab4f91dc88231a47e0912389174128941029381029381029381029381029381",
        phash: "pHash-8f9a2b1c4e",
        status: "VERIFIED_RELATED",
        reviewer_id: "lead_analyst_01",
        decision_reason: "Cryptographic SHA-256 and pHash exact match",
        created_at: "2026-08-28T14:22:00Z"
      },
      {
        id: "VAR-2041-02",
        incident_id: "HC-2041",
        variant_type: "CROPPED",
        label: "Cropped & Re-encoded Repost",
        sha256: "7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2",
        phash: "pHash-8f9a2b1c4f",
        status: "VERIFIED_RELATED",
        reviewer_id: "lead_analyst_01",
        decision_reason: "Spatial tile match and USAC homography inlier verification confirmed origin",
        created_at: "2026-08-28T16:05:00Z"
      }
    ],
    occurrences: MOCK_OCCURRENCES
  };
}

export async function enrolVariant(incidentId: string, formData: FormData): Promise<VariantItem> {
  const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/variants`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function reviewVariant(
  incidentId: string,
  variantId: string,
  action: string,
  reason: string,
  reviewer: string = "lead_analyst_01"
) {
  const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/variants/${variantId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, reason, reviewer })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function revokeVariant(
  incidentId: string,
  variantId: string,
  reason: string,
  reviewer: string = "lead_analyst_01"
) {
  const formData = new FormData();
  formData.append('reviewer', reviewer);
  formData.append('reason', reason);
  const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/variants/${variantId}/revoke`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function runPairwiseCompare(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/compare/pairwise`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function fetchRegistryItems(status?: string) {
  try {
    const url = status ? `${API_BASE_URL}/registry/items?status=${status}` : `${API_BASE_URL}/registry/items`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('Error fetching registry items:', err);
  }
  return [];
}

export async function runPartnerDemo(formData: FormData) {
  const res = await fetch(`${API_BASE_URL}/partner-demo/match-and-enforce`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function fetchAccessSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/access/settings`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('Error fetching access settings:', err);
  }
  return {
    profile_id: "PROF-8821",
    full_name: "Dr. Evelyn Carter",
    processing_mode: "CONSENTED_ANALYSIS",
    retention_days: 30,
    is_consent_active: true,
    active_representatives_count: 0,
    unused_recovery_codes_count: 8,
    mfa_enabled: true
  };
}

export async function updateProcessingMode(mode: string, retentionDays: number) {
  const formData = new FormData();
  formData.append('mode', mode);
  formData.append('retention_days', String(retentionDays));
  const res = await fetch(`${API_BASE_URL}/access/mode`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function generateRecoveryCodes(count: number = 8) {
  const formData = new FormData();
  formData.append('count', String(count));
  const res = await fetch(`${API_BASE_URL}/access/recovery/generate`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function fetchRepresentatives() {
  try {
    const res = await fetch(`${API_BASE_URL}/access/representatives`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('Error fetching representatives:', err);
  }
  return [];
}

export async function createRepresentative(email: string, name: string, scopes: string) {
  const formData = new FormData();
  formData.append('representative_email', email);
  formData.append('representative_name', name);
  formData.append('scopes', scopes);
  const res = await fetch(`${API_BASE_URL}/access/representatives`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function revokeRepresentative(grantId: string) {
  const res = await fetch(`${API_BASE_URL}/access/representatives/${grantId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function fetchIncident(id: string): Promise<Incident> {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('API backend offline, serving seed mock data for incident');
  }
  return MOCK_MASTER_INCIDENT;
}

export async function fetchOccurrences(incidentId: string): Promise<Occurrence[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/occurrences`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('API backend offline, serving seed mock occurrences');
  }
  return MOCK_OCCURRENCES;
}

export async function fetchEvidence(incidentId: string): Promise<EvidenceItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/evidence/${incidentId}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('API backend offline, serving seed mock evidence');
  }
  return MOCK_EVIDENCE;
}

export async function fetchReports(incidentId: string): Promise<ReportItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/${incidentId}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('API backend offline, serving seed mock reports');
  }
  return MOCK_REPORTS;
}

export async function fetchAuditLogs(incidentId: string): Promise<AuditLogItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/audit-logs`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('API backend offline, serving seed mock audit logs');
  }
  return MOCK_AUDIT_LOGS;
}


export interface PlatformItem {
  id: string;
  platform_key: string;
  name: string;
  company: string;
  brand_color: string;
  icon: string;
  protocol: string;
  status: string;
  containment_mode: string;
  policy_action: string;
  action_description: string;
  subscribed_algorithms: string[];
  avg_latency_ms: number;
  containment_rate: number;
  active_fingerprints_count: number;
  zero_raw_media_standard: boolean;
  endpoint: string;
  last_synced_at: string;
}

export interface PlatformDecision {
  platform_id: string;
  platform_key: string;
  platform_name: string;
  company: string;
  icon: string;
  brand_color: string;
  protocol: string;
  status: string;
  contained: boolean;
  action_taken: string;
  action_code: string;
  latency_ms: number;
  similarity_score: number;
  algorithm_used: string;
  reason: string;
  hmac_callback_signature: string;
  timestamp: string;
  zero_raw_media_transmitted: boolean;
}

export interface MatchAllResponse {
  success: boolean;
  sample_analyzed: string;
  is_harmful_match: boolean;
  overall_similarity: number;
  match_type: string;
  matched_incident_id?: string;
  protected_person?: string;
  digital_fingerprint: {
    sha256: string;
    phash: string;
    dhash: string;
    ahash: string;
    format: string;
    zero_raw_media: boolean;
  };
  signals: {
    exact_sha256: boolean;
    phash_distance: number;
    tile_min_distance: number;
    tile_matched_name?: string;
    usac_inliers: number;
    homography_verified: boolean;
  };
  containment_summary: {
    total_platforms_evaluated: number;
    total_platforms_contained: number;
    containment_rate_percent: number;
    automated_containment_mode: string;
    manual_reports_required: number;
  };
  platform_decisions: PlatformDecision[];
}

export async function fetchPlatforms(): Promise<{ total_connected_platforms: number; total_active_fingerprints: number; platforms: PlatformItem[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/platforms`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('Error fetching platforms:', err);
  }
  return {
    total_connected_platforms: 5,
    total_active_fingerprints: 14,
    platforms: [
      {
        id: 'instagram_safety',
        platform_key: 'instagram',
        name: 'Instagram Platform Safety Engine',
        company: 'Meta Platforms, Inc.',
        brand_color: 'from-pink-500 via-purple-500 to-amber-500',
        icon: 'instagram',
        protocol: 'Meta StopNCII Hash Exchange v2',
        status: 'ACTIVE_PROTECTED',
        containment_mode: 'PRE_UPLOAD_INTERCEPT',
        policy_action: 'PRE-UPLOAD BLOCKED',
        action_description: 'Intercepts uploads at media gateway before posting to Feed, Reels, or Stories.',
        subscribed_algorithms: ['SHA256', 'PHASH', 'DHASH', 'TILE_HASH'],
        avg_latency_ms: 18,
        containment_rate: 99.4,
        active_fingerprints_count: 14,
        zero_raw_media_standard: true,
        endpoint: 'https://api.instagram.com/safety/v1/containment-feed',
        last_synced_at: new Date().toISOString()
      },
      {
        id: 'facebook_safety',
        platform_key: 'facebook',
        name: 'Facebook Trust & Safety Exchange',
        company: 'Meta Platforms, Inc.',
        brand_color: 'from-blue-600 to-cyan-600',
        icon: 'facebook',
        protocol: 'Meta Safety Hash Quarantine Feed',
        status: 'ACTIVE_PROTECTED',
        containment_mode: 'INSTANT_QUARANTINE_PURGE',
        policy_action: 'AUTOMATICALLY REMOVED',
        action_description: 'Blocks client-side uploads and retroactively purges re-shared copies across Groups and Feeds.',
        subscribed_algorithms: ['SHA256', 'PHASH', 'DHASH', 'TILE_HASH'],
        avg_latency_ms: 22,
        containment_rate: 98.9,
        active_fingerprints_count: 14,
        zero_raw_media_standard: true,
        endpoint: 'https://api.facebook.com/safety/v1/containment-feed',
        last_synced_at: new Date().toISOString()
      },
      {
        id: 'x_safety',
        platform_key: 'x',
        name: 'X Safety Operations & Threat Intercept',
        company: 'X Corp.',
        brand_color: 'from-slate-700 to-slate-900',
        icon: 'twitter',
        protocol: 'X Threat Intelligence Signature API',
        status: 'ACTIVE_PROTECTED',
        containment_mode: 'PRE_UPLOAD_REJECT',
        policy_action: 'PRE-UPLOAD BLOCKED',
        action_description: 'Direct media upload rejected with safety violation signature before tweet publishing.',
        subscribed_algorithms: ['SHA256', 'PHASH', 'PDQ', 'TILE_HASH'],
        avg_latency_ms: 14,
        containment_rate: 98.2,
        active_fingerprints_count: 14,
        zero_raw_media_standard: true,
        endpoint: 'https://api.x.com/safety/v1/containment-feed',
        last_synced_at: new Date().toISOString()
      },
      {
        id: 'youtube_safety',
        platform_key: 'youtube',
        name: 'YouTube Content Safety Network',
        company: 'Google LLC',
        brand_color: 'from-red-600 to-rose-700',
        icon: 'youtube',
        protocol: 'Google Content Safety Keyframe Ingestion',
        status: 'ACTIVE_PROTECTED',
        containment_mode: 'PRE_PUBLISH_INTERCEPT',
        policy_action: 'UPLOAD INTERCEPTED',
        action_description: 'Analyzes video keyframes and thumbnail assets during ingest; publish pipeline aborted on match.',
        subscribed_algorithms: ['SHA256', 'PHASH', 'KEYFRAME_HASH'],
        avg_latency_ms: 31,
        containment_rate: 99.7,
        active_fingerprints_count: 14,
        zero_raw_media_standard: true,
        endpoint: 'https://api.youtube.com/safety/v1/containment-feed',
        last_synced_at: new Date().toISOString()
      },
      {
        id: 'reddit_safety',
        platform_key: 'reddit',
        name: 'Reddit Safety & Moderation Operations',
        company: 'Reddit, Inc.',
        brand_color: 'from-orange-500 to-amber-600',
        icon: 'reddit',
        protocol: 'Reddit Media Filter & AutoMod Ingestion',
        status: 'ACTIVE_PROTECTED',
        containment_mode: 'INGESTION_FILTER_BLOCK',
        policy_action: 'POST BLOCKED AT INGESTION',
        action_description: 'Prevents direct media submissions across subreddits and blocks image host distribution.',
        subscribed_algorithms: ['SHA256', 'PHASH', 'DHASH'],
        avg_latency_ms: 16,
        containment_rate: 98.6,
        active_fingerprints_count: 14,
        zero_raw_media_standard: true,
        endpoint: 'https://api.reddit.com/safety/v1/containment-feed',
        last_synced_at: new Date().toISOString()
      }
    ]
  };
}

export async function matchAllPlatforms(formData: FormData): Promise<MatchAllResponse> {
  const res = await fetch(`${API_BASE_URL}/platforms/match-all`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function syncPlatform(platformId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/platforms/${platformId}/sync`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
