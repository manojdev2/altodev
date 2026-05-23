import type { AuthSession } from '@/types/auth';
import { sleep } from '@/lib/utils';

export async function login(email: string, password: string): Promise<AuthSession> {
  await sleep(600);
  if (!email || !password) throw new Error('Email and password are required');
  return {
    token: 'mock-jwt-alto-2026',
    user: { id: 'u001', fullName: 'Arjun Sharma', email, phone: '+91 98765 43210' },
  };
}
