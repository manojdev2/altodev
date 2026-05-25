'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { useAuthStore } from '@/store/authSlice';
import toast from 'react-hot-toast';

export function LoginForm() {
  const [email, setEmail] = useState('rider@alto.dev');
  const [password, setPassword] = useState('Alto@1234');
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuthStore();
  const router = useRouter();

  const INPUT = "w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors";
  const INPUT_STYLE = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const INPUT_FOCUS = { border: '1px solid #00D4FF' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await login(email, password);
      setAuth(session.user, session.token);
      router.push('/home');
    } catch { toast.error('Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email address" className={INPUT} style={INPUT_STYLE}
        onFocus={e => Object.assign(e.target.style, INPUT_FOCUS)}
        onBlur={e => Object.assign(e.target.style, INPUT_STYLE)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Password" className={INPUT} style={INPUT_STYLE}
        onFocus={e => Object.assign(e.target.style, INPUT_FOCUS)}
        onBlur={e => Object.assign(e.target.style, INPUT_STYLE)} required />
      <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white transition-opacity"
        style={{ background: 'linear-gradient(135deg,#00D4FF,#0088AA)', boxShadow: '0 0 24px rgba(0,212,255,0.3)', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
