import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authSlice';

const mockUser = { id: 'u1', fullName: 'Test User', email: 't@t.com', phone: '123' };

describe('authSlice', () => {
  beforeEach(() => useAuthStore.setState({ isAuthenticated: false, user: null, token: null }));

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
  it('sets auth on login', () => {
    useAuthStore.getState().login(mockUser, 'tok');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().token).toBe('tok');
  });
  it('clears state on logout', () => {
    useAuthStore.getState().login(mockUser, 'tok');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
