'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      // After login, authContext should set user — read from localStorage or context if needed
      const savedUser =
        typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const parsed = savedUser ? JSON.parse(savedUser) : null;
      if (parsed?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/products'); // users see products first as requested
      }
    } catch (err: any) {
      // show friendly inline error
      setError(
        err?.message || err?.response?.data?.message || 'Invalid credentials. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="bg-[var(--brand-foreground,white)] rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs header */}
          <div className="flex">
            <div className="flex-1 text-center py-4 bg-gradient-to-r from-[var(--brand-gradient-from)] to-[var(--brand-gradient-to)] text-white font-semibold">
              Login
            </div>
            <Link
              href="/register"
              className="flex-1 text-center py-4 bg-white text-[var(--foreground)] hover:bg-gray-50 transition font-semibold"
            >
              Create account
            </Link>
          </div>

          {/* Card content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)]">
              Welcome back
            </h2>
            <p className="text-sm text-[var(--muted,#6b7280)] mb-6">
              Sign in to continue to Eithermall
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email - floating label style */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="peer block w-full rounded-lg border border-gray-200 px-3 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                  placeholder=" "
                  autoComplete="email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 -top-2 text-xs bg-[var(--brand-foreground,white)] px-1 text-[var(--muted,#6b7280)] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[var(--muted,#6b7280)] transition-all"
                >
                  Email
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="peer block w-full rounded-lg border border-gray-200 px-3 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                  placeholder=" "
                  autoComplete="current-password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 -top-2 text-xs bg-[var(--brand-foreground,white)] px-1 text-[var(--muted,#6b7280)] peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[var(--muted,#6b7280)] transition-all"
                >
                  Password
                </label>
              </div>

              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full brand-btn py-3 rounded-lg text-white font-semibold shadow"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <div className="text-center text-sm text-[var(--muted,#6b7280)]">
                Don’t have an account?{' '}
                <Link
                  href="/register"
                  className="text-[var(--brand-accent)] font-semibold"
                >
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Small footer / credit */}
        <p className="mt-4 text-center text-xs text-[var(--muted,#6b7280)]">
          Eithermall — Premium internal e-commerce
        </p>
      </div>
    </div>
  );
}
