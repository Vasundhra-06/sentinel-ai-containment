export interface Occurrence {
  id: string;
  incidentId: string;
  platform: 'Instagram' | 'X' | 'Facebook' | 'Reddit' | 'YouTube';
  variantType: 'Original' | 'Cropped' | 'Screenshot' | 'Meme' | 'Video Derivative' | 'Paraphrased Text';
  url: string;
  accountHandle: string;
  detectedAt: string;
  similarityScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Active' | 'Pending Review' | 'Restricted' | 'Removed';
  sha256: string;
  pHash: string;
  ocrText?: string;
}

export interface Incident {
  id: string;
  title: string;
  protectedProfile: string;
  protectedProfileId: string;
  status: 'ACTIVE MONITORING' | 'PARTIALLY CONTAINED' | 'RESOLVED';
  riskScore: number; // 0-100
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  occurrencesCount: number;
  platformsCount: number;
  variantsCount: number;
  reUploadsCount: number;
  containmentRate: number; // percentage
  createdAt: string;
  lastActivityAt: string;
  description: string;
}

export interface EvidenceItem {
  id: string;
  incidentId: string;
  occurrenceId: string;
  platform: string;
  url: string;
  account: string;
  capturedAt: string;
  sha256: string;
  pHash: string;
  integrityStatus: 'VERIFIED' | 'TAMPERED_WARNING';
  fileSize: string;
}

export interface ReportItem {
  id: string;
  incidentId: string;
  occurrenceId: string;
  platform: string;
  targetUrl: string;
  submittedAt: string;
  policyCategory: string;
  status: 'Draft' | 'Submitted' | 'Pending' | 'Removed' | 'Restricted' | 'Rejected' | 'Appealed';
  responseDetails?: string;
  appealCount: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export const MOCK_MASTER_INCIDENT: Incident = {
  id: 'HC-2041',
  title: 'Manipulated Media & Impersonation Campaign',
  protectedProfile: 'Dr. Evelyn Carter',
  protectedProfileId: 'PROF-8821',
  status: 'ACTIVE MONITORING',
  riskScore: 88,
  riskLevel: 'HIGH',
  occurrencesCount: 27,
  platformsCount: 5,
  variantsCount: 8,
  reUploadsCount: 4,
  containmentRate: 78,
  createdAt: '2026-08-28 14:22 UTC',
  lastActivityAt: '2026-09-02 08:10 UTC',
  description: 'Unconsented manipulated image combined with defamatory claims regarding student research funds across multiple social platforms.'
};

export const MOCK_OCCURRENCES: Occurrence[] = [
  {
    id: 'HC-2041-001',
    incidentId: 'HC-2041',
    platform: 'Instagram',
    variantType: 'Original',
    url: 'https://instagram.com/p/C9x81_orig',
    accountHandle: '@unauth_source_01',
    detectedAt: '2026-08-28 14:22 UTC',
    similarityScore: 100,
    riskLevel: 'HIGH',
    status: 'Removed',
    sha256: 'ab4f91dc88231a47e0912389174128941029381029381029381029381029381',
    pHash: 'pHash-8f9a2b1c4e',
    ocrText: 'Dr. Carter exposed for altering department records'
  },
  {
    id: 'HC-2041-002',
    incidentId: 'HC-2041',
    platform: 'Instagram',
    variantType: 'Cropped',
    url: 'https://instagram.com/p/C9x92_crop',
    accountHandle: '@repost_bot_99',
    detectedAt: '2026-08-28 16:05 UTC',
    similarityScore: 96,
    riskLevel: 'HIGH',
    status: 'Removed',
    sha256: '7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2',
    pHash: 'pHash-8f9a2b1c4f',
    ocrText: 'Dr. Carter exposed...'
  },
  {
    id: 'HC-2041-003',
    incidentId: 'HC-2041',
    platform: 'X',
    variantType: 'Screenshot',
    url: 'https://x.com/user/status/182910293',
    accountHandle: '@viral_leaks_x',
    detectedAt: '2026-08-29 02:40 UTC',
    similarityScore: 94,
    riskLevel: 'HIGH',
    status: 'Restricted',
    sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    pHash: 'pHash-8f9a2b1c50',
    ocrText: 'SHOCKING: Dr. Evelyn Carter student funds mystery!'
  },
  {
    id: 'HC-2041-004',
    incidentId: 'HC-2041',
    platform: 'Facebook',
    variantType: 'Cropped',
    url: 'https://facebook.com/groups/campus/posts/882190',
    accountHandle: '@campus_news_unfiltered',
    detectedAt: '2026-08-29 08:15 UTC',
    similarityScore: 91,
    riskLevel: 'MEDIUM',
    status: 'Removed',
    sha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
    pHash: 'pHash-8f9a2b1c55',
    ocrText: 'Students demanding answers from Dr. Carter'
  },
  {
    id: 'HC-2041-005',
    incidentId: 'HC-2041',
    platform: 'Reddit',
    variantType: 'Meme',
    url: 'https://reddit.com/r/university_drama/comments/xyz123',
    accountHandle: 'u/meme_lord_academic',
    detectedAt: '2026-08-29 11:50 UTC',
    similarityScore: 89,
    riskLevel: 'MEDIUM',
    status: 'Active',
    sha256: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    pHash: 'pHash-8f9a2b1c60',
    ocrText: 'When the department funds suddenly vanish...'
  },
  {
    id: 'HC-2041-006',
    incidentId: 'HC-2041',
    platform: 'YouTube',
    variantType: 'Video Derivative',
    url: 'https://youtube.com/shorts/v_882910',
    accountHandle: '@drama_recap_daily',
    detectedAt: '2026-08-30 08:30 UTC',
    similarityScore: 85,
    riskLevel: 'HIGH',
    status: 'Pending Review',
    sha256: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
    pHash: 'pHash-8f9a2b1c70',
    ocrText: 'Full breakdown of Dr. Carter scandal'
  }
];

export const MOCK_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-2041-001',
    incidentId: 'HC-2041',
    occurrenceId: 'HC-2041-001',
    platform: 'Instagram',
    url: 'https://instagram.com/p/C9x81_orig',
    account: '@unauth_source_01',
    capturedAt: '2026-08-28 14:25 UTC',
    sha256: 'ab4f91dc88231a47e0912389174128941029381029381029381029381029381',
    pHash: 'pHash-8f9a2b1c4e',
    integrityStatus: 'VERIFIED',
    fileSize: '2.4 MB'
  },
  {
    id: 'EVD-2041-002',
    incidentId: 'HC-2041',
    occurrenceId: 'HC-2041-002',
    platform: 'Instagram',
    url: 'https://instagram.com/p/C9x92_crop',
    account: '@repost_bot_99',
    capturedAt: '2026-08-28 16:10 UTC',
    sha256: '7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2',
    pHash: 'pHash-8f9a2b1c4f',
    integrityStatus: 'VERIFIED',
    fileSize: '1.8 MB'
  },
  {
    id: 'EVD-2041-003',
    incidentId: 'HC-2041',
    occurrenceId: 'HC-2041-003',
    platform: 'X',
    url: 'https://x.com/user/status/182910293',
    account: '@viral_leaks_x',
    capturedAt: '2026-08-29 02:45 UTC',
    sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    pHash: 'pHash-8f9a2b1c50',
    integrityStatus: 'VERIFIED',
    fileSize: '3.1 MB'
  }
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'REP-2041-01',
    incidentId: 'HC-2041',
    occurrenceId: 'HC-2041-001',
    platform: 'Instagram',
    targetUrl: 'https://instagram.com/p/C9x81_orig',
    submittedAt: '2026-08-28 15:00 UTC',
    policyCategory: 'Impersonation & Harassment',
    status: 'Removed',
    responseDetails: 'Meta Trust & Safety confirmed violation and restricted content globally.',
    appealCount: 0
  },
  {
    id: 'REP-2041-02',
    incidentId: 'HC-2041',
    occurrenceId: 'HC-2041-003',
    platform: 'X',
    targetUrl: 'https://x.com/user/status/182910293',
    submittedAt: '2026-08-29 03:15 UTC',
    policyCategory: 'Non-Consensual Media',
    status: 'Restricted',
    responseDetails: 'X Safety marked post with sensitive content warning and geo-restricted in target region.',
    appealCount: 0
  },
  {
    id: 'REP-2041-03',
    incidentId: 'HC-2041',
    occurrenceId: 'HC-2041-005',
    platform: 'Reddit',
    targetUrl: 'https://reddit.com/r/university_drama/comments/xyz123',
    submittedAt: '2026-08-29 12:30 UTC',
    policyCategory: 'Harassment / Doxxing',
    status: 'Rejected',
    responseDetails: 'Subreddit moderators determined content is satire under community guidelines.',
    appealCount: 1
  }
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-08-28 14:22:10 UTC',
    actor: 'SYSTEM_AUTODETECT',
    action: 'INCIDENT_CREATED',
    details: 'Master Incident HC-2041 created for protected profile Dr. Evelyn Carter.'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-08-28 14:25:00 UTC',
    actor: 'EVIDENCE_ENGINE',
    action: 'EVIDENCE_PRESERVED',
    details: 'Preserved EVD-2041-001 with SHA-256 ab4f91dc8823... (Status: VERIFIED).'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-08-28 15:00:00 UTC',
    actor: 'USER_AUTHORIZED',
    action: 'REPORT_SUBMITTED',
    details: 'Submitted platform review request REP-2041-01 to Instagram API.'
  },
  {
    id: 'AUD-904',
    timestamp: '2026-09-02 08:10:00 UTC',
    actor: 'REUPLOAD_WATCH',
    action: 'POSSIBLE_REUPLOAD_FLAGGED',
    details: 'Detected recurring variant HC-2041-006 on YouTube Shorts with 85% match.'
  }
];
