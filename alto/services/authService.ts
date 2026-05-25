import type { AuthSession } from '@/types/auth';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

const DUMMY_CREDS = { email: 'rider@alto.dev', password: 'Alto@1234' };

export async function login(email: string, password: string): Promise<AuthSession> {
  if (!email || !password) throw new Error('Email and password are required');

  if (email === DUMMY_CREDS.email && password === DUMMY_CREDS.password) {
    return {
      token: 'dummy-alto-token-dev',
      user: { id: 'dev-user-001', fullName: 'Arjun Sharma', email, phone: '+91 98765 43210' },
    };
  }

  const res = await fetch(`${BASE}/Login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (json.status !== 'Success') throw new Error(json.message ?? 'Login failed');

  return {
    token: json.token,
    user: {
      id: json.data?._id ?? json.data?.id ?? '',
      fullName: json.data?.fullName ?? json.data?.name ?? '',
      email: json.data?.email ?? email,
      phone: json.data?.phone ?? '',
    },
  };
}
