'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/products');
    } catch (err: any) {
      // Catch error and show readable message
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center min-h-screen p-6">
      <div className="hero-card-glow max-w-md w-full p-8 rounded-2xl text-center shadow-2xl animate-slideIn">
        <h1 className="text-3xl font-bold gold-accent mb-6">Welcome Back</h1>
        <p className="text-white/80 mb-8">Sign in to continue shopping</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-btn w-full py-3 font-semibold text-lg"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/70">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-yellow-400 hover:text-yellow-300 cursor-pointer font-semibold"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
