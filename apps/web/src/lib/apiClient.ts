import { MOCK_MASTER_INCIDENT, MOCK_OCCURRENCES, MOCK_EVIDENCE, MOCK_REPORTS, MOCK_AUDIT_LOGS, Incident, Occurrence, EvidenceItem, ReportItem, AuditLogItem } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
