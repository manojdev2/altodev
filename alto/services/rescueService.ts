import type { IssueType, Severity, RescueData } from '@/types/rescue';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

function authHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

export async function createRescueRequest(params: {
  issueType: IssueType;
  severity: Severity;
  issueDescription?: string;
  voiceTranscript?: string;
  userLatitude: number;
  userLongitude: number;
  userAddress?: string;
}): Promise<RescueData> {
  const res = await fetch(`${BASE}/rescue/request`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(params),
  });
  const json = await res.json();
  if (json.status !== 'Success') throw new Error(json.message ?? 'Failed to create rescue request');
  return json.data as RescueData;
}

export async function getRescueStatus(rescueId: string): Promise<RescueData> {
  const res = await fetch(`${BASE}/rescue/status/${rescueId}`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (json.status !== 'Success') throw new Error(json.message ?? 'Failed to fetch rescue status');
  return json.data as RescueData;
}

export async function cancelRescue(rescueId: string): Promise<void> {
  const res = await fetch(`${BASE}/rescue/cancel/${rescueId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const json = await res.json();
  if (json.status !== 'Success') throw new Error(json.message ?? 'Failed to cancel rescue');
}

export async function seedTechnicians(): Promise<{ count: number }> {
  const res = await fetch(`${BASE}/rescue/seed-technicians`, { method: 'POST' });
  const json = await res.json();
  return json;
}
