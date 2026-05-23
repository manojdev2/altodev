import { describe, it, expect } from 'vitest';
import { login } from '@/services/authService';

describe('authService.login', () => {
  it('returns session for valid credentials', async () => {
    const s = await login('test@example.com', 'pass123');
    expect(s.token).toBe('mock-jwt-alto-2026');
    expect(s.user.email).toBe('test@example.com');
  });
  it('throws if email is empty', async () => {
    await expect(login('', 'pass')).rejects.toThrow('Email and password are required');
  });
  it('throws if password is empty', async () => {
    await expect(login('a@b.com', '')).rejects.toThrow('Email and password are required');
  });
});
